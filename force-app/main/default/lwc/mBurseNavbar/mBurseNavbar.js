import { LightningElement, api } from 'lwc';

export default class MBurseNavbar extends LightningElement {
    @api links;
    @api margin;
    get headerStyle() {
        return `margin-bottom:${this.margin}`;
    }
}