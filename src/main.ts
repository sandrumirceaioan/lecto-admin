import { enableProdMode, importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';

import { AppComponent } from './app/app.component';
import { AppService } from './app/app.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './app/shared/interceptors/request.interceptor';
import { AuthGuard } from './app/shared/guards/auth.guard';
import { RoleGuard } from './app/shared/guards/role.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './app/shared/modules/material.module';
import { AlertModule } from '@full-fledged/alerts';
import { UserResolve } from './app/admin/users/user.resolve';
import { DiscountResolve } from './app/admin/discounts/discount.resolve';
import { LocationResolve } from './app/admin/locations/location.resolve';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: AppService, useClass: AppService },
    { provide: environment.BACKEND_URL, useValue: environment.BACKEND_URL },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    AuthGuard,
    RoleGuard,
    UserResolve,
    DiscountResolve,
    LocationResolve,
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(APP_ROUTES),
      HttpClientModule,
      FlexLayoutModule,
      MaterialModule,
      AlertModule.forRoot({ maxMessages: 1, timeout: 5000, positionX: 'right', positionY: 'bottom' }),
    ),
  ]
}).catch((err) => console.error(err));