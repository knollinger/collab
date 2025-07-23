package org.knollinger.colab.calendar.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.dtos.CalendarPersonDTO;
import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.calendar.mapper.ICalPersonMapper;
import org.knollinger.colab.calendar.models.CalendarPerson;
import org.knollinger.colab.calendar.services.ICalendarPersonsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "v1/calpersons/")
public class CalPersonController
{
    @Autowired()
    private ICalendarPersonsService personSvc;

    @Autowired()
    private ICalPersonMapper personMapper;

    /**
     * @param eventId
     * @param required
     * @return
     */
    @GetMapping(path = "/{eventId}")
    public List<CalendarPersonDTO> getAllUsersFor(//
        @PathVariable("eventId") UUID eventId)
    {
        try
        {
            List<CalendarPerson> persons = this.personSvc.getAllPersons(eventId);
            return this.personMapper.toDTO(persons);
        }
        catch (TechnicalCalendarException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param eventId
     * @param persons
     */
    @PostMapping(path = "/{eventId}")
    public void savePersons(//
        @PathVariable("eventId") UUID eventId, //
        @RequestBody List<CalendarPersonDTO> persons)
    {
System.err.println("savePersons");
        try
        {
            this.personSvc.savePersons(eventId, this.personMapper.fromDTO(persons));
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
