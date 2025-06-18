package org.knollinger.colab.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.BlobInfo;

public interface IDownloadService
{
    public BlobInfo getFileContent(UUID uuid) throws TechnicalFileSysException, NotFoundException;
    
    public BlobInfo downloadFiles(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException;
}
