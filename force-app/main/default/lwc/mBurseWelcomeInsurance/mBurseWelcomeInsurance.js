import {
    LightningElement,
    api
} from 'lwc';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import contactInfo from '@salesforce/apex/NewAccountDriverController.getContactDetail';
import {
    events,
    skipEvents,
    backEvents,
    nextSkipEvents
} from 'c/utils';
export default class MBurseWelcomeInsurance extends LightningElement {
    videoWidth = 396;
    videoHeight = 223;
    welcomeVideoUrl;
    insuranceVideoUrl;
    nextShow = false;
    nextPreview = false;
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
                    this.nextPreview = ((list[0].driverPacketStatus === null && list[0].insuranceStatus === null) || (list[0].driverPacketStatus !== 'Uploaded' &&  (list[0].insuranceStatus === null || list[0].insuranceStatus === 'Skip')) || (list[0].driverPacketStatus === null &&  (list[0].insuranceStatus === null || list[0].insuranceStatus === 'Skip')) || (list[0].driverPacketStatus === 'Uploaded' &&  (list[0].insuranceStatus === null || list[0].insuranceStatus === 'Skip'))) ? false : true;
                    if (this.dayLeft === true) {
                        this.nextShow = (status === 'Uploaded' || packetStatus === 'Uploaded') ? true : false;
                    } else {
                        this.nextShow = true;
                    }
                    // this.template.querySelector("video").onended = function() {
                    //     console.log(this.played, this.played.end(0))
                    //     if(this.played.end(0) - this.played.start(0) === this.duration) {
                    //         list[0].planPreview = true;
                    //         updateContactDetail({
                    //             contactData: JSON.stringify(list),
                    //             driverPacket: false
                    //         }).then(() => {})
                    //       console.log("Played all");
                    //     }else {
                    //       console.log("Some parts were skipped");
                    //     }
                    //   }
                    //   this.template.querySelector("video").onpause = function(evt) {
                    //     if(this.ended){
                    //         list[0].planPreview = true;
                    //         updateContactDetail({
                    //             contactData: JSON.stringify(list),
                    //             driverPacket: false
                    //         }).then(() => {})
                    //     }else{
                    //         list[0].planPreview = false;
                    //         updateContactDetail({
                    //             contactData: JSON.stringify(list),
                    //             driverPacket: false
                    //         }).then(() => {})
                    //     }
                    //     console.log(this.paused,evt,this.ended)
                    //   }
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
    skipToNext(){
        nextSkipEvents(this, this.driverDetails)
    }
    backToPage() {
        // let delayInMilliseconds = 100;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.welcomeInsurance = true;
        this.isPlay = false;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.insuranceDeclaration = false;
    }
    backToPrevious(){
            backEvents(this, 'Next Welcome Page');
    }
    connectedCallback() {
        console.log("callback called", this.customSetting)
        let data = this.customSetting;
        this.welcomeVideoUrl = data.Welcome_Link__c;
        this.insuranceVideoUrl = data.Insurance_Link__c;
    }
}