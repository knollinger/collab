package org.knollinger.workingtogether.filesys.controller;

import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.BlobInfo;
import org.knollinger.workingtogether.filesys.services.IDownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 
 */
@RestController
@RequestMapping(path = "v1/filecontent")
public class FileContentController
{
    @Autowired()
    private IDownloadService downloadSvc;

    /**
     * 
     * @param uuid
     * @return
     */
    @GetMapping(path = "/{uuid}")
    public ResponseEntity<InputStreamResource> getFileContent( //
        @PathVariable("uuid") UUID uuid, //
        @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch)
    {
        try
        {
            BlobInfo blobInfo = this.downloadSvc.getFileContent(uuid);
            HttpHeaders headers = new HttpHeaders();

            if (ifNoneMatch == null || !ifNoneMatch.equalsIgnoreCase(blobInfo.getETag()))
            {
                headers.add(HttpHeaders.ETAG, String.format("\"%1$s\"", blobInfo.getETag()));
                headers.add(HttpHeaders.CONTENT_TYPE, blobInfo.getContentType());
                return new ResponseEntity<>(new InputStreamResource(blobInfo.getData()), headers, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, headers, HttpStatus.NOT_MODIFIED);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
