import { Component } from '@angular/core';
import { CustomersListPage } from '../customers/list/customers-list';
import { LoginPage } from '../login/login';
import { MessagesPage } from '../messages/messages';
import { ReservationByDatePage} from '../reservations/by-date/reservation-by-date';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CustomersListPage;
  tab2Root = ReservationByDatePage;

  constructor() {

  }
}
