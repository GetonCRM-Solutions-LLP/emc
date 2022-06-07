import {
    LightningElement,
    api
} from 'lwc';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import contactInfo from '@salesforce/apex/NewAccountDriverController.getContactDetail';
import {
    events,
    skipEvents
} from 'c/utils';
export default class MBurseWelcomeInsurance extends LightningElement {
    videoWidth = 396;
    videoHeight = 223;
    welcomeVideoUrl;
    insuranceVideoUrl;
    nextShow = false;
    isPlay = false;
    renderInitialized = false;
    promiseError = false;
    driverDetails;
    @api dayLeft;
    @api contactId;
    @api welcomeInsurance;
    @api insuranceDeclaration;
    @api customSetting;
    // get backgroundStyle() {
    //     return `background-image:url(${background})`;
    // }
    nextDeclarationUpload() {
        events(this, 'Next Declaration Upload')
    }
    nextDeclaration() {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.welcomeInsurance = false;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.insuranceDeclaration = true;
        this.isPlay = false;
    }
    proxyToObject(e) {
        return JSON.parse(e)
    }
    toggleHide() {
        var list, status, packetStatus;
        contactInfo({
                contactId: this.contactId
            })
            .then((data) => {
                if (data) {
                    this.driverDetails = data;
                    list = this.proxyToObject(data);
                    status = list[0].insuranceStatus;
                    packetStatus = list[0].driverPacketStatus;
                    if (this.dayLeft === true) {
                        this.nextShow = (status === 'Uploaded' || packetStatus === 'Uploaded') ? true : false;
                    } else {
                        this.nextShow = true;
                    }
                }
            })
            .catch((error) => {
                // If the promise rejects, we enter this code block
                console.log(error);
            })
    }
    playVideo() {
        this.isPlay = true;
    }
    renderedCallback() {
        if (this.renderInitialized) {
            return;
        }
        this.renderInitialized = true;
        this.toggleHide();
    }
    skipToPage() {
        var contactData, beforeUpdate, toUpdate, listFrom;
        if (this.driverDetails) {
            this.promiseError = false;
            listFrom = this.driverDetails
            contactData = this.proxyToObject(listFrom);
            beforeUpdate = contactData[0].insuranceStatus;
            toUpdate = "Skip";
            if (beforeUpdate !== toUpdate) {
                contactData[0].insuranceStatus = "Skip";
                console.log(JSON.stringify(contactData));
                updateContactDetail({
                        contactData: JSON.stringify(contactData),
                        driverPacket: false
                    }).then(() => {
                        this.toggleHide();
                    })
                    .catch((error) => {
                        // If the promise rejects, we enter this code block
                        this.errorMessage = 'Disconnected! Please check your connection and log in';
                        this.promiseError = true;
                        console.log(error);
                    })
            }
        }
        skipEvents(this, 'Next Declaration Upload');
    }
    backToPage() {
        // let delayInMilliseconds = 100;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.welcomeInsurance = true;
        this.isPlay = false;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.insuranceDeclaration = false;
    }
    connectedCallback() {
        console.log("callback called", this.customSetting)
        let data = this.customSetting;
        this.welcomeVideoUrl = data.Welcome_Link__c;
        this.insuranceVideoUrl = data.Insurance_Link__c;
    }
}