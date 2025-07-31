package org.knollinger.colab.settings.services;

import org.knollinger.colab.settings.exc.TechnicalSettingsException;

public interface ISettingsService
{
    public String getSettingsLOB() throws TechnicalSettingsException;
    public void saveSettingsLOB(String lob) throws TechnicalSettingsException;
}
