package org.knollinger.colab.user.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.user.exceptions.DuplicateUserException;
import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.IUserService;
import org.knollinger.colab.utils.services.IDbService;
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
        + "select uuid, accountName, email, surname, lastname from users" //
        + "  order by surname, lastname";

    private static final String SQL_SEARCH_USER = "" //
        + "select uuid, accountName, email, surname, lastname from users" //
        + "  where accountName like ? or email like ? or surname like ? or lastname like ?" //
        + "  order by surname, lastname";

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

    /**
     *
     */
    @Override
    public List<User> fullTextSearch(String search) throws TechnicalUserException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<User> result = new ArrayList<>();

            String maskedSearch = String.format("%%%1$s%%", search);

            conn = this.dbService.openConnection();
            stmt = conn.prepareStatement(SQL_SEARCH_USER);
            stmt.setString(1, maskedSearch);
            stmt.setString(2, maskedSearch);
            stmt.setString(3, maskedSearch);
            stmt.setString(4, maskedSearch);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                User user = User.builder() //
                    .userId(UUID.fromString(rs.getString("uuid"))) //
                    .accountName(rs.getString("accountName")) //
                    .lastname(rs.getString("lastname")) //
                    .surname(rs.getString("surname")) //
                    .email(rs.getString("email")) //
                    .build();
                result.add(user);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalUserException(search, e); // scheiße, passt nicht
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
            this.dbService.closeQuitely(conn);
        }
    }
}
