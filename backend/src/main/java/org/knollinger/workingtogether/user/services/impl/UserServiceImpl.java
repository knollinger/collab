package org.knollinger.workingtogether.user.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.user.exceptions.DuplicateUserException;
import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.exceptions.UserNotFoundException;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.IUserService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class UserServiceImpl implements IUserService
{
    private static final String SQL_GET_USER = "" //
        + "select accountName, email, surname, lastname from users" //
        + "  where uuid=?";

    private static final String SQL_SAVE_USER = "" //
        + "update users set accountName=?, email=?, surname=?, lastname=?" //
        + "  where uuid=?";

    private static final String SQL_LIST_USER = "" //
        + "select uuid, accountName, email, surname, lastname from users";

    @Autowired
    private IDbService dbService;

    /**
     *
     */
    @Override
    public User getUser(UUID uuid) throws UserNotFoundException, TechnicalUserException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_GET_USER);
            stmt.setString(1, uuid.toString());
            rs = stmt.executeQuery();
            if (!rs.next())
            {
                throw new UserNotFoundException(uuid);
            }

            return User.builder() //
                .userId(uuid) //
                .accountName(rs.getString("accountName")) //
                .email(rs.getString("email")) //
                .surname(rs.getString("surname")) //
                .lastname(rs.getString("lastname")) //
                .build();
        }
        catch (SQLException e)
        {
            throw new TechnicalUserException(uuid, e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public User saveUser(User user) throws UserNotFoundException, DuplicateUserException, TechnicalUserException
    {
        Connection conn = null;
        PreparedStatement stmt = null;

        try
        {
            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_SAVE_USER);
            stmt.setString(1, user.getAccountName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getSurname());
            stmt.setString(4, user.getLastname());
            stmt.setString(5, user.getUserId().toString());
            if (stmt.executeUpdate() == 0)
            {
                throw new UserNotFoundException(user.getUserId());
            }
            return user;
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateUserException(user.getEmail());
        }
        catch (SQLException e)
        {
            String msg = String.format("Der Benutzer mit der UUID '%1$s' konnte nicht gespeichert werden.",
                user.getUserId().toString());
            throw new TechnicalUserException(msg, e);
        }
        finally
        {
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public List<User> listUser() throws TechnicalUserException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<User> result = new ArrayList<>();

            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_LIST_USER);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                User u = User.builder() //
                    .userId(UUID.fromString(rs.getString("uuid"))) //
                    .accountName(rs.getString("accountName")) //
                    .email(rs.getString("email")) //
                    .surname(rs.getString("surname")) //
                    .lastname(rs.getString("lastname")) //
                    .build();
                result.add(u);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalUserException(
                "Die Liste der Benutzer konnte aufgrund eines technischen Fehlers nicht geladen werden.", e);
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }
}
