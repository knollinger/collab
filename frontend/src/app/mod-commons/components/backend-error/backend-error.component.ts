import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IBackendError {
  message: string,
  method: string,
  path: string,
  status: number,
  trace: string
}

@Component({
  selector: 'app-backend-error',
  templateUrl: './backend-error.component.html',
  styleUrls: ['./backend-error.component.css']
})
export class BackendErrorComponent {

  public showDetails: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public error: IBackendError) {

  }
}
