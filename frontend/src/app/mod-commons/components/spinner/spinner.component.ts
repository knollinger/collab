import { Component, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SpinnerService } from '../../services/spinner.service';

/**
 * Die Component dient der visualisierung des loader-states.
 * Dazu stützt sie sich auf den sharedState des SpinnerService.
 * Dieser wiederum wird vom SpinnerInterceptor kontrolliert.
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class SpinnerComponent implements OnDestroy {

  showLoading: boolean = false;
  message: string = '';
  loadingSubscription: Subscription;
  messageSubscription: Subscription;

  /**
   * Wir subscriben hier das isLoading-Property des SpinnerServices. Um nicht permanent
   * den Spinner anzuzeigen, wird ein debounce von 500ms gewählt.
   */
  constructor(
    private spinnerService: SpinnerService) {

    this.loadingSubscription = this.spinnerService.isLoading.pipe(debounceTime(500)).subscribe(val => {
      this.showLoading = val;
    });

    this.messageSubscription = this.spinnerService.message.subscribe(val => {
      this.message = val;
    });
  }

  /**
   *
   */
  ngOnDestroy() {

    this.loadingSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.message = '';
  }
}
