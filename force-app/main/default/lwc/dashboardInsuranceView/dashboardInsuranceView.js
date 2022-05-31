import { LightningElement, wire} from 'lwc';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
import { events } from 'c/utils';
export default class DashboardInsuranceView extends LightningElement {
    video;
    vfHost;
    originUrl;
    videoWidth = 396;
    videoHeight = 223;
    insuranceVideoUrl;
    isPlay = false;
    renderInitialized = false;
    /* Get video url from custom settings */
    @wire(getCustomSettings)
    myCustomSettings({ error, data }){
        if (data) {
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
        if (this.template.querySelector('iframe') != null) {
            this.template.querySelector('iframe').addEventListener(
                'load',
                this._handler = () => this.handleFireToVf(this.insuranceVideoUrl)
            );
        }
    }

    onMyFrameLoad(){
        if (this.template.querySelector('iframe') != null) {
            this.template.querySelector('iframe').addEventListener(
                'load',
                this._handler = () => this.handleFireToVf(this.insuranceVideoUrl)
            );
        }
    }
    handleFireToVf(vurl) {
        var vfData, message
        if(vurl){
            vfData = {
                vfHeight: this.videoHeight,
                vfWidth: this.videoWidth,
                vfSource: vurl,
            }
            message = JSON.stringify(vfData);
            // Fire an event to send data to visualforce page
            this.template.querySelector('iframe').contentWindow.postMessage(message, this.originUrl)
        }else{
            this.template.querySelector('iframe').addEventListener(
                'load',
                this._handler = () => this.handleFireToVf(this.insuranceVideoUrl)
            );
        }
       
    }

    connectedCallback() {
        let url = window.location.origin;
        let urlHost = url + '/app/mBurseVideoFrame';
        this.originUrl = url;
        this.vfHost = urlHost;
    }
}