package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.exceptions.LoginNotFoundException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.models.LoginResponse;

public interface ILoginService
{
    /**
     * Führt den Login durch und erzeugt im Erfolgsfall einen JWT
     * 
     * @param email
     * @param password
     * @return
     * @throws LoginNotFoundException 
     */
    public LoginResponse login(String email, String password) throws LoginNotFoundException, TechnicalLoginException;
    
    /**
     * Ändert das Kennwort nachdem eine Validierung des alten Kennworts vorgenommen wurde
     * 
     * @param email
     * @param password
     * @param newPwd
     * @return
     * @throws LoginNotFoundException 
     * @throws TechnicalLoginException 
     */
    public LoginResponse changePwd(String email, String password, String newPwd) throws LoginNotFoundException, TechnicalLoginException;
}
