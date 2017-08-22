import { FormControl } from '@angular/forms';

export class NewCustomerValidators {
    
    static emailInvalid(control: FormControl) {
        if (control.value.length === 0) 
            return null;
        if (control.value.indexOf("@") < 0 
            || control.value.indexOf(".") < 0
            || control.value.length < 5)
        return { emailInvalid : true}
        return null;
    } 

    static addressInvalid(control: FormControl) {
        if (control.value && control.value.indexOf(" ") < 0)
            return {addressInvalid : true}
        return null;
    }
}