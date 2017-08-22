import { Injectable } from '@angular/core';
import { HttpAuthService } from './http-auth.service';
import { Settings } from './settings';

@Injectable()
export class OrderTypeService
{
    constructor(private _http: HttpAuthService)
    {

    }

    getTypes() {
        return this._http.get(Settings.apiBase + "order/types")
            .map(r => r.json());
    }
}