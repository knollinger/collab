import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-files-permissions',
  templateUrl: './files-permissions.component.html',
  styleUrls: ['./files-permissions.component.css'],
  standalone: false
})
export class FilesPermissionsComponent {

  @Input()
  disabled: boolean = false;

  @Input()
  permission: number = 0o77;

  @Output()
  permissionChange: EventEmitter<number> = new EventEmitter<number>();

  public get usrRead(): number {
    return 0o400;
  }

  public get usrWrite(): number {
    return 0o200;
  }

  public get usrDelete(): number {
    return 0o100;
  }

  public get grpRead(): number {
    return 0o40;
  }

  public get grpWrite(): number {
    return 0o20;
  }

  public get grpDelete(): number {
    return 0o10;
  }

  public get worldRead(): number {
    return 0o4;
  }

  public get worldWrite(): number {
    return 0o2;
  }

  public get worldDelete(): number {
    return 0o1;
  }

  hasPermission(perm: number): boolean {
    return (this.permission & perm) === perm;
  }

  onPermChange(evt: MatCheckboxChange, perm: number) {

    if (evt.checked) {
      this.permission |= perm;
    }
    else {
      this.permission &= ~perm;
    }
    this.permissionChange.emit(this.permission);
  }

  get octalPresentation(): string {

    const val = '000' + this.permission.toString(8);
    return val.substring(val.length - 3);
  }
}
