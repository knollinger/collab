import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEventFull } from '../../models/calendar-event-full';


@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css'],
  standalone: false
})
export class CalendarEventEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  fullEvent: CalendarEventFull = CalendarEventFull.empty();
  uploads: Array<File> = new Array<File>();

  mainFormValid: boolean = false;
  recurringFormValid: boolean = false;
  personFormValid: boolean = false;

  /**
   * 
   * @param route 
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calSvc: CalendarService,
    private sessSvc: SessionService,
    private titlebarSvc: TitlebarService) {

  }

  /**
   * Entweder wurde ein bestehendes Event selektiert, in diesem Fall ist die
   * uuid gesetzt. 
   * 
   * Oder ein neues Event wurde generiert, in diesem Fall ist start/end gesetzt.
   */
  ngOnInit() {

    this.titlebarSvc.subTitle = 'Kalender-Termin bearbeiten';
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params['eventId'];
        if (uuid) {
          this.loadEvent(uuid);
        }
        else {
          const start = Number.parseInt(params['start']);
          const end = Number.parseInt(params['end']);
          const fullDay = params['fullDay'] === 'true';
          this.createNewEvent(new Date(start), new Date(end), fullDay);
        }
      });
  }

  /**
   * Lade das Event anhand seiner UUID
   * 
   * @param uuid 
   */
  private loadEvent(uuid: string) {

    this.calSvc.getEvent(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fullEvent => {

        this.fullEvent = fullEvent;
        this.uploads = new Array<File>();
        this.titlebarSvc.subTitle = this.fullEvent.core.title;
      })
  }

  /**
   * 
   * @param start 
   * @param end 
   */
  private createNewEvent(start: Date, end: Date, fullDay: boolean) {

    const owner = this.sessSvc.currentUser.userId;
    this.fullEvent = CalendarEventFull.empty();
    this.fullEvent.core.start = start;
    this.fullEvent.core.end = end;
    this.fullEvent.core.fullDay = fullDay;
    this.fullEvent.reqPersons.push(this.sessSvc.currentUser);
    this.titlebarSvc.subTitle = 'Neuer Termin';
  }


  /**
   * 
   * @param val 
   */
  onMainFormValidChange(val: boolean) {
    this.mainFormValid = val;
  }

  /**
   * 
   * @param val 
   */
  onRecurringFormValidChange(val: boolean) {
    this.recurringFormValid = val;
  }

  /**
   * 
   * @param val 
   */
  onPersonFormValidChange(val: boolean) {
    this.personFormValid = val;
  }

  /**
   * 
   * @param files 
   */
  onUploadChange(files: File[]) {

    this.uploads = files;
  }

  /**
   * 
   */
  get isValid(): boolean {
    return this.mainFormValid && this.recurringFormValid && this.personFormValid;
  }

  /**
   * 
   */
  onSave() {

    const saveRsp = this.fullEvent.core.uuid ? this.calSvc.saveEvent(this.fullEvent) : this.calSvc.createEvent(this.fullEvent);
    saveRsp.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {

        this.uploadFiles(event.core.uuid);
        this.onGoBack();
      })
  }

  /**
   * 
   * @param eventId 
   */
  private uploadFiles(eventId: string) {
    if (this.uploads && this.uploads.length) {

      this.calSvc.uploadFiles(eventId, this.uploads)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
        })
    }
  }

  /**
   * 
   */
  onGoBack() {
    this.router.navigateByUrl('/calendar/show');
  }
}
