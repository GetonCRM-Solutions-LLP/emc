/* eslint-disable no-useless-escape */
import { LightningElement, wire, api } from "lwc";
import onboardingStatus from "@salesforce/apex/ManagerDashboardController.onboardingStatus";
import insuranceReport from "@salesforce/apex/ManagerDashboardController.insuranceReport";
import myTeamDetails from "@salesforce/apex/ManagerDashboardController.myTeamDetails";
import highRiskDriversDetails from "@salesforce/apex/ManagerDashboardController.highRiskDriversDetails";
import managerContactData from "@salesforce/apex/ManagerDashboardController.managerContactData";
import getAllDriversLastMonthUnapprovedReimbursementsclone from "@salesforce/apex/ManagerDashboardController.getAllDriversLastMonthUnapprovedReimbursementsclone";
export default class ManagerUserProfile extends LightningElement {
  @api contactId;
  @api accountId;
  @api isNotify;
  @api notifyMessageList;
  @api notifyMessage;
  driverUnapproveList;
  driverVisibleList;
  driverTeamVisibleList;
  highRiskMileageDriverList;
  highMileageDriverList;
  complianceList;
  insuranceList;
  locationList;
  myTeamList;
  driverIsUnapprove = false;
  driverIsMyteam = false;
  driverIsHighMileage = false;
  driverIsHighRisk = false;
  @wire(onboardingStatus, {
    managerId: "$contactId"
  })
  status({ data, error }) {
    if (data) {
      this.complianceList = data;
      console.log("compliance status", data);
    } else {
      console.log("complianceStatus", error);
    }
  }

  @wire(insuranceReport, {
    managerId: "$contactId"
  })
  insurance({ data, error }) {
    if (data) {
      this.insuranceList = data;
      console.log("insuranceList status", data)
    } else {
      console.log("insuranceList", error);
    }
  }

  @wire(managerContactData, {
    managerId: "$contactId"
  })
  managerContactData({ data, error }) {
    if (data) {
      let dataList = this.proxyToObject(data);
      dataList.forEach((el) => {
        el.lat = el.Address__r
          ? el.Address__r.Location_Lat_Long__Latitude__s
          : 0;
        el.lon = el.Address__r
          ? el.Address__r.Location_Lat_Long__Longitude__s
          : 0;
        el.amount = el.Fixed_Amount__c ? el.Fixed_Amount__c : 0;
        el.address =
          el.MailingCity + ", " + el.MailingState + " " + el.MailingPostalCode;
      });
      this.locationList = dataList;
      console.log("locationList---", this.locationList);
    } else {
      console.log("locationList", error);
    }
  }

  proxyToObject(e) {
    return JSON.parse(e);
  }

  getElement(data, id) {
    var object = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].contactid === id) {
        object = data[i];
      }
    }
    return object;
  }

  getElementById(data, id) {
    var object = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        object = data[i];
      }
    }
    return object;
  }

  connectedCallback() {
    getAllDriversLastMonthUnapprovedReimbursementsclone({
      accountId: this.accountId,
      contactId: this.contactId,
      showTeam: false
    })
      .then((data) => {
        let result = data.replace(/\\'/g, "'");
        this.driverUnapproveList = this.proxyToObject(result);
        this.driverIsUnapprove =
          this.driverUnapproveList.length > 0 ? true : false;
        console.log("driver--", this.driverUnapproveList);
        if (this.driverUnapproveList) {
          this.driverVisibleList =
            this.driverUnapproveList.length > 7
              ? this.driverUnapproveList.slice(0, 7)
              : this.driverUnapproveList;
        }

        console.log("driver---", this.driverUnapproveList);
      })
      .catch((error) => {
        console.log(
          "getAllDriversLastMonthUnapprovedReimbursementsclone error",
          error
        );
      });

    myTeamDetails({
      managerId: this.contactId,
      accountId: this.accountId,
      showteam: false
    })
      .then((data) => {
        let result = data.replace(/\\'/g, "'");
        this.myTeamList = this.proxyToObject(result);
        this.driverIsMyteam = this.myTeamList.length > 0 ? true : false;
        if (this.myTeamList) {
          this.driverTeamVisibleList =
            this.myTeamList.length > 7
              ? this.myTeamList.slice(0, 12)
              : this.myTeamList;
        }
        console.log("myTeamDetails List---", data);
      })
      .catch((error) => {
        console.log("myTeamDetails error", error);
      });

      highRiskDriversDetails({
       managerId: this.contactId,
       highMileage: true
      })
      .then((data) => {
        let result = data.replace(/\\'/g, "'");
        console.log("highMileageDriversDetails List---", data);
        this.highMileageDriverList = this.proxyToObject(result);
        this.driverIsHighMileage =
          this.highMileageDriverList.length > 0 ? true : false;
       
      })
      .catch((error) => {
        console.log("highMileageDriversDetails error", error);
      });

      highRiskDriversDetails({
        managerId: this.contactId,
        highMileage: false
      })
      .then((data) => {
        let result = data.replace(/\\'/g, "'");
        console.log("highRiskDriversDetails List---", data);
        this.highRiskMileageDriverList = this.proxyToObject(result);
        this.driverIsHighRisk =
          this.highRiskMileageDriverList.length > 0 ? true : false;
     
      })
      .catch((error) => {
        console.log("highRiskDriversDetails error", error);
      });
  }

  navigateToMileage() {
    this.dispatchEvent(
      new CustomEvent("mileage", {
        detail: JSON.stringify(this.driverUnapproveList)
      })
    );
  }

  navigateToTeam() {
    this.dispatchEvent(
      new CustomEvent("team", {
        detail: JSON.stringify(this.myTeamList)
      })
    );
  }

  navigateToFlag(event) {
    let target = event.currentTarget.dataset.id;
    let element = this.getElement(this.driverUnapproveList, target);
    const linkEvent = new CustomEvent("access", {
      detail: JSON.stringify(element)
    });
    this.dispatchEvent(linkEvent);
  }

  navigateToUser(event) {
    let target = event.currentTarget.dataset.id;
    let element = this.getElementById(this.myTeamList, target);
    const linkEvent = new CustomEvent("userview", {
      detail: JSON.stringify(element)
    });
    this.dispatchEvent(linkEvent);
  }

  navigateToRisk(event){
    let target = event.currentTarget.dataset.id;
    let element = this.getElementById(this.highRiskMileageDriverList, target);
    const mEvent = new CustomEvent("highriskaccess", {
      detail: JSON.stringify(element)
    });
    this.dispatchEvent(mEvent);
    console.log(event.currentTarget.dataset.id, element)
  }

  navigateToHigh(event){
    let target = event.currentTarget.dataset.id;
    let element = this.getElementById(this.highMileageDriverList, target);
    const mEvent = new CustomEvent("highaccess", {
      detail: JSON.stringify(element)
    });
    this.dispatchEvent(mEvent);
  }

  navigateToHighRiskMileage() {
    this.dispatchEvent(
      new CustomEvent("highrisk", {
        detail: ""
      })
    );
  }

  navigateToHighMileage() {
    this.dispatchEvent(
      new CustomEvent("highmileage", {
        detail: ""
      })
    );
  }

  showAll(){
    this.dispatchEvent(
        new CustomEvent("modal", {
          detail: ''
        })
      );
  }

  handleClose(event) {
    var eId = event.target.dataset.id;
    this.dispatchEvent(
        new CustomEvent("close", {
          detail: eId
        })
      );
  }
}
