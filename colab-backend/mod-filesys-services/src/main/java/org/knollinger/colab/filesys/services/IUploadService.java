package org.knollinger.colab.filesys.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.exceptions.UploadException;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.web.multipart.MultipartFile;

public interface IUploadService
{
    public List<INode> uploadFiles(UUID uuid, List<MultipartFile> files) throws UploadException, TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException;
    public List<INode> uploadFiles(UUID uuid, List<MultipartFile> files, Connection conn) throws UploadException, TechnicalFileSysException, DuplicateEntryException, NotFoundException, AccessDeniedException;
}
