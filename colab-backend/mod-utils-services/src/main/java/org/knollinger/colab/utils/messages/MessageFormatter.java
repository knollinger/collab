package org.knollinger.colab.utils.messages;

import java.util.IllegalFormatException;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class MessageFormatter
{
    public static String formatMsg(Class<?> clazz, String key, Object... params)
    {
        try
        {
            ResourceBundle b = ResourceBundle.getBundle(clazz.getName());
            String format = b.getString(key);
            return String.format(format, params);
        }
        catch (MissingResourceException | IllegalFormatException e)
        {
            return String.format("%1$s::%2$s = %3$s", clazz.getName(), key, params.toString());
        }
    }
}
