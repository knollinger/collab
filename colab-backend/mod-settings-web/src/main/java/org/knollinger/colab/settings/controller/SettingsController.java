package org.knollinger.colab.settings.controller;

import org.knollinger.colab.settings.exc.TechnicalSettingsException;
import org.knollinger.colab.settings.services.ISettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 
 */
@RestController
@RequestMapping(path = "/v1/settings")
public class SettingsController
{
    @Autowired()
    private ISettingsService settingsSvc;

    /**
     * @return
     */
    @GetMapping(path = "")
    public String getSettings()
    {
        try
        {
            return this.settingsSvc.getSettingsLOB();
        }
        catch (TechnicalSettingsException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @return
     */
    @PostMapping(path = "")
    public void setSettings(@RequestBody String lob)
    {
        try
        {
            this.settingsSvc.saveSettingsLOB(lob);
        }
        catch (TechnicalSettingsException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
