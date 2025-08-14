package org.knollinger.colab.user.services.impl;

import java.util.Collections;
import java.util.List;

import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.models.TokenPayload;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.springframework.stereotype.Service;

/**
 * Die {@link CurrentUserServiceImpl} hält den aktuellen Benutzer 
 * innerhalb der aktuellen Tomcat-Transaktion.
 * 
 * Während einer Transaktion springt zuerst der {@link CheckTokenFilter}
 * an. Dieser prüft das JWT-Cookie und extrahiert im Erfolgs-Fall den Benutzer
 * und dessen Gruppen aus dem Token.
 * 
 * Diese Werte werden als {@link TokenPayload} an den Service übergeben,
 * diese speichert sie in einem ThreadLocal.
 * 
 * Nachdem die Steuerung wieder an den {@link CheckTokenFilter} zurück
 * kehrt wird das ThreadLocal wieder mittels clear() gelöscht.
 */
@Service
public class CurrentUserServiceImpl implements ICurrentUserService
{
    private ThreadLocal<TokenPayload> tokenPayload = ThreadLocal.withInitial(() -> TokenPayload.empty());
    private ThreadLocal<String> lang = ThreadLocal.withInitial(() -> "de-DE");

    /**
     *
     */
    @Override
    public void setToken(TokenPayload payload)
    {
        this.tokenPayload.set(payload);
    }

    /**
     *
     */
    @Override
    public void clear()
    {
        this.tokenPayload.set(TokenPayload.empty());
    }

    /**
     *
     */
    @Override
    public User getUser()
    {
        User user = User.empty();
        TokenPayload token = this.tokenPayload.get();
        if (token != null)
        {
            user = token.getUser();
        }
        return user;
    }

    @Override
    public List<Group> getGroups()
    {
        List<Group> groups = Collections.emptyList();
        TokenPayload token = this.tokenPayload.get();
        if (token != null)
        {
            groups = Collections.unmodifiableList(token.getGroups());
        }
        return groups;
    }
    
    /**
     * 
     */
    public void setLanguage(String language) {
        this.lang.set(language);
    }
    
    /**
     * 
     */
    public String getLanguage() {
        return this.lang.get();
    }
}
