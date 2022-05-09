import { LightningElement} from 'lwc';
export default class MBursePlanInfo extends LightningElement {
    eventShow(){
        this.dispatchEvent(
            new CustomEvent("spinner", {
                detail: "spinner"
            })
        );
    }
}