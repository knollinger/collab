package org.knollinger.colab.user.models;

import java.io.InputStream;

public record Avatar(String contentType, InputStream data)
{

}
