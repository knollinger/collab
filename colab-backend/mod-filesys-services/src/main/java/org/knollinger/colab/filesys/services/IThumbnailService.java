package org.knollinger.colab.filesys.services;

import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.BlobInfo;

/**
 * Im {@link IThumbnailService} wird alles rund um die Mini-Anzeigen von Images
 * abgehandelt.
 * 
 * Das Interface ist trivial, die Implementierung ischer nicht :-)
 */
public interface IThumbnailService
{
    public BlobInfo getThumbnail(UUID uuid) throws NotFoundException, TechnicalFileSysException;
}
