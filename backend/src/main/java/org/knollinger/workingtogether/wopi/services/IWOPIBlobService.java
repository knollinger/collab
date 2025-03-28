package org.knollinger.workingtogether.wopi.services;

import java.io.InputStream;
import java.util.UUID;

import org.knollinger.workingtogether.wopi.exceptions.TechnicalWOPIException;

public interface IWOPIBlobService
{
    public void saveFile(UUID fileId, InputStream blob) throws TechnicalWOPIException;
}
