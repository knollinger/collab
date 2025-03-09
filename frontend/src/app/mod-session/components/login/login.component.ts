import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SessionService } from '../../services/session.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  private redirUrl: string = '';
  loginForm: FormGroup;
  hidePwds: boolean = true;

  /**
   *
   * @param router
   * @param route
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private sessSvc: SessionService
  ) {

    this.loginForm = this.formBuilder.nonNullable.group(
      {
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        passwd: new FormControl<string>('', [Validators.required]),
        newPwd1: new FormControl<string>('', []),
        newPwd2: new FormControl<string>('', []),
      }
    );
    this.loginForm.markAllAsTouched();
  }

  /**
   *
   */
  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      this.redirUrl = params.get('redirUrl') || '';
    });
  }
  toggleValidators(changePwd: MatSlideToggleChange) {

    const pwd1 = this.loginForm.get('newPwd1');
    const pwd2 = this.loginForm.get('newPwd2');

    if (pwd1 && pwd2) {

      pwd1.setValue('');
      pwd2.setValue('');

      if (changePwd.checked) {
        pwd1.setValidators([Validators.required]);
        pwd2.setValidators([Validators.required]);
        this.loginForm.setValidators(LoginComponent.crossFieldCheck);
      }
      else {
        pwd1.setValidators([]);
        pwd2.setValidators([]);
        this.loginForm.setValidators([]);
      }
      pwd1.updateValueAndValidity();
      pwd2.updateValueAndValidity();
      this.loginForm.updateValueAndValidity();
    }
  }

  /**
    * 
    * @param control 
    * @returns 
    */
  static crossFieldCheck(control: AbstractControl) {

    const group = control as FormGroup;
    const oldPwd = group.controls['passwd'];
    const newPwd1 = group.controls['newPwd1'];
    const newPwd2 = group.controls['newPwd2'];

    if (newPwd1.value === oldPwd.value) {
      newPwd1.setErrors({ sameNewPwd: true });
    }
    else {
      if (newPwd1.value !== newPwd2.value) {
        newPwd2.setErrors({ newPwdDiff: true });
      }
    }
    return null;
  }
  /**
   *
   */
  onSubmit(): void {

    const email = this.loginForm.get('email')!.value || '';
    const passwd = this.loginForm.get('passwd')!.value || '';
    const newPwd = this.loginForm.get('newPwd1')!.value || '';

    this.sessSvc.login(email, passwd, newPwd)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(session => {

        if (this.redirUrl) {
          this.router.navigateByUrl(this.redirUrl);
        }
        else {
          this.location.back();
        }
      });
  }
}
