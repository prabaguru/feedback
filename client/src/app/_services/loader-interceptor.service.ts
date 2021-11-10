import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, empty  } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  private sharedDataInfo: any = {};
  constructor(private router: Router,private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.showLoader();

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.onEnd();
      }
        let element =  document.getElementById('loaderInterService');
        if (typeof(element) != 'undefined' && element != null)
        {
          element.style.display = "none";
        }
    },
      (err: any) => {
        if (err.status === 0 || err.status === 500 || err.status === 503){
          this.router.navigate(['/']);
          document.getElementById("loaderInterService").style.display = "block";
        }
        this.onEnd();
      }));
    
  }
  

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }

}