import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { MissionsModule } from './missions/missions.module';
import { ReportsModule } from './reports/reports.module';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthHttpInterceptor } from './services/auth-http-interceptor';
import { MissionService } from './services/mission.service';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GroundOutageComponent } from './ground-outage/ground-outage.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminComponent } from './admin/admin.component';
import { PasswordStrengthValidator } from './password-strength-validator.directive';
import { MustMatchValidator } from './must-match-validator.directive';
import { PasswordExpireDialogComponent } from './password-expire-dialog/password-expire-dialog.component';
import { OutageService } from './services/outage.service';
import { DeleteOutageDialogComponent } from './ground-outage/delete-outage-dialog/delete-outage-dialog.component';
import { AdminService } from './services/admin.service';
import { DeleteUserDialogComponent } from './admin/delete-user-dialog/delete-user-dialog.component';
import { PurgeDialogComponent } from './admin/purge-dialog/purge-dialog.component';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { WaitDialogComponent } from './home/wait-dialog/wait-dialog.component';
import { DialogService } from './services/dialog-service.service';
import { GroundOutageListComponent } from './ground-outage/ground-outage-list/ground-outage-list.component';
import { GroundOutageItemComponent } from './ground-outage/ground-outage-item/ground-outage-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavigationMenuComponent,
    UserProfileComponent,
    GroundOutageComponent,
    ReportsComponent,
    AdminComponent,
    PasswordStrengthValidator,
    MustMatchValidator,
    PasswordExpireDialogComponent,
    DeleteOutageDialogComponent,
    DeleteUserDialogComponent,
    PurgeDialogComponent,
    WarningDialogComponent,
    UserListComponent,
    WaitDialogComponent,
    GroundOutageListComponent,
    GroundOutageItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    MissionsModule,
    ReportsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, MissionService, OutageService, AdminService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
