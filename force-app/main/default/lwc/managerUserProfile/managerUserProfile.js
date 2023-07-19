/* eslint-disable @lwc/lwc/no-async-operation */
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
  @api role;
  driverUnapproveList;
  driverVisibleList;
  driverRiskList;
  driverMileageList;
  driverTeamVisibleList;
  highRiskMileageDriverList;
  highMileageDriverList;
  complianceList;
  insuranceList;
  locationList;
  headerText = '';
  monthText = '';
  vhHeight = (3 / 5 * 100) + '%';
  margin = [0,0,0,0];
  top = 0;
  bottom = 0;
  myTeamList;
  paginatedModal = false;
  navigation = false;
  isFalse = false;
  isTrue = false;
  driverIsUnapprove = false;
  driverIsMyteam = false;
  driverIsHighMileage = false;
  driverIsHighRisk = false;
  isLocation = false;
  
  /*Get parameters from URL*/
  getUrlParamValue(url, key) {
    return new URL(url).searchParams.get(key);
  }

  @wire(onboardingStatus, {
    managerId: "$contactId",
    accountId: "$accountId",
    role: "$role"
  })
  status({ data, error }) {
    if (data) {
      let result = JSON.parse(data);
      if(typeof result === "object"){
        let isEmptyCompliance = Object.keys(result).length;
        this.complianceList = (isEmptyCompliance > 0) ? data : null;
      }
      console.log("compliance status", data);
    } else {
      console.log("complianceStatus", error);
    }
  }

  @wire(insuranceReport, {
    managerId: "$contactId",
    accountId: "$accountId",
    role:"$role"
  })
  insurance({ data, error }) {
    if (data) {
      let result = JSON.parse(data);
      if(typeof result === "object"){
        let isEmptyInsurance = Object.keys(result).length;
        this.insuranceList = (isEmptyInsurance > 0) ? data : null;
      }
      console.log("insuranceList status", data)
    } else {
      console.log("insuranceList", error);
    }
  }

  @wire(managerContactData, {
    managerId: "$contactId",
    accountId: "$accountId",
    role: "$role"
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
        el.amount = (el.Reimbursement_Frequency__c === "Monthly Reimbursement") ? el.Fixed_Amount__c ? el.Fixed_Amount__c : 0 : el.Half_Fixed_Amount__c ? el.Half_Fixed_Amount__c : 0 ;
        el.address =
          el.MailingCity + ", " + el.MailingState + " " + el.MailingPostalCode;
      });
      this.locationList = dataList;
      this.isLocation = this.locationList.length > 0 ? true : false;
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


  getLocation(){
   // var tablediv = this.template.querySelector("parent");
    this.navigation = true;
    this.margin = undefined;
    this.top = 10;
    this.bottom = 15;
    this.vhHeight = (3 / 7 * 100) + '%';
    this.paginatedModal = true;
    this.headerText = 'My Team Locations';
    // if (this.template.querySelector('c-user-profile-modal')) {
    //       this.template.querySelector('c-user-profile-modal').show();
    //       //if (tablediv.webkitRequestFullscreen) {
    //         //tablediv.webkitRequestFullscreen();
    //     //}
    // }
  }

  exitFullscreen(){
    this.template.querySelector('.parent').classList.remove('overlay-slide-down');
    this.template.querySelector('.parent').classList.add('overlay-slide-up');
    this.paginatedModal = false;
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
    const showIsTeam = this.getUrlParamValue(window.location.href, "showteam");
    let team = showIsTeam === "false" ? false : true;
    getAllDriversLastMonthUnapprovedReimbursementsclone({
      accountId: this.accountId,
      contactId: this.contactId,
      showTeam: team,
      role: this.role
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
      showteam: team,
      role: this.role
    })
      .then((data) => {
        let result = data.replace(/\\'/g, "'");
        this.myTeamList = this.proxyToObject(result);
        this.driverIsMyteam = this.myTeamList.length > 0 ? true : false;
        if (this.myTeamList) {
          this.driverTeamVisibleList =
            this.myTeamList.length > 12
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
       accountId: this.accountId,
       highMileage: true,
       showTeam: team,
       role: this.role
      })
      .then((data) => {
        if(data !== 'No Trips Found More than 250 miles for this contact'){
          let result = data.replace(/\\'/g, "'");
          this.highMileageDriverList = this.proxyToObject(result);
          this.driverIsHighMileage =
            this.highMileageDriverList.length > 0 ? true : false;
            if (this.highMileageDriverList) {
              this.driverMileageList =
                this.highMileageDriverList.length > 7
                  ? this.highMileageDriverList.slice(0, 7)
                  : this.highMileageDriverList;
            }  
        }

        console.log("highMileageDriversDetails List---", data, team);
       
      })
      .catch((error) => {
        console.log("highMileageDriversDetails error", error);
      });

      highRiskDriversDetails({
        managerId: this.contactId,
        accountId: this.accountId,
        highMileage: false,
        showTeam: team,
        role: this.role
      })
      .then((data) => {
        if(data !== 'No Trips Found More than 250 miles for this contact'){
          let result = data.replace(/\\'/g, "'");
          this.highRiskMileageDriverList = this.proxyToObject(result);
          this.driverIsHighRisk =
            this.highRiskMileageDriverList.length > 0 ? true : false;
            if (this.highRiskMileageDriverList) {
              this.driverRiskList =
                this.highRiskMileageDriverList.length > 12
                  ? this.highRiskMileageDriverList.slice(0, 12)
                  : this.highRiskMileageDriverList;
            }
        }
        console.log("highRiskDriversDetails List---", data);
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
    var eId = event.currentTarget.dataset.id;
    this.dispatchEvent(
        new CustomEvent("close", {
          detail: eId
        })
      );
  }
}