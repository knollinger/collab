import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export class BackendErrorDesc {

  constructor(
    public readonly httpStatusCode: number,
    public readonly httpStatusText: string,
    public readonly path: string,
    public readonly msg: string,
    public readonly stackTrace: string) {

  }

  static empty() {
    return new BackendErrorDesc(0, '', '', '', '');
  }

}

@Injectable({
  providedIn: 'root'
})
export class ShowBackendErrorService {

  private _errorDesc: BackendErrorDesc = BackendErrorDesc.empty();

  /**
   * 
   * @param router 
   */
  constructor(private router: Router) {

  }

  /**
   * 
   * @param desc 
   */
  showBackendError(desc: BackendErrorDesc) {

    this._errorDesc = desc;
    this.router.navigateByUrl('/commons/error');
  }

  /**
   * 
   */
  get errorDesc(): BackendErrorDesc {
    return this._errorDesc;
  }

  /**
   * 
   */
  clear() {
    this._errorDesc = BackendErrorDesc.empty();
  }
}
