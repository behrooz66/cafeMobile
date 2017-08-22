import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'order-view.html',
    providers: [
        OrderService
    ]
})

export class OrderViewPage 
{
    constructor(
        private _order: OrderService
    )
    { }
}