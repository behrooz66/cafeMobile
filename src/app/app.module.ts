import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { CustomersListPage } from '../pages/customers/list/customers-list';
import { CustomerAddPage } from '../pages/customers/add/customer-add';
import { CustomerViewPage } from '../pages/customers/view/customer-view';
import { CustomerEditPage } from '../pages/customers/edit/customer-edit';
import { OrdersListPage } from '../pages/orders/list/orders-list';
import { OrderAddPage } from '../pages/orders/add/order-add';
import { OrderEditPage } from '../pages/orders/edit/order-edit';
import { OrderViewPage } from '../pages/orders/view/order-view';
import { OrderTypesComponent } from '../shared/order-types/order-types.component';
import { LoginPage } from '../pages/login/login';
import { ReservationsPage } from '../pages/reservations/reservations';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';
import { HttpAuthService } from '../services/http-auth.service';

@NgModule({
  declarations: [
    MyApp,
    CustomersListPage,
    CustomerAddPage,
    CustomerViewPage,
    CustomerEditPage,
    OrdersListPage,
    OrderAddPage,
    OrderEditPage,
    OrderViewPage,
    OrderTypesComponent,
    LoginPage,
    ReservationsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CustomersListPage,
    CustomerAddPage,
    CustomerViewPage,
    CustomerEditPage,
    OrdersListPage,
    OrderAddPage,
    OrderEditPage,
    OrderViewPage,
    LoginPage,
    ReservationsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpAuthService,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
