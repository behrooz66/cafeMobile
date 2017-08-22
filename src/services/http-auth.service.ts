import { Injectable, Injector, Inject } from '@angular/core';
import { Http, XHRBackend, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Request, Headers, } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { AuthService } from './auth.service';
import { NavController } from 'ionic-angular';
import { App } from 'ionic-angular/index';
import { LoginPage } from '../pages/login/login';

@Injectable()
export class HttpAuthService extends Http {

  _authService: AuthService;
  _router: NavController;
//   constructor(router:NavController, injector:Injector, authService:AuthService){
//       let _http = injector.get(Http);
//       super(_http._backend, _http._defaultOptions);
//       this._authService = authService;
//       this._router = router;
//   }

  constructor(
      private app: App,
      backend: XHRBackend,
      options: RequestOptions,
      private authService: AuthService,
      
  )
  {
      super(backend, options);
      this._authService = authService;
      this._router = this.app.getRootNav();
  }

  
  // overriding all the HTTP methods, adding the fuctionality to:
  /* 1. Add the current token to the header and try
     2. If 401, refresh the token, add the new token to the header and try
     3. If refresh fails, redirect to login
  */
  
  get(url:string, options?:RequestOptions):Observable<Response>
  {    
       return super.get(url, this.getAuthorizedOptions())
       .catch(err => {
          if (err && err.status === 401){
              return this._authService.refreshToken()
                .flatMap(r =>
                    super.get(url, this.getAuthorizedOptions())
                )
                .catch(err2 => {
                    this.redirect();
                    return Observable.throw(err2);
                });
          }
          else {
              return Observable.throw(err);
          }
      });      
  }

  post(url:string, body:any, options?:RequestOptions):Observable<Response>
  {
      return super.post(url, body, this.getAuthorizedOptions())
        .catch(err => {
            if (err && err.status === 401) {
                return this._authService.refreshToken()
                    .flatMap(r => 
                        super.post(url, body, this.getAuthorizedOptions())
                    ).catch(err2 => {
                        this.redirect();
                        return Observable.throw(err2);
                    });
            }   
            else {
                return Observable.throw(err);
            }
        });
  }

  put(url: string, body: any, options?:RequestOptions)
  {
      return super.put(url, body, this.getAuthorizedOptions())
        .catch(err => {
            if (err && err.status === 401) {
                return this._authService.refreshToken()
                    .flatMap(r => 
                        super.put(url, body, this.getAuthorizedOptions())
                    ).catch(err2 => {
                        this.redirect();
                        return Observable.throw(err2);
                    });
            }   
            else {
                return Observable.throw(err);
            }
        });
        
  }

  delete(url: string, options?:RequestOptionsArgs) 
  {
       return super.delete(url, this.getAuthorizedOptions())
       .catch(err => {
          if (err && err.status === 401){
              return this._authService.refreshToken()
                .flatMap(r =>
                    super.delete(url, this.getAuthorizedOptions())
                )
                .catch(err2 => {
                    this.redirect();
                    return Observable.throw(err2);
                });
          }
          else {
              return Observable.throw(err);
          }
      });      
  }

  private getAuthorizedOptions():RequestOptions
  {
      let token = this._authService.getAccessToken();
      let header = new Headers({
        'Authorization': 'Bearer '+ token
      });
      let ro = new RequestOptions({
        headers: header
      });
      let options = new RequestOptions();
      if (options.headers) options.headers.delete("Authorization");
      options.headers = header;
      return options;
  }

  private redirect() {
      this._router.setRoot(LoginPage);
      this._router.popToRoot();
  }




}
