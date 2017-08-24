import { Component } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { CustomerViewPage} from '../../customers/view/customer-view';
import { EditReservationValidators } from './edit-reservation-validators';
import { Reservation } from '../ireservation';
import { ReservationViewPage } from '../view/reservation-view';


@Component({
    templateUrl: 'reservation-edit.html',
    providers:[
        ReservationService
    ]
})

export class ReservationEditPage {
    id;
    reservation = new Reservation();
    onSubmitErrors = [];
    editReservationForm: FormGroup;
    waiting = false;

    constructor(
        public Nav: NavController,
        private _reservation: ReservationService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController,
        private _fb: FormBuilder
    )
    {
        this.id = this._params.get("id");
        this.editReservationForm = this._fb.group({
            numberOfPeople: [this.reservation.numberOfPeople, [Validators.compose([Validators.required, EditReservationValidators.numberOfPeopleInvalid] )], ],
            date: [this.reservation.date, [Validators.compose([Validators.required, EditReservationValidators.dateInvalid] )]],
            time: [this.reservation.time, Validators.required],
            table: [this.reservation.table, , ],
            notes: [this.reservation.notes, , ],
            revenue: [this.reservation.revenue,[Validators.compose([EditReservationValidators.revenueInvalid] )],],
            reservationStatusId:[this.reservation.reservationStatusId, Validators.required],
        });
    }

    ionViewDidLoad()
    {
        this.waiting = true;
        this._reservation.getReservation(this.id)
            .subscribe(
                d =>
                {
                    this.waiting = false;
                    this.reservation.id = d.id;
                    this.reservation.customerId = d.customerId;
                    this.reservation.date = d.date.substr(0,10);
                    this.reservation.notes = d.notes;
                    this.reservation.numberOfPeople = d.numberOfPeople;
                    this.reservation.reservationStatusId = d.reservationStatusId;
                    this.reservation.revenue = d.revenue;
                    this.reservation.table = d.table;
                    this.reservation.time = d.time;
                    this.reservation.updatedAt = d.updatedAt;
                    this.reservation.updatedBy = d.updatedBy;
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
            )
    }

    submit()
    {
        this.waiting = true;
        this._reservation.put(this.reservation.id, this.reservation)
            .subscribe(
                d => 
                {
                    this.waiting = false;
                    this._toast.create({
                         position: 'bottom',
                        duration: 2500,
                        message: 'Reservation Updated.',
                        cssClass: 'toast-success',
                        dismissOnPageChange: false,
                    }).present();
                    this.Nav.push(ReservationViewPage, {id: this.reservation.id });
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