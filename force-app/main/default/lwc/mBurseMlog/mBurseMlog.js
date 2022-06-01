import { LightningElement, wire, api } from 'lwc';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
import contactInfo from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import { events,backEvents } from 'c/utils';
export default class MBurseMlog extends LightningElement {
    render;
    arrayList;
    originUrl;
    vfHost;
    privacyPledgeUrl;
    videoWidth = 396;
    videoHeight = 223;
    mLogVideoUrl;
    isShow = false;
    renderInitialized = false;
    promiseError = false;
    @api contactId;
    @api cellType;
    @wire(getCustomSettings)
    myCustomSettings({ error, data }){
        if (data) {
             this.privacyPledgeUrl = data.Privacy_Pledge_Link__c;
             this.mLogVideoUrl = (this.cellType === 'Employee Provide') ? data.mLog_Preview_Employee_Provided_Link__c : data.mLog_Preview_Company_Provided_Link__c;
          } else if (error) {
              console.log(error);
          }
    }
    proxyToObject(e) {
        return JSON.parse(e)
    }
    renderStyle(){
        if(this.template.querySelector('.video-container') !== undefined || this.template.querySelector('.video-container') !== null){
            if(this.cellType === 'Company Provide') {
                this.template.querySelector('.video-container').classList.add('pd-top-2');
            }else{
                this.template.querySelector('.video-container').classList.add('pd-top');
            }
        }
    }
    toggleHide(){
        var list, status;
        contactInfo({contactId: this.contactId})
        .then((data) => {
          if (data) {
            this.promiseError = false;
            list = this.proxyToObject(data);
            this.arrayList = list;
            status = list[0].driverPacketStatus;
            this.isShow = (status === 'Uploaded') ? false : true;
            this.renderStyle()
          }
        })
        .catch((error)=>{
            // If the promise rejects, we enter this code block
            console.log(error); 
        })
    }
    mLogDownload(){
        var list;
        contactInfo({contactId: this.contactId})
        .then((data) => {
          if (data) {
            this.promiseError = false;
            list = this.proxyToObject(data);
            let u;
            u = list;
            u[0].mlogApp = true;
            updateContactDetail({contactData: JSON.stringify(u),driverPacket : true})
            events(this, 'Next Download mLog');
          }
        })
        .catch((error)=>{
            // If the promise rejects, we enter this code block
            this.errorMessage = 'Disconnected! Please check your connection and log in';
            this.promiseError = true;
            console.log(error); 
        })
    }
    backToPage(){
        backEvents(this, 'Next Driver Packet');
    }
    renderedCallback(){
        if (this.renderInitialized) {
            return;
        }
        this.renderInitialized = true;
        this.toggleHide();
        if (this.template.querySelector('iframe') != null) {
            this.template.querySelector('iframe').addEventListener(
                'load',
                this._handler = () => this.handleFireToVf(this.mLogVideoUrl)
            );
        }
        this.render = (this.cellType === 'Company Provide') ? true : false;
    }
    handleFireToVf(vurl) {
        var vfData = {
            vfHeight: this.videoHeight,
            vfWidth: this.videoWidth,
            vfSource: vurl,
            cellType: this.cellType
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