package org.knollinger.colab.calendar.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.calendar.exc.CalEventNotFoundException;
import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.web.multipart.MultipartFile;

public interface ICalAttachmentsService
{
    public List<INode> getAttachments(UUID eventId) throws CalEventNotFoundException, TechnicalCalendarException;

    public List<INode> uploadFiles(UUID eventId, List<MultipartFile> files) throws CalEventNotFoundException, TechnicalCalendarException;
}
