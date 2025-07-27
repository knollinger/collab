package org.knollinger.colab.calendar.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.web.multipart.MultipartFile;

/**
 * Der Service, um Attachments für EIn CalendarEvent zu verwalten.
 * 
 * Die meisten Methoden sollen innerhalb einer Transaktion laufen und bekommen 
 * aus diesem Grund ein Connection-Objekt übergeben. 
 * 
 * Ausnahme ist der FileUpload, dieser muss leider per Multipart/formdata
 * erfolgen und benötigt aus diesem Grund einen eigenen Controller-Eingang. Und
 * somit läuft es in einer eigenen Transaktion. :-(
 * 
 */
public interface ICalendarAttachmentsService
{
    /**
     * @param eventId
     * @param conn
     * @return
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    public List<INode> getAttachments(UUID eventId, Connection conn) throws CalEventNotFoundException, TechnicalCalendarException;

    /**
     * @param eventId
     * @param attachments
     * @param conn
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    public void saveAttachments(UUID eventId, List<INode> attachments, Connection conn) throws CalEventNotFoundException, TechnicalCalendarException;
    
    /**
     * @param eventId
     * @param conn
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    public void removeAttachments(UUID eventId, Connection conn) throws CalEventNotFoundException, TechnicalCalendarException;

    /**
     * @param eventId
     * @param files
     * @return
     * @throws CalEventNotFoundException
     * @throws TechnicalCalendarException
     */
    public List<INode> uploadFiles(UUID eventId, List<MultipartFile> files) throws CalEventNotFoundException, TechnicalCalendarException;
}
