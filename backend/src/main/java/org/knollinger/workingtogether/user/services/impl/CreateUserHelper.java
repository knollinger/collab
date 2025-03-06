package org.knollinger.workingtogether.user.services.impl;

import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HexFormat;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.models.EWellknownINodeIDs;
import org.knollinger.workingtogether.filesys.services.IFileSysService;
import org.knollinger.workingtogether.user.exceptions.DuplicateUserException;
import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 
 */
class CreateUserHelper
{
    private static String SQL_CREATE_ACCOUNT = "" //
        + "insert into users set uuid=?, accountName=?, email=?, surname=?, lastName=?, pwdhash=?, salt=?";

    private static String SQL_CREATE_DIRECTORY = "" //
        + "insert into inodes" //
        + "  set uuid=?, parent=?, owner=?, name=?, type=?, size=0";
    
    private static String[] DEFAULT_HOME_FOLDER_NAMES = {"Bilder", "Dokumente", "Videos", "Musik"};

    private IDbService dbSvc;

    @Autowired
    IFileSysService fileSysSvc;

    /**
     * @param dbService
     */
    public CreateUserHelper(IDbService dbService)
    {
        this.dbSvc = dbService;
    }

    /**
     * @param accountName
     * @param email
     * @param surName
     * @param lastName
     * @return
     * @throws TechnicalUserException
     * @throws DuplicateUserException
     */
    public User createUser(String accountName, String email, String surName, String lastName)
        throws TechnicalUserException, DuplicateUserException
    {

        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            User user = this.createAccount(accountName, email, surName, lastName, conn);
            this.createHomeDirectory(user, conn);

            conn.commit();
            return user;
        }
        catch (SQLException e)
        {
            throw new TechnicalUserException(email, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * @param accountName
     * @param email
     * @param surName
     * @param lastName
     * @param conn
     * @return
     * @throws DuplicateUserException
     * @throws TechnicalUserException
     */
    private User createAccount(String accountName, String email, String surName, String lastName, Connection conn)
        throws DuplicateUserException, TechnicalUserException
    {
        PreparedStatement stmt = null;

        try
        {
            UUID uuid = UUID.randomUUID();
            byte[] salt = CryptoHelper.createSalt();
            String pwdHash = CryptoHelper.createHash(CryptoHelper.saltPassword("Start123", salt));

            stmt = conn.prepareStatement(SQL_CREATE_ACCOUNT);
            stmt.setString(1, uuid.toString());
            stmt.setString(2, accountName);
            stmt.setString(3, email);
            stmt.setString(4, surName);
            stmt.setString(5, lastName);
            stmt.setString(6, pwdHash);
            stmt.setString(7, HexFormat.of().formatHex(salt));
            stmt.executeUpdate();

            return User.builder() //
                .userId(uuid) //
                .accountName(accountName) //
                .email(email) //
                .surname(surName) //
                .lastname(lastName) //
                .build();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateUserException(email);
        }
        catch (NoSuchAlgorithmException | SQLException e)
        {
            throw new TechnicalUserException(email, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * @param user
     * @param conn
     * @throws SQLException 
     */
    private void createHomeDirectory(User user, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            UUID homeUUID = user.getUserId();
            stmt = conn.prepareStatement(SQL_CREATE_DIRECTORY);
            stmt.setString(1, homeUUID.toString());
            stmt.setString(2, EWellknownINodeIDs.ROOT.value().toString());
            stmt.setString(3, user.getUserId().toString());
            stmt.setString(4, user.getAccountName());
            stmt.setString(5, "inode/directory");
            stmt.executeUpdate();
            
            for (String name : DEFAULT_HOME_FOLDER_NAMES)
            {
                UUID uuid = UUID.randomUUID();
                stmt.setString(1, uuid.toString());
                stmt.setString(2, homeUUID.toString());
                stmt.setString(3, user.getUserId().toString());
                stmt.setString(4, name);
                stmt.setString(5, "inode/directory");
                stmt.executeUpdate();
            }
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }
}

