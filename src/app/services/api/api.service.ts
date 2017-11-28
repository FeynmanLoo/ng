import { Injectable } from '@angular/core';
import { HttpClient,
  HttpParams,
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class APIService {
    // baseUrl = 'https://localhost:44340';
    baseUrl = 'http://api.jinfans.com';
    getToken(username: string, password: string): Observable<any> {
      const params = new HttpParams()
      .append('username', username)
      .append('password', password);
      return this.http.get(`${this.baseUrl}/api/Token`, {params: params});
    }
    refreshToken(): Observable<any> {
      return this.http.put(`${this.baseUrl}/api/Token`, null);
    }
    getSurvey(id: string) {
      const params = new HttpParams().append('id', `${id}`);
      return this.http.get(`${this.baseUrl}/api/survey/getsingle`, {
        params: params
      });
    }
    getSurveys(pageIndex = 1, pageSize = 10, sortField, sortOrder, genders) {
      const params = new HttpParams()
        .append('pageIndex', `${pageIndex}`)
        .append('pageSize', `${pageSize}`)
        .append('sortField', sortField)
        .append('sortOrder', sortOrder);
      // genders.forEach(gender => {
      //   params = params.append('gender', gender);
      // });
      return this.http.get(`${this.baseUrl}/api/survey`, {
        params: params
      });
    }
    createOrUpdateSurvey(model: any) {
      return this.http.post(`${this.baseUrl}/api/survey/createOrUpdate`, model);
    }
    getUser(id: string) {
      const params = new HttpParams().append('id', `${id}`);
      return this.http.get(`${this.baseUrl}/api/user/getsingle`, {
        params: params
      });
    }
    getUsers(pageIndex = 1, pageSize = 10, sortField, sortOrder, searchValue, genders) {
      const params = new HttpParams()
        .append('pageIndex', `${pageIndex}`)
        .append('pageSize', `${pageSize}`)
        .append('sortField', sortField)
        .append('sortOrder', sortOrder)
        .append('searchValue', searchValue);
      // genders.forEach(gender => {
      //   params = params.append('gender', gender);
      // });
      return this.http.get(`${this.baseUrl}/api/user`, {
        params: params
      });
    }
    updateUser(userId: string, userStatus: number, accountStatus: number, remark: string) {
      return this.http.post(`${this.baseUrl}/api/user/Update`, {
        userId: userId,
        userStatus: userStatus,
        accountStatus: accountStatus,
        remark: remark
      });
    }
    getAccount(userId: string) {
      const params = new HttpParams().append('userId', `${userId}`);
      return this.http.get(`${this.baseUrl}/api/account/getsingle`, {
        params: params
      });
    }
    updateAccount(userId: string, money: number, remark: string) {
      return this.http.post(`${this.baseUrl}/api/account/Update`, {
        userId: userId,
        money: money,
        remark: remark
      });
    }
    getLedgers(userId: string, pageIndex = 1, pageSize = 10, sortField, sortOrder, searchValue) {
      const params = new HttpParams()
      .append('userId', `${userId}`)
      .append('pageIndex', `${pageIndex}`)
      .append('pageSize', `${pageSize}`)
      .append('sortField', sortField)
      .append('sortOrder', sortOrder)
      .append('searchValue', searchValue);
      return this.http.get(`${this.baseUrl}/api/Ledger`, {
        params: params
      });
    }
    exportLedger(beginTime: Date, endTime: Date) {
      let params = new HttpParams();
      if (beginTime != null && endTime != null) {
        params = params.append('beginTime', `${beginTime.toLocaleString()}`)
        .append('endTime', `${endTime.toLocaleString()}`);
      }
      return this.http.get(`${this.baseUrl}/api/Ledger/ExportExcel`, {
        params: params,
        responseType: 'blob',
        observe: 'response'
      });
    }
    getSystemConfigs(pageIndex = 1, pageSize = 10) {
      const params = new HttpParams()
      .append('pageIndex', `${pageIndex}`)
      .append('pageSize', `${pageSize}`);
      return this.http.get(`${this.baseUrl}/api/SystemConfig`, {
        params: params
      });
    }
    updateSystemConfig(config: object) {
      return this.http.post(`${this.baseUrl}/api/SystemConfig/update`, config);
    }
    constructor(private http: HttpClient) {
    }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const token = this.getToken();
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Bearer', token)});
    // Pass on the cloned request instead of the original request.
    const started = Date.now();
    return next.handle(authReq)
    .do(event => {
      if (event instanceof HttpResponse) {
        const elapsed = Date.now() - started;
        console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        // window.localStorage.setItem(req.urlWithParams, JSON.stringify(event));
        console.log(event);
        const body = event.body as any;
        if (body.errMsg && body.errMsg.indexOf('授权') !== -1) {
          this.router.navigateByUrl('/admin/login');
        }
      }
    });
  }

  getToken() {
    const tokenInfo = JSON.parse(localStorage.getItem('token'));
    if (tokenInfo && tokenInfo.token) {
      return tokenInfo.token;
    } else {
      return '';
    }
  }
}
