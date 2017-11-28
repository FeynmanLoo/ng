import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FileSaverModule } from 'ngx-filesaver';
import { APIService, AuthInterceptor } from './services/api/api.service';

import { AppComponent } from './components/app/app.component';
import { AdminComponent } from './components/admin/admin.component';
import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { SurveyComponent } from './components/survey/survey.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SurveyDetailComponent } from './components/survey-detail/survey-detail.component';
import { QuestionTypePipe } from './pipes/questionType/question-type.pipe';
import { SystemConfigComponent } from './components/system-config/system-config.component';
import { SystemLogComponent } from './components/system-log/system-log.component';
import { LedgerComponent } from './components/ledger/ledger.component';
import { WithdrawLogComponent } from './components/withdraw-log/withdraw-log.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NavmenuComponent,
    SurveyComponent,
    LoginComponent,
    HomeComponent,
    UserComponent,
    SettingsComponent,
    SurveyDetailComponent,
    QuestionTypePipe,
    UserDetailComponent,
    SystemConfigComponent,
    SystemLogComponent,
    LedgerComponent,
    WithdrawLogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    FileSaverModule,
    RouterModule.forRoot([
        { path: '', redirectTo: 'admin', pathMatch: 'full' },
        { path: 'admin', children:  [
          {path: 'login', component: LoginComponent},
          {path: '', component: HomeComponent}
        ]},
        { path: 'survey', children:  [
          {path: '', component: SurveyComponent},
          {path: ':id', component: SurveyDetailComponent}
        ]},
        { path: 'user', children: [
          {path: '', component: UserComponent},
          {path: ':id', component: UserDetailComponent}
        ]},
        { path: 'finance', children: [
          {path: '', component: LedgerComponent},
          {path: 'withdrawlog', component: WithdrawLogComponent}
        ]},
        { path: 'settings', children:  [
          {path: 'config', component: SystemConfigComponent},
          {path: 'log', component: SystemLogComponent}
        ]},
        { path: '**', redirectTo: 'admin' }
    ])
  ],
  providers: [ APIService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
