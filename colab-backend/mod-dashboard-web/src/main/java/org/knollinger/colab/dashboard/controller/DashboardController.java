package org.knollinger.colab.dashboard.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.dashboard.data.DashboardWidgetDesc;
import org.knollinger.colab.dashboard.dtos.DashboardWidgetDescDTO;
import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;
import org.knollinger.colab.dashboard.mapper.IDashboardWidgetMapper;
import org.knollinger.colab.dashboard.services.IDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "v1/dashboard")
public class DashboardController
{
    @Autowired
    IDashboardService dashboardSvc;

    @Autowired
    IDashboardWidgetMapper dashboardMapper;

    @GetMapping(path = "/widgets")
    public List<DashboardWidgetDescDTO> loadAllWidgets()
    {
        try
        {
            List<DashboardWidgetDesc> widgets = this.dashboardSvc.loadWidgets();
            return this.dashboardMapper.toDTO(widgets);
        }
        catch (TechnicalDashboardException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param typeName
     * @return
     */
    @PutMapping(path = "/widgets")
    public DashboardWidgetDescDTO addWidget(@RequestParam("typeName") String typeName)
    {
        try
        {
            DashboardWidgetDesc desc = this.dashboardSvc.addWidget(typeName);
            return this.dashboardMapper.toDTO(desc);
        }
        catch (TechnicalDashboardException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param widgetId
     */
    @DeleteMapping(path = "/widgets")
    public void deleteWidget(@RequestParam("widgetId") UUID widgetId)
    {
        try
        {
            this.dashboardSvc.deleteWidget(widgetId);
        }
        catch (TechnicalDashboardException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
