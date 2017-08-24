import { Component } from '@angular/core';
import { GiftCardService } from '../../../services/giftcard.service';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { CustomerViewPage} from '../../customers/view/customer-view';
import { GiftCardEditPage } from '../edit/giftcard-edit';


@Component({
    templateUrl: 'giftcard-view.html',
    providers: [
        GiftCardService
    ]
})

export class GiftCardViewPage
{
    id; giftcard; 
    waiting = false;

    constructor(
        public Nav: NavController,
        private _giftcard: GiftCardService,
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
        this._giftcard.getGiftCard(this.id)
            .subscribe(
                d =>
                {
                    this.waiting = false;
                    this.giftcard = d;
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
                        this.waiting = true;
                        this._giftcard.archive(this.id)
                            .subscribe(
                                d => 
                                {
                                    this.waiting = false;
                                    this._toast.create({
                                        position: 'bottom',
                                        message: 'Gift card deleted.',
                                        dismissOnPageChange: false,
                                        duration: 2500,
                                        cssClass: 'toast-success'
                                    }).present();
                                    this.Nav.push(CustomerViewPage, {id: this.giftcard.customerId});
                                },
                                d =>
                                {
                                    this.waiting = false;
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
        this.Nav.push(GiftCardEditPage, {id: this.giftcard.id });
    }


}