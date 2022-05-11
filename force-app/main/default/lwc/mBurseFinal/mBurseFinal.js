import { LightningElement, wire, api } from 'lwc';
import redirectionURL  from '@salesforce/apex/NewAccountDriverController.loginRedirection';
import contactInfo from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
export default class MBurseFinal extends LightningElement {
    videoWidth = 380;
    videoHeight = 214;
    mburseVideoUrl;
    allowRedirect = false;
    renderInitialized = false;
    driverInfo;
    @api dayLeft;
    @api contactId;
    @wire(getCustomSettings)
    myCustomSettings({ error, data }){
        if (data) {
             this.mburseVideoUrl = data.Plan_Preview_Link__c;
          } else if (error) {
              console.log(error);
          }
    }

    proxyToObject(e) {
        return JSON.parse(e)
    }

    renderButton(){
        let contact;
        contactInfo({contactId: this.contactId})
        .then((data) => {
          if (data) {
            this.driverInfo = data;
            contact = this.proxyToObject(data);
            if(this.dayLeft === true){
                this.allowRedirect = true;
            }else{
                if(contact[0].driverPacketStatus === 'Uploaded' && contact[0].insuranceStatus === 'Uploaded'){
                    this.allowRedirect = true;
                }else{
                    this.allowRedirect = false;
                }
            }
          }
        })
        .catch((error)=>{
            // If the promise rejects, we enter this code block
            console.log(error);
        })
        
    }

    loginToSystem(){
        redirectionURL({contactId: this.contactId})
        .then((result) => {
            let url = window.location.origin + result;
            window.open(url, '_self');
        })
        .catch((error)=>{
            // If the promise rejects, we enter this code block
            console.log(error);
        })
    }

    renderedCallback(){
        if (this.renderInitialized) {
            return;
          }
        this.renderInitialized = true;
        this.renderButton()
    }
}