import {
    LightningElement,
    api
} from 'lwc';
import signatureRequestForDriver from '@salesforce/apex/NewAccountDriverController.sendSignatureRequestForDriver';
import contactInfo from '@salesforce/apex/NewAccountDriverController.getContactDetail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import redirectionURL from '@salesforce/apex/NewAccountDriverController.loginRedirection';
import mBurseCss from '@salesforce/resourceUrl/mBurseCss';
import {
    events,
    skipEvents,
    backEvents
} from 'c/utils';
export default class MBurseDriverPacket extends LightningElement {
    packetCss = mBurseCss + '/mburse/assets/Sign.png';
    packetSent = false;
    isShowUpload = false;
    isShow = false;
    isPacket = false;
    renderInitialized = false;
    promiseError = false;
    driverDetails;
    isAppDone = false;
    @api days
    @api cellType;
    @api contactId;
    @api emailOfDriver;
    @api contactOfDriver;
    // Watch driver meeting
    @api meeting;
    // Schedule driver meeting 
    @api schedule;
    // Type of account (New or Existing)
    @api accountType;

    sendDriverPacket() {
        this.packetSent = true;
        let contactList, mLogList;
        if (this.driverDetails) {
            mLogList = this.driverDetails;
            contactList = this.proxyToObject(mLogList);
            this.isAppDone = (contactList[0].mlogApp) ? true : false;
            signatureRequestForDriver({
                    userEmail: this.emailOfDriver,
                    contactName: this.contactOfDriver
                })
                .then((result) => {
                    console.log("Packet received --", result);
                    contactList[0].driverPacketStatus = (contactList[0].driverPacketStatus === null) ? "Sent" :
                        (contactList[0].driverPacketStatus === "Sent") ? "Resent" : (contactList[0].driverPacketStatus === "Resent") ? "Resent Again" : (contactList[0].driverPacketStatus === "Skip") ? "Sent" : "Resent Again"
                    updateContactDetail({
                        contactData: JSON.stringify(contactList),
                        driverPacket: true
                    }).then(() => {
                        this.toggleHide();
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }
    nextmLogPreview() {
        events(this, 'Next mLog Preview');
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
                    this.promiseError = false;
                    this.driverDetails = data;
                    list = this.proxyToObject(data);
                    packetStatus = list[0].driverPacketStatus; // list[0].driverPacketStatus;
                    status = list[0].insuranceStatus;
                    this.isShowUpload = (status === 'Uploaded') ? false : true;
                    if (this.days === true) {
                        this.isShow = (packetStatus === 'Uploaded') ? true : false;
                    } else {
                        this.isShow = true;
                    }
                    //this.isPacket = (packetStatus === 'Uploaded') ? true : false;
                }
            })
            .catch((error) => {
                // If the promise rejects, we enter this code block
                this.errorMessage = 'Disconnected! Please check your connection and log in';
                this.promiseError = true;
                console.log(error);
            })
    }
    skipToPage() {
        var contactData, beforeUpdate, toUpdate, listToContact, downloadApp;
        if (this.driverDetails) {
            listToContact = this.driverDetails;
            contactData = this.proxyToObject(listToContact);
            beforeUpdate = contactData[0].driverPacketStatus;
            downloadApp = contactData[0].mlogApp;
            toUpdate = 'Skip';
            if (beforeUpdate !== toUpdate) {
                contactData[0].driverPacketStatus = "Skip";
                updateContactDetail({
                        contactData: JSON.stringify(contactData),
                        driverPacket: true
                    })
                    .then(() => {
                        if (downloadApp === true) {
                            let list, d;
                            contactInfo({
                                    contactId: this.contactId
                                })
                                .then((data) => {
                                    if (data) {
                                        list = this.proxyToObject(data);
                                        this.arrayList = list;
                                        d = this.arrayList;
                                        d[0].checkDriverMeeting = true;
                                        updateContactDetail({
                                            contactData: JSON.stringify(d),
                                            driverPacket: true
                                        })
                                        events(this, 'Next mburse meeting');
                                    }
                                })
                                .catch((error) => {
                                    // If the promise rejects, we enter this code block
                                    console.log(error);
                                })
                           // this.redirectToDashboard()
                        } else {
                            skipEvents(this, 'Next mLog Preview');
                        }
                    }).catch(error => {
                        console.log("error", error)
                    })
            } else {
                if (downloadApp === true) {
                    let list, d;
                    contactInfo({
                            contactId: this.contactId
                        })
                        .then((data) => {
                            if (data) {
                                list = this.proxyToObject(data);
                                this.arrayList = list;
                                d = this.arrayList;
                                d[0].checkDriverMeeting = true;
                                updateContactDetail({
                                    contactData: JSON.stringify(d),
                                    driverPacket: true
                                })
                                events(this, 'Next mburse meeting');
                                // if (d[0].accountStatus === 'New Account') {
                                //     window.open(this.schedule)
                                // } else {
                                //     window.open(this.meeting)
                                // }
                                
                            }
                        })
                        .catch((error) => {
                            // If the promise rejects, we enter this code block
                            console.log(error);
                        })
                   //this.redirectToDashboard()
                } else {
                    skipEvents(this, 'Next mLog Preview');
                }
            }
        }
    }

    redirectToDashboard() {
        redirectionURL({
                contactId: this.contactId
            })
            .then((result) => {
                let url = window.location.origin + result;
                window.open(url, '_self');
            })
            .catch((error) => {
                // If the promise rejects, we enter this code block
                console.log(error);
            })
    }

    goToDashboard() {
        var list, d;
        contactInfo({
                contactId: this.contactId
            })
            .then((data) => {
                if (data) {
                    list = this.proxyToObject(data);
                    this.arrayList = list;
                    d = this.arrayList;
                    d[0].checkDriverMeeting = true;
                    updateContactDetail({
                        contactData: JSON.stringify(d),
                        driverPacket: true
                    })
                    events(this, 'Next mburse meeting');
                }
            })
            .catch((error) => {
                // If the promise rejects, we enter this code block
                console.log(error);
            })
    }

    backToPage() {
        backEvents(this, 'Next Declaration Upload');
    }

    backToPacket() {
        this.packetSent = false;
    }

    renderedCallback() {
        if (this.renderInitialized) {
            return;
        }
        this.renderInitialized = true;
        this.toggleHide();
        this.renderText = (this.cellType === 'Company Provide') ? 'mLog Preview' : 'mLog Preview';
        this.renderBtnText = (this.accountType === 'New Account') ? 'Register for your driver meeting' : 'Next watch your driver meeting';
    }
}