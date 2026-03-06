package org.knollinger.colab.dashboard.data;

import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
@ToString()
public class DashboardWidgetDesc
{
    private UUID id;
    private String widgetType;
    private int width;
    private int height;
}
