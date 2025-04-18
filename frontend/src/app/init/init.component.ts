import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SessionService } from '../mod-session/session.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Die InitComponent wird vom SessionRequiredGuard angesteuert, sofern
 * im SessionService keine aktuelle Sitzung existiert.
 * 
 * Die Component selbst ruft nur ein "refreshToken" am SessionService
 * auf. Bei diesem Call wird das ggf noch gesetzte Bearer-Cookie mit ans
 * Backend gesendet. Sollte der Token noch gültig sein, so wird er 
 * verlängert und die Session im SessionService gesetzt. Die Component 
 * routed dann an die angegebene RedirURL.
 * 
 * Sollte der refreshToken fehl schlagen, so wird einfach auf die 
 * LoginPage geroutet, dieser wird die RedirURL mitgegeben.
 */
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  /**
   * 
   * @param sessSvc 
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessSvc: SessionService) {

  }

  /**
   * 
   */
  ngOnInit(): void {

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef)) //
      .subscribe(params => {

        const redirUrl = params.get('redirUrl') || '/home';
        this.sessSvc.refreshToken() //
          .pipe(takeUntilDestroyed(this.destroyRef)) //
          .subscribe(rsp => {

            if (rsp.isEmpty()) {
              const url = `/session/login?redirUrl=${redirUrl}`;
              this.router.navigateByUrl(url);
            }
            else {
              this.router.navigateByUrl(redirUrl);
            }
          });
      });
  }
}
