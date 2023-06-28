import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { GroundOutageComponent } from './ground-outage/ground-outage.component';
import { HomeComponent } from './home/home.component';
import { MissionsHomeComponent } from './missions/home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReportsComponent } from './reports/reports.component';
import { ReviewComponent } from './reports/review/review.component';
import { AuthGuard } from './services/auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: HomeComponent },
  { path: 'missions', component: MissionsHomeComponent },
  { path: 'outages', component: GroundOutageComponent },
  { path: 'admin', component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: 'ADMIN',
    },
  },
  { path: 'reports', component: ReportsComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
