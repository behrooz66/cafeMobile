import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { CustomerViewPage} from '../../customers/view/customer-view';
import { OrderEditPage } from '../edit/order-edit';

@Component({
    templateUrl: 'order-view.html',
    providers: [
        OrderService
    ]
})

export class OrderViewPage 
{
    id;
    order;
    waiting: boolean = false;
    constructor(
        public Nav: NavController,
        private _order: OrderService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController
    )
    {
        this.id = this._params.get('id');
    }

    ionViewDidLoad()
    {
        this.waiting = true;
        this._order.getOrder(this.id)
            .finally(() => this.waiting = false)
            .subscribe(
                d =>
                {
                    this.order = d;
                },
                d =>
                {
                    this._toast.create({
                        position: 'bottom',
                        cssClass: 'toast-fail',
                        message: 'Operation failed.',
                        duration: 2500,
                        dismissOnPageChange: false
                    }).present();
                }
            );
    }

    delete()
    {
        this._alert.create({
            title: 'Confirmation',
            message: 'Are you sure?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel'
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this._order.archive(this.id)
                            .subscribe(
                                d => 
                                {
                                    this._toast.create({
                                        position: 'bottom',
                                        message: 'Order deleted.',
                                        dismissOnPageChange: false,
                                        duration: 2500,
                                        cssClass: 'toast-success'
                                    }).present();
                                    this.Nav.push(CustomerViewPage, {id: this.order.customerId});
                                },
                                d =>
                                {
                                    this._toast.create({
                                        position: 'bottom',
                                        message: 'Operation failed.',
                                        dismissOnPageChange: false,
                                        duration: 2500,
                                        cssClass: 'toast-fail'
                                    }).present();
                                }
                            )
                    }
                }
            ]
        }).present();
    }

    edit()
    {
        this.Nav.push(OrderEditPage, {id: this.id });
    }


}