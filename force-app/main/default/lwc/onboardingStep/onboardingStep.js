import { LightningElement } from "lwc";
import emcUrl from "@salesforce/resourceUrl/mBurseCss";
import driverDetails from "@salesforce/apex/NewAccountDriverController.getContactDetail";
export default class OnboardingStep extends LightningElement {
  step1Url = emcUrl + "/mburse/assets/Watch.png";
  step2Url = emcUrl + "/mburse/assets/Upload.png";
  step3Url = emcUrl + "/mburse/assets/Calendar.png";
  number1 = emcUrl + "/mburse/assets/Numbers/1.png";
  number2 = emcUrl + "/mburse/assets/Numbers/2.png";
  number3 = emcUrl + "/mburse/assets/Numbers/3.png";
  isSchedule = false;
  accountType = false;
  isRegister = false;
  getUrlParamValue(url, key) {
    return new URL(url).searchParams.get(key);
  }
  proxyToObject(e) {
    return JSON.parse(e);
  }
  connectedCallback() {
    const idParamValue = this.getUrlParamValue(window.location.href, "id");
    const aidParamValue = this.getUrlParamValue(window.location.href, "accid");
    this.contactId = idParamValue;
    this.accountId = aidParamValue;
    driverDetails({ contactId: this.contactId })
      .then((data) => {
        var driverDetailList;
        if (data) {
          driverDetailList = this.proxyToObject(data);
          this.accountType =
            driverDetailList[0].accountStatus === "New Account" ? true : false;
          this.phone =
            driverDetailList[0].cellPhone === "Company Provide" ? true : false;
          this.isSchedule =
            driverDetailList[0].driverMeeting === "Scheduled" ? true : false;
          this.isRegister =
            driverDetailList[0].driverMeeting === "Attended" ? true : false;
        }
      })
      .catch((error) => {
        console.log("Error", error.message);
      });
  }
}
