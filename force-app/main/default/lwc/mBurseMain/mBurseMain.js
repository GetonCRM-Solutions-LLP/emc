import {
  LightningElement, api, track
} from 'lwc';
import driverDetails from '@salesforce/apex/NewAccountDriverController.getContactDetail';
export default class MBurseMain extends LightningElement {
  nextInsurance = false;
  nextDeclationUpload = false;
  nextDriverPacket = false;
  nextmLogPreview = false;
  nextmLogDownload = false;
  nextBurseMeeting = false;
  // nextBurseFinal = false;
  welcomePage = true;
  isInsurance = true;
  isDeclaration = false;
  skipUpload = false;
  uploadVal = true;
  renderInitialized = false;
  contactId;
  accountId;
  contactName;
  contactEmail;
  mobilePhone;
  attachmentid;
 @track information;
  registerMeeting;
  accountType;
  cellphoneType;
  _handler;
  @api settings;
  getUrlParamValue(url, key) {
    return new URL(url).searchParams.get(key);
  }

  proxyToObject(e) {
    return JSON.parse(e)
  }

  _renderView(m) {
    //this.welcomePage = ((m.driverPacketStatus === null && m.insuranceStatus === null) || (m.driverPacketStatus === 'Skip' && m.insuranceStatus === 'Skip') || (m.driverPacketStatus === null  && m.insuranceStatus === 'Skip') || (m.driverPacketStatus === 'Uploaded' && m.insuranceStatus === 'Skip' )) ? true : false;
    this.nextInsurance = ((m.driverPacketStatus === null && m.insuranceStatus === null) || (m.driverPacketStatus !== 'Uploaded' &&  (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus === null &&  (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus === 'Uploaded' &&  (m.insuranceStatus === null || m.insuranceStatus === 'Skip'))) ? true : false;
    this.isInsurance = ((m.driverPacketStatus  === null && m.insuranceStatus === null) || (m.driverPacketStatus !== 'Uploaded' &&  (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus !== 'Uploaded' &&  (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus === 'Uploaded' &&  (m.insuranceStatus === null || m.insuranceStatus === 'Skip'))) ? true : false;
    this.nextDriverPacket = (m.insuranceStatus ==='Uploaded'  && m.driverPacketStatus !== 'Uploaded') ? true : false;
    this.nextmLogPreview = (m.insuranceStatus === 'Uploaded' && m.driverPacketStatus === 'Uploaded' && m.mlogApp === false) ? true : false;
    this.nextBurseMeeting = (m.insuranceStatus === 'Uploaded' && m.driverPacketStatus === 'Uploaded' && m.mlogApp === true) ? true : false;
  }

  callApex() {
    driverDetails({
        contactId: this.contactId
      })
      .then((data) => {
        var driverDetailList;
        if (data) {
          this.information = data;
          driverDetailList = this.proxyToObject(data);
          this.registerMeeting = driverDetailList[0].meetingVideoLink;
          this.scheduleMeeting = driverDetailList[0].scheduleLink;
          this.attachmentid = driverDetailList[0].insuranceId;
          this.contactName = driverDetailList[0].contactName;
          this.contactEmail = driverDetailList[0].contactEmail;
          this.mobilePhone = driverDetailList[0].mobilePhone;
          this.accountType = driverDetailList[0].accountStatus;
          this.cellphoneType = driverDetailList[0].cellPhone;
          this.leftDays = driverDetailList[0].checkActivationDate;
          // eslint-disable-next-line @lwc/lwc/no-async-operation
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("show", {
                detail: "spinner"
              })
            );
          }, 100);
          console.log('Listening from wire handler', data)
        }
      })
      .catch((error) => {
        console.log('Error', error)
      })
  }

  connectedCallback() {
    const idParamValue = this.getUrlParamValue(window.location.href, 'id');
    const aidParamValue = this.getUrlParamValue(window.location.href, 'accid');
    this.contactId = idParamValue;
    this.accountId = aidParamValue;
    this.callApex();
  }

  navigateToInsurance() {
    let cList, listForInfo;
    listForInfo = this.information;
    cList = this.proxyToObject(listForInfo);
    this.welcomePage = false;
    this._renderView(cList[0]);
    //this.nextInsurance = true;
  }

  navigateToDeclaration() {
    this.nextInsurance = false;
    this.nextDeclationUpload = true;
    this.skipUpload = false;
    this.uploadVal = true;
  }


  navigateToDriverPacket(event) {
    this.nextDeclationUpload = false;
    if (event.detail === 'Next Driver Packet') {
      this.nextDriverPacket = true;
    } else if (event.detail === 'Next mLog Preview') {
      this.nextmLogPreview = true;
    } else if (event.detail === 'Next mburse meeting') {
      this.nextBurseMeeting = true;
    }
  }

  navigateTomLog(event) {
    this.nextDriverPacket = false;
    if (event.detail === 'Next mburse meeting') {
      this.nextBurseMeeting = true;
    }else{
      this.nextmLogPreview = true;
    }
  }

  navigateTomLogDownload() {
    this.nextmLogPreview = false;
    this.nextmLogDownload = true;
  }

  navigateToFinal() {
    this.nextmLogDownload = false;
    // this.nextBurseFinal = true;
  }

  navigateToMeeting(){
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextDriverPacket = false;
    this.nextDeclationUpload = false;
    this.nextBurseMeeting = true;
  }

  skipToDriverPacket() {
    this.skipUpload = true;
    this.uploadVal = false;
    this.welcomePage = false;
    this.nextDriverPacket = false;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.nextInsurance = false;
    this.nextDeclationUpload = true;
  }

  skipTomLogPreview() {
    this.welcomePage = false;
    this.nextDriverPacket = false;
    this.nextmLogPreview = true;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.nextInsurance = false;
    this.nextDeclationUpload = false;
    this.skipUpload = false;
    this.uploadVal = true;
  }

  backToDriverPacket() {
    this.welcomePage = false;
    this.nextDriverPacket = true;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.nextInsurance = false;
    this.nextDeclationUpload = false;
  }

  backToInsurance() {
    this.welcomePage = false;
    this.nextDriverPacket = false;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.nextInsurance = true;
    this.isInsurance = false;
    this.isDeclaration = true;
    this.nextDeclationUpload = false;
    this.skipUpload = false;
    this.uploadVal = false;
  }

  backToWelcome(){
    this.welcomePage = true;
    this.nextDriverPacket = false;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.nextInsurance = false;
    this.isDeclaration = false;
    this.nextDeclationUpload = false;
    this.skipUpload = false;
    this.uploadVal = false;
  }

  backTomLog() {
    this.welcomePage = false;
    this.nextDriverPacket = false;
    this.nextmLogPreview = true;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.isInsurance = false;
    this.nextInsurance = false;
    this.nextDeclationUpload = false;
  }

  backToDeclaration() {
    this.welcomePage = false;
    this.nextDriverPacket = false;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.isInsurance = false;
    this.nextInsurance = false;
    this.skipUpload = true;
    this.uploadVal = false;
    this.nextDeclationUpload = true;
  }

  renderedCallback() {
    if (this.renderInitialized) {
      return;
    }
    this.renderInitialized = true;
    this.callApex();
  }

  handleLink(event) {
    console.log("inside handle click")
    this.dispatchEvent(
      new CustomEvent("sentemail", {
        detail: event.detail
      })
    );
  }

}