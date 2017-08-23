import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GiftcardTypeService } from '../../services/giftcard-types.service'

@Component({
  selector: 'giftcard-types',
  templateUrl: './giftcard-types.component.html',
  providers: [
      GiftcardTypeService,
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: GiftcardTypeComponent,
          multi: true
      }
  ]
})
export class GiftcardTypeComponent implements OnInit, ControlValueAccessor {

  giftcardTypes:any[] = [];
  mode: string = "";

  @Input() allowNone = false;
  @Input() typeId = 0;

  onChange: (_: any) => {};
  onTouched: () => {}
  
  constructor(private _typeService: GiftcardTypeService) { }

  ngOnInit() {
      this.mode = "loading";
      this._typeService.getTypes().subscribe(
          d => {
              this.giftcardTypes = d;
              this.mode = "success";
          },
          d => {
              this.mode = "fail";
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
