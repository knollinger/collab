package org.knollinger.colab.user.models;

public record TokenCreatorResult(String token, long expires, boolean isPersistent)
{
    
}
