package org.knollinger.workingtogether.user.services;

import org.knollinger.workingtogether.user.exceptions.ExpiredTokenException;
import org.knollinger.workingtogether.user.exceptions.InvalidTokenException;
import org.knollinger.workingtogether.user.exceptions.LoginNotFoundException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.models.LoginResponse;
import org.knollinger.workingtogether.user.models.TokenPayload;

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

    /**
     * @param token
     * @return
     * @throws InvalidTokenException
     * @throws ExpiredTokenException
     * @throws TechnicalLoginException 
     */
    public TokenPayload validateToken(String token) throws InvalidTokenException, ExpiredTokenException, TechnicalLoginException;

    /**
     * 
     * @param token
     * @return
     * @throws ExpiredTokenException 
     * @throws InvalidTokenException 
     * @throws TechnicalLoginException 
     */
    public LoginResponse refreshToken(String token) throws TechnicalLoginException, InvalidTokenException, ExpiredTokenException;
}
