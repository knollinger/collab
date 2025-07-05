import { Type } from "@angular/core";
import { WidgetTypeRegistryService } from "../services/widget-type-registry.service";
import { DashboardUnknownWidgetTypeComponent } from '../components/widgets/dashboard-unknown-widget-type/dashboard-unknown-widget-type.component';

/**
 * 
 */
export interface IDashboardWidgetDescriptor {
    id: string,
    widgetType: string,
    width: number,
    height: number
}

/**
 * 
 */
export class DashboardWidgetDescriptor {

    /**
     * 
     * @param widgetType 
     * @param width 
     * @param height 
     */
    constructor(
        public readonly id: string,
        public readonly widgetType: Type<unknown>,
        public width: number,
        public height: number) {

    }

    /**
     * 
     * @param json 
     * @returns 
     */
    public static fromJSON(json: IDashboardWidgetDescriptor, typeRegistry: WidgetTypeRegistryService): DashboardWidgetDescriptor {

        console.log('fromJSON')
        let type = typeRegistry.getTypeByName(json.widgetType);
        if(type === null) {
            type = DashboardUnknownWidgetTypeComponent;
        }
        return new DashboardWidgetDescriptor(json.id, type, json.width, json.height);
    }

    /**
     * 
     * @returns 
     */
    public toJSON(typeRegistry: WidgetTypeRegistryService): IDashboardWidgetDescriptor {
        return {
            id: this.id,
            widgetType: typeRegistry.getNameByType(this.widgetType) || 'unknown type',
            width: this.width,
            height: this.height
        }
    }
}
