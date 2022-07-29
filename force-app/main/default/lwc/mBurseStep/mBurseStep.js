import { LightningElement,api } from 'lwc';
import  emcUrl from '@salesforce/resourceUrl/mBurseCss';
import driverDetails from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
export default class MBurseStep extends LightningElement {
    step1Url = emcUrl + '/mburse/assets/Watch.png';
    step2Url = emcUrl + '/mburse/assets/Upload.png';
    step3Url = emcUrl + '/mburse/assets/Sign.png';
    step4Url = emcUrl + '/mburse/assets/App.png';
    step5Url = emcUrl + '/mburse/assets/Calendar.png';
    number1 = emcUrl + '/mburse/assets/Numbers/1.png';
    number2 = emcUrl + '/mburse/assets/Numbers/2.png';
    number3 = emcUrl + '/mburse/assets/Numbers/3.png';
    number4 = emcUrl + '/mburse/assets/Numbers/4.png';
    number5 = emcUrl + '/mburse/assets/Numbers/5.png';
    checkmark = emcUrl + '/mburse/assets/check-yellow.png'
    contactId;
    accountType = false;
    phone = false;
    @api isInsuranceDone;
    @api isAppDone;
    @api isDriverPacketDone;
    @api account;
    @api cellphone;
    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }
    proxyToObject(e) {
        return JSON.parse(e)
    }
    renderedCallback(){
        console.log("Rendered from Step mburse")
    }
    connectedCallback(){
        const idParamValue = this.getUrlParamValue(window.location.href, 'id');
        const aidParamValue = this.getUrlParamValue(window.location.href, 'accid');
        this.contactId = idParamValue;
        this.accountId = aidParamValue;
        driverDetails({contactId: this.contactId})
        .then((data) => {
                var driverDetailList;
                if (data) {
                    driverDetailList = this.proxyToObject(data);
                    this.accountType = (driverDetailList[0].accountStatus === 'New Account') ? true : false;
                    this.phone = (driverDetailList[0].cellPhone === 'Company Provide') ? true : false;
                    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
                    this.isInsuranceDone = (driverDetailList[0].insuranceStatus === 'Uploaded') ? true  : false;
                    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
                    this.isAppDone = driverDetailList[0].mlogApp;
                    this.isdriverPacketDone = (driverDetailList[0].driverPacketStatus === 'Uploaded') ? true  : false;
                }
         })
        .catch((error) => {
            console.log('Error', error.message)
        })
    }
}