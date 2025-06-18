package org.knollinger.colab.user.services.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

class CryptoHelper
{
    private static SecureRandom secureRandom = new SecureRandom();
    
    /**
     * @return
     */
    public static byte[] createSalt()
    {
        byte[] salt = new byte[32];
        CryptoHelper.secureRandom.nextBytes(salt);
        return salt;
    }
    
    /**
     * @param password
     * @param salt
     * @return
     */
    public static String saltPassword(String password, byte[] salt) {
        
        byte[] pwdAsBytes = password.getBytes(StandardCharsets.UTF_8);
        byte[] result = new byte[pwdAsBytes.length +  salt.length];
        System.arraycopy(pwdAsBytes, 0, result, 0, pwdAsBytes.length);
        System.arraycopy(salt, 0, result, pwdAsBytes.length, salt.length);
        return HexFormat.of().formatHex(result);
    }
    
    /**
     * 
     * @param password
     * @return
     * @throws NoSuchAlgorithmException 
     */
    public static String createHash(String password) throws NoSuchAlgorithmException
    {
        MessageDigest md = MessageDigest.getInstance("SHA256");
        byte[] digest = md.digest(password.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(digest);
    }

    
}
