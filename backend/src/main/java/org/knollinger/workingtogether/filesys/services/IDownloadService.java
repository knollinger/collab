package org.knollinger.workingtogether.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.NotFoundException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.BlobInfo;

public interface IDownloadService
{
    public BlobInfo getFileContent(UUID uuid) throws TechnicalFileSysException, NotFoundException;
    
    public BlobInfo downloadFiles(List<UUID> uuids) throws TechnicalFileSysException, NotFoundException;
}
