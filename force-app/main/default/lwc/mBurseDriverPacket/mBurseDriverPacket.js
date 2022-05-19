import { LightningElement, api } from 'lwc';
import signatureRequestForDriver from '@salesforce/apex/NewAccountDriverController.sendSignatureRequestForDriver';
import contactInfo from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import  mBurseCss from '@salesforce/resourceUrl/mBurseCss';
import { events, skipEvents, backEvents} from 'c/utils';
export default class MBurseDriverPacket extends LightningElement {
    packetCss = mBurseCss +  '/mburse/assets/Sign.png';
    packetSent = false;
    isShowUpload = false;
    isShow = false;
    isPacket = false;
    renderInitialized = false;
    promiseError = false;
    driverDetails;
    @api days
    @api cellType;
    @api contactId;
    @api emailOfDriver;
    @api contactOfDriver;
    sendDriverPacket(){
        this.packetSent = true; 
        signatureRequestForDriver({userEmail: this.emailOfDriver, contactName: this.contactOfDriver})
        .then((result) => {
            console.log("Packet received --", result);
            let contactList, mLogList;
            mLogList = this.driverDetails;
            contactList = this.proxyToObject(mLogList);
            contactList[0].driverPacketStatus = "Uploaded";
            updateContactDetail({contactData: JSON.stringify(contactList),driverPacket : true}).then(() =>{
                this.toggleHide();
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }
    nextmLogPreview(){
        events(this, 'Next mLog Preview');
    }
    proxyToObject(e) {
        return JSON.parse(e)
    }
    toggleHide(){
        var list, status, packetStatus;
        contactInfo({contactId: this.contactId})
        .then((data) => {
          if (data) {
            this.promiseError = false;
            this.driverDetails = data;
            list = this.proxyToObject(data);
            packetStatus = list[0].driverPacketStatus;
            status =   list[0].insuranceStatus;
            this.isShowUpload = (status === 'Uploaded') ? false : true;
            if(this.days === true){
                this.isShow = true;
            }else{
                if(status !== 'Uploaded'){
                    this.isShow = false;
                }else{
                    this.isShow = true;
                }
            }
            this.isPacket = (packetStatus === 'Uploaded') ? true : false;
          }
        })
        .catch((error)=>{
            // If the promise rejects, we enter this code block
            this.errorMessage = 'Disconnected! Please check your connection and log in';
            this.promiseError = true;
            console.log(error);
        })
    }
    skipToPage(){
        var contactData, beforeUpdate, toUpdate, listToContact;
        if(this.driverDetails){
            listToContact = this.driverDetails;
            contactData = this.proxyToObject(listToContact);
            beforeUpdate = contactData[0].driverPacketStatus;
            toUpdate = 'Skip';
            if(beforeUpdate !== toUpdate){
                contactData[0].driverPacketStatus = "Skip";
                updateContactDetail({contactData: JSON.stringify(contactData), driverPacket: true})
                .then(()=>{
                }).catch(error =>{
                    console.log("error", error)
                })
            }
        }
        skipEvents(this, 'Next mLog Preview');
    }

    backToPage(){
        backEvents(this, 'Next Declaration Upload');
    }

    backToPacket(){
        this.packetSent = false;
    }

    renderedCallback() {
        if (this.renderInitialized) {
            return;
          }
        this.renderInitialized = true;
        this.toggleHide();
        this.renderText = (this.cellType === 'Company Provide') ? 'mLog Preview' : 'mLog Preview';
    }
}