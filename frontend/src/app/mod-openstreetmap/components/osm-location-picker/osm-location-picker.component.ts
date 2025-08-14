import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OSMLocation } from '../../models/osm-location';
import { OSMService } from '../../services/osm.service';

@Component({
  selector: 'app-osm-location-picker',
  templateUrl: './osm-location-picker.component.html',
  styleUrls: ['./osm-location-picker.component.css'],
  standalone: false
})
export class OSMLocationPickerComponent {

  @Input()
  location: OSMLocation = OSMLocation.empty();

  @Output()
  locationChange: EventEmitter<OSMLocation> = new EventEmitter<OSMLocation>();

  locationsFound: OSMLocation[] = new Array<OSMLocation>();

  constructor(private osmSvc: OSMService) {

  }

  /**
   * 
   * @param search 
   */
  onSearchChange(search: string) {

    if (!search) {
      this.locationsFound = new Array<OSMLocation>();
    }
    else {

      this.osmSvc.search(search).subscribe(results => {
        this.locationsFound = results;
      })
    }
  }

  /**
   * 
   * @param location 
   */
  onLocationSelected(location: OSMLocation) {
    this.locationChange.emit(location);
  }
}
