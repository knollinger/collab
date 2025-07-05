package org.knollinger.colab.dashboard.mapper;

import java.util.List;

import org.knollinger.colab.dashboard.data.DashboardWidgetDesc;
import org.knollinger.colab.dashboard.dtos.DashboardWidgetDescDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IDashboardWidgetMapper
{
    public DashboardWidgetDesc fromDTO(DashboardWidgetDescDTO dto);
    public DashboardWidgetDescDTO toDTO(DashboardWidgetDesc widget);

    public List<DashboardWidgetDesc> fromDTO(List<DashboardWidgetDescDTO> dtos);
    public List<DashboardWidgetDescDTO> toDTO(List<DashboardWidgetDesc> inodes);
}
