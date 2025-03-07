package org.knollinger.workingtogether.user.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.user.exceptions.DuplicateUserException;
import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.exceptions.UserNotFoundException;
import org.knollinger.workingtogether.user.models.User;

public interface IUserService
{
    public User getUser(UUID uuid) throws UserNotFoundException, TechnicalUserException;

    public User saveUser(User fromDTO) throws UserNotFoundException, DuplicateUserException, TechnicalUserException;

    public List<User> listUser() throws TechnicalUserException;
}
