import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AvatarService, User } from '../../../mod-userdata/mod-userdata.module';
import { UserService } from '../../services/user.service';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

/**
 * Der UserPicker implementiert eine Component, welche die 
 * Auswahl eines oderer mehrerer Benutzers durch Eingabe 
 * eines Suchstrings ermöglicht. Dabei werden sowohl der 
 * Vorname, Nachname, AccountName und die Email berücksichtigt.
 * 
 * Die Suche selbst erfolgt lazy. Nur wenn während der 
 * Eingabe des Such-Strings mindestens 500ms keine neue
 * Eingabe erfolgt wird gesucht.
 * 
 * Die Component implementiert alle Interfaces, um als
 * FormControl durch zu gehen, kanns also mittels formControl,
 * formControlName und ngModel an TemplateDriven- und 
 * ReactiveForms gebunden werden.
 */
@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UserPickerComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: UserPickerComponent
    }
  ]
})
export class UserPickerComponent implements OnInit, ControlValueAccessor, Validator {

  private destroyRef = inject(DestroyRef);

  @Input()
  label: string = '';

  /**
   * Der Timeout für den start der Suche in Millies. Default sind 500ms
   */
  @Input()
  timeout: number = 500;

  @Input()
  multiple: boolean = false;

  private searchChangeDebouncer: EventEmitter<string> = new EventEmitter<string>();
  usersFound: User[] = [];
  selectedUsers: User[] = [];

  /**
   * 
   */
  constructor(
    private userSvc: UserService,
    private avatarSvc: AvatarService) {

  }

  /**
   * 
   */
  ngOnInit() {

    this.showAll();
    this.searchChangeDebouncer.pipe(
      debounceTime(500),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(searchString => {
        this.performSearch(searchString);
      })
  }

  /**
   * Der Such-Begriff wurde geändert. Wir packen das ganze erst 
   * mal in den debouncer, vielleicht ergibt sich ja eine neue 
   * Suche.
   * 
   * Wenn der neue Such-Begriff jedoch leer ist, werden einfach 
   * alle Benutzer angezeigt.
   *  
   * @param search 
   */
  onSearchInput(search: string) {

    if (!search) {
      this.showAll();
    }
    else {
      this.searchChangeDebouncer.emit(search);
    }
    this._onTouched();
  }

  /**
   * Callback, wenn aus der Autocomple-Liste ein Element ausgewählt 
   * wurde.
   * 
   * Der User wird in die selectedUsers-Liste aufgenommen, das 
   * InputField und die Autocomplete-Liste werden gelöscht.
   * 
   * @param evt 
   * @param input 
   */
  onSearchOptionSelected(evt: MatAutocompleteSelectedEvent, input: HTMLInputElement) {

    this.selectedUsers.push(evt.option.value);
    this.usersFound = new Array<User>();
    input.value = '';
    this._onChange(this.selectedUsers);
    this._onTouched();
  }

  /**
   * Alle Benutzer anzeigen
   */
  private showAll() {
    this.userSvc.getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.usersFound = user.filter(user => this.searchFilter(user));
      })
  }

  /**
   * 
   * @param searchString 
   */
  private performSearch(searchString: string) {

    if (!searchString) {
      this.usersFound = new Array<User>(0);
    }
    else {

      this.userSvc.searchUsers(searchString)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(users => {
          this.usersFound = users.filter(user => this.searchFilter(user));
        })
    }
  }

  /**
   * Array.filter-Callback, welcher aus der Liste aller gefundenen Benutzer
   * diejenigen ausfiltert welche schon selektiert sind.
   * 
   * @param search 
   * @returns 
   */
  private searchFilter(search: User): boolean {

    for (let user of this.selectedUsers) {
      if (user.userId === search.userId) {
        return false;
      }
    }
    return true;
  }

  /** 
   * Entferne einen Benutzer aus der Liste der selektierten User 
   */
  onUserRemove(toRemove: User) {

    this.selectedUsers = this.selectedUsers.filter(user => {
      return toRemove.userId !== user.userId;
    });
    this._onChange(this.selectedUsers);
    this._onTouched();
  }

  /**
   * Liefere die AVatar-URL eines Benutzers
   * 
   * @param userId 
   * @returns 
   */
  getAvatar(userId: string): string {
    return this.avatarSvc.getAvatarUrl(userId);
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* ControlValueAccessor (Forms-Integration)                                */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  writeValue(users: User[]): void {
    this.selectedUsers = users;
  }

  private _onChange = (users: User[]) => { }
  registerOnChange(callBack: any): void {

    this._onChange = callBack;
  }

  private _onTouched = () => { }
  registerOnTouched(callBack: any): void {
    this._onTouched = callBack;
  }

  setDisabledState?(isDisabled: boolean): void {
    //  throw new Error('Method not implemented.');
  }

  /*-------------------------------------------------------------------------*/
  /*                                                                         */
  /* Validator (Forms-Integration)                                           */
  /*                                                                         */
  /*-------------------------------------------------------------------------*/

  /**
   * Wir haben keine eigenen Validatoren, die Standard-Validatoren (required)
   * sollten reichen
   * 
   * @param control 
   * @returns 
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  private _validatorChangeCallback = () => { };
  registerOnValidatorChange?(callBack: () => void): void {
    this._validatorChangeCallback = callBack;
  }
}
