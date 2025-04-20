package org.knollinger.workingtogether.calendar.controller;

import java.sql.Timestamp;
import java.util.List;

import org.knollinger.workingtogether.calendar.TechnicalCalendarException;
import org.knollinger.workingtogether.calendar.dtos.CalendarEventDTO;
import org.knollinger.workingtogether.calendar.mapper.ICalendarMapper;
import org.knollinger.workingtogether.calendar.models.CalendarEvent;
import org.knollinger.workingtogether.calendar.services.ICalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "v1/calendar")
public class CalendarController
{
    @Autowired()
    private ICalendarService calSvc;

    @Autowired()
    private ICalendarMapper calMapper;

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
        @RequestParam("start") Timestamp start, //
        @RequestParam("end") Timestamp end)
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
}
