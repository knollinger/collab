package org.knollinger.colab.user.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.KeyStore.PrivateKeyEntry;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import org.knollinger.colab.user.dtos.GroupDTO;
import org.knollinger.colab.user.dtos.UserDTO;
import org.knollinger.colab.user.exceptions.ExpiredTokenException;
import org.knollinger.colab.user.exceptions.InvalidTokenException;
import org.knollinger.colab.user.exceptions.TechnicalLoginException;
import org.knollinger.colab.user.mapper.IGroupMapper;
import org.knollinger.colab.user.mapper.IUserMapper;
import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.models.TokenCreatorResult;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.ITokenService;
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

@Service
public class TokenServiceImpl implements ITokenService
{
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
    private IUserMapper userMapper;

    @Autowired()
    private IGroupMapper groupMapper;

    private AtomicReference<PrivateKeyEntry> keyPair = new AtomicReference<>(null);

    /**
     *
     */
    @Override
    public TokenCreatorResult createToken(User user, List<Group> groups, long ttl) throws TechnicalLoginException
    {
        long issued = System.currentTimeMillis();
        long expires = issued + ttl;
        PrivateKeyEntry pke = this.getKeyPair();

        String token = Jwts.builder() //
            .id(UUID.randomUUID().toString()) //
            .audience().add("WTG").and() //
            .issuedAt(new Date(issued)) //
            .notBefore(new Date(issued)) //
            .expiration(new Date(expires)) // 
            .subject(user.getEmail()) //
            .issuer(((X509Certificate) pke.getCertificate()).getIssuerX500Principal().getName()) //
            .claims() //
            .add("user", this.userMapper.toDTO(user)) //
            .add("groups", this.groupMapper.toDTO(groups)) //
            .and() //
            .signWith(pke.getPrivateKey()) //
            .compact();
        return new TokenCreatorResult(token, expires);
    }

    /**
     *
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
            Date expires = payload.getExpiration();

            Object flatUser = payload.get("user");
            ObjectMapper mapper = new ObjectMapper(); // jackson's objectmapper
            UserDTO user = mapper.convertValue(flatUser, UserDTO.class);

            Object flatGroups = payload.get("groups");
            List<GroupDTO> groups = mapper.convertValue(flatGroups, new TypeReference<List<GroupDTO>>()
            {
            });

            result = TokenPayload.builder() //
                .token(token) //
                .user(this.userMapper.fromDTO(user)) //
                .groups(this.groupMapper.fromDTO(groups)) //
                .expires(expires.getTime()) //
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
     *
     */
    @Override
    public TokenCreatorResult refreshToken(String token, long ttl)
        throws InvalidTokenException, ExpiredTokenException, TechnicalLoginException
    {
        TokenPayload payload = this.validateToken(token);
        
        return this.createToken(payload.getUser(), payload.getGroups(), ttl);
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
//        try (InputStream in = new URL(this.keystorePath).openStream())
        {
            KeyStore store = KeyStore.getInstance(this.keystoreType);
            store.load(in, this.keystorePasswd.toCharArray());
            return (PrivateKeyEntry) store.getEntry(this.keystoreAlias,
                new KeyStore.PasswordProtection(this.keystoreAliasPasswd.toCharArray()));
        }
        catch (GeneralSecurityException | IOException e)
        {
            throw new TechnicalLoginException("unable to load keystore", e);
        }
    }
}
