import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { BackendRoutingService } from '../../mod-commons/mod-commons.module';

import { IPinBoard, PinBoard } from '../models/pinboard';
import { IPinCard, PinCard } from '../models/pincard';

@Injectable({
  providedIn: 'root'
})
export class PinboardService {

  private static routes: Map<string, string> = new Map<string, string>(
    [
      ['getAllPinBoards', 'v1/pinboards'],
      ['getPinCards', 'v1/pinboards/{1}']
    ]);

  constructor(
    private http: HttpClient,
    private backendRouter: BackendRoutingService) {

  }

  /**
   * Lade alle Pinboards
   * 
   * @returns 
   */
  public getAllPinBoards(): Observable<PinBoard[]> {

    const url = this.backendRouter.getRouteForName('getAllPinBoards', PinboardService.routes);
    return this.http.get<IPinBoard[]>(url).pipe(
      map(result => {
        return result.map(pinboard => {
          return PinBoard.fromJSON(pinboard);
        })
      })
    );
  }

  /**
   * 
   * @param board 
   * @returns 
   */
  public getCardsFor(boardId: string): Observable<PinCard[]> {

    const url = this.backendRouter.getRouteForName('getPinCards', PinboardService.routes, boardId);
    return this.http.get<IPinCard[]>(url).pipe(
      map(result => {
        return result.map(pincard => {
          return PinCard.fromJSON(pincard);
        })
      })
    );
  }
}
