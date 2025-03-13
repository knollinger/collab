package org.knollinger.workingtogether.user.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStore.PrivateKeyEntry;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import org.knollinger.workingtogether.user.dtos.GroupDTO;
import org.knollinger.workingtogether.user.dtos.UserDTO;
import org.knollinger.workingtogether.user.exceptions.ExpiredTokenException;
import org.knollinger.workingtogether.user.exceptions.InvalidTokenException;
import org.knollinger.workingtogether.user.exceptions.LoginNotFoundException;
import org.knollinger.workingtogether.user.exceptions.TechnicalGroupException;
import org.knollinger.workingtogether.user.exceptions.TechnicalLoginException;
import org.knollinger.workingtogether.user.mapper.IGroupMapper;
import org.knollinger.workingtogether.user.mapper.IUserMapper;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.models.LoginResponse;
import org.knollinger.workingtogether.user.models.TokenPayload;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.IListGroupService;
import org.knollinger.workingtogether.user.services.ILoginService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.IncorrectClaimException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import lombok.extern.log4j.Log4j2;

/**
 * 
 */
@Service
@Log4j2
public class LoginServiceImpl implements ILoginService
{
    private static final long TWO_HOURS_IN_MILLIES = 2 * 60 * 60 * 1000;

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

    @Value("${jwt.keystore.type}")
    private String keystoreType;

    @Value("${jwt.keystore.path}")
    private String keystorePath;

    @Value("${jwt.keystore.passwd}")
    private String keystorePasswd;

    @Value("${jwt.keystore.alias}")
    private String keystoreAlias;

    @Value("${jwt.keystore.aliasPasswd}")
    private String keystoreAliasPasswd;

    @Autowired()
    private IDbService dbService;

    @Autowired()
    private IListGroupService listGroupSvc;

    @Autowired()
    private IUserMapper userMapper;

    @Autowired()
    private IGroupMapper groupMapper;

    private AtomicReference<PrivateKeyEntry> keyPair = new AtomicReference<>(null);

    /**
     *
     */
    @Override
    public LoginResponse login(String email, String password) throws LoginNotFoundException, TechnicalLoginException
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

            long issuedAt = System.currentTimeMillis();
            long expires = issuedAt + TWO_HOURS_IN_MILLIES;
            String token = this.createToken(user, groups, issuedAt, expires);

            return LoginResponse.builder() //
                .token(token) //
                .expires(new Timestamp(expires)) //
                .build();
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
    public LoginResponse changePwd(String email, String password, String newPwd)
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

            long issuedAt = System.currentTimeMillis();
            long expires = issuedAt + TWO_HOURS_IN_MILLIES;
            String token = this.createToken(user, groups, issuedAt, expires);

            return LoginResponse.builder() //
                .token(token) //
                .expires(new Timestamp(expires)) //
                .build();
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
     * Validiere einen plain Token
     * @throws TechnicalLoginException 
     * @throws InvalidTokenException 
     * @throws ExpiredTokenException 
     */
    @Override
    public TokenPayload validateToken(String token)
        throws TechnicalLoginException, InvalidTokenException, ExpiredTokenException
    {
        TokenPayload result = TokenPayload.empty();
        PrivateKeyEntry pke = this.getKeyPair();
        X509Certificate x509Cert = (X509Certificate) pke.getCertificate();

        try
        {
            JwtParser parser = Jwts.parser() //
                .verifyWith(pke.getCertificate().getPublicKey()) //
                .requireAudience("WTG") //
                .requireIssuer(x509Cert.getIssuerX500Principal().getName()) //
                //            .requireNotBefore(new Date(System.currentTimeMillis() - TWO_HOURS_IN_MILLIES)) //
                .build();

            Jws<Claims> claims = parser.parseSignedClaims(token);
            Claims payload = claims.getPayload();

            Object flatUser = payload.get("user");
            ObjectMapper mapper = new ObjectMapper(); // jackson's objectmapper
            UserDTO user = mapper.convertValue(flatUser, UserDTO.class);

            Object flatGroups = payload.get("groups");
            List<GroupDTO> groups = mapper.convertValue(flatGroups, new TypeReference<List<GroupDTO>>()
            {
            });

            result = TokenPayload.builder() //
                .user(this.userMapper.fromDTO(user)) //
                .groups(this.groupMapper.fromDTO(groups)) //
                .build();
        }
        catch (ExpiredJwtException e)
        {
            throw new ExpiredTokenException();
        }
        catch (IncorrectClaimException e)
        {
            throw new InvalidTokenException();
        }
        return result;
    }

    /**
     * @throws ExpiredTokenException 
     * @throws InvalidTokenException 
     * @throws TechnicalLoginException 
     *
     */
    @Override
    public LoginResponse refreshToken(String token)
        throws TechnicalLoginException, InvalidTokenException, ExpiredTokenException
    {
        log.info("refresh token");
        TokenPayload payload = this.validateToken(token);

        long issuedAt = System.currentTimeMillis();
        long expires = issuedAt + TWO_HOURS_IN_MILLIES;
        String newToken = this.createToken(payload.getUser(), payload.getGroups(), issuedAt, expires);

        return LoginResponse.builder() //
            .token(newToken) //
            .expires(new Timestamp(expires)) //
            .build();
    }

    /**
     * @param email
     * @param user
     * @param groups
     * @param issued
     * @param expires
     * @return
     * @throws TechnicalLoginException
     */
    private String createToken(User user, List<Group> groups, long issued, long expires) throws TechnicalLoginException
    {
        PrivateKeyEntry pke = this.getKeyPair();
        X509Certificate x509Cert = (X509Certificate) pke.getCertificate();
        PrivateKey privKey = pke.getPrivateKey();

        return Jwts.builder() //
            .id(UUID.randomUUID().toString()) //
            .audience().add("WTG").and() //
            .issuedAt(new Date(issued)) //
            .notBefore(new Date(issued)) //
            .expiration(new Date(expires)) // 
            .subject(user.getEmail()) //
            .issuer(x509Cert.getIssuerX500Principal().getName()) //
            .claims() //
            .add("user", this.userMapper.toDTO(user)) //
            .add("groups", this.groupMapper.toDTO(groups)) //
            .and() //
            .signWith(privKey) //
            .compact();
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


    /**
     * @return
     * @throws TechnicalLoginException 
     */
    private PrivateKeyEntry getKeyPair() throws TechnicalLoginException
    {
        PrivateKeyEntry keyPair = this.keyPair.get();
        if (keyPair == null)
        {
            keyPair = this.loadKeyStore();
            this.keyPair.set(keyPair);
        }
        return keyPair;
    }

    /**
     * @return
     * @throws TechnicalLoginException 
     */
    private PrivateKeyEntry loadKeyStore() throws TechnicalLoginException
    {
        try (InputStream in = new FileInputStream(new File(this.keystorePath)))
        {
            KeyStore store = KeyStore.getInstance(this.keystoreType);
            store.load(in, this.keystorePasswd.toCharArray());
            return (PrivateKeyEntry) store.getEntry(this.keystoreAlias,
                new KeyStore.PasswordProtection(this.keystoreAliasPasswd.toCharArray()));
        }
        catch (Exception e)
        {
            throw new TechnicalLoginException("Der Zertifikats-Speicher konnte nicht geladen werden.", e);
        }
    }

}
