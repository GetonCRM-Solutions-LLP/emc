import { LightningElement } from 'lwc';
import { events } from 'c/utils';
export default class MBurseWelcomeAccount extends LightningElement {
    host;
    protocol;
    pathname;
    search;
    redirectToInsurance(){
        events(this,'Next Welcome Insurance');
    }

}