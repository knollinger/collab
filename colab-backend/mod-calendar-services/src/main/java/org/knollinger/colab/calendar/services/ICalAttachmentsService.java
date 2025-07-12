package org.knollinger.colab.calendar.services;

import org.knollinger.colab.calendar.exc.TechnicalCalendarException;
import org.knollinger.colab.filesys.models.INode;

public interface ICalAttachmentsService
{
    public INode getAttachmentsFolder() throws TechnicalCalendarException;
}
