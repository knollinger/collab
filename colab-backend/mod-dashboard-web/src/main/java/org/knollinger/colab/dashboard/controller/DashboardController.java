package org.knollinger.colab.dashboard.controller;

import java.util.List;

import org.knollinger.colab.dashboard.data.DashboardWidgetDesc;
import org.knollinger.colab.dashboard.dtos.DashboardWidgetDescDTO;
import org.knollinger.colab.dashboard.exceptions.TechnicalDashboardException;
import org.knollinger.colab.dashboard.mapper.IDashboardWidgetMapper;
import org.knollinger.colab.dashboard.services.IDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping(path = "/widgets", produces = MediaType.APPLICATION_JSON_VALUE)
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
        //        return "[{\"id\": \"1\", \"widgetType\":\"clock\",\"width\":1,\"height\":1},{\"id\": \"2\", \"widgetType\":\"files\",\"width\":3,\"height\":4},{\"id\": \"3\", \"widgetType\":\"calendar\",\"width\":1,\"height\":3}]";
    }
}
