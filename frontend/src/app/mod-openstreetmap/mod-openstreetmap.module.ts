import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModCommonsModule } from '../mod-commons/mod-commons.module';

import { OSMLocation } from './models/osm-location';
export { OSMLocation }

import { OSMService } from './services/osm.service';
export { OSMService }

import { OpenStreetMapComponent } from './components/open-street-map/open-street-map.component';
import { OSMLocationPickerComponent } from './components/osm-location-picker/osm-location-picker.component';



@NgModule({
  declarations: [
    OpenStreetMapComponent,
    OSMLocationPickerComponent
  ],
  imports: [
    CommonModule,
    ModCommonsModule
  ],
  exports: [
    OpenStreetMapComponent,
    OSMLocationPickerComponent
  ]
})
export class ModOpenstreetmapModule { }
