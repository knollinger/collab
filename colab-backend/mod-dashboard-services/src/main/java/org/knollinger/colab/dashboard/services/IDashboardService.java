package org.knollinger.colab.dashboard.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.dashboard.data.DashboardWidgetDesc;
import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;

public interface IDashboardService
{
    public List<DashboardWidgetDesc> loadWidgets() throws TechnicalDashboardException;
    
    public DashboardWidgetDesc addWidget(String typeName) throws TechnicalDashboardException;

    public void deleteWidget(UUID widgetId) throws TechnicalDashboardException;

    public void addLink(UUID refId, String refType) throws TechnicalDashboardException;
}
