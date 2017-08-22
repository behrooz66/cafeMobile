import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerService } from '../../../services/customer.service';
import { TabsPage } from '../../tabs/tabs';
import { CustomerAddPage } from '../../customers/add/customer-add';
import { CustomerViewPage } from '../../customers/view/customer-view';

@Component({
  selector: 'page-customers-list',
  templateUrl: 'customers-list.html',
  providers: [
      CustomerService
  ]
})
export class CustomersListPage {

  customers = [];
  customersFiltered = [];
  search = "";

  constructor(
    public navCtrl: NavController,
    private _customer: CustomerService
  ) {

  }

  ionViewDidLoad()
  {
      this._customer.getCustomers()
          .subscribe(
              d => 
              {
                  this.customers = d;
                  this.customersFiltered = this.customers;
              },
              d =>
              {
                  console.log("connection issue");
                  console.log(d);
              }
          );
  }

  add()
  {
      this.navCtrl.push(CustomerAddPage)
  }

  view(id)
  {
      this.navCtrl.push(CustomerViewPage, {id: id});
  }

  filter()
  {
      this.search = this.search.toLowerCase();
      this.customersFiltered = this.customers.filter(
          x => x.name.toLowerCase().indexOf(this.search) !== -1
            || this.phoneFilter(x, this.search)
      );
  }

  private phoneFilter(x, exp): boolean
  {
        let c,w,h,o : boolean = false;
        if (x.cell && x.cell.toLowerCase().indexOf(exp) !== -1)
            c = true;
        else 
            c = false;

        if (x.work && x.work.toLowerCase().indexOf(exp) !== -1)
            w = true;
        else 
            w = false;

        if (x.home && x.home.toLowerCase().indexOf(exp) !== -1)
            h = true;
        else 
            h = false;    

        if (x.otherPhone && x.otherPhone.toLowerCase().indexOf(exp) !== -1)
            o = true;
        else 
            o = false;
        
        return c || w || o || h;
  }

  

}
