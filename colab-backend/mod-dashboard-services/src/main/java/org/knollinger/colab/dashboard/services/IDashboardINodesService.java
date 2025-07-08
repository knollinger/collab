package org.knollinger.colab.dashboard.services;

import java.util.List;

import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;
import org.knollinger.colab.filesys.models.INode;

/**
 * 
 */
public interface IDashboardINodesService
{
    /**
     * 
     * @return
     * @throws TechnicalDashboardException
     */
    public List<INode> loadINodes() throws TechnicalDashboardException;
}
