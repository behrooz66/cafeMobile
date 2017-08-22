import { Component } from '@angular/core';
import { CustomersListPage } from '../customers/list/customers-list';
import { LoginPage } from '../login/login';
import { MessagesPage } from '../messages/messages';
import { ReservationsPage } from '../reservations/reservations';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CustomersListPage;
  tab2Root = ReservationsPage;

  constructor() {

  }
}
