import { LightningElement, wire} from 'lwc';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
import { events } from 'c/utils';
export default class DashboardInsuranceView extends LightningElement {
    video;
    videoWidth = 380;
    videoHeight = 214;
    welcomeVideoUrl;
    insuranceVideoUrl;
    isPlay = false;
    renderInitialized = false;
    /* Get video url from custom settings */
    @wire(getCustomSettings)
    myCustomSettings({ error, data }){
        if (data) {
            this.welcomeVideoUrl = data.Welcome_Link__c;
            this.insuranceVideoUrl = data.Insurance_Link__c;
          } else if (error) {
              console.log(error);
          }
    }

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
}