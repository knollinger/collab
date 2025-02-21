import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Der Service dient als Singleton, um die Anzahl offener HTTP-Requests
 * zwischen dem SpinnerInterceptor und der SpinnerComponent zu teilen.
 * 
 * Desweiteren kann ein MessageText übergeben werden, dieser wird bei 
 * angezeigtem Spinner angezeigt.
 */
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private pendingRequests: number = 0;

  public isLoading = new BehaviorSubject<boolean>(false);
  public message = new BehaviorSubject<string>('');

  /**
   *
   */
  public constructor() {

  }

  /**
   *
   */
  public addPendingRequest() {

    this.isLoading.next(true);
    this.pendingRequests++;
  }

  /**
   *
   */
  public removePendingRequest() {

    if (this.pendingRequests > 0) {
      this.pendingRequests--;
    }
    
    if(this.pendingRequests == 0) {
      this.setMessage('');
    }
    this.isLoading.next(this.pendingRequests > 0);
  }

  /**
   *
   * @param message
   */
  public setMessage(message: string) {

    this.message.next(message);
  }
}
