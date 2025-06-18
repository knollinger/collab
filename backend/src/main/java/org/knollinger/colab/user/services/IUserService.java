package org.knollinger.colab.user.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.user.exceptions.DuplicateUserException;
import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;
import org.knollinger.colab.user.models.User;

public interface IUserService
{
    public User getUser(UUID uuid) throws UserNotFoundException, TechnicalUserException;

    public User saveUser(User fromDTO) throws UserNotFoundException, DuplicateUserException, TechnicalUserException;

    public List<User> listUser() throws TechnicalUserException;
}
