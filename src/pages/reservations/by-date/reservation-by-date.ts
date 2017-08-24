import { Component } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { ReservationStatusesService } from '../../../services/reservation-statuses.service';
import * as moment from 'moment';

@Component({
    templateUrl: 'reservation-by-date.html',
    styles:[
      `
        .shown{ background-color: #daf9c5;}
        .not-shown {background-color: #f4c6c1; }
        .cancelled{ background-color: #ffe6c1;}
        .unspecified {background-color: #efeeed; }
      `
  ],
    providers: [
        ReservationService,
        ReservationStatusesService
    ]
})
export class ReservationByDatePage {

    reservations = [];
    statuses = [];
    dateFrom = "";
    dateTo = "";
    waiting = false;

    constructor(
        public Nav: NavController,
        private _toast: ToastController,
        private _reservation: ReservationService,
        private _action: ActionSheetController,
        private _statuses: ReservationStatusesService
    )
    {

    }

    ionViewDidLoad()
    {   
        this.getStatuses();
        this.dateFrom = moment().format('YYYY-MM-DD');
        this.dateTo = moment().format('YYYY-MM-DD');
        this.refresh();
    }

    getStatuses()
    {
        this._statuses.getStatuses()
            .subscribe(
                d => 
                {
                    this.statuses = d;
                },
                d =>
                {
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

    refresh()
    {
        this.waiting = true;
        this._reservation.getReservationsByRestaurant(this.dateFrom, this.dateTo)
        .subscribe(
            d => {
                this.reservations = d;
                this.waiting = false;
            },
            d => {
                this.waiting = false;
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

    markAs(id)
    {
        let actionSheet = this._action.create({
            title: 'Update Status',
            buttons: [
                {
                    text: 'Shown Up',
                    handler: () => {
                        this.waiting = true;
                        let res = this.reservations.filter(x => x.id === id)[0];
                        res.reservationStatusId = this.getStatusId('Shown Up');
                        this._reservation.put(id, res)
                            .subscribe(
                                d => 
                                {
                                    this.waiting = false;
                                    this._toast.create({
                                        position: 'bottom',
                                        duration: 2500,
                                        message: 'Status Updated.',
                                        cssClass: 'toast-success',
                                        dismissOnPageChange: false,
                                    }).present();
                                    this.refresh();
                                },
                                d => 
                                {
                                    this.waiting = false;
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
                },
                {
                    text: 'Not Shown',
                    handler: () => {
                        this.waiting = true;
                        let res = this.reservations.filter(x => x.id === id)[0];
                        res.reservationStatusId = this.getStatusId('Not Shown');
                        this._reservation.put(id, res)
                            .subscribe(
                                d => 
                                {
                                    this.waiting = false;
                                    this._toast.create({
                                        position: 'bottom',
                                        duration: 2500,
                                        message: 'Status Updated.',
                                        cssClass: 'toast-success',
                                        dismissOnPageChange: false,
                                    }).present();
                                    this.refresh();
                                },
                                d => 
                                {
                                    this.waiting = false;
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
                },
                {
                    text: 'Cancelled',
                    handler: () => {
                        this.waiting = true;
                        let res = this.reservations.filter(x => x.id === id)[0];
                        res.reservationStatusId = this.getStatusId('Cancelled');
                        this._reservation.put(id, res)
                            .subscribe(
                                d => 
                                {
                                    this.waiting = false;
                                    this._toast.create({
                                        position: 'bottom',
                                        duration: 2500,
                                        message: 'Status Updated.',
                                        cssClass: 'toast-success',
                                        dismissOnPageChange: false,
                                    }).present();
                                    this.refresh();
                                },
                                d => 
                                {
                                    this.waiting = false;
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
                },
                {
                    text: 'Unspecified',
                    handler: () => {
                        this.waiting = true;
                        let res = this.reservations.filter(x => x.id === id)[0];
                        res.reservationStatusId = this.getStatusId('Unspecified');
                        this._reservation.put(id, res)
                            .subscribe(
                                d => 
                                {
                                    this.waiting = false;
                                    this._toast.create({
                                        position: 'bottom',
                                        duration: 2500,
                                        message: 'Status Updated.',
                                        cssClass: 'toast-success',
                                        dismissOnPageChange: false,
                                    }).present();
                                    this.refresh();
                                },
                                d => 
                                {
                                    this.waiting = false;
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
            ]
            });
        actionSheet.present();
    }

    private getStatusId(status: string): number {
        return this.statuses.filter(s => s.status === status)[0].id;
    } 
}