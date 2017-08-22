import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'order-edit.html',
    providers: [
        OrderService
    ]
})

export class OrderEditPage 
{
    constructor(
        private _order: OrderService
    )
    { }
}