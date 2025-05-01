package org.knollinger.workingtogether.calendar.controller;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.calendar.dtos.CalendarEventDTO;
import org.knollinger.workingtogether.calendar.dtos.FullCalendarEventDTO;
import org.knollinger.workingtogether.calendar.exc.NotFoundException;
import org.knollinger.workingtogether.calendar.exc.TechnicalCalendarException;
import org.knollinger.workingtogether.calendar.mapper.ICalendarMapper;
import org.knollinger.workingtogether.calendar.models.CalendarEvent;
import org.knollinger.workingtogether.calendar.models.FullCalendarEvent;
import org.knollinger.workingtogether.calendar.services.ICalendarService;
import org.knollinger.workingtogether.hashtags.exceptions.TechnicalHashTagException;
import org.knollinger.workingtogether.hashtags.services.IHashTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.lang.Collections;

@RestController
@RequestMapping(path = "v1/calendar")
public class CalendarController
{
    @Autowired()
    private ICalendarService calSvc;

    @Autowired()
    private ICalendarMapper calMapper;

    @Autowired()
    private IHashTagService hashTagSvc;

    /**
     * Läd alle Kalender-Einträge zwischen dem angegebenen Start-Timestamp 
     * und dem angegebenen End-Timestamp
     * 
     * @param start
     * @param end
     * @return
     */
    @GetMapping(path = "/all")
    public List<CalendarEventDTO> getAllEvents(//
        @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start, //
        @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end)
    {
        try
        {
            List<CalendarEvent> events = this.calSvc.getAllEvents(start, end);
            return this.calMapper.toDTO(events);
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
    @GetMapping(path = "/get/{uuid}")
    public FullCalendarEventDTO getEvents(//
        @PathVariable("uuid") UUID uuid)
    {
        try
        {
            FullCalendarEvent result = FullCalendarEvent.builder() //
                .event(this.calSvc.getEvent(uuid)) //
                .hashTags(this.hashTagSvc.getHashTagsByResource(uuid)) //
                .attachments(Collections.emptyList()) //
                .build();

            return this.calMapper.toDTO(result);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalCalendarException | TechnicalHashTagException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
