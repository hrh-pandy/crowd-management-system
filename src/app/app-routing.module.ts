// import { NgModule } from "@angular/core";
// import { RouterModule, Routes } from "@angular/router";
// import { LoginComponent } from "./pages/login/login.component";
// import { DashboardComponent } from "./pages/dashboard/dashboard.component";
// import { CrowdEntriesComponent } from "./pages/crowd-entries/crowd-entries.component";

// const routes: Routes = [
//   { path: "", redirectTo: "login", pathMatch: "full" },
//   { path: "login", component: LoginComponent },
//   { path: "dashboard", component: DashboardComponent },
//     { path: "crowd-entries", component: CrowdEntriesComponent },

//   // {
//   //   path: "crowd-entries",
//   //   loadChildren: () =>
//   //     import("./pages/crowd-entries/crowd-entries.module").then(
//   //       (m) => m.CrowdEntriesModule
//   //     ),
//   // },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}




import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CrowdEntriesComponent } from './pages/crowd-entries/crowd-entries.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'crowd-entries', component: CrowdEntriesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


