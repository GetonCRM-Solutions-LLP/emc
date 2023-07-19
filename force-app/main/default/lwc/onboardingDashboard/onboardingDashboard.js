/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api } from 'lwc';
import getContactDetail from '@salesforce/apex/NewAccountDriverController.getContactDetail';
export default class OnboardingDashboard extends LightningElement {
    contactId;
    accountId;
    contactInformation;
    planPreview = false;
    mTour = false;
    mBurseMeeting = false;
    renderInitialized = false;
    @api settings;

    getUrlParamValue(url, key) {
      return new URL(url).searchParams.get(key);
    }
  
    proxyToObject(e) {
      return JSON.parse(e)
    }

    getDriverDetail(){
        getContactDetail({
          contactId: this.contactId
        })
        .then((data) => {
            if (data) {
              console.log("getContactDetail", data);
              this.contactInformation = data;
              let driverDetailList = this.proxyToObject(data);
              this.registerMeeting = driverDetailList[0].scheduleLink;
              this.scheduleMeeting = driverDetailList[0].scheduleLink;
              this.contactName = driverDetailList[0].contactName;
              this.contactEmail = driverDetailList[0].contactEmail;
              this.accountType = driverDetailList[0].accountStatus;
              this.meetingType = driverDetailList[0].driverMeeting;
              this.cellphoneType = driverDetailList[0].cellPhone;
              if(driverDetailList[0].planPreviewOnBoarding){
                this.planPreview = false
              }else if(driverDetailList[0].mburseDashboardOnBoarding){
                this.mTour = false
              }
              setTimeout(() => {
                this.dispatchEvent(
                  new CustomEvent("show", {
                    detail: "spinner"
                  })
                );
              }, 100);
            }
        })
        .catch((error) => {
            console.log("Error", error);
        });
    }

    renderedCallback() {
        if (this.renderInitialized) {
          return;
        }
        this.renderInitialized = true;
        console.log("inside rendered")
        this.getDriverDetail();
    }

    toggleView(){
        this.getDriverDetail();
        if(this.contactInformation){
            let driverDetailList = this.proxyToObject(this.contactInformation);
            this.planPreview = (!driverDetailList[0].planPreviewOnBoarding && driverDetailList[0].mburseDashboardOnBoarding) ? true : false;
            this.mTour = (!driverDetailList[0].mburseDashboardOnBoarding) ? true : false;
            this.mBurseMeeting = false;
        }
        console.log(this.planPreview, this.mTour, this.mBurseMeeting)
    }

    navigateToPlanPreview(){
        let driverDetailList = this.proxyToObject(this.contactInformation);
        this.planPreview = (!driverDetailList[0].planPreviewOnBoarding) ? true : false;
        this.mTour = (driverDetailList[0].planPreviewOnBoarding && !driverDetailList[0].mburseDashboardOnBoarding) ? true : false;
        this.mBurseMeeting =  (driverDetailList[0].planPreviewOnBoarding && driverDetailList[0].mburseDashboardOnBoarding && !driverDetailList[0].watchMeetingOnBoarding) ? true : false;
    }

    navigateTomDashTour(event){
      if(event.detail === 'Redirect to Meeting'){
        this.planPreview = false;
        this.mTour = false;
        this.mBurseMeeting = true;
      }else{
        this.planPreview = false;
        this.mTour = true;
        this.mBurseMeeting = false;
      }
       
    }

    navigateToMeeting(){
        this.planPreview = false;
        this.mTour = false;
        this.mBurseMeeting = true;
    }

    backToWelcome(){
        this.planPreview = false;
        this.mTour = false;
        this.mBurseMeeting = false;
    }

    backToPlanPreview(){
        this.getDriverDetail();
        let driverDetailList = this.proxyToObject(this.contactInformation);
        this.planPreview = (!driverDetailList[0].planPreviewOnBoarding) ? true : false;
      //  this.planPreview = true;
        this.mTour = false;
        this.mBurseMeeting = false;
    }

    backToTour(){
        // let driverDetailList = this.proxyToObject(this.contactInformation);
        // this.planPreview = (!driverDetailList[0].planPreviewOnBoarding && driverDetailList[0].mburseDashboardOnBoarding) ? true : false;
        // this.mTour = (!driverDetailList[0].mburseDashboardOnBoarding) ? true : false;
        this.planPreview = false;
        this.mTour = true;
        this.mBurseMeeting = false;
    }

    connectedCallback() {
        const idParamValue = this.getUrlParamValue(window.location.href, 'id');
        const aidParamValue = this.getUrlParamValue(window.location.href, 'accid');
        this.contactId = idParamValue;
        this.accountId = aidParamValue;
    }
}