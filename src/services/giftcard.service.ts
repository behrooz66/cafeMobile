import { Injectable } from '@angular/core';
import { Settings } from './settings';
import { HttpAuthService } from './http-auth.service';


@Injectable()
export class GiftCardService {

  apiBase: string;

  constructor(private _http:HttpAuthService) {
      this.apiBase = Settings.apiBase + "giftcard/";
  }

  getGiftCardsByCustomer(customerId: number) {
      return this._http.get(this.apiBase + "getByCustomer?customerId=" + customerId)
          .map(r => r.json());
  }

  getGiftCard(id: number) {
       return this._http.get(this.apiBase + "get/" + id)
          .map(r => r.json());
  }

  getGiftCardsByRestaurant(restaurantId: number) {
      return this._http.get(this.apiBase + "getByRestaurant")
          .map(r => r.json());
  }

  post(giftcard) {
      return this._http.post(this.apiBase + "post", giftcard)
          .map(r => r.json());
  }

  put(id: number, giftcard) {
      return this._http.put(this.apiBase + "put/" + id, giftcard)
          .map(r => r.json());
  }

  archive(id: number) {
      return this._http.put(this.apiBase + "archive/" + id, null)
          .map(r => r.json());
  }

  unarchive(id: number){
      return this._http.put(this.apiBase + "unarchive/" + id, null)
          .map(r => r.json());
  }

  delete(id: number) {
      return this._http.delete(this.apiBase + "delete/" + id)
          .map(r => r.json());
  }

}
