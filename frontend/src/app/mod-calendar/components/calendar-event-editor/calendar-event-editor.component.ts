import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


import { INode } from "../../../mod-files-data/mod-files-data.module";
import { CalendarEvent } from '../../models/calendar-event';
import { CalendarService } from '../../services/calendar.service';

import { User } from '../../../mod-userdata/mod-userdata.module';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';
import { SessionService } from '../../../mod-session/session.module';
import { CalendarAttachmentsService } from '../../services/calendar-attachments.service';
import { CalendarPersonsService } from '../../services/calendar-persons.service';


@Component({
  selector: 'app-calendar-event-editor',
  templateUrl: './calendar-event-editor.component.html',
  styleUrls: ['./calendar-event-editor.component.css'],
  standalone: false
})
export class CalendarEventEditorComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  event: CalendarEvent = CalendarEvent.empty();
  requiredUsers: User[] = new Array<User>();
  optionalUsers: User[] = new Array<User>();
  hashTags: Array<string> = new Array<string>();
  attachments: Array<INode> = new Array<INode>();
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
    private calUserSvc: CalendarPersonsService,
    private attachmentsSvc: CalendarAttachmentsService,
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
          this.createNewEvent(new Date(start), new Date(end));
        }
      });
  }

  /**
   * Lade das Event andand seiner UUID
   * 
   * @param uuid 
   */
  private loadEvent(uuid: string) {

    this.calSvc.getEvent(uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {

        this.event = result;

        // Benötigte Teilnehmer
        this.calUserSvc.getUsersFor(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(users => {
            this.requiredUsers = users.filter(user => user.required).map(user => user.user);
            this.optionalUsers = users.filter(user => !user.required).map(user => user.user);
          });

        // alle Attachments laden
        this.attachmentsSvc.getAllAttachments(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(attachments => {
            this.attachments = attachments;
          });
      });
  }

  /**
   * 
   * @param start 
   * @param end 
   */
  private createNewEvent(start: Date, end: Date) {

    const owner = this.sessSvc.currentUser.userId;
    this.event = new CalendarEvent('', owner, '', start, end, '', false, null);
    this.requiredUsers = [this.sessSvc.currentUser];
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
   * @param inodes 
   */
  onAttachmentsChange(inodes: INode[]) {

    this.attachments = inodes;
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

    const saveRsp = this.event.uuid ? this.calSvc.saveEvent(this.event) : this.calSvc.createEvent(this.event);
    saveRsp.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {

        // personen

        // hashtags

        // attachments

        // uploads
        if (this.uploads && this.uploads.length) {

          this.calSvc.uploadFiles(event.uuid, this.uploads)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
            })
        }

        this.onGoBack();
      })
  }

  onGoBack() {
    this.router.navigateByUrl('/calendar/show');
  }
}
