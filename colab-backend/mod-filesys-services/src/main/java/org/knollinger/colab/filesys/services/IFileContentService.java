package org.knollinger.colab.filesys.services;

import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;
import org.springframework.web.multipart.MultipartFile;

public interface IFileContentService
{
    public INode saveContent(UUID uuid, MultipartFile file)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException;
}
