package org.knollinger.colab.user.services;

import java.util.UUID;

import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;
import org.knollinger.colab.user.models.Avatar;
import org.springframework.web.multipart.MultipartFile;

public interface IAvatarService
{
    public Avatar getAvatar(UUID uuid) throws UserNotFoundException, TechnicalUserException;

    public void saveAvatar(UUID uuid, MultipartFile avatar) throws UserNotFoundException, TechnicalUserException;

    public void deleteAvatar(UUID uuid) throws UserNotFoundException, TechnicalUserException;
}
