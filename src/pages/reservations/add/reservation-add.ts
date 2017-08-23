import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../ireservation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewReservationValidators } from './new-reservation-validators';
//import { ReservationViewPage } from '../view/reservation-view';
import { CustomerViewPage } from '../../customers/view/customer-view';
//import { }
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  templateUrl: './reservation-add.html',
  providers: [
      ReservationService, 
  ]
})
export class ReservationAddPage {

    customerId;
    reservation = new Reservation();
    onSubmitErrors = [];
    newReservationForm: FormGroup;
    waiting: boolean = false;

    constructor(
        public _nav: NavController,
        private _reservation: ReservationService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController,
        private _fb: FormBuilder,
    )
    {
        this.customerId = this._params.get("customerId");
        this.newReservationForm = this._fb.group({
            numberOfPeople: ['', [Validators.compose([Validators.required, NewReservationValidators.numberOfPeopleInvalid] )], ],
            date: ['', [Validators.compose([Validators.required, NewReservationValidators.dateInvalid] )]],
            time: ['', Validators.required],
            table: ['', , ],
            notes: ['', , ],
            revenue: ['',[Validators.compose([NewReservationValidators.revenueInvalid] )],],
            reservationStatusId:['', Validators.required],
        });
    }

    ionViewDidLoad()
    {
        this.reservation.customerId = this.customerId;
        this.reservation.date = moment().add(1, 'days').format('YYYY-MM-DD');
        this.reservation.time = '19:15';
        this.reservation.numberOfPeople = 2;
        this.reservation.reservationStatusId = 1;
    }

    submit()
    {
        if (this.onSubmitValidation()){
            this._alert.create({
                title: 'Validation Error',
                message: this.onSubmitErrors[0],
                buttons: ['OK'],
            }).present();
            return;
        }
        else {
            this.waiting = true;
            //this.reservation.date = this.newReservationForm.controls["date"].value;
            this._reservation.post(this.reservation)
                .subscribe(d => {
                    this.waiting = false;
                    this._toast.create({
                        position: 'bottom',
                        duration: 2500,
                        message: 'Reservation Added.',
                        cssClass: 'toast-success',
                        dismissOnPageChange: false,
                    }).present();
                    this._nav.push(CustomerViewPage, {id: this.customerId});
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
                });
        }
    }

    private onSubmitValidation() 
    {
        this.onSubmitErrors = [];
        if (this.newReservationForm.controls["date"].invalid)
            this.onSubmitErrors.push("The date is not valid.");

        if (this.newReservationForm.controls["revenue"].invalid) 
            this.onSubmitErrors.push("The revenue is not valid.");
        
        if (!this.newReservationForm.controls["numberOfPeople"])
            this.onSubmitErrors.push("Number of people is not valid.");
        
        if (this.onSubmitErrors.length > 0)
            return true;
        return false;
    } 

}
