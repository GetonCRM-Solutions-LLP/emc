import { LightningElement, wire, api } from 'lwc';
import redirectionURL  from '@salesforce/apex/NewAccountDriverController.loginRedirection';
import contactInfo from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
export default class MBurseFinal extends LightningElement {
    originUrl;
    vfHost;
    videoWidth = 329;
    videoHeight = 248;
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
        if (this.template.querySelector('iframe') != null) {
            this.template.querySelector('iframe').addEventListener(
                'load',
                this._handler = () => this.handleFireToVf(this.mburseVideoUrl)
            );
        }
        this.renderButton()
    }

    handleFireToVf(vurl) {
        var vfData = {
            vfHeight: this.videoHeight,
            vfWidth: this.videoWidth,
            vfSource: vurl,
        }
        var message = JSON.stringify(vfData);
        console.log("Vf data", JSON.stringify(vfData));
        // Fire an event to send data to visualforce page
        this.template.querySelector('iframe').contentWindow.postMessage(message, this.originUrl)
    }

    connectedCallback() {
        let url = window.location.origin;
        let urlHost = url + '/app/mBurseVideoFrame';
        this.originUrl = url;
        this.vfHost = urlHost;
    }
}