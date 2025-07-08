package org.knollinger.colab.user.services;

import java.util.UUID;

import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;

public interface IDeleteUserService
{
    public void deleteUser(UUID uuid) throws TechnicalUserException, UserNotFoundException;
}
