import { Component, OnInit, ViewChild } from '@angular/core';
import { GiftCardService } from '../../../services/giftcard.service';
import { GiftCard } from '../igiftcard';
import { GiftCardAddPage } from '../add/giftcard-add';
import { GiftCardViewPage } from '../view/giftcard-view';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: './giftcard-list.html',
  providers: [
      GiftCardService, 
  ]
})

export class GiftCardListPage
{
    customerId;
    giftcards = [];

    constructor(
        public _nav: NavController,
        private _giftcard: GiftCardService,
        private _params: NavParams,
        private _toast: ToastController,
        private _alert: AlertController
    )
    {
        this.customerId = this._params.get("customerId");
    }

    ionViewDidLoad()
    {
        this.getGiftCards();
    }

    getGiftCards()
    {
        this._giftcard.getGiftCardsByCustomer(this.customerId)
            .subscribe(
              d =>
              {
                  this.giftcards = d;
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
        this._nav.push(GiftCardAddPage, {customerId: this.customerId});
    }

    view(id)
    {
        this._nav.push(GiftCardViewPage, {id: id});
    }
}