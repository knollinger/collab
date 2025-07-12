package org.knollinger.colab.calendar.controller;

import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.services.ICalAttachmentsService;
import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.mapper.IFileSysMapper;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
     * @return
     */
    @GetMapping(path = "/attachmentfolder")
    public INodeDTO getAttachmentsFolder()
    {
        try
        {
            INode folder = this.attachmentsSvc.getAttachmentsFolder();
            return this.fileSysMapper.toDTO(folder);
        }
        catch (TechnicalCalendarException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
