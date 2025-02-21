package org.knollinger.workingtogether.user.services;

import java.util.UUID;

import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.exceptions.UserNotFoundException;
import org.knollinger.workingtogether.user.models.Avatar;
import org.springframework.web.multipart.MultipartFile;

public interface IAvatarService
{
    public Avatar getAvatar(UUID uuid) throws UserNotFoundException, TechnicalUserException;

    public void saveAvatar(UUID uuid, MultipartFile avatar) throws UserNotFoundException, TechnicalUserException;

}
