import { Component, OnInit, ViewChild } from '@angular/core';
import { GiftCardService } from '../../../services/giftcard.service';
import { GiftCard } from '../igiftcard';
import { GiftCardViewPage } from '../view/giftcard-view';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditGiftCardValidators } from './edit-giftcard-validators';
import { CustomerViewPage } from '../../customers/view/customer-view';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  templateUrl: './giftcard-edit.html',
  providers: [
      GiftCardService, 
  ]
})
export class GiftCardEditPage {
    
    id;
    giftcard = new GiftCard();
    editGiftCardForm: FormGroup;

    onSubmitErrors: string[] = [];
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
        this.id = this._params.get('id');
        this.editGiftCardForm = this._fb.group({
            number: [this.giftcard.number, Validators.required],
            amount: [this.giftcard.amount, Validators.compose([Validators.required, EditGiftCardValidators.amountInvalid])],
            issueDate: [this.giftcard.issueDate, Validators.compose([Validators.required, EditGiftCardValidators.dateInvalid])],
            expiryDate: [this.giftcard.issueDate, Validators.compose([Validators.required, EditGiftCardValidators.dateInvalid])],
            giftcardTypeId: [this.giftcard.giftCardTypeId, Validators.required],
            notes: [this.giftcard.notes]
        });
    }

    ionViewDidLoad()
    {
        this._giftcard.getGiftCard(this.id)
            .subscribe(
                d =>
                {
                      this.giftcard.id = d.id;
                      this.giftcard.number = d.number;
                      this.giftcard.issueDate = d.issueDate.substr(0,10);
                      this.giftcard.expiryDate = d.expiryDate.substr(0,10);
                      this.giftcard.amount = d.amount;
                      this.giftcard.notes = d.notes;
                      this.giftcard.updatedAt = d.updatedAt;
                      this.giftcard.updatedBy = d.updatedBy;
                      this.giftcard.deleted = d.deleted;
                      this.giftcard.giftCardTypeId = d.giftCardTypeId;
                      this.giftcard.customerId = d.customerId;
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

    private onSubmitValidation() 
    {
        this.onSubmitErrors = [];
        if (this.editGiftCardForm.controls["issueDate"].invalid)
            this.onSubmitErrors.push("The issue date is not valid.");

        if (this.editGiftCardForm.controls["expiryDate"].invalid)
            this.onSubmitErrors.push("The expiry date is not valid.");

        if (this.editGiftCardForm.controls["amount"].invalid) 
            this.onSubmitErrors.push("The amount field is not valid.");
        
        if (this.onSubmitErrors.length > 0)
            return true;
        return false;
    }

    submit()
    {
        this.waiting = false;
        this._giftcard.put(this.giftcard.id, this.giftcard)
            .subscribe(
                d => 
                {
                    this.waiting = false;
                    this._toast.create({
                         position: 'bottom',
                        duration: 2500,
                        message: 'Gift Card Updated.',
                        cssClass: 'toast-success',
                        dismissOnPageChange: false,
                    }).present();
                    this._nav.push(GiftCardViewPage, {id: this.giftcard.id });
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