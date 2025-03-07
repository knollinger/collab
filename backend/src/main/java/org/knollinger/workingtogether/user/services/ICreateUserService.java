package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.exceptions.DuplicateUserException;
import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.models.User;
import org.springframework.web.multipart.MultipartFile;

/**
 * EInen neuen Butzer anzulegen ist nicht ganz trivial.
 * 
 * <ul>
 * <li> Der account muss angelegt werdem
 * <li> Ein Start-Password muss vergeben werden
 * <li> ggf. muss ein Avatar gespeichert werden
 * <li> die private Benutzergruppe den Benutzers muss angelegt werden
 * <li> Der neue Benutzer muss dieser Benutzergruppe zugewiesen werden
 * </ul>
 * 
 * Genügend Code, um das in einen eigenen Service zu verpacken.
 */
public interface ICreateUserService
{
    /**
     * 
     * @param user
     * @param avatar
     * @return
     * @throws TechnicalUserException
     * @throws DuplicateUserException
     */
    public User createUser(// 
        String accountName, //
        String email, //
        String surName, //
        String lastName, //
        MultipartFile avatar) throws TechnicalUserException, DuplicateUserException;
}
