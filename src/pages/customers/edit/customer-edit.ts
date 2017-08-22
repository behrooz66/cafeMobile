import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CustomerService } from '../../../services/customer.service';
import { TabsPage } from '../../tabs/tabs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICustomer, Customer } from '../icustomer';
import { Observable } from 'rxjs/Rx';
import { EditCustomerValidators } from './edit-customer-validators';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { GeocoderService } from '../../../services/geocoder.service';
import { CustomersListPage } from '../list/customers-list';
import { CustomerViewPage } from '../view/customer-view';


@Component({
  selector: 'customer-add',
  templateUrl: 'customer-edit.html',
  styles:[
    `.fail { background-color: red; }
     .success { background-color: greed; }
    `
  ],
  providers: [
      CustomerService,
      GeocoderService
  ]
})
export class CustomerEditPage {

  id;
  
  editCustomerForm: FormGroup;
  city:string;
  province:string;
  customer: Customer = new Customer();

  initialAddress = {
      address: "",
      postalCode: "",
      noAddress: false
  };

  mode: string = "";
  onSubmitErrors: string[];

  constructor
  (
    fb: FormBuilder,
    public navCtrl: NavController,
    private _customerService: CustomerService,
    private _alert: AlertController,
    private _toast: ToastController,
    private _geocoder: GeocoderService,
    private _params: NavParams
  ) 
  {
      this.id = _params.get('id');
       this.editCustomerForm = fb.group({
          name: [this.customer.name, Validators.required],
          cell: [this.customer.cell],
          home: [this.customer.home],
          work: [this.customer.work],
          otherPhone: [this.customer.otherPhone],
          email: [this.customer.email, Validators.compose([EditCustomerValidators.emailInvalid])],
          noAddress:[this.customer.noAddress],
          address: [this.customer.address],
          postalCode: [this.customer.postalCode],
          notes: [this.customer.notes]
      });

  }

  ionViewDidLoad()
  {
      this.mode = "loading";
      this.province = localStorage.getItem("bdProvince");
      this.city = localStorage.getItem("bdCity");
      this._customerService.getCustomer(this.id)
            .subscribe(d => {
                this.mode = "success";
                this.customer = d;
                this.initialAddress.address = this.customer.address;
                this.initialAddress.postalCode = this.customer.postalCode;
                this.initialAddress.noAddress = this.customer.noAddress;
            },
            d => {
                console.log("error: ", d);
                // todo toast
            });
  }

  toggleNoAddress() {
      this.customer.noAddress = !this.customer.noAddress;
  }

  cancel()
  {
      this.navCtrl.push(CustomerViewPage, {id: this.customer.id });
  }

  // private
  private hasAddressChanged():boolean 
  {
      if (this.customer.address === this.initialAddress.address 
            && this.customer.postalCode === this.initialAddress.postalCode 
            && this.customer.noAddress === this.initialAddress.noAddress)
      return false;
      return true;
  }

  private geoCode(address:string):Observable<any> 
  {
      return this._geocoder.geoCode(encodeURI(address));
  }

  private save() {
      this.mode = "loading";
      this._customerService.updateCustomer(this.customer.id, this.customer)
        .subscribe(
            d => {
                this._toast.create({
                    position: 'bottom',
                    message: 'Customer Updated.',
                    dismissOnPageChange: false,
                    duration: 2500,
                    cssClass: 'toast-success'
                 }).present();
                 this.navCtrl.push(CustomerViewPage, {id: this.customer.id})
            },
            d => {
                this._toast.create({
                    position: 'bottom',
                    message: 'Operation failed.',
                    dismissOnPageChange: false,
                    showCloseButton: true,
                    duration: 2500,
                    cssClass: 'toast-fail'
                 }).present();
            },
            () => {
                this.mode = "";
            }
        );
  }

  private submit() 
  {
      if (this.onSubmitValidation()) {
          this._alert.create({
                title: 'Validation Errors',
                message: this.onSubmitErrors[0],
                buttons: ['OK']
          }).present();
          return;
      }
      this.mode = "loading";
      
      if (this.customer.noAddress) {
          this.save();
      }
      else {
          if (this.hasAddressChanged()) {
              let address = this.customer.address + " ,"
                          + this.city + ", "
                          + this.province + " "
                          + this.customer.postalCode;
              this.geoCode(address)
                .subscribe(d => {
                     if (d.confidence >= 0.8) {
                        this.customer.addressFound = true;
                        this.customer.lat = d.lat;
                        this.customer.lon = d.lon;
                        this.save();
                    }
                    else {
                        this.mode = "";
                        this._alert.create({title: 'Address Not addressFound',
                            message: 'We were unable to locate this address on the map. Do you want to save it anyway?',
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: () => { }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => { 
                                        this.customer.addressFound = false;
                                        this.customer.lat = null;
                                        this.customer.lon = null;
                                        this.save();
                                    }
                                }
                            ]
                        });
                    }
                }, 
                d => {
                    this.mode = "";
                })
          }
          else {
              this.save();
          }
      }
  }

  private onSubmitValidation():boolean
  {
      this.onSubmitErrors = [];

      if (!this.customer.cell && !this.customer.home 
          && !this.customer.work && !this.customer.otherPhone)
            this.onSubmitErrors.push("At least one phone number has to be provided.");
      
      if (!this.customer.address && !this.customer.noAddress)
            this.onSubmitErrors.push("You have to either provide an address or mark the \"No Address\" checkbox. ");

      if (this.onSubmitErrors.length > 0) return true;
      return false;
  }

}
