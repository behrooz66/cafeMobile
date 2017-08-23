import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewOrderValidators } from './new-order-validators';
import { CustomerViewPage } from '../../customers/view/customer-view';
import { Order } from '../iorder';
import { OrderTypesComponent } from '../../../shared/order-types/order-types.component';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
    templateUrl: 'order-add.html',
    providers: [
        OrderService
    ]
})

export class OrderAddPage 
{
    customerId;
    order = new Order();
    onSubmitErrors = [];
    newOrderForm: FormGroup;
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
        this.customerId = this._params.get("customerId");
        this.newOrderForm = fb.group({
          date: ['', Validators.compose([Validators.required, NewOrderValidators.dateInvalid])],
          orderTypeId: ['', Validators.required],
          price: ['', Validators.compose([Validators.required, NewOrderValidators.priceInvalid])],
          notes: ['']
      });
    }

    ionViewDidLoad()
    {
        this.order.price = 0;
        this.order.date = moment().format('YYYY-MM-DD').toString();
        this.order.customerId = this.customerId;
        this.order.deleted = false;
    }

    typeChange($event){
        this.newOrderForm.controls["orderTypeId"].setValue(+$event);
        this.order.orderTypeId = +$event;
    }

    dateChange($event){
        this.order.date = $event;
        this.newOrderForm.controls["date"].setValue($event);
    }

       
    submit(){
        if (this.onSubmitValidation()){
            this._alert.create({
                title: 'Validation Error',
                message: this.onSubmitErrors[0],
                buttons: ['OK'],
            }).present();
        }
        else {
            this.waiting = true;
            this.order.date = this.newOrderForm.controls["date"].value;
            this._orderService.post(this.order)
                .subscribe(d => {
                    this._toast.create({
                        position: 'bottom',
                        duration: 2500,
                        message: 'Order Added.',
                        cssClass: 'toast-success',
                        dismissOnPageChange: false,
                    }).present();
                    this.Nav.push(CustomerViewPage, {id: this.customerId});
                }, 
                d => {
                    this._toast.create({
                        position: 'bottom',
                        duration: 2500,
                        message: 'Operation Failed.',
                        cssClass: 'toast-fail',
                        dismissOnPageChange: false,
                    }).present();
                    this.waiting = false;
                },
                () => {
                    this.waiting = false;
                });
        }
    }

    private onSubmitValidation():boolean {
        this.onSubmitErrors = [];
        if (this.newOrderForm.controls["date"].invalid)
            this.onSubmitErrors.push("The date is not valid.");

        if (this.newOrderForm.controls["price"].invalid) 
            this.onSubmitErrors.push("The price is not valid.");
        
        if (!this.order.orderTypeId)
            this.onSubmitErrors.push("Order type is not selected.");
        
        if (this.onSubmitErrors.length > 0)
            return true;
        return false;
    }
}