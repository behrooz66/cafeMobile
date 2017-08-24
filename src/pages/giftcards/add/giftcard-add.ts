import { Component, OnInit, ViewChild } from '@angular/core';
import { GiftCardService } from '../../../services/giftcard.service';
import { GiftCard } from '../igiftcard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewGiftCardValidators } from './new-giftcard-validators';
import { CustomerViewPage } from '../../customers/view/customer-view';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  templateUrl: './giftcard-add.html',
  providers: [
      GiftCardService, 
  ]
})
export class GiftCardAddPage 
{
    customerId;
    giftcard = new GiftCard();
    onSubmitErrors = [];
    newGiftCardForm: FormGroup;
    waiting = false;

    constructor(
        public _nav: NavController,
        private _giftcard: GiftCardService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController,
        private _fb: FormBuilder,
    )
    {
        this.customerId = this._params.get('customerId');
        this.newGiftCardForm = this._fb.group({
            number: [''],
            amount: ['', Validators.compose([Validators.required, NewGiftCardValidators.amountInvalid])],
            issueDate: ['', Validators.compose([Validators.required, NewGiftCardValidators.dateInvalid])],
            expiryDate: ['', Validators.compose([Validators.required, NewGiftCardValidators.dateInvalid])],
            notes: [''],
            giftcardTypeId: ['', Validators.required]
        });
    }

    ionViewDidLoad()
    {
        this.giftcard.customerId = this.customerId;
        this.giftcard.amount = 0;
        this.giftcard.issueDate = moment().format("YYYY-MM-DD");
        this.giftcard.expiryDate = moment().add(1, 'years').format("YYYY-MM-DD");
    }

    private onSubmitValidation() {
        this.onSubmitErrors = [];
        if (this.newGiftCardForm.controls["issueDate"].invalid)
            this.onSubmitErrors.push("The issue date is not valid.");

        if (this.newGiftCardForm.controls["expiryDate"].invalid)
            this.onSubmitErrors.push("The expiry date is not valid.");

        if (this.newGiftCardForm.controls["amount"].invalid) 
            this.onSubmitErrors.push("The amount field is not valid.");
        
        if (this.onSubmitErrors.length > 0)
            return true;
        return false;
    }

    submit()
    {
        if (this.onSubmitValidation())
        {
            this._alert.create({
                title: 'Validation Error',
                message: this.onSubmitErrors[0],
                buttons: ['OK'],
            }).present();
            return;
        }
        else 
        {
            this.waiting = true;
            this._giftcard.post(this.giftcard)
                .subscribe(
                    d =>
                    {
                        this.waiting = false;
                        this._toast.create({
                            position: 'bottom',
                            duration: 2500,
                            message: 'Gift Card Added.',
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
}