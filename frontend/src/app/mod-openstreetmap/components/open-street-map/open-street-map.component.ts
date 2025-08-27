import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as L from 'leaflet';

import { OSMService } from '../../services/osm.service';
import { OSMLocation } from '../../models/osm-location';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-open-street-map',
  templateUrl: './open-street-map.component.html',
  styleUrls: ['./open-street-map.component.css']
})
export class OpenStreetMapComponent implements AfterViewInit {

  private static TILE_URL_TEMPLATE: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  private static ATTRIBUTION_TEMPLATE: string = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  @ViewChild('mapCnr')
  private mapCnr: ElementRef<HTMLDivElement> | null = null;

  private map: any;
  private markerTemplate: L.Icon;
  private currMarker: L.Marker | null = null;

  /**
   * 
   * @param osmSvc 
   */
  constructor(
    private osmSvc: OSMService) {

    this.markerTemplate = L.icon({

      iconUrl: '/assets/images/osm/marker-icon.png',
      shadowUrl: '/assets/images/osm/marker-shadow.png',

      iconSize: [25, 41],  // size of the icon
      shadowSize: [41, 41],  // size of the shadow
      iconAnchor: [12, 41],  // point of the icon which will correspond to marker's location
      shadowAnchor: [10, 41],  // the same for the shadow
      popupAnchor: [12, -41]  // point from which the popup should open relative to the iconAnchor
    });
  }

  /**
   * 
   */
  ngAfterViewInit(): void {
    this.initMap();
    if (!this.location.isEmpty()) {
      this.setMarker(this.location.lat, this.location.lon, 10);
    }
  }

  /**
   * 
   */
  private initMap(): void {

    const lat = 0;
    const lon = 0;
    this.map = L.map(this.mapCnr!.nativeElement, {
      center: [lat, lon],
      zoom: 1
    });

    const tiles = L.tileLayer(OpenStreetMapComponent.TILE_URL_TEMPLATE, {
      maxZoom: 18,
      minZoom: 3,
      attribution: OpenStreetMapComponent.ATTRIBUTION_TEMPLATE
    });
    tiles.addTo(this.map);

    this.map.on('click', (evt: any) => {
      this.onMapClick(evt.latlng);
    });


    if (!this.location.isEmpty()) {
      this.setMarker(this.location.lat, this.location.lon);
    }
  }

  /**
   * Setze eine Location. Die Map wird auf diese Position zentriert,
   * ein Marker gesetzt und ein flyTo gestartet
   * 
   * @param location 
   */
  private _location: OSMLocation = OSMLocation.empty();
  
  @Input()
  public set location(location: OSMLocation) {

    this.removeMarker();
    this._location = location;

    if (this.map) {
        this.setMarker(location.lat, location.lon, 10);
    }
  }

  public get location(): OSMLocation {
    return this._location;
  }

  @Output()
  locationChange: EventEmitter<OSMLocation> = new EventEmitter<OSMLocation>();


  /**
   * 
   * @param latLon 
   */
  onMapClick(latLon: L.LatLng) {
    this.osmSvc.reverseSearch(latLon.lat, latLon.lng).subscribe(location => {
      this.setMarker(location.lat, location.lon);
      this._location = location;
      this.locationChange.next(location);
    });
  }

  /**
   * 
   * @param lat 
   * @param lon 
   * @param name 
   */
  private setMarker(lat: number, lon: number, zoom?: number) {

    this.removeMarker();

    this.currMarker = L.marker([lat, lon], { icon: this.markerTemplate });
    // if (name) {
    //   this.currMarker.bindPopup(name);
    // }
    this.currMarker.addTo(this.map);
   this.map.flyTo([lat, lon], zoom)
  }

  /**
   * 
   */
  private removeMarker() {
    if (this.currMarker) {
      this.map.removeLayer(this.currMarker);
      this.currMarker = null;
    }
  }
}
