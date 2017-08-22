import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { CustomersListPage } from '../customers/list/customers-list';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  login = 
  {
    username: "",
    password: ""
  };

  mode: string = "";

  constructor(
    public navCtrl: NavController,
    private _auth: AuthService
  ) {

  }

  signin()
  {
      this.mode = "loading";
      this._auth.login(this.login.username, this.login.password)
          .subscribe(
            d => 
            {
                console.log("success");
                this.navCtrl.push(CustomersListPage);
                this.mode = "success";
            },
            d =>
            {
                this.mode = "error"
            }
          );
  }

}
