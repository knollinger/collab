package org.knollinger.colab.dashboard.data;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class DashboardWidgetDesc
{
    private UUID id;
    private String widgetType;
    private int width;
    private int height;
}
