package org.knollinger.workingtogether.filesys.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.DuplicateEntryException;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.exceptions.UploadException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.springframework.web.multipart.MultipartFile;

public interface IUploadService
{
    public List<INode> uploadFiles(UUID uuid, List<MultipartFile> files) throws UploadException, TechnicalFileSysException, DuplicateEntryException;
}
