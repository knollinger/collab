package org.knollinger.colab.dashboard.services;

import java.util.List;

import org.knollinger.colab.dashboard.data.DashboardWidgetDesc;
import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;

public interface IDashboardService
{
    public List<DashboardWidgetDesc> loadWidgets() throws TechnicalDashboardException;
}
