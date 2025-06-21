package org.knollinger.colab.user.services.impl;

import org.knollinger.colab.user.models.TokenPayload;
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
    private ThreadLocal<TokenPayload> currentUser = ThreadLocal.withInitial(() -> TokenPayload.empty());

    /**
     *
     */
    @Override
    public TokenPayload get()
    {
        return this.currentUser.get();
    }

    /**
     *
     */
    @Override
    public void clear()
    {
        this.currentUser.set(TokenPayload.empty());
    }

    /**
     *
     */
    @Override
    public void set(TokenPayload payload)
    {
        this.currentUser.set(payload);
    }
}
