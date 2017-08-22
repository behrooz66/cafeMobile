import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerService } from '../../../services/customer.service';
import { TabsPage } from '../../tabs/tabs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICustomer, Customer } from '../icustomer';
import { NewCustomerValidators } from './new-customer-validators';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { GeocoderService } from '../../../services/geocoder.service';
import { CustomersListPage } from '../list/customers-list';


@Component({
  selector: 'customer-add',
  templateUrl: 'customer-add.html',
  styles:[
    `
     .fail { background-color: red; }
     .success { background-color: greed; }
    `
  ],
  providers: [
      CustomerService,
      GeocoderService
  ]
})
export class CustomerAddPage {

  newCustomerForm: FormGroup;
  cityId: number;
  city: string;
  province: string;
  noAddress: boolean = false;
  customer: Customer = new Customer();
  waiting = false;

  onSubmitValidationErrors:string[] = [];

  constructor
  (
    fb: FormBuilder,
    public navCtrl: NavController,
    private _customerService: CustomerService,
    private _alert: AlertController,
    private _toast: ToastController,
    private _geocoder: GeocoderService
  ) 
  {
      this.newCustomerForm = fb.group({
          name: ['', Validators.required],
          cell: [''],
          home: [''],
          work: [''],
          otherPhone: [''],
          email: ['', Validators.compose([NewCustomerValidators.emailInvalid])],
          noAddress:[false],
          address: ['', Validators.compose([NewCustomerValidators.addressInvalid])],
          postalCode: [''],
          notes: ['']
      })

  }

  ionViewDidLoad()
  {
      this.cityId = +localStorage.getItem("bdCityId");
      this.province = localStorage.getItem("bdProvince");
      this.city = localStorage.getItem("bdCity");
      this.customer.cityId = this.cityId;
      this.customer.restaurantId = +localStorage.getItem("bdRestaurant");
      this.customer.postalCode = "";
  }

  toggleNoAddress() {
      this.noAddress = !this.noAddress;
  }

  submit() {
      console.log(this.customer);
      if (this.customer.noAddress === true){
          this.postWithoutAddress();
      }
      else {
          this.postwithAddress();
      } 
  }

  private onSubmitValidationWithAddress():boolean{
      this.onSubmitValidationErrors = [];
      
      if (!this.customer.cell && !this.customer.home 
        && !this.customer.work && !this.customer.otherPhone)
        this.onSubmitValidationErrors.push("At least one phone number has to be provided.");
      
      if (!this.customer.address || this.customer.address.length==0)
        this.onSubmitValidationErrors.push("You have to either provide an address or mark the \"No Address\" checkbox. ");
      if (this.onSubmitValidationErrors.length > 0) return true;
      return false;
  }

  private onSubmitValidationWithoutAddress(){
      this.onSubmitValidationErrors = [];
      if (!this.customer.cell && !this.customer.home 
        && !this.customer.work && !this.customer.otherPhone)
        this.onSubmitValidationErrors.push("At least one phone number has to be provided.");
        if (this.onSubmitValidationErrors.length > 0) return true;
      return false;
  }

  private postCustomer(){
       this._customerService.addCustomer(this.customer)
            .finally(() => {
               this.waiting = false;
            })
            .subscribe(d => {
                this._toast.create({
                    position: 'bottom',
                    message: 'Customer Added.',
                    dismissOnPageChange: false,
                    duration: 2500,
                    cssClass: 'toast-success'
                 }).present();
                 this.navCtrl.push(CustomersListPage)
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
            });
  }

  private postwithAddress() {
      if (this.onSubmitValidationWithAddress()) {
        this._alert.create({
          title: 'Validation Errors',
          message: this.onSubmitValidationErrors[0],
          buttons: ['OK']
        }).present();
        return;
      }
      
      //start the waitbox
      this.waiting = true;

      let address = this.customer.address + 
            ", " + this.city +
            ", " + this.province +
            " " + this.customer.postalCode;
        this._geocoder.geoCode(encodeURI(address))
        .subscribe(
            x => {
                if (x.confidence >= 0.8) {
                    this.customer.addressFound = true;
                    this.customer.lat = x.lat;
                    this.customer.lon = x.lon;
                    this.postCustomer();
                }
                else {
                    this.waiting = false;
                    this._alert.create({
                      title: 'Address Not addressFound',
                      message: 'We were unable to locate this address on the map. Do you want to save it anyway?',
                      buttons: [
                        {
                          text: 'No',
                          role: 'cancel',
                          handler: () => { }
                        },
                        {
                          text: 'Yes',
                          handler: () => this.postCustomer()
                        }
                      ]
                    })
                }
            },
            x => {
                this.waiting = false;
                this._alert.create({
                  title: 'Geo Coder Unavailable',
                  message: 'External geo coder service seems to be unavailable. This can prevent this customer\'s records from appearing on the map. Do you want to save anyway?',
                  buttons: [
                      {
                          text: 'No',
                          role: 'cancel',
                          handler: () => { }
                      },
                      {
                        text: 'Yes',
                        handler: () => this.postCustomer()
                      }
                  ]
                }).present();
            }
        );
  }

  private postWithoutAddress() {
        if (this.onSubmitValidationWithoutAddress()) {
             this._alert.create({
                title: 'Validation Errors',
                message: this.onSubmitValidationErrors[0],
                buttons: ['OK']
              }).present();
            return;
        }
        
        //start the waitbox
        this.waiting = true;

        this.customer.addressFound = false;
        this.customer.address = "";
        this.customer.postalCode = "";
        this.postCustomer();
  }
  

}
