package org.knollinger.colab.wopi.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.BlobInfo;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.models.IPermissions;
import org.knollinger.colab.filesys.services.IDownloadService;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.user.exceptions.TechnicalLoginException;
import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.models.TokenCreatorResult;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.knollinger.colab.user.services.ITokenService;
import org.knollinger.colab.wopi.dtos.WOPIFileInfoDTO;
import org.knollinger.colab.wopi.exceptions.TechnicalWOPIException;
import org.knollinger.colab.wopi.services.IWOPIBlobService;
import org.knollinger.colab.wopi.services.IWOPIDiscoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;

/**
 * Intro:
 * 
 * WOPI ist das WEB APPLICATION OPEN PLATFORM INTERFACE.
 * Dummerweise von MS, ist aber OpenSource.
 * 
 * Der WOPI-Controller dient der Integration von LibreOffice-Online (Collabra). 
 * Es sollte auch mit MS-Office funktionieren, aber wer braucht das schon... :-)
 * 
 * Im wesentlichen sind drei EndPoints zu implementieren:
 * <ul>
 *  <li>CheckFileInfo</li>
 *  <li>GetFile</li>
 *  <li>PutFile</li>
 * </ul>
 * 
 * Wir implementieren hier noch EndPoints welche nicht von Collabra gerufen werden,
 * jedoch von den Integrations-Componenten/Services der Angular-App.
 */
@RestController()
@RequestMapping(path = "/wopi")
@Log4j2
public class WOPIControler
{
    private static final String LAUNCHER_FORM = "" // ggf von extern mittels JSOUP laden?
        + "<html>" //
        + "  <body onload=\"document.getElementById('form').submit()\">" //
        + "    <form style=\"display: none;\" id=\"form\" action=\"{baseUrl}?WOPISrc={wopiSrc}&lang={lang}\" enctype=\"multipart/form-data\" method=\"post\">" //
        + "      <input name=\"access_token\" value=\"{token}\" type=\"text\"/>" //
        + "      <input type=\"submit\" value=\"Load Collabora Online\"/>" //
        + "    </form>" //
        + "  </body>" //
        + "</html>";

    private static final long TWO_HOURS_IN_MILLIES = 2 * 60 * 60 * 1000L;

    @Autowired()
    private IFileSysService fileSysServive;

    @Autowired()
    private IDownloadService downloadSvc;

    @Autowired()
    private ICurrentUserService currUserSvc;

    @Autowired()
    private ITokenService tokenUserSvc;

    @Autowired()
    private IWOPIBlobService wopiBlobSvc;

    @Autowired()
    private IWOPIDiscoveryService wopiDiscoverySvc;

    /**
     * Implementiert die CheckFileInfo-API eines WOPI-Controllers.
     * 
     * Nachzulesen unter 
     * <a href="https://sdk.collaboraonline.com/docs/How_to_integrate.html#connection-to-the-file-storage">WOPI#heckFileInfo</a>
     * 
     * @param fileId
     * @return
     */
    @GetMapping(path = "/files/{fileId}")
    public WOPIFileInfoDTO checkFileInfo(@PathVariable(name = "fileId") UUID fileId)
    {
        try
        {
            log.info("WOPI::getFileInfo for {}", fileId);

            User currentUser = this.currUserSvc.get().getUser();
            INode inode = this.fileSysServive.getINode(fileId, IPermissions.READ);

            return WOPIFileInfoDTO.builder() //
                .baseFileName(inode.getName()) //
                .owner(inode.getOwner()) //
                .userId(currentUser.getUserId()) //
                .userFriendlyName(String.format("%1$s %2$s", currentUser.getSurname(), currentUser.getLastname())) //
                .size(inode.getSize()) //
                .canWrite(inode.hasEffectivePermission(IPermissions.WRITE)) //
                .build();
        }
        catch (NotFoundException e)
        {
            log.error("WOPI::getFileInfo for {} failed, file not found", fileId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            log.error("WOPI::getFileInfo for {} failed, access denied", fileId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            log.error("WOPI::getFileInfo for {} failed, techical error: {}", fileId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * Dieser EndPoint wird von Collabra gerufen, um den Inhalt eines Dokumentes zu lesen
     * 
     * @param fileId
     * @return
     */
    @GetMapping(path = "/files/{fileId}/contents")
    public ResponseEntity<InputStreamResource> getFileContent( //
        @PathVariable("fileId") UUID fileId)
    {
        try
        {
            BlobInfo blobInfo = this.downloadSvc.getFileContent(fileId);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.ETAG, String.format("\"%1$s\"", blobInfo.getETag()));
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
            headers.add(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment;filename=", blobInfo.getName()));
            return new ResponseEntity<>(new InputStreamResource(blobInfo.getData()), headers, HttpStatus.OK);
        }
        catch (TechnicalFileSysException e)
        {
            log.error("WOPI::getFileContent for {} failed, techical error: {}", fileId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            log.error("WOPI::getFileContent for {} failed, not found: {}", fileId, e);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    /**
     * Dieser EndPoint wird von Collabra gerufen, um den Inhalt eines Dokumentes zu speichern.
     * 
     * @param fileId
     * @param bodyIn
     */
    @PostMapping(path = "/files/{fileId}/contents")
    public void putFile(//
        @PathVariable("fileId") UUID fileId, //
        InputStream bodyIn)
    {
        try
        {
            this.wopiBlobSvc.saveFile(fileId, bodyIn);
        }
        catch (TechnicalWOPIException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * Um Collabra in einem iframe einbetten zu können braucht es ein HTML-Form. Ursache ist,
     * dass Collabra Parameter wie den access_token oder die token_ttl als multipart/form-data
     * erwartet.
     * 
     * Die Angular-App stellt also erst mal die iframe-src auf diesen EndPoint. Wir generieren
     * hier ein (auto-submit) Form mit allen Parametern und der ZielURL entsprechend den Collabra-
     * Docs.
     * 
     * Der iframe lädt also das Form, es wird auto-submitted und durch pure Magie erscheint 
     * Collabra im iframe :-)
     * 
     * @param fileId
     * @param httpReq
     * @return
     */
    @GetMapping(path = "/createLauncherForm/{fileId}")
    public String createLauncherForm(//
        @PathVariable("fileId") UUID fileId, //
        HttpServletRequest httpReq)
    {
        try
        {
            INode inode = this.fileSysServive.getINode(fileId, IPermissions.READ);

            Map<String, Map<String, String>> discovery = this.wopiDiscoverySvc.discoverWOPI();
            Map<String, String> actionsByMimeType = discovery.get(inode.getType());
            String baseUrl = actionsByMimeType.get("edit");
            if (baseUrl == null)
            {
                baseUrl = actionsByMimeType.get("view");
            }

            return LAUNCHER_FORM //
                .replace("{baseUrl}", baseUrl) //
                .replace("{wopiSrc}", this.createWOpiSrcUrl(httpReq, fileId).toExternalForm()) //
                .replace("{lang}", this.getRequestedLanguage(httpReq)) //
                .replace("{token}", this.createAccessToken(inode));
        }
        catch (TechnicalWOPIException | TechnicalFileSysException | IOException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (TechnicalLoginException e)
        {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        }
    }

    /**
     * @param httpReq
     * @return
     */
    private String getRequestedLanguage(HttpServletRequest httpReq)
    {
        String requested = httpReq.getHeader(HttpHeaders.ACCEPT_LANGUAGE);
        if(requested == null || requested.isBlank()) {
            requested = "de-de";
        }
        
        String[] languages = requested.split(",");
        return languages[0].split(";")[0];
    }

    /**
     * @param inode
     * @return
     * @throws TechnicalLoginException
     */
    private String createAccessToken(INode inode) throws TechnicalLoginException
    {

        TokenPayload currToken = this.currUserSvc.get();

        List<Group> groups = new ArrayList<>();
        for (Group g : currToken.getGroups())
        {
            if (g.getUuid().equals(inode.getGroup()))
            {
                groups.add(g);
                break;
            }
        }
        TokenCreatorResult accessToken = this.tokenUserSvc.createToken(currToken.getUser(), groups, TWO_HOURS_IN_MILLIES);
        return accessToken.token();
    }

    /**
     * @param httpReq
     * @param fileId
     * @return
     * @throws IOException
     */
    private URL createWOpiSrcUrl(HttpServletRequest httpReq, UUID fileId) throws IOException
    {
        String proto = httpReq.getScheme();
        String host = InetAddress.getLocalHost().getHostName();
        int port = httpReq.getLocalPort();
        String path = "/wopi/files/{fileId}" //
            .replace("{fileId}", fileId.toString());
        return new URL(proto, host, port, path);
    }

    /**
     * Liefere die Liste aller durch Collabra unterstützten ContentTypes
     * 
     * Mit dieser Liste kann die Angular-App entscheiden, ob die zu öffnende INode in
     * Collabra geöffnet werden soll oder ob ein anderer Viewer/Editor instantiiert
     * werden muss.
     * 
     * @return
     */
    @GetMapping(path = "/mimetypes")
    public List<String> getMimeTypes()
    {
        try
        {
            Map<String, Map<String, String>> bindings = this.wopiDiscoverySvc.discoverWOPI();

            List<String> result = new ArrayList<>();
            result.addAll(bindings.keySet());
            return result;
        }
        catch (TechnicalWOPIException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
