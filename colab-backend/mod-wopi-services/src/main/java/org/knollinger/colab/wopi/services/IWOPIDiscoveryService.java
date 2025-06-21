package org.knollinger.colab.wopi.services;

import java.util.Map;

import org.knollinger.colab.wopi.exceptions.TechnicalWOPIException;

public interface IWOPIDiscoveryService
{
    public Map<String, Map<String, String>> discoverWOPI() throws TechnicalWOPIException;
}
