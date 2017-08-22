import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { OrderAddPage } from '../add/order-add';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


@Component({
    templateUrl: 'orders-list.html',
    providers: [
        OrderService
    ]
})

export class OrdersListPage 
{
    customerId;
    orders = [];

    constructor(
        public _nav: NavController,
        private _order: OrderService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController
    )
    {
        this.customerId = this._params.get('customerId');
    }

    ionViewDidLoad()
    {
        this.getOrders();
    }

    getOrders()
    {
        this._order.getOrdersByCustomer(this.customerId)
            .subscribe(
                d => 
                {
                    this.orders = d;
                    console.log(d);
                },
                d =>
                {
                    this._toast.create({
                        position: 'bottom',
                        message: 'Operation Failed',
                        dismissOnPageChange: false,
                        duration: 2500,
                        cssClass: 'toast-fail'
                    }).present();
                }
            );
    }

    add()
    {
        this._nav.push(OrderAddPage, {customerId: this.customerId});
    }


}