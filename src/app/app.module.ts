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
import { ReservationsListPage } from '../pages/reservations/list/reservations-list';
import { ReservationAddPage } from '../pages/reservations/add/reservation-add';
import { ReservationViewPage} from '../pages/reservations/view/reservation-view';
import { OrderTypesComponent } from '../shared/order-types/order-types.component';
import { ReservationStatusesComponent } from '../shared/reservation-statuses/reservation-statuses.component';
import { GiftcardTypeComponent } from '../shared/giftcard-types/giftcard-types.component';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { WaitComponent } from '../shared/wait/wait.component';

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
    ReservationsListPage,
    ReservationAddPage,
    OrderTypesComponent,
    ReservationStatusesComponent,
    GiftcardTypeComponent,
    WaitComponent,
    LoginPage,
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
    ReservationsListPage,
    ReservationAddPage,
    LoginPage,
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
