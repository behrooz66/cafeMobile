import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerViewPage } from '../../customers/view/customer-view';
import { Order } from '../iorder';
import { OrderTypesComponent } from '../../../shared/order-types/order-types.component';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { EditOrderValidators } from './edit-order-validators';
import 'rxjs/add/operator/finally';

@Component({
    templateUrl: 'order-edit.html',
    providers: [
        OrderService
    ]
})

export class OrderEditPage 
{
    id;
    order = new Order();
    onSubmitErrors = [];
    editOrderForm: FormGroup;
    waiting: boolean = false;


    constructor(
        public Nav: NavController,
        private _orderService: OrderService,
        private _params: NavParams,
        fb: FormBuilder,
        private _toast: ToastController,
        private _alert: AlertController
    )
    {
        this.id = this._params.get("id");
        this.editOrderForm = fb.group({
            date: [this.order.date, Validators.compose([Validators.required, EditOrderValidators.dateInvalid])],
            orderTypeId: [this.order.orderTypeId, Validators.required],
            price: [this.order.price, Validators.required],
            notes: [this.order.notes]
        });
    }

    ionViewDidLoad()
    {      
        this.waiting = true;
        this._orderService.getOrder(this.id)
            .subscribe(
                d =>
                {
                    this.waiting = false
                    this.order.id = d.id;
                    this.order.customerId = d.customerId;
                    this.order.date = d.date.substr(0,10);
                    this.order.notes = d.notes;
                    this.order.orderTypeId = d.orderTypeId;
                    this.order.price = d.price;
                    this.order.updatedAt = d.updatedAt;
                    this.order.updatedBy = d.updatedBy;
                    
                },
                d =>
                {
                    this.waiting = false
                    this._toast.create({
                         position: 'bottom',
                        duration: 2500,
                        message: 'Operation Failed.',
                        cssClass: 'toast-fail',
                        dismissOnPageChange: false,
                    }).present();
                }
            );
    }

    submit()
    {
        this.waiting = true;
        this._orderService.put(this.order.id, this.order)
            .subscribe(
                d =>
                {
                    this.waiting = false
                    this._toast.create({
                        position: 'bottom',
                        duration: 2500,
                        message: 'Order Updated.',
                        cssClass: 'toast-success',
                        dismissOnPageChange: false,
                    }).present();
                    this.Nav.push(CustomerViewPage, {id: this.order.customerId});
                },
                d =>
                {
                    this.waiting = false
                    this._toast.create({
                        position: 'bottom',
                        duration: 2500,
                        message: 'Operation Failed.',
                        cssClass: 'toast-fail',
                        dismissOnPageChange: false,
                    }).present();
                }
            );
    }
}