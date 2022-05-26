import { LightningElement, api } from 'lwc';

export default class MBurseNavbar extends LightningElement {
    @api links;
    @api margin;
    @api addUrl(){
        this.template.querySelector('.navbar__brand').href = "";
    }
    get headerStyle() {
        return `margin-bottom:${this.margin}`;
    }
}