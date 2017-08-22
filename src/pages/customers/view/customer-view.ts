import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CustomerService } from '../../../services/customer.service';
import { TabsPage } from '../../tabs/tabs';
import { CustomersListPage } from '../list/customers-list';
import { CustomerEditPage } from '../edit/customer-edit';
import { OrdersListPage } from '../../orders/list/orders-list';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-customer-view',
  templateUrl: 'customer-view.html',
  //styleUrls: ['customer-view.css'],
  providers: [
      CustomerService
  ]
})
export class CustomerViewPage {

    id;
    customer;
    mode: string = "";
    toast;

  constructor(
    public navCtrl: NavController,
    private _customer: CustomerService,
    private _params: NavParams,
    private _alert: AlertController,
    private _toast: ToastController
  ) 
  {
      this.id = _params.get('id');
  }

  ionViewDidLoad()
  {
      this.mode = "wait";
      this._customer.getCustomer(this.id)
            .subscribe(
                d => 
                {
                    this.mode = "success";
                    this.customer = d;
                },
                d =>
                {
                    this.mode = "error"
                }
            );
  }

  list()
  {
      this.navCtrl.push(CustomersListPage);
  }

  delete()
  {
      this._alert.create({
          title: 'Confirmation',
          message: 'Are you sure?',
          buttons: [
              {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {

                  }
              },
              {
                  text: 'Yes',
                  handler: () => {
                      this._customer.archiveCustomer(this.customer.id)
                          .subscribe(
                              d => {
                                  this.navCtrl.push(CustomersListPage);
                                  this.toast = this._toast.create({
                                      message: 'Customer deleted.',
                                      duration: 2500,
                                      position: 'bottom',
                                      //cssClass: 'toast-danger'
                                  });
                              },
                              d => {
                                  this.toast = this._toast.create({
                                      message: 'Operation failed.',
                                      duration: 2500,
                                      position: 'bottom',
                                      //cssClass: 'toast-danger'
                                  });
                              }
                          );
                  }
              }
          ]
      }).present();
  }

  edit()
  {
      this.navCtrl.push(CustomerEditPage, {id: this.customer.id });
  }

  orders()
  {
      this.navCtrl.push(OrdersListPage, {customerId: this.customer.id});
  }
}
