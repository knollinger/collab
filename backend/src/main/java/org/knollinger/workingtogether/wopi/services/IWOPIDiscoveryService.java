package org.knollinger.workingtogether.wopi.services;

import java.util.Map;

import org.knollinger.workingtogether.wopi.exceptions.TechnicalWOPIException;

public interface IWOPIDiscoveryService
{
    public Map<String, Map<String, String>> discoverWOPI() throws TechnicalWOPIException;
}
