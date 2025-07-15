package org.knollinger.colab.calendar.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.services.ICalAttachmentsService;
import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.mapper.IFileSysMapper;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * 
 */
@RestController
@RequestMapping(path = "v1/calattachments")
public class CalAttachmentsController
{
    @Autowired
    private ICalAttachmentsService attachmentsSvc;

    @Autowired
    private IFileSysMapper fileSysMapper;

    /**
     * @param eventId
     * @return
     */
    @GetMapping(path = "/{eventId}")
    public List<INodeDTO> getAttachments(@PathVariable("eventId") UUID eventId)
    {
        try
        {
            List<INode> attachments = this.attachmentsSvc.getAttachments(eventId);
            return this.fileSysMapper.toDTO(attachments);
        }
        catch (CalEventNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalCalendarException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
    
    /**
     * @param eventId
     * @param files
     * @return
     */
    @PutMapping(path = "/attachments", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<INodeDTO> uploadFiles(//
        @RequestParam("eventId") UUID eventId, //
        @RequestParam("file") List<MultipartFile> files)
    {
        try
        {
            List<INode> result = this.attachmentsSvc.uploadFiles(eventId, files);
            return this.fileSysMapper.toDTO(result);
        }
        catch (CalEventNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalCalendarException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
