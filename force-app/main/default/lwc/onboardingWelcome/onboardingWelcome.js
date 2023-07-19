import { LightningElement } from 'lwc';
import { events } from 'c/utils';
export default class OnboardingWelcome extends LightningElement {
    redirectToPlan(){
        console.log("Redirect Plan Preview")
        events(this,'');
    }
}