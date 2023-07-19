import { LightningElement, api } from "lwc";
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import redirectionURL from '@salesforce/apex/NewAccountDriverController.loginRedirection';
import contactInfo from '@salesforce/apex/NewAccountDriverController.getContactDetail';
import { backEvents, events } from "c/utils";
export default class OnboardingmDashTour extends LightningElement {
  videoWidth = 396;
  videoHeight = 223;
  welcomeVideoUrl;
  nextShow = false;
  nextPreview = false;
  isPlay = false;
  renderInitialized = false;
  promiseError = false;
  renderAccount = false;
  driverDetails;
  buttonRender = "";
  @api dayLeft;
  @api welcomeInsurance;
  @api customSetting;
  // Id of driver or contact
  @api contactId;

  // Id of account
  @api accountId;

  // Email of contact
  @api contactEmail;

  // mobile phone of contact
  @api mobilePhone;

  // Type of account (New or Existing)
  @api accountType;

  @api driverMeeting;

  // Type of phone (Employee Provided or Company Provided)
  @api cellType;

  // Watch driver meeting
  @api meeting;

  // Schedule driver meeting
  @api schedule;

  backToPrevious() {
    backEvents(this, "Next Preview Page");
  }

  nextRedirectMeeting() {
    events(this, "");
  }

  proxyToObject(e) {
    return JSON.parse(e)
  }


  toggleHide() {
    var list, contactList
    contactInfo({
            contactId: this.contactId
        })
        .then((data) => {
            console.log("detail data", data)
            if (data) {
                this.driverDetails = data;
                list = this.driverDetails;
                contactList = this.proxyToObject(list);
                this.renderAccount = (contactList[0].mburseDashboardOnBoarding) ? true : false
            }
        })
        .catch((error) => {
            console.log(error);
        })
  }

  loggedInToAccount(){
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

  removePreview(){
      var list, contactList
      if (this.driverDetails) {
          list = this.driverDetails;
          contactList = this.proxyToObject(list);
          contactList[0].mburseDashboardOnBoarding = true;
          updateContactDetail({
              contactData: JSON.stringify(contactList),
              driverPacket: true
          }).then(() => {
              this.toggleHide();
              if(contactList[0].watchMeetingOnBoarding){
                  this.loggedInToAccount();
              }else{
                  events(this,'');
              }
          })
      }
  }

  connectedCallback() {
    console.log("callback called", this.customSetting);
    let data = this.customSetting;
    this.welcomeVideoUrl = data.Welcome_Link__c;
  }


  renderedCallback() {
    if (this.renderInitialized) {
      return;
    }
    this.renderInitialized = true;
    this.toggleHide();
    this.render = this.cellType === "Company Provide" ? true : false;
    this.buttonRender =
      this.accountType === "New Account"
        ? "Register for your manager meeting"
        : "Watch your manager training";
    this.showWatchBtn = this.accountType === "New Account" ? false : true;
    this.afterRegister =
      this.accountType === "New Account" && this.driverMeeting === "Scheduled"
        ? true
        : false;
    console.log("rendered--", this.render, this.accountType);
  }
}
