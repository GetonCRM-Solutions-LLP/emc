import { LightningElement, wire, api } from 'lwc';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
import contactInfo from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import { events,backEvents } from 'c/utils';
export default class MBurseMlog extends LightningElement {
    host;
    protocol;
    pathname;
    search;
    render;
    arrayList;
    privacyPledgeUrl;
    videoWidth = 380;
    videoHeight = 214;
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
        this.render = (this.cellType === 'Company Provide') ? true : false;
    }
}