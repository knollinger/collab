import { Component, EventEmitter, Input, Output } from "@angular/core";
import { OSMLocation } from "../../../mod-openstreetmap/mod-openstreetmap.module";
import { BehaviorSubject } from "rxjs";
import { OSMService } from "../../../mod-openstreetmap/mod-openstreetmap.module";

@Component({
  selector: 'app-calendar-event-editor-location',
  templateUrl: './calendar-event-editor-location.component.html',
  styleUrls: ['./calendar-event-editor-location.component.css'],
  standalone: false
})
export class CalendarEventEditorLocationComponent {

  showMap: boolean = false;

  constructor(private osmSvc: OSMService) {

  }

  @Input()
  set locationId(val: string | null) {

    if (val !== this.locationId) {
      this.locationIdChange.next(val);

      if (val) {

        this.osmSvc.lookup(val)
          .pipe()
          .subscribe(locations => {

            this.currLocation = locations.length ? locations[0] : OSMLocation.empty();
          })
      }
    }
  }

  get locationId(): string | null {
    return this.locationIdChange.value;
  }

  @Output()
  locationIdChange: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  currLocation: OSMLocation = OSMLocation.empty();

  /**
   * 
   * @param location 
   */
  onLocationPicked(location: OSMLocation) {
    this.currLocation = location;
    this.locationIdChange.next(location.osmId);
  }

  onLocationSelected(location: OSMLocation) {
    console.dir(location);
    this.currLocation = location;
    this.locationIdChange.next(location.osmId);
  }
}