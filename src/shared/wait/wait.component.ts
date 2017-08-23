import { Component } from '@angular/core';


@Component({
    selector: 'wait',
    template:`
        <div style="z-index:9000000;width:100%; height:100%; position: absolute; display:block; top:0; left:0; background-color:rgba(192,192,192,0.7);">
            <div style="width:85%; margin:20% auto; background-color:#f9fbff; text-align: center;">
                <br/>
                Please Wait...
                <br/>
                <br/>
                <img src="./assets/img/spinner.gif">
                <br/>
                <br/>
            </div>
        </div>
    `
})

export class WaitComponent 
{

}