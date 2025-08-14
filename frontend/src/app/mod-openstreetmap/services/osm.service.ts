import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IOSMLocation, OSMLocation } from '../models/osm-location';

@Injectable({
  providedIn: 'root'
})
export class OSMService {

  private static searchUrl: string = 'https://nominatim.openstreetmap.org/search?q={query}&addressdetails=1&format=jsonv2';
  private static reverseUrl: string = 'https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=jsonv2';
  private static lookupUrl: string = 'https://nominatim.openstreetmap.org/lookup?osm_ids={id}&format=jsonv2';

  constructor(private http: HttpClient) {

  }

  /**
   * 
   * @param query 
   * @returns 
   */
  public search(query: string): Observable<OSMLocation[]> {

    const url = OSMService.searchUrl.replace('{query}', encodeURIComponent(query));
    return this.http.get<IOSMLocation[]>(url, { withCredentials: false })
      .pipe(
        map(locations => {
          return locations.map(location => {
            return OSMLocation.fromJSON(location);
          });
        })
      );
  }

  /**
   * 
   * @param lat 
   * @param lon 
   */
  reverseSearch(lat: number, lon: number): Observable<OSMLocation> {

    const url = OSMService.reverseUrl.replace('{lat}', lat.toString()).replace('{lon}', lon.toString());
    console.log(url);

    return this.http.get<IOSMLocation>(url, { withCredentials: false })
      .pipe(
        map(location => {
          return OSMLocation.fromJSON(location);
        })
      );
  }

  lookup(osmLocId: string): Observable<OSMLocation[]> {

    const url = OSMService.lookupUrl.replace('{id}', osmLocId);
    console.log(url);

    return this.http.get<IOSMLocation[]>(url, { withCredentials: false })
      .pipe(
        map(locations => {
          return locations.map(location => {
            return OSMLocation.fromJSON(location);
          });
        })
      );
  }
}
