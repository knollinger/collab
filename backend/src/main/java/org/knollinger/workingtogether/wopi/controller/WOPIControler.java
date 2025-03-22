package org.knollinger.workingtogether.wopi.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.AccessDeniedException;
import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.BlobInfo;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.filesys.models.IPermissions;
import org.knollinger.workingtogether.filesys.services.ICheckPermsService;
import org.knollinger.workingtogether.filesys.services.IDownloadService;
import org.knollinger.workingtogether.filesys.services.IFileSysService;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.ICurrentUserService;
import org.knollinger.workingtogether.wopi.dtos.WOPIFileInfoDTO;
import org.knollinger.workingtogether.wopi.exceptions.TechnicalWOPIException;
import org.knollinger.workingtogether.wopi.services.WOPIBlobService;
import org.knollinger.workingtogether.wopi.services.impl.WOPIDiscoryService;
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

import lombok.extern.log4j.Log4j2;

/**
 * Der WOPI-Controller dient der Integration von LibreOffice-Online. Es sollte 
 * auch mit MS-Office funktionieren, aber wer brazcht das schon... :-)
 * 
 * Im wesentlichen sind drei EndPoints zu implementieren:
 * <ul>
 *  <li>CheckFileInfo</li>
 *  <li>GetFile</li>
 *  <li>PutFile</li>
 *  
 * </ul>
 */
@RestController()
@RequestMapping(path = "/wopi")
@Log4j2
public class WOPIControler
{
    private static final String LAUNCHER_FORM = "" //
        + "<html>" //
        + "  <body>" //
        //        + "    <form action=\"http://localhost:9980/browser/ded56d8ff7/cool.html??WOPISrc=http://192.168.1.153:8080/wopi/files/{fileId}\" enctype=\"multipart/form-data\" method=\"post\">" //
        + "    <form action=\"{baseUrl}?WOPISrc=http://192.168.1.153:8080/wopi/files/{fileId}\" enctype=\"multipart/form-data\" method=\"post\">" //
        + "      <input name=\"access_token\" value=\"{token}\" type=\"text\"/>" //
        + "      <input type=\"submit\" value=\"Load Collabora Online\"/>" //
        + "    </form>" //
        + "  </body>" //
        + "</html>";

    @Autowired()
    private IFileSysService fileSysServive;

    @Autowired()
    private IDownloadService downloadSvc;

    @Autowired()
    private ICurrentUserService currUserSvc;

    @Autowired()
    private ICheckPermsService checkPermsSvc;

    @Autowired()
    private WOPIBlobService wopiBlobSvc;

    @Autowired()
    private WOPIDiscoryService wopiDiscoverySvc;

    /**
     * Implementiert die CheckFileInfo-API eines WOPI-Controllers.
     * 
     * Nachzulesen unter <a href="https://sdk.collaboraonline.com/docs/How_to_integrate.html#connection-to-the-file-storage">WOPI#heckFileInfo</a>
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
                .canWrite(this.checkPermsSvc.hasPermission(IPermissions.WRITE, inode)) //
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

    @GetMapping(path = "/createLauncherForm/{fileId}")
    public String createLauncherForm(@PathVariable("fileId") UUID fileId)
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
                .replace("{fileId}", inode.getUuid().toString()) //
                .replace("{token}", this.currUserSvc.get().getToken());
        }
        catch (TechnicalWOPIException | TechnicalFileSysException e)
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
    }

    /**
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
