package org.knollinger.workingtogether.user.services.impl;

import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.user.exceptions.LoginNotFoundException;
import org.knollinger.workingtogether.user.exceptions.TechnicalGroupException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.models.TokenCreatorResult;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.IListGroupService;
import org.knollinger.workingtogether.user.services.ILoginService;
import org.knollinger.workingtogether.user.services.ITokenService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class LoginServiceImpl implements ILoginService
{
    private static final long TWO_HOURS_IN_MILLIES = 2L * 60L * 60L * 1000L;
    private static final long NINETY_DAYS_IN_MILLIES = 90L * 24L * 60L * 60L * 1000L;
    
    private static final String SQL_LOGIN = "" //
        + "select * from users" //
        + "  where email=? and pwdhash=?";

    private static final String SQL_CHANGE_PWD = "" //
        + "update users" //
        + "  set pwdhash=?, salt=?" //
        + "  where email=? and pwdhash=?";

    private static final String SQL_GET_USER = "" //
        + "select uuid, accountName, lastname, surname" //
        + " from users" //
        + " where email=?";

    private static final String SQL_GET_SALT = "" //
        + "select salt from users" //
        + "  where email=?";

    @Autowired()
    private IDbService dbService;

    @Autowired()
    private IListGroupService listGroupSvc;

    @Autowired()
    private ITokenService tokenSvc;;

    /**
     *
     */
    @Override
    public TokenCreatorResult login(String email, String password, boolean keepLoggedIn) throws LoginNotFoundException, TechnicalLoginException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            conn = this.dbService.openConnection();

            byte[] salt = this.getSalt(email, conn);

            stmt = conn.prepareStatement(SQL_LOGIN);
            stmt.setString(1, email);
            stmt.setString(2, CryptoHelper.createHash(CryptoHelper.saltPassword(password, salt)));
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new LoginNotFoundException(email);
            }

            User user = this.getUser(email, conn);
            List<Group> groups = this.listGroupSvc.getGroupsByUser(user);

            long ttl = keepLoggedIn ? NINETY_DAYS_IN_MILLIES : TWO_HOURS_IN_MILLIES;
            return this.tokenSvc.createToken(user, groups, ttl);
        }
        catch (SQLException | NoSuchAlgorithmException | TechnicalGroupException e)
        {
            throw new TechnicalLoginException(email, e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }


    /**
     * @throws LoginNotFoundException 
     * @throws TechnicalLoginException 
     *
     */
    @Override
    public TokenCreatorResult changePwd(String email, String password, String newPwd, boolean keepLoggedIn)
        throws LoginNotFoundException, TechnicalLoginException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbService.openConnection();

            byte[] newSalt = CryptoHelper.createSalt();
            byte[] oldSalt = this.getSalt(email, conn);

            stmt = conn.prepareStatement(SQL_CHANGE_PWD);
            stmt.setString(1, CryptoHelper.createHash(CryptoHelper.saltPassword(newPwd, newSalt)));
            stmt.setString(2, HexFormat.of().formatHex(newSalt));
            stmt.setString(3, email);
            stmt.setString(4, CryptoHelper.createHash(CryptoHelper.saltPassword(password, oldSalt)));
            if (stmt.executeUpdate() != 1)
            {
                throw new LoginNotFoundException(email);
            }

            User user = this.getUser(email, conn);
            List<Group> groups = this.listGroupSvc.getGroupsByUser(user);

            long ttl = keepLoggedIn ? NINETY_DAYS_IN_MILLIES : TWO_HOURS_IN_MILLIES;
            return this.tokenSvc.createToken(user, groups, ttl);
        }
        catch (SQLException | NoSuchAlgorithmException | TechnicalGroupException e)
        {
            throw new TechnicalLoginException(email, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     * @param email
     * @param conn
     * @return
     * @throws SQLException
     */
    private User getUser(String email, Connection conn) throws SQLException
    {
        User user = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_USER);
            stmt.setString(1, email);
            rs = stmt.executeQuery();
            if (rs.next())
            {

                user = User.builder() //
                    .userId(UUID.fromString(rs.getString("uuid"))) //
                    .accountName(rs.getString("accountName")) //
                    .email(email) //
                    .lastname(rs.getString("lastname")) //
                    .surname(rs.getString("surname")) //
                    .build();
            }
            return user;
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(rs);
        }
    }
    /**
     * @param email
     * @param conn
     * @return
     * @throws SQLException
     */
    private byte[] getSalt(String email, Connection conn) throws SQLException
    {
        byte[] salt = new byte[0]; // just for migration!!!
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            stmt = conn.prepareStatement(SQL_GET_SALT);
            stmt.setString(1, email);
            rs = stmt.executeQuery();
            if (rs.next())
            {
                salt = HexFormat.of().parseHex(rs.getString("salt"));
            }
            return salt;
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }
}
