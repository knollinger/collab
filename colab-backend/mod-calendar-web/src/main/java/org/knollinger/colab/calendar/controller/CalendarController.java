package org.knollinger.colab.calendar.controller;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.dtos.CalendarEventCoreDTO;
import org.knollinger.colab.calendar.dtos.CalendarEventFullDTO;
import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.mapper.ICalendarMapper;
import org.knollinger.colab.calendar.models.CalendarEventCore;
import org.knollinger.colab.calendar.models.CalendarEventFull;
import org.knollinger.colab.calendar.services.ICalendarAttachmentsService;
import org.knollinger.colab.calendar.services.ICalendarService;
import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.mapper.IFileSysMapper;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "v1/calendar")
public class CalendarController
{
    @Autowired()
    private ICalendarService calSvc;

    @Autowired()
    private ICalendarAttachmentsService attachmentsSvc;

    @Autowired()
    private ICalendarMapper calMapper;

    @Autowired()
    private IFileSysMapper fileSysMapper;

    /**
     * Lädt alle Kalender-Einträge zwischen dem angegebenen Start-Timestamp 
     * und dem angegebenen End-Timestamp
     * 
     * @param start
     * @param end
     * @return
     */
    @GetMapping(path = "/all")
    public List<CalendarEventCoreDTO> getAllEvents(//
        @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start, //
        @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end)
    {
        try
        {
            List<CalendarEventCore> events = this.calSvc.getAllEventCores(start, end);
            return this.calMapper.coreToDTO(events);
        }
        catch (TechnicalCalendarException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param uuid
     * @return
     */
    @GetMapping(path = "/calevent/{uuid}")
    public CalendarEventFullDTO getEvent(//
        @PathVariable("uuid") UUID uuid)
    {
        try
        {
            CalendarEventFull result = this.calSvc.getFullEvent(uuid);
            return this.calMapper.fullToDTO(result);
        }
        catch (CalEventNotFoundException e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalCalendarException e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param dto
     * @return
     */
    @PutMapping(path="/calevent")
    public CalendarEventFullDTO createFullEvent(@RequestBody CalendarEventFullDTO dto) {
        
        try
        {
            CalendarEventFull result = this.calSvc.createFullEvent(this.calMapper.fullFromDTO(dto));
            return this.calMapper.fullToDTO(result);
        }
        catch (TechnicalCalendarException e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param dto
     * @return
     */
    @PostMapping(path = "/calevent")
    public CalendarEventFullDTO updateFullEvent(@RequestBody CalendarEventFullDTO dto)
    {
        try
        {
            CalendarEventFull result = this.calSvc.updateFullEvent(this.calMapper.fullFromDTO(dto));
            return this.calMapper.fullToDTO(result);
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
     * Im CalendarMainView können Events verschoben und resized werden. In diesem Fall reicht es aus,
     * den EventCore zu aktualisieren, Personen, Attachments, Hashtags... ändern sich dadurch nicht.
     * 
     * @param evt
     * @return
     */
    @PostMapping(path = "/update")
    public CalendarEventCoreDTO updateEventCore(@RequestBody CalendarEventCoreDTO evt)
    {

        try
        {
            CalendarEventCore result = this.calSvc.updateEventCore(this.calMapper.coreFromDTO(evt));
            return this.calMapper.coreToDTO(result);
        }
        catch (TechnicalCalendarException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (CalEventNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    /**
     * @param eventId
     * @param files
     * @return
     */
    @PutMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
