import {
  LightningElement,
  api,
  track
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
  meetingType;
  cellphoneType;
  _handler;
  @api settings;
  getUrlParamValue(url, key) {
    return new URL(url).searchParams.get(key);
  }

  proxyToObject(e) {
    return JSON.parse(e)
  }

  renderView(array) {
    let listForInfo, m, cList;
   // listForInfo = (event.detail);
   listForInfo = array
    cList = this.proxyToObject(listForInfo);
    m = cList[0];
    //console.log("renderview", event.detail)
    //this.welcomePage = ((m.driverPacketStatus === null && m.insuranceStatus === null) || (m.driverPacketStatus === 'Skip' && m.insuranceStatus === 'Skip') || (m.driverPacketStatus === null  && m.insuranceStatus === 'Skip') || (m.driverPacketStatus === 'Uploaded' && m.insuranceStatus === 'Skip' )) ? true : false;
    this.nextInsurance = ((m.driverPacketStatus === null && m.insuranceStatus === null) || (m.driverPacketStatus !== 'Uploaded' && (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus === null && (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus === 'Uploaded' && (m.insuranceStatus === null || m.insuranceStatus === 'Skip'))) ? true : false;
    this.isInsurance = (m.insuranceDialogueRemove === false) ? (((m.driverPacketStatus === null && m.insuranceStatus === null) || (m.driverPacketStatus !== 'Uploaded' && (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus !== 'Uploaded' && (m.insuranceStatus === null || m.insuranceStatus === 'Skip')) || (m.driverPacketStatus === 'Uploaded' && (m.insuranceStatus === null || m.insuranceStatus === 'Skip'))) ? true : false) : false;
    this.nextDriverPacket = (m.insuranceStatus === 'Uploaded' && m.driverPacketStatus !== 'Uploaded') ? true : false;
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
          console.log("driver", driverDetailList)
          this.registerMeeting = driverDetailList[0].scheduleLink;
          this.scheduleMeeting = driverDetailList[0].scheduleLink;
          this.attachmentid = driverDetailList[0].insuranceId;
          this.contactName = driverDetailList[0].contactName;
          this.contactEmail = driverDetailList[0].contactEmail;
          this.mobilePhone = driverDetailList[0].mobilePhone;
          this.accountType = driverDetailList[0].accountStatus;
          this.meetingType = driverDetailList[0].driverMeeting;
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
   // this.callApex();
  }

  navigateToInsurance() {
    let listForInfo, list;
    listForInfo = this.information;
    list = this.proxyToObject(listForInfo);
    console.log("inside insurance")
    this.welcomePage = false;
    this.nextInsurance = true;
    this.isInsurance = (!list[0].insuranceDialogueRemove) ? true : false;
   // this.isDeclaration = (!this.isInsurance) ? true : false;
   if(!this.isInsurance){
    this.renderView(listForInfo);
   }
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
    } else {
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

  navigateToMeeting() {
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
    let status;
    this.welcomePage = false;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    this.nextInsurance = false;
    this.nextDeclationUpload = false;
    driverDetails({
        contactId: this.contactId
      })
      .then((data) => {
        let dataList;
        if (data) {
          dataList = this.proxyToObject(data);
          status = dataList[0].driverPacketStatus;
          if (status === 'Uploaded') {
            this.nextDriverPacket = false;
            this.nextInsurance = true;
            this.isInsurance = (!dataList[0].insuranceDialogueRemove) ? true : false;
          } else {
            this.nextInsurance = false;
            this.isInsurance = false;
            this.nextDriverPacket = true;
          }
        }
      })
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

  backToWelcome() {
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
    let status;
    this.welcomePage = false;
    this.nextDriverPacket = false;
    this.nextmLogPreview = false;
    this.nextmLogDownload = false;
    this.nextBurseMeeting = false;
    // this.nextBurseFinal = false;
    // this.isInsurance = false;
    //this.nextInsurance = false;
    //this.skipUpload = true;
    this.uploadVal = false;
    this.packetSent = false;
    driverDetails({
        contactId: this.contactId
      })
      .then((data) => {
        var detailList;
        if (data) {
          detailList = this.proxyToObject(data);
          status = detailList[0].insuranceStatus;
          if (status === 'Uploaded') {
            this.nextDeclationUpload = false;
            this.isDeclaration = false;
            this.nextDeclationUpload = false;
            this.skipUpload = false;
            this.uploadVal = false;
            this.nextInsurance = true;
            this.isInsurance = (!detailList[0].insuranceDialogueRemove) ? true : false;
          } else {
            this.nextInsurance = false;
            this.isInsurance = false;
            this.skipUpload = true;
            this.nextDeclationUpload = true;
          }
        }
      })
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