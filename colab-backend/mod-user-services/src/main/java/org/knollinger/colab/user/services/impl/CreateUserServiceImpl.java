package org.knollinger.colab.user.services.impl;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.models.EWellknownINodeIDs;
import org.knollinger.colab.user.exceptions.DuplicateUserException;
import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.models.EWellknownGroupIDs;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.ICreateUserService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class CreateUserServiceImpl implements ICreateUserService
{
    private static String SQL_CREATE_ACCOUNT = "" //
        + "insert into users set uuid=?, accountName=?, email=?, surname=?, lastName=?, pwdhash=?, salt=?";

    private static final String SQL_CREATE_DIRECTORY = "" //
        + "insert into inodes" //
        + "  set uuid=?, parent=?, name=?, owner=?, `group`=?, perms=?, size=?, type=?";

    private static final String SQL_CREATE_GROUP = "" //
        + "insert into groups" //
        + "  set uuid=?, name=?, isPrimary=?";

    private static final String SQL_ADD_TO_GROUP = "" //
        + "insert into groupMembers set parentId=?, memberId=?";

    private static final String SQL_SAVE_AVATAR = "" //
        + "update users set avatar=?, avatarType=?" //
        + "  where uuid=?";

    private static final UUID[] DEFAULT_GROUPS = {EWellknownGroupIDs.GROUP_USERS.value()};

    public static RNameAndMimetype COMMON_DIRS[] = {new RNameAndMimetype("Dokumente", "inode/directory+documents"),
        new RNameAndMimetype("Musik", "inode/directory+sound"), new RNameAndMimetype("Videos", "inode/directory+video"),
        new RNameAndMimetype("Bilder", "inode/directory+image"), new RNameAndMimetype("Notizen", "inode/directory"),
        new RNameAndMimetype("Whiteboards", "inode/directory")};

    @Autowired
    IDbService dbSvc;

    /**
     * @see ICreateUserService
     */
    @Override
    public User createUser(//
        String accountName, //
        String email, //
        String surName, //
        String lastName, //
        MultipartFile avatar) throws TechnicalUserException, DuplicateUserException
    {
        Connection conn = null;
        User user = User.empty();
        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            user = this.createAccount(accountName, email, surName, lastName, conn);
            this.createHomeDirectory(user, conn);
            this.createUserGroup(user, conn);
            this.addToDefaultGroups(user, conn);

            if (avatar != null)
            {
                this.saveAvatar(user, avatar, conn);
            }

            conn.commit();
            return user;
        }
        catch (SQLException | IOException e)
        {
            e.printStackTrace();
            String msg = String.format("Der Benutzer-Account '%1$s' konnte nicht angelegt werden", accountName);
            throw new TechnicalUserException(msg, e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }
    
    public User createUser(User user) throws TechnicalUserException, DuplicateUserException {
        
        Connection conn = null;
        User result = User.empty();
        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            result = this.createAccount(user, conn);
            this.createHomeDirectory(result, conn);
            this.createUserGroup(result, conn);
            this.addToDefaultGroups(result, conn);

            conn.commit();
            return user;
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            String msg = String.format("Der Benutzer-Account '%1$s' konnte nicht angelegt werden", user.getAccountName());
            throw new TechnicalUserException(msg, e);
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
            throw new DuplicateUserException(email); // TOD: accountName muss auch uniqe sein
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

    private User createAccount(User user, Connection conn)
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
            stmt.setString(2, user.getAccountName());
            stmt.setString(3, user.getEmail());
            stmt.setString(4, user.getSurname());
            stmt.setString(5, user.getLastname());
            stmt.setString(6, pwdHash);
            stmt.setString(7, HexFormat.of().formatHex(salt));
            stmt.executeUpdate();

            return User.builder() //
                .userId(uuid) //
                .accountName(user.getAccountName()) //
                .email(user.getEmail()) //
                .surname(user.getSurname()) //
                .lastname(user.getLastname()) //
                .build();
        }
        catch (SQLIntegrityConstraintViolationException e)
        {
            throw new DuplicateUserException(user.getEmail()); // TOD: accountName muss auch uniqe sein
        }
        catch (NoSuchAlgorithmException | SQLException e)
        {
            throw new TechnicalUserException(user.getEmail(), e);
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
            stmt = conn.prepareStatement(SQL_CREATE_DIRECTORY);
            stmt.setString(1, user.getUserId().toString());
            stmt.setString(2, EWellknownINodeIDs.HOME.value().toString());
            stmt.setString(3, user.getAccountName());
            stmt.setString(4, user.getUserId().toString());
            stmt.setString(5, user.getUserId().toString());
            stmt.setInt(6, 0600); // read and write for owner and group
            stmt.setLong(7, 0);
            stmt.setString(8, "inode/directory+home");
            stmt.executeUpdate();

            for (RNameAndMimetype commonDir : COMMON_DIRS)
            {
                UUID newUUID = UUID.randomUUID();
                stmt.setString(1, newUUID.toString());
                stmt.setString(2, user.getUserId().toString());
                stmt.setString(3, commonDir.name);
                stmt.setString(4, user.getUserId().toString());
                stmt.setString(5, user.getUserId().toString());
                stmt.setInt(6, 0700); // read, write, delete for owner and group
                stmt.setLong(7, 0);
                stmt.setString(8, commonDir.mimeType);
                stmt.executeUpdate();
            }
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * 
     * @param user
     * @param conn
     * @throws SQLException
     */
    private void createUserGroup(User user, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_CREATE_GROUP);
            stmt.setString(1, user.getUserId().toString());
            stmt.setString(2, user.getAccountName());
            stmt.setBoolean(3, true);
            stmt.executeUpdate();
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
    private void addToDefaultGroups(User user, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        List<UUID> groups = new ArrayList<>();
        groups.add(user.getUserId());
        groups.addAll(Arrays.asList(DEFAULT_GROUPS));

        try
        {
            stmt = conn.prepareStatement(SQL_ADD_TO_GROUP);

            for (UUID groupId : groups)
            {
                stmt.setString(1, groupId.toString());
                stmt.setString(2, user.getUserId().toString());
                stmt.executeUpdate();
            }
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    /**
     * @param avatar
     * @param conn
     * @throws SQLException 
     * @throws IOException 
     */
    private void saveAvatar(User user, MultipartFile avatar, Connection conn) throws SQLException, IOException
    {
        PreparedStatement stmt = null;

        try
        {
            stmt = conn.prepareStatement(SQL_SAVE_AVATAR);
            stmt.setBinaryStream(1, avatar.getInputStream());
            stmt.setString(2, avatar.getContentType());
            stmt.setString(3, user.getUserId().toString());
            stmt.executeUpdate();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }

    public record RNameAndMimetype(String name, String mimeType)
    {

    }
}
