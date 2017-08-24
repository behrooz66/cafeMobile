import { FormControl } from '@angular/forms';

export class EditGiftCardValidators {
    
    static dateInvalid(control: FormControl) {
        if (!control.value) 
            return null;
        
        if (control.value.length != 10) {
            return {
                dateInvalid: true
            }
        }

        if (control.value && control.value.toString().match(/[a-z]/i)){
            return {
                dateInvalid: true
            }
        }

        return null;
    } 

    static amountInvalid(control: FormControl) {
        if (control.value && control.value.toString().match(/[a-z]/i))
            return {
                amountInvalid: true
            }
        return null;
    }

}