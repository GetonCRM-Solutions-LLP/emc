/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, track } from "lwc";
import logo from "@salesforce/resourceUrl/EmcCSS";
import onboardingStatus from "@salesforce/apex/ManagerDashboardController.onboardingStatus";
import insuranceReport from "@salesforce/apex/ManagerDashboardController.insuranceReport";
import getDriverDetailsClone from "@salesforce/apex/DriverDashboardLWCController.getDriverDetailsClone";
import managerContactData from "@salesforce/apex/ManagerDashboardController.managerContactData";
export default class DynamicDashboard extends LightningElement {
  managerProfileMenu = [
    {
      id: 1,
      label: "Charts",
      menuItem: [
        {
          menuId: 101,
          menu: "Compliance",
          menuLabel: "Compliance Status",
          menuClass: "active",
          logo: logo + "/emc-design/assets/images/Icons/PNG/Green/Approval.png",
          logoHov:
            logo + "/emc-design/assets/images/Icons/PNG/White/Approval.png"
        },
        {
          menuId: 102,
          menu: "Insurance",
          menuLabel: "Insurance",
          menuClass: "active",
          logo:
            logo +
            "/emc-design/assets/images/Icons/PNG/Green/Mileage_summary.png",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/PNG/White/Mileage_summary.png"
        },
        {
          menuId: 103,
          menu: "Onboarding",
          menuLabel: "Onboarding Status",
          menuClass: "active",
          logo:
            logo +
            "/emc-design/assets/images/Icons/PNG/Green/Historical_Mileage.png",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/PNG/White/Historical_Mileage.png"
        },
        {
            menuId: 104,
            menu: "Team",
            menuLabel: "My Team Locations",
            menuClass: "",
            logo:
              logo + "/emc-design/assets/images/Icons/PNG/Green/Drivers_list.png",
            logoHov:
              logo + "/emc-design/assets/images/Icons/PNG/White/Drivers_list.png"
          }
      ]
    }
  ];

  section = "main";
  /* logged in user name in navigation menu*/
  userName;

  /* logged in user first name in navigation menu*/
  firstName;

  /* logged in user email in navigation menu*/
  userEmail;

  contactInformation;
  contactTitle;
  _contactId;
  _accountId;
  contactUserId;
  complianceList;
  insuranceList;
  locationList;
  mileageContactName = "";
  isOnboarding = false;
  isTeam = false;
  isInsurance = false;
  compliance = false;
  none = false;
  @track isHomePage = false;
  @wire(onboardingStatus, {
    managerId: "$_contactId"
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
    managerId: "$_contactId"
  })
  insurance({ data, error }) {
    if (data) {
      this.insuranceList = data;
      console.log("insuranceList status", data);
    } else {
      console.log("insuranceList", error);
    }
  }

  @wire(managerContactData, {
    managerId: "$_contactId"
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

  /*Return json to array data */
  proxyToObject(e) {
    return JSON.parse(e);
  }

  /*Get parameters from URL*/
  getUrlParamValue(url, key) {
    return new URL(url).searchParams.get(key);
  }

  /* sidebar open/close arrow navigation event*/
  handleSidebarToggle(event) {
    console.log("From navigation new", event.detail);
    this.section = event.detail === "sidebar close" ? "sidebar-open" : "main";
    this.template
      .querySelector("c-dashboard-profile-header")
      .styleHeader(event.detail);
  }
  /* Logout button event on header*/
  handleLogout() {
    // eslint-disable-next-line no-restricted-globals
    location.href = "/app/secur/logout.jsp";
  }

  viewComplaince(){
    this.compliance = false;
    this.none = (!this.isOnboarding && !this.isTeam && !this.isInsurance && !this.compliance) ? false : true;
  }

  viewInsurance(){
    this.isInsurance = false;
    this.none = (!this.isOnboarding && !this.isTeam && !this.isInsurance && !this.compliance) ? false : true;
  }

  viewLocations(){
    this.isTeam = false;
    this.none = (!this.isOnboarding && !this.isTeam && !this.isInsurance && !this.compliance) ? false : true;
  }

  viewOnboarding(){
    this.isOnboarding = false;
    this.none = (!this.isOnboarding && !this.isTeam && !this.isInsurance && !this.compliance) ? false : true;
  }

  popStateMessage = () => {
    console.log("inside popState", this.lastMonth, this.lastMonthSelected, this.compliance, this.isInsurance);
    const url = new URL(document.location);
    let address = url.hash;
    if (address === "#Compliance") {
        // this.isOnboarding = false;
        // this.isTeam = false;
        // this.isInsurance = false;
        this.compliance = true;
        this.none = true;
    } else if (address === "#Insurance") {
        this.isOnboarding = (this.isOnboarding) ? true : false;
        this.isTeam = (this.isTeam) ? true : false;
        this.isInsurance = true;
        this.none = true;
        this.compliance = (this.compliance) ? true : false;
    } else if (address === "#Team") {
        this.isOnboarding = (this.isOnboarding) ? true : false;
        this.isInsurance = (this.isInsurance) ? true : false;
        this.compliance = (this.compliance) ? true : false;
        this.isTeam = true;
        this.none = true;
    } else if (address === "#Onboarding") {
        this.isOnboarding = true;
        this.compliance = (this.compliance) ? true : false;
        this.isInsurance = (this.isInsurance) ? true : false;
        this.isTeam = (this.isTeam) ? true : false;
        this.none = true;
    } else {
        this.isOnboarding = false;
        this.isTeam = false;
        this.isInsurance = false;
        this.compliance = false;
        this.none = false;
    }
  };

  connectedCallback() {
    /*Get logged in user id */
    const idParamValue = this.getUrlParamValue(window.location.href, "id");
    /*Get logged in user's account id */
    const aidParamValue = this.getUrlParamValue(window.location.href, "accid");
    const showIsTeam = this.getUrlParamValue(window.location.href, "showteam");
    const current = new Date();
    current.setMonth(current.getMonth() - 1);
    const previousMonth = current.toLocaleString("default", { month: "long" });
    this.lastMonth = previousMonth;
    this.lastMonthSelected = this.lastMonth;
    this._contactId = idParamValue;
    this._accountId = aidParamValue;
    this.isTeamShow = showIsTeam;
    this.contactTitle = this.userName;
    this.isProfile = true;
    console.log("Guest", this.isGuestUser);
    window.addEventListener("popstate", this.popStateMessage);

    if (window.location.hash !== "") {
      setTimeout(() => {
        this.popStateMessage();
      }, 10);
    } 
    /*Apex imperatively method call to get contact information */
    getDriverDetailsClone({
      contactId: this._contactId
    })
      .then((data) => {
        if (data) {
          let contactList = this.proxyToObject(data);
          this.contactInformation = data;
          console.log("contact--->", this.contactInformation);
          this.userEmail = contactList[0].External_Email__c;
          this.userName = contactList[0].Name;
          this.firstName = contactList[0].FirstName;
          console.log("Name", this.userName, this.userEmail);
        }
      })
      .catch((error) => {
        console.log("getDriverDetailsClone error", error.message);
      });
  }
}
