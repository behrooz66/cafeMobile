import { FormControl } from '@angular/forms';

export class NewReservationValidators {
    
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

    static revenueInvalid(control: FormControl) {
        if (control.value && control.value.toString().match(/[a-z]/i))
            return {
                priceInvalid: true
            }
        return null;
    }

    static numberOfPeopleInvalid(control: FormControl) {
        if (control.value && control.value.toString().match(/[a-z]/i))
            return {
                numberOfPeopleInvalid: true
            }
        return null;
    }
}