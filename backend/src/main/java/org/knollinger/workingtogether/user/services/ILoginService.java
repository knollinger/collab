package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.exceptions.LoginNotFoundException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.models.LoginResponse;
import org.knollinger.workingtogether.user.models.TokenCreatorResult;

public interface ILoginService
{
    /**
     * Führt den Login durch und erzeugt im Erfolgsfall einen JWT
     * 
     * @param email
     * @param password
     * @param keepLoggedIn
     * @return
     * @throws LoginNotFoundException 
     */
    public TokenCreatorResult login(String email, String password, boolean keepLoggedIn)
        throws LoginNotFoundException, TechnicalLoginException;

    /**
     * Ändert das Kennwort nachdem eine Validierung des alten Kennworts vorgenommen wurde
     * 
     * @param email
     * @param password
     * @param newPwd
     * @param keepLoggedIn
     * @return
     * @throws LoginNotFoundException 
     * @throws TechnicalLoginException 
     */
    public TokenCreatorResult changePwd(String email, String password, String newPwd, boolean keepLoggedIn)
        throws LoginNotFoundException, TechnicalLoginException;
}
