package org.knollinger.colab.user.models;

import java.util.ArrayList;
import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 
 */
@Builder()
@ToString
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class TokenPayload
{
    private String token;
    private User user;
    private List<Group> groups;
    private long expires;

    /**
     * Erzeuge eine leere Instanz der TokenPayload. Das ganze dient dazu,
     * null-Results zu vermeiden. In solchen Fällen kann einfach eine
     * empty()-Instanz geliefert werden.
     * 
     * @return
     */
    public static TokenPayload empty()
    {

        return TokenPayload.builder() //
            .user(User.empty()) //
            .groups(new ArrayList<Group>()).build();
    }

    /**
     * Ist die aktuelle Instanz leer?
     * 
     * @return
     */
    public boolean isEmpty()
    {
        return this.user.isEmpty();
    }
}
