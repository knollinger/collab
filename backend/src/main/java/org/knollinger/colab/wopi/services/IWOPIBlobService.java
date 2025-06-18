package org.knollinger.colab.wopi.services;

import java.io.InputStream;
import java.util.UUID;

import org.knollinger.colab.wopi.exceptions.TechnicalWOPIException;

public interface IWOPIBlobService
{
    public void saveFile(UUID fileId, InputStream blob) throws TechnicalWOPIException;
}
