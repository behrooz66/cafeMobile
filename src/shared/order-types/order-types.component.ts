import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OrderTypeService } from '../../services/order-types.service';

@Component({
    selector: 'order-types',
    templateUrl: './order-types.component.html',
     providers: [
      OrderTypeService,
      {
            provide: NG_VALUE_ACCESSOR,
            useExisting: OrderTypesComponent,
            multi: true
      }
    ]
})

export class OrderTypesComponent implements OnInit, ControlValueAccessor 
{
    orderTypes:any[] = [];
    mode: string = "";

    @Input() allowNone = false;
    @Input() typeId = 0;

    onChange: (_: any) => {};
    onTouched: () => {}

    constructor(private _orderTypes: OrderTypeService) { }

    ngOnInit() {
        this.mode = "loading";
        this._orderTypes.getTypes().subscribe(
            d => {
                this.orderTypes = d;
                this.mode = "success";
            },
            d => {
                this.mode = "error";
            },
            () => {
                // todo: anything here?!
            }
        );
    }

    writeValue(value: any) {
        if (value !== undefined)
            this.typeId = +value;
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    changed(value) {
        this.onChange(+value);
    }
}