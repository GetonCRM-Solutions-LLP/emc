import { LightningElement, api} from 'lwc';
export default class MBursePlanInfo extends LightningElement {
    @api linkList;
    eventShow(){
        this.dispatchEvent(
            new CustomEvent("spinner", {
                detail: "spinner"
            })
        );
    }
}