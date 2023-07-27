import { LightningElement, api} from 'lwc';
import { events } from 'c/utils';
export default class DashboardInsuranceView extends LightningElement {
    @api videoLink
		@api expired;
    video;
    videoWidth = 396;
    videoHeight = 223;
    isPlay = false;
    renderInitialized = false;

    /* Move to next page */
    nextDeclarationUpload(){
        events(this, 'Next Declaration Upload')
    }

    /* converts string to json object */
    proxyToObject(e) {
        return JSON.parse(e)
    }

    /* play video on click of button */
    playVideo(){
        this.isPlay = true;
    }

    /* rendered callback */ 
    renderedCallback() {
        if (this.renderInitialized) {
            return;
        }
        this.renderInitialized = true;
    }
		
		connectedCallback(){
				console.log("expired", this.expired)
		}

}