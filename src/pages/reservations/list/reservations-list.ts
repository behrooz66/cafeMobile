import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../ireservation';
//import { }
import { ReservationAddPage } from '../add/reservation-add';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: './reservations-list.html',
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
  ]
})
export class ReservationsListPage {

  customerId: number;
  reservations = [];
  
  constructor(
        public _nav: NavController,
        private _reservation: ReservationService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController
  )
  {
      this.customerId = this._params.get("customerId");
  }

  ionViewDidLoad()
  {
      this.getReservations();
  }

  getReservations()
  {
      this._reservation.getReservationsByCustomer(this.customerId)
          .subscribe(
              d =>
              {
                  this.reservations = d;
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
      this._nav.push(ReservationAddPage, {customerId: this.customerId});
  }

  view()
  {

  }


}
