import {
  LightningElement, wire, api
} from 'lwc';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
export default class CarouselPopover extends LightningElement {
  @api totalContacts;
  @api styleCarousel;
  @api styleHeader;
  @api styleFooter;
  @api styleBody;
   // Link for instruction for android
   instructionUrlAndroid;

   // Link for instruction for iOS
   instructionUrlIOS;

   visibleContacts;

   // Link for mLog mileage tracking
   mLogTracking;
  // Get a list of custom setting named NewDashboardVideoLink
  @wire(getCustomSettings)
  myCustomSettings({
    error,
    data
  }) {
    if (data) {
      this.instructionUrlAndroid = data.Donwload_instruction_for_Android__c;
      this.instructionUrlIOS = data.Donwload_instruction_for_IOS__c;
      this.mLogTracking = data.mLog_Mileage_Tracking__c;
    } else if (error) {
      console.log(error);
    }
  }
  updateContactHandler(event) {
    this.visibleContacts = [...event.detail.records]
    console.log("visible", this.visibleContacts)
  }
  // Event handler for link click
  handleRedirect(){
      window.open(this.instructionUrlIOS)
  }

  closePopover() {
    this.dispatchEvent(new CustomEvent('pop', {
      detail: ''
    }))
  }
}