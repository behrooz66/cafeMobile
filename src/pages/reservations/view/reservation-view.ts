import { Component } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { CustomerViewPage} from '../../customers/view/customer-view';
//import { OrderEditPage } from '../edit/order-edit';

@Component({
    templateUrl: 'reservation-view.html',
    providers: [
        ReservationService
    ]
})

export class ReservationViewPage 
{
    id;
    reservation;
    waiting: boolean = false;
    constructor(
        public Nav: NavController,
        private _reservation: ReservationService,
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
        this._reservation.getReservation(this.id)
            .subscribe(
                d =>
                {
                    this.waiting = false;
                    this.reservation = d;
                },
                d =>
                {
                    this.waiting = false;
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
                        this._reservation.archive(this.id)
                            .subscribe(
                                d => 
                                {
                                    this._toast.create({
                                        position: 'bottom',
                                        message: 'Reservation deleted.',
                                        dismissOnPageChange: false,
                                        duration: 2500,
                                        cssClass: 'toast-success'
                                    }).present();
                                    this.Nav.push(CustomerViewPage, {id: this.reservation.customerId});
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
        //this.Nav.push(ReservationEditPage, {id: this.id });
    }


}