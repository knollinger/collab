package org.knollinger.workingtogether.user.models;

import java.io.InputStream;

public record Avatar(String contentType, InputStream data)
{

}
