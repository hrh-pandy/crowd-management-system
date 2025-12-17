
// // import { NgModule } from '@angular/core';
// // import { BrowserModule } from '@angular/platform-browser';
// // import { ReactiveFormsModule } from '@angular/forms';
// // import { HttpClientModule } from '@angular/common/http';

// // import { AppComponent } from './app.component';
// // import { LoginComponent } from './pages/login/login.component';
// // import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // import { AppRoutingModule } from './app-routing.module';

// // @NgModule({
// //   declarations: [AppComponent, LoginComponent, DashboardComponent],
// //   imports: [
// //     BrowserModule,
// //     ReactiveFormsModule,
// //     HttpClientModule,
// //     AppRoutingModule
// //   ],
// //   bootstrap: [AppComponent]
// // })
// // export class AppModule {}

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { ReactiveFormsModule } from '@angular/forms';
// import {
//   HttpClientModule,
//   HTTP_INTERCEPTORS
// } from '@angular/common/http';

// import { AppComponent } from './app.component';
// import { LoginComponent } from './pages/login/login.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { AppRoutingModule } from './app-routing.module';
// import { AuthInterceptor } from './core/services/interceptor/auth.interceptor';

// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     DashboardComponent
//   ],
//   imports: [
//     BrowserModule,
//     ReactiveFormsModule,
//     HttpClientModule,
//     AppRoutingModule
//   ],
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: AuthInterceptor,
//       multi: true
//     }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}


// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

// import { AppComponent } from './app.component';
// import { LoginComponent } from './pages/login/login.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // import { AnalyticsSetupComponent } from './pages/analytics-setup.component';
// import { AppRoutingModule } from './app-routing.module';

// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     DashboardComponent,
//     // AnalyticsSetupComponent
//   ],
//   imports: [
//     BrowserModule,
//     ReactiveFormsModule,
//     FormsModule,          // ✅ ADD THIS
//     HttpClientModule,
//     AppRoutingModule
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CrowdEntriesComponent } from './pages/crowd-entries/crowd-entries.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/services/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CrowdEntriesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
