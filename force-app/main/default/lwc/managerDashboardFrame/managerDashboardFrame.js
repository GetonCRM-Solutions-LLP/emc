/* eslint-disable radix */
/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable @lwc/lwc/no-api-reassignments */
/* eslint-disable @lwc/lwc/valid-api */
/* eslint-disable @lwc/lwc/no-leading-uppercase-api-name */
import { LightningElement, api, track, wire } from "lwc";
import logo from "@salesforce/resourceUrl/EmcCSS";
import guest from "@salesforce/user/isGuest";
import { loadStyle , loadScript } from 'lightning/platformResourceLoader';
import jQueryMinified from '@salesforce/resourceUrl/jQueryMinified';
import datepicker from '@salesforce/resourceUrl/calendar';
import customMinifiedDP  from '@salesforce/resourceUrl/modalCalDp';
import myTeamDetails from "@salesforce/apex/ManagerDashboardController.myTeamDetails";
import getDriverDetails from "@salesforce/apex/ManagerDashboardController.getDriverDetails";
import getLastMonthReimbursements from "@salesforce/apex/ManagerDashboardController.getLastMonthReimbursements";
import getAllDriversLastMonthUnapprovedReimbursementsclone from "@salesforce/apex/ManagerDashboardController.getAllDriversLastMonthUnapprovedReimbursementsclone";
import getUnapprovedMileages from "@salesforce/apex/ManagerDashboardController.getUnapprovedMileages";
import getMileages from "@salesforce/apex/ManagerDashboardController.getMileages";
import contactReimMonthList from "@salesforce/apex/ManagerDashboardController.contactReimMonthList";
import accountMonthList from "@salesforce/apex/ManagerDashboardController.accountMonthList";
import reimbursementForHighMileageOrRisk from "@salesforce/apex/ManagerDashboardController.reimbursementForHighMileageOrRisk";
import getNotificationMessageList from '@salesforce/apex/ManagerDashboardController.getNotificationMessageList';
import updateNotificationMessage from '@salesforce/apex/ManagerDashboardController.updateNotificationMessage';
import dropdownDriverName from '@salesforce/apex/GetDriverData.getDriverName';
import fetchLookUpValues from '@salesforce/apex/GetDriverData.fetchLookUpValues';
import sendMlogWelcomeEmail from '@salesforce/apex/ResourceController.sendMlogWelcomeEmail';
export default class ManagerDashboardFrame extends LightningElement {
  isGuestUser = guest;
  section = "content-wrapper main";
  /* logged in user name in navigation menu*/
  userName;

  /* logged in user first name in navigation menu*/
  firstName;

  /* logged in user email in navigation menu*/
  userEmail;

  contactInformation;

  contactTitle;
  lastMonth;
  viewTag;
  lastMonthSelected;
  _contactId;
  _accountId;
  contactUserId;
  mileageContactName = "";
  dashboardTitle = "";
  driverProfileName = "";
  defaultYear = '';
  defaultMonth = '';
  listOfDriver;
  myTeamList;
  unreadCount;
  isTeamShow;
  listOfReimbursement;
  unapproveMileages;
  viewMileages;
  nameFilter = "";
  monthSelected = "";
  isProfile = false;
  biweekAccount = false;

  showDriverView = false;
  isDashboard = false;
  mileageApproval = false;
  notificationModal = false;
  singleUser = false;
  teamList = false;
  mileageSummary = false;
  mileageSummaryView = false;
  resources = false;
  mileageView = false;
  menu = false;
  calendarJsInitialised = false;
  notificationViewClicked = false;
  driverName = "";
  unapproveReimbursements = "";
  driverList;
  driverdetail;
  idContact;
  mileageMonthList = "";
  mileageAccountList = "";
  pageSize = 100;
  Statuspicklist = [{label:'All Status',value:'All Status'}];
  monthpicklist ;
  Statusoptions = [];
  teamColumn = [
    {
      id: 1,
      name: "Name",
      colName: "name",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 2,
      name: "Activation Date",
      colName: "activationDate",
      colType: "Date",
      arrUp: false,
      arrDown: false
    },
    {
      id: 3,
      name: "Fixed Amount",
      colName: "fixedamount",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    }
  ];
  teamKeyFields = ["name", "activationDate", "fixedamount"];

  summaryColumn = [
    {
      id: 1,
      name: "Name",
      colName: "name",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 2,
      name: "Approved",
      colName: "approvedMileages",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    },
    {
      id: 3,
      name: "Flagged",
      colName: "rejectedMileages",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    },
    {
      id: 4,
      name: "Total Mileage",
      colName: "totalMileages",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    }
  ];
  summaryKeyFields = [
    "name",
    "approvedMileages",
    "rejectedMileages",
    "totalMileages"
  ];

  summaryDetailColumn = [
    {
      id: 1,
      name: "Trip Date",
      colName: "tripdate",
      colType: "Date",
      arrUp: false,
      arrDown: false
    },
    {
      id: 2,
      name: "Origin",
      colName: "originname",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 3,
      name: "Destination",
      colName: "destinationname",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 4,
      name: "Submitted",
      colName: "submitteddate",
      colType: "Date",
      arrUp: false,
      arrDown: false
    },
    {
      id: 5,
      name: "Status",
      colName: "status",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 6,
      name: "Mileage",
      colName: "mileage",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    },
    {
      id: 7,
      name: "Amount",
      colName: "variableamount",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    }
  ];
  summaryDetailKeyFields = [
    "tripdate",
    "originname",
    "destinationname",
    "submitteddate",
    "status",
    "mileage",
    "variableamount"
  ];

  @track isHomePage = false;
  @track isNotify = false;
  @track notifyList;
  @track notificationList;
  @api showTeam;
  @api userRole;
  @api managerId;
  @api profile;
  @api mileageRecord;
  @api customSetting;
  @api driverMeeting;
  monthoption = [];
 
  managerProfileMenu = [
    {
      id: 1,
      label: "Mileage",
      menuItem: [
        {
          menuId: 101,
          menu: "Mileage-Approval",
          menuLabel: "Approval",
          menuClass: "active",
          logo: logo + "/emc-design/assets/images/Icons/SVG/Green/Approval.svg#approval",
          logoHov: logo + "/emc-design/assets/images/Icons/SVG/White/Approval.svg#approval"
        },
        {
          menuId: 102,
          menu: "Mileage-Summary",
          menuLabel: "Summary",
          menuClass: "active",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Mileage_summary.svg#summary",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/SVG/White/Mileage_summary.svg#summary"
        },
        {
          menuId: 103,
          menu: "Mileage-Preview",
          menuLabel: "Preview",
          menuClass: "active",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Historical_Mileage.svg#historical",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/SVG/White/Historical_Mileage.svg#historical"
        }
      ]
    },
    {
      id: 2,
      label: "Plan management",
      menuItem: [
        {
          menuId: 201,
          menu: "Team",
          menuLabel: "Team",
          menuClass: "",
          logo:
            logo + "/emc-design/assets/images/Icons/SVG/Green/Drivers_list.svg#drivers",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Drivers_list.svg#drivers"
        }
      ]
    },
    {
      id: 3,
      label: "Help & info",
      menuItem: [
        {
          menuId: 301,
          menu: "Notifications",
          menuLabel: "Notifications",
          menuClass: "",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Notifications.svg#notification",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Notifications.svg#notification"
        },
        {
          menuId: 302,
          menu: "Videos",
          menuLabel: "Videos/Training",
          menuClass: "",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Driver_Videos_Training.svg#videos",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/SVG/White/Driver_Videos_Training.svg#videos"
        }
      ]
    }
  ];

  //selectList = [];
  selectList = [
    {
      id: 1,
      label: "January",
      value: "January"
    },
    {
      id: 2,
      label: "February",
      value: "February"
    },
    {
      id: 3,
      label: "March",
      value: "March"
    },
    {
      id: 4,
      label: "April",
      value: "April"
    },
    {
      id: 5,
      label: "May",
      value: "May"
    },
    {
      id: 6,
      label: "June",
      value: "June"
    },
    {
      id: 7,
      label: "July",
      value: "July"
    },
    {
      id: 8,
      label: "August",
      value: "August"
    },
    {
      id: 9,
      label: "September",
      value: "September"
    },
    {
      id: 10,
      label: "October",
      value: "October"
    },
    {
      id: 11,
      label: "November",
      value: "November"
    },
    {
      id: 12,
      label: "December",
      value: "December"
    }
  ];

  yearList = [];
    
  monthList = [
      {
        id: 1,
        label: "January",
        value: "January"
      },
      {
        id: 2,
        label: "February",
        value: "February"
      },
      {
        id: 3,
        label: "March",
        value: "March"
      },
      {
        id: 4,
        label: "April",
        value: "April"
      },
      {
        id: 5,
        label: "May",
        value: "May"
      },
      {
        id: 6,
        label: "June",
        value: "June"
      },
      {
        id: 7,
        label: "July",
        value: "July"
      },
      {
        id: 8,
        label: "August",
        value: "August"
      },
      {
        id: 9,
        label: "September",
        value: "September"
      },
      {
        id: 10,
        label: "October",
        value: "October"
      },
      {
        id: 11,
        label: "November",
        value: "November"
      },
      {
        id: 12,
        label: "December",
        value: "December"
      }
  ]

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
    this.section = (event.detail === 'sidebar') ? 'content-wrapper sidebar-open' : 'content-wrapper main';
    this.template
      .querySelector("c-dashboard-profile-header")
      .styleHeader(event.detail);
  }
  /* Logout button event on header*/
  handleLogout() {
    // eslint-disable-next-line no-restricted-globals
    location.href = "/app/secur/logout.jsp";
  }

  @wire(getDriverDetails, {
    managerId:'$managerId'
  })userInfo({data,error}) {
      if (data) {
        this.contactInformation = data;
        let contact = JSON.parse(data)
        this.driverdetail = data;
        this.userEmail = contact[0].External_Email__c;
        this.userName = contact[0].Name;
        this.firstName = contact[0].FirstName;
        this.biweekAccount = contact[0].Account.Bi_Weekly_Pay_Period__c;
        console.log("getDriverDetails###", JSON.parse(data))
      }else if(error){
          console.log("getDriverDetails error", error.message)
      }
  }

  async handleNotification(event) {
    // eslint-disable-next-line radix
    var rd = event.detail;
    this.unreadCount = 0
    console.log(rd, this.defaultYear, this.defaultMonth)
    await updateNotificationMessage({msgId: rd, year: this.defaultYear, month: this.defaultMonth}).then((data) => { 
        let  result = data
        let notification = this.proxyToObject(result);
        this.notifyList = notification;
        this.notificationList = this.notifyList.slice(0, 1);
        for (let i = 0; i < this.notifyList.length; i++) {
            if (this.notifyList[i].unread === true) {
              this.unreadCount++;
            }
        }
        this.isNotify = (this.notifyList.length > 0) ? true : false
        console.log("Notification", notification, result, this.unreadCount)
    }).catch(error=>{console.log(error)})
  }

  modifyUrl(title, url) {
    if (typeof (history.pushState) != "undefined") {
     let obj = {
      Title: title,
      Url: url
     };
     history.pushState(obj, obj.Title, obj.Url);
    }
   }

  handleClose(event) {
      // console.log("id", event.target.dataset.id)
      // eslint-disable-next-line radix
      var eId = event.currentTarget.dataset.id;
      console.log("MEssage id", eId)
    //  this.unreadCount = 0
        for (let i = 0; i < this.notifyList.length; i++) {
          if (this.notifyList[i].id === eId) {
              this.notifyList.splice(i, 1);
              this.unreadCount = this.unreadCount - 1;
          }
      }
      this.notificationList = this.notifyList.slice(0, 1);
      this.isNotify = (this.notifyList.length > 0) ? true : false;
      updateNotificationMessage({msgId: eId, year: this.defaultYear, month: this.defaultMonth}).then((data) => { 
          let  result = data
          console.log("Notification", result, this.unreadCount)
      }).catch(error=>{console.log(error)})
  }


  viewAllNotification() {
      this.notificationViewClicked = true;
      this.headerModalText = 'Notifications';
      this.modalClass = "slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__delay-1s"
      this.headerClass = "slds-modal__header header-preview slds-p-left_xx-large slds-clearfix"
      this.subheaderClass = "slds-text-heading slds-hyphenate slds-float_left"
      this.modalContent = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
      this.styleHeader = "slds-modal__container slds-m-top_medium"
      this.styleClosebtn = "close-notify"
      // eslint-disable-next-line no-restricted-globals
      this.notificationModal = true;
        setTimeout(()=>{
            this.notificationViewClicked = false;
        }, 1000)
  }

  getContactNotification(){
    var notification = [], result;
    this.unreadCount = 0;
    getNotificationMessageList({
      conId: this._contactId,
      year: parseInt(this.defaultYear),
      month: this.defaultMonth
    }).then((data) => { 
        result = data
        notification = this.proxyToObject(result);
        this.notifyList = notification;
        this.notificationList = this.notifyList.slice(0, 1);
        for (let i = 0; i < this.notifyList.length; i++) {
            if (this.notifyList[i].unread === true) {
              this.unreadCount++;
            }
        }
      //  this.notificationList = notification;
        this.isNotify = (this.notifyList.length > 0) ? true : false
        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent("hide", {
                    detail: "spinner"
                })
            );
        }, 100);
       console.log("Notification", notification, result, this.unreadCount)
    }).catch(error=>{console.log(error)})
  
  }

  getMileageList(event) {
    this.isProfile = false;
    this.isDashboard = false;
    this.notificationViewClicked = false;
    this.contactTitle = "Unapproved Mileage";
   this.isHomePage = false;
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Approval";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Approval");
    this.listOfDriver = event.detail;
  }

  getMyTeamList(event) {
    console.log('event My Team', event);
    this.isProfile = false;
    this.mileageApproval = false;
    this.resources = false;
    this.notificationViewClicked = false;
    this.isDashboard = false;
    this.teamList = true;
    this.contactTitle = "My Team";
   this.isHomePage = false;
    window.location.href =
      location.origin + location.pathname + location.search + "#Team";
    this.template.querySelector("c-navigation-menu").toggleStyle("Team");
    this.myTeamList = event.detail;
    console.log("My team", this.myTeamList);
  }

  redirectToMileage(event) {
    if(event.detail !== 'Dashboard'){    
      this.isProfile = false;
      this.isDashboard = false;
      this.mileageApproval = true;
      this.notificationViewClicked = false;
      this.contactTitle = "Unapproved Mileage";
    this.isHomePage = false;
      window.location.href =
        location.origin +
        location.pathname +
        location.search +
        "#Mileage-Approval";
      this.template
        .querySelector("c-navigation-menu")
        .toggleStyle("Mileage-Approval");
    }else{
      document.title = "Admin Dashboard";
      let url =  location.origin + location.pathname + location.search
      this.contactTitle = this.userName;
      this.notificationModal = false;
      this.notificationViewClicked = false;
      this.mileageView = false;
      this.showDriverView = false;
      this.showUsers = false;
      this.showTools = false;
      this.showReports = false;
      this.reportDetail = false;
      this.resources = false;
      this.isHomePage = false;
      this.isProfile = true;
      this.isDashboard = false;
      this.template.querySelector('c-navigation-menu').toggleStyle('');
      this.modifyUrl(document.title, url)
    }
  }

  redirectToSummary(event) {
    if(event.detail !== 'Dashboard'){
    this.isProfile = false;
    this.mileageApproval = false;
    this.resources = false;
    this.isDashboard = false;
    this.mileageSummaryView = false;
    this.notificationViewClicked = false;
    this.mileageSummary = true;
    this.contactTitle = this.viewTag;
    let hasVal = (this.viewTag === 'High Risk') ? '#Mileage-Summary-Risk' : (this.viewTag === 'High Mileage') ? '#Mileage-Summary-High' : '#Mileage-Summary';
    console.log("Address---", this.viewTag)
    this.isHomePage = false;
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      hasVal
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Summary");
    }else{
      document.title = "Admin Dashboard";
      let url =  location.origin + location.pathname + location.search
      this.contactTitle = this.userName;
      this.notificationModal = false;
      this.notificationViewClicked = false;
      this.mileageView = false;
      this.showDriverView = false;
      this.showUsers = false;
      this.showTools = false;
      this.showReports = false;
      this.reportDetail = false;
      this.resources = false;
      this.isHomePage = false;
      this.isProfile = true;
      this.isDashboard = false;
      this.template.querySelector('c-navigation-menu').toggleStyle('');
      this.modifyUrl(document.title, url)
    } 
  }

  redirectToHighRiskMileage() {
    this.isProfile = false;
    this.mileageApproval = false;
    this.resources = false;
    this.mileageSummaryView = false;
    this.notificationViewClicked = false;
    this.isDashboard = false;
    this.mileageSummary = true;
    this.lastMonthSelected = this.lastMonth;
    this.contactTitle = "High Risk";
   this.isHomePage = false;
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Summary-Risk";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Summary");
  }

  redirectToRiskMileage(event){
    this.viewTag = 'High Risk';
    let detailList = JSON.parse(event.detail);
    let contactId = detailList.id;
    this.contactUserId = contactId;
    this.mileageContactName = detailList.name;
    this.notificationViewClicked = false;
    this.isHomePage = false;
    this.isProfile = false;
    this.mileageApproval = false;
    this.resources = false;
    this.mileageSummary = false;
    this.isDashboard = true;
    this.mileageSummaryView = true;
    this.viewMileages = "";
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Summary-Detail";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Summary");
    console.log("event--", contactId, event.detail);
    contactReimMonthList({
      contactId: contactId
    })
      .then((data) => {
        let objList = JSON.parse(data)
        let monthName = data ? ((objList.length > 1) ? ((objList[0] === this.defaultMonth) ? objList[1] : objList[0]): objList[0]) : "";
        let mileageMonth = data ? this.removeDuplicateValue(this.proxyToObject(data)) : [];
        this.mileageMonthList = this.review(mileageMonth);
        this.monthSelected = monthName ? monthName : "";
        this.contactTitle = "High Risk " + this.monthSelected + " Mileage For " + detailList.name;
        this.dashboardTitle = this.contactTitle;
        this.getListMileages(contactId, this.monthSelected);
        console.log(
          "contactReimMonthList Data",
          data,
          this.monthSelected,
          this.mileageMonthList
        );
      })
      .catch((error) => {
        console.log("contactReimMonthList error", error);
      });
  }

  redirectMileage(event){
    this.viewTag = 'High Mileage';
    let detailList = JSON.parse(event.detail);
    let contactId = detailList.id;
    this.contactUserId = contactId;
    this.mileageContactName = detailList.name;
    this.isHomePage = false;
    this.isProfile = false;
    this.notificationViewClicked = false;
    this.mileageApproval = false;
    this.resources = false;
    this.mileageSummary = false;
    this.mileageSummaryView = true;
    this.isDashboard = true;
    this.viewMileages = "";
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Summary-Detail";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Summary");
    console.log("event--", contactId, event.detail);
    contactReimMonthList({
      contactId: contactId
    })
      .then((data) => {
        let objList = JSON.parse(data)
        let monthName = data ? ((objList.length > 1) ? ((objList[0] === this.defaultMonth) ? objList[1] : objList[0]): objList[0]) : "";
        let mileageMonth = data ? this.removeDuplicateValue(this.proxyToObject(data)) : [];
        this.mileageMonthList = this.review(mileageMonth);
        this.monthSelected = monthName ? monthName : "";
        this.contactTitle =
          detailList.name + " " + this.monthSelected + " Mileage";
        this.dashboardTitle = this.contactTitle;
        this.getListMileages(contactId, this.monthSelected);
        console.log(
          "contactReimMonthList Data",
          data,
          this.monthSelected,
          this.mileageMonthList
        );
      })
      .catch((error) => {
        console.log("contactReimMonthList error", error);
      });
  }


  redirectToHighMileage(){
    this.isProfile = false;
    this.mileageApproval = false;
    this.mileageSummaryView = false;
    this.resources = false;
    this.notificationViewClicked = false;
    this.mileageSummary = true;
    this.isDashboard = false;
    this.contactTitle = "High Mileage";
   this.isHomePage = false;
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Summary-High";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Summary");
  }

  handleMonthYearRender(event){
    const url = new URL(document.location);
    let params = new URL(document.location).searchParams;
    let address = url.hash;
    let showteam = params.get("showteam");
    let v = showteam === "false" ? false : true;
    let boolean = (address === "#Mileage-Summary-High") ? true : false;
    this.lastMonthSelected = event.detail;
    console.log(this.lastMonthSelected, event.detail);
    if(address === '#Mileage-Summary'){
      this.getAllReimbursement(v, this.lastMonthSelected);
    }else{
      this.getMileageHighRisk(v, boolean, event.detail);
    }
  }

  getMileageHighRisk(boolean, v, monthName) {
    console.log("Mileage risk", boolean, v, monthName, this.lastMonthSelected)
    const url = new URL(document.location);
    let address = url.hash;
    this.notificationViewClicked = false;
    this.lastMonthSelected = (this.lastMonthSelected === undefined) ? monthName : this.lastMonthSelected;
    this.listOfReimbursement = "";
    let column = [{
          id: 1,
          name: "Name",
          colName: "name",
          colType: "String",
          arrUp: false,
          arrDown: false
        },
        {
          id: 2,
          name: "Approved",
          colName: "highRiskTotalApproved",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        },
        {
          id: 3,
          name: "Flagged",
          colName: "highRiskTotalRejected",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        },
        {
          id: 4,
          name: "Total Mileage",
          colName: "totalHighRiskMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        }
    ];
    let columnKeyFields = [
        "name",
        "highRiskTotalApproved",
        "highRiskTotalRejected",
        "totalHighRiskMileages"
    ];

    let columnA = [{
          id: 1,
          name: "Name",
          colName: "name",
          colType: "String",
          arrUp: false,
          arrDown: false
        },
        {
          id: 2,
          name: "Approved",
          colName: "approvedMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        },
        {
          id: 3,
          name: "Flagged",
          colName: "rejectedMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        },
        {
          id: 4,
          name: "Total Mileage",
          colName: "totalMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        }
    ];

    let columnAKeyFields = [
        "name",
        "approvedMileages",
        "rejectedMileages",
        "totalMileages"
    ];

    this.summaryColumn = (address === "#Mileage-Summary-Risk") ? column : columnA;
    this.summaryKeyFields = (address === "#Mileage-Summary-Risk") ? columnKeyFields : columnAKeyFields;
    reimbursementForHighMileageOrRisk({
      managerId: this._contactId,
      accountId: this._accountId,
      month: monthName,
      showteam: boolean,
      highMileage: v,
      role: this.userRole
    })
      .then((data) => {
        console.log("reimbursementForHighMileageOrRisk Method", data);
        let resData = data.replace(/\\/g, "");
        this.listOfReimbursement = resData;
      })
      .catch((error) => {
        console.log("reimbursementForHighMileageOrRisk error", error);
      });
  }

  getUnapproveMileage(event) {
    var arrayInput, original, filterList;
    // this.dispatchEvent(
    //     new CustomEvent("show", {
    //         detail: "spinner"
    //     })
    // );
    console.log("Unapproved-->", JSON.stringify(event.detail.message));
    this.contactTitle = "Unapproved Mileage";
    this.nameFilter = event.detail.type;
   this.isHomePage = false;
   this.singleUser = false;
   this.notificationViewClicked = false;
   this.isDashboard = (event.detail.target) ? true : false;
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Approval-Flag";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Approval");
    this.unapproveMileages = "";
    this.unapproveReimbursements = (event.detail.data) ? event.detail.data : event.detail.message;
    getUnapprovedMileages({
      reimbursementDetails: (event.detail.data) ? event.detail.data : event.detail.message,
      accountId: this._accountId
    })
      .then((data) => {
        console.log("MEthod", data);
        let resData = data.replace(/\\/g, "");
        // this.notificationModal = false;
        // this.isProfile = false;
        // this.mileageApproval = false;
        // this.mileageSummary = false;
        // this.mileageSummaryView = false;
        // this.teamList = false;
        // this.mileageView = false;
        // this.showDriverView = false;
        arrayInput = this.proxyToObject(resData);
        original = arrayInput;

        if (event.detail.type === "High Risk") {
          filterList = arrayInput.mileagesList.filter(function (b) {
            return b.highRiskMileage === true;
          });
          this.unapproveMileages = JSON.stringify(filterList);
        } else {
          filterList = original.mileagesList;
          this.unapproveMileages = JSON.stringify(filterList);
        }
        this.driverName = arrayInput.name;

        console.log("driver unapprove mileage---", arrayInput);
        // this.dispatchEvent(
        //     new CustomEvent("hide", {
        //         detail: "spinner"
        //     })
        // );
      })
      .catch((error) => {
        console.log("getUnapproveMileages error", error);
      });
  }
		
	 escapeSpecialChars(str){
    return str
    .replace(/\\'/g, "\'")
    .replace(/\\&#39;/g, "\'")
    .replace(/(&quot\;)/g,"\"")
    .replace(/\\\\|\'/g,"\\")
    .replace(/\\s/g,"\'");
  }

  getListMileages(contactId, month) {
    var arrayList, filterList, original, year;
    const current = new Date();
    year = (current.getFullYear()).toString();
    getMileages({
      clickedMonth: month,
      clickedYear: year,
      did: contactId
    })
      .then((data) => {
       // var pattern = /\\\\|\'/g;
       // var resultdata = data.replace(pattern, "\\");
				let resultdata = this.escapeSpecialChars(data);
        arrayList = this.proxyToObject(resultdata);
        original = this.proxyToObject(resultdata);
        if (this.viewTag === "High Risk") {
          filterList = arrayList.filter(function (b) {
            return b.highRiskMileage === true;
          });
          
          this.viewMileages = JSON.stringify(filterList);
        } else {
          filterList = original;
          this.viewMileages = JSON.stringify(filterList);
        }
       // this.viewMileages = arrayList;
        console.log("getMileage Data", data, this.viewMileages);
      })
      .catch((error) => {
        console.log("getMileage error", error);
      });
  }

  removeDuplicateValue(myArray) {
    var newArray = [];
    myArray.forEach((value) => {
        var exists = false;
        newArray.forEach((val2) => {
            if (value === val2) {
                exists = true;
            }
        })

        if (exists === false && value !== "") {
            newArray.push(value);
        }
    })

    return newArray;
  }

  review(a) {
    if (a) {
      let monthA = a,
        array = [];
      for (let i = 0; i < monthA.length; i++) {
        let obj = {};
        obj.id = i + 1;
        obj.label = monthA[i];
        obj.value = monthA[i];
        array.push(obj);
      }

      return JSON.stringify(array);
    }
    return a;
  }

  refreshDetailSummary(event) {
    console.log("Detail---", event.detail, this.contactUserId);
    this.viewMileages = "";
    this.monthSelected = event.detail;
    this.notificationViewClicked = false;
    this.contactTitle = (this.viewTag === 'High Risk') ? "High Risk " + this.monthSelected + " Mileage For " + this.mileageContactName : 
                        this.mileageContactName + " " + this.monthSelected + " Mileage"
    this.getListMileages(this.contactUserId, event.detail);
  }

  replaceToFirst(array, el){
    let element = JSON.parse(el)
    const index = array.findIndex(x => x.contactid === element.contactid);
    var newArray = []
    if (index !== -1) {
      const items = array.splice(index, 1);
     // array.splice(index, 1);
      newArray.splice(0, 0, ...items);
    }

    return JSON.stringify(newArray)
  }

  getMileage(event) {
    console.log("Title", this.contactTitle)
    this.viewTag = this.contactTitle;
    let detailList = JSON.parse(event.detail);
    let contactId = detailList.contactid;
    this.contactUserId = contactId;
    this.mileageContactName = detailList.name;
    this.isHomePage = false;
    this.isProfile = false;
    this.mileageApproval = false;
    this.resources = false;
    this.notificationViewClicked = false;
    this.mileageSummary = false;
    this.mileageSummaryView = true;
    this.viewMileages = "";
    window.location.href =
      location.origin +
      location.pathname +
      location.search +
      "#Mileage-Summary-Detail";
    this.template
      .querySelector("c-navigation-menu")
      .toggleStyle("Mileage-Summary");
    console.log("event--", contactId, event.detail);
    contactReimMonthList({
      contactId: contactId
    })
      .then((data) => {
        let objList = JSON.parse(data)
        let monthName = data ? ((objList.length > 1) ? ((objList[0] === this.defaultMonth) ? objList[1] : objList[0]): objList[0]) : "";
        let mileageMonth = data ? this.removeDuplicateValue(this.proxyToObject(data)) : [];
        this.mileageMonthList = this.review(mileageMonth);
        this.monthSelected = monthName ? monthName : "";
        this.contactTitle = (this.viewTag === 'High Risk') ?  "High Risk " + this.monthSelected + " Mileage For " + detailList.name : 
          detailList.name + " " + this.monthSelected + " Mileage";
        this.dashboardTitle = this.contactTitle;
        this.getListMileages(contactId, this.monthSelected);
        console.log(
          "contactReimMonthList Data",
          data,
          this.monthSelected,
          this.mileageMonthList
        );
      })
      .catch((error) => {
        console.log("contactReimMonthList error", error);
      });
  }

  showSpinner(event) {
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: event.detail
      })
    );
  }

  hideSpinner(event) {
    this.dispatchEvent(
      new CustomEvent("hide", {
        detail: event.detail
      })
    );
  }

  showLoader(event) {
    this.dispatchEvent(
      new CustomEvent("spinnershow", {
        detail: event.detail
      })
    );
  }

  hideLoader(event) {
    this.dispatchEvent(
      new CustomEvent("spinnerhide", {
        detail: event.detail
      })
    );
  }

  showToast(event) {
    this.dispatchEvent(
      new CustomEvent("toast", {
        detail: event.detail
      })
    );
  }

  handleComplete() {
    var arrayInput;
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "spinner"
      })
    );
    this.unapproveMileages = "";
    let team = this.isTeamShow === "false" ? false : true;
    getAllDriversLastMonthUnapprovedReimbursementsclone({
      accountId: this._accountId,
      contactId: this._contactId,
      showTeam: team,
      role: this.userRole
    })
      .then((b) => {
        let resultDriver = b.replace(/\\'/g, "'");
        this.userOfDriver = resultDriver;
        this.listOfDriver = resultDriver;
        this.singleUser = true;
        if(resultDriver.length > 0){
          this.listOfDriver =  this.replaceToFirst(JSON.parse(resultDriver), event.detail);
        }else{
          this.listOfDriver = resultDriver;
        }
      })
      .catch((error) => {
        console.log(
          "getAllDriversLastMonthUnapprovedReimbursementsclone error",
          error
        );
        this.dispatchEvent(
          new CustomEvent("hide", {
            detail: "spinner"
          })
        );
      });

    if (this.unapproveReimbursements) {
      getUnapprovedMileages({
        reimbursementDetails: this.unapproveReimbursements,
        accountId: this._accountId
      })
        .then((data) => {
          console.log("driver unapprove mileage 4---", data);
          this.isProfile = false;
          this.mileageApproval = false;
          arrayInput = this.proxyToObject(data);
          this.driverName = arrayInput.name;
          this.unapproveMileages = JSON.stringify(arrayInput.mileagesList);
          console.log(
            "driver unapprove mileage 4---",
            this.unapproveMileages,
            arrayInput
          );
          this.dispatchEvent(
            new CustomEvent("hide", {
              detail: "spinner"
            })
          );
        })
        .catch((error) => {
          console.log("getUnapproveMileages error", error);
          this.dispatchEvent(
            new CustomEvent("hide", {
              detail: "spinner"
            })
          );
        });
    }
  }

  refreshSync(){
    var arrayInput;
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "spinner"
      })
    );
    this.unapproveMileages = "";
    console.log(this._accountId, this._contactId)
    let team = this.isTeamShow === "false" ? false : true;
    getAllDriversLastMonthUnapprovedReimbursementsclone({
      accountId: this._accountId,
      contactId: this._contactId,
      showTeam: team,
      role: this.userRole
    })
      .then((b) => {
        let resultDriver = b.replace(/\\'/g, "'");
        this.listOfDriver = resultDriver;
      })
      .catch((error) => {
        console.log(
          "getAllDriversLastMonthUnapprovedReimbursementsclone error",
          error
        );
        this.dispatchEvent(
          new CustomEvent("hide", {
            detail: "spinner"
          })
        );
      });

    if (this.unapproveReimbursements) {
      getUnapprovedMileages({
        reimbursementDetails: this.unapproveReimbursements,
        accountId: this._accountId
      })
        .then((data) => {
          console.log("driver unapprove mileage 4---", data);
          this.isProfile = false;
          this.mileageApproval = false;
          arrayInput = this.proxyToObject(data);
          this.driverName = arrayInput.name;
          this.unapproveMileages = JSON.stringify(arrayInput.mileagesList);
          console.log(
            "driver unapprove mileage 4---",
            this.unapproveMileages,
            arrayInput
          );
          this.dispatchEvent(
            new CustomEvent("hide", {
              detail: "spinner"
            })
          );
        })
        .catch((error) => {
          console.log("getUnapproveMileages error", error);
          this.dispatchEvent(
            new CustomEvent("hide", {
              detail: "spinner"
            })
          );
        });
    }
  }

  handleSyncDone(){
    clearTimeout(this.timeoutId); // no-op if invalid id
    this.timeoutId = setTimeout(this.refreshSync.bind(this), 6000);
  }

  getAllReimbursement(boolean, m) {
      this.listOfReimbursement = "";
      this.summaryColumn = [
        {
          id: 1,
          name: "Name",
          colName: "name",
          colType: "String",
          arrUp: false,
          arrDown: false
        },
        {
          id: 2,
          name: "Approved",
          colName: "approvedMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        },
        {
          id: 3,
          name: "Flagged",
          colName: "rejectedMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        },
        {
          id: 4,
          name: "Total Mileage",
          colName: "totalMileages",
          colType: "Decimal",
          arrUp: false,
          arrDown: false
        }
      ];
      this.summaryKeyFields = [
        "name",
        "approvedMileages",
        "rejectedMileages",
        "totalMileages"
      ];
      getLastMonthReimbursements({
        accountId: this._accountId,
        contactId: this._contactId,
        showTeam: boolean,
        month: m,
        role: this.userRole
      })
      .then((b) => {
        let driverResult = b.replace(/\\'/g, "'");
        this.listOfReimbursement = driverResult;
        console.log(
          "List of getAllDriversLastMonthReimbursements",
          this.listOfReimbursement
        );
      })
      .catch((error) => {
        console.log("getAllDriversLastMonthReimbursements error", error);
      });
  }

  getAllUnapprove(boolean) {
    getAllDriversLastMonthUnapprovedReimbursementsclone({
      accountId: this._accountId,
      contactId: this._contactId,
      showTeam: boolean,
      role: this.userRole
    })
      .then((b) => {
        let resultDriver = b.replace(/\\'/g, "'");
        this.listOfDriver = resultDriver;
      })
      .catch((error) => {
        console.log(
          "getAllDriversLastMonthUnapprovedReimbursementsclone error",
          error
        );
      });
  }



  getDriverList(){
    var parsedaata, driverlist = [] ;
      dropdownDriverName({accountId: this._accountId,managerId: this._contactId,role:this.userRole })
      .then((data) => {
        console.log("driverdropdown",JSON.parse(data))
        parsedaata = JSON.parse(data)
        let i = 2;
        for(let key in parsedaata) {
          if (Object.prototype.hasOwnProperty.call(parsedaata, key)) {
            i = i+1;
            driverlist.push({Id: i,label:`${parsedaata[key]}`,value:key})
          }
        }
        this.driverdetail =  JSON.parse(JSON.stringify(this.removeDuplicate(driverlist , it => it.label)));
       
        console.log("driverlist",this.driverdetail)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  getStatus(){
    fetchLookUpValues({
      accId:this._accountId,
      adminId:'',
      accField:'EmployeeReimbursement__r.Contact_Id__r.AccountId',
      searchKey: 'Trip_Status__c',
      idOfDriver: '',
      fieldName: 'Trip_Status__c',
      ObjectName: 'Employee_Mileage__c',
      keyField: 'Id',
      whereField: '',
      isActive: ''
    }) 
    .then((result) => {
      let data = JSON.parse( JSON.stringify( result ) ).sort( ( a, b ) => {
        a = a.Trip_Status__c ? a.Trip_Status__c.toLowerCase() : ''; // Handle null values
        b = b.Trip_Status__c ? b.Trip_Status__c.toLowerCase() : '';
        return a > b ? 1 : -1;
      });;
      let i=0;
      data.forEach(element => {
        if(element.Trip_Status__c !== undefined){
          i = i + 1;
          this.Statuspicklist.push({Id: i ,label:element.Trip_Status__c,value:element.Trip_Status__c})
        }
      });
      this.Statusoptions = JSON.parse(JSON.stringify(this.removeDuplicate(this.Statuspicklist , it => it.value)));
      console.log("this.Statusoptions",this.Statusoptions)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  removeDuplicate(data , key){
    return [
      ... new Map(
        data.map(x => [key(x) , x])
      ).values()
    ]
  }

  getAccountMonthList() {
    accountMonthList({
      accountId: this._accountId
    }).then((data) => {
      if (data) {
        let mileageAccount = data ? this.removeDuplicateValue(this.proxyToObject(data)) : [];
        this.mileageAccountList = this.review(mileageAccount);
        console.log("Month---", this.mileageAccountList);
      }
    });
  }

  handleToastMessage(event){
    this.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          type: event.detail.errormsg,
          message:event.detail.message
        } 
      })
    );
  }

  getAllTeam(boolean) {
    myTeamDetails({
      managerId: this._contactId,
      accountId: this._accountId,
      showteam: boolean,
      role: this.userRole
    })
      .then((data) => {
        let result = data.replace(/\\'/g, "'");
        this.myTeamList = result;
        console.log("myTeamDetails List---", data);
      })
      .catch((error) => {
        console.log("myTeamDetails error", error);
      });
  }

  redirectToDriverView(event){
    this.notificationViewClicked = false;
    this.isDashboard = (event.detail.target) ? true : false;
    let contactDetail = (event.detail.message) ? JSON.parse(event.detail.message) : JSON.parse(event.detail)
    this.idContact = contactDetail.id;
    this.driverProfileName = contactDetail.name;
    this.contactTitle = contactDetail.name;
    document.title = "Team";
    window.location.href = location.origin + location.pathname + location.search + '#Driver-view'
  }

  redirectToUser(event){
    console.log(event.detail);
    this.notificationViewClicked = false;
    let contactDetail = JSON.parse(event.detail)
    this.idContact = contactDetail.id;
    this.driverProfileName = contactDetail.name;
    this.contactTitle = contactDetail.name;
    document.title = "Team";
    window.location.href = location.origin + location.pathname + location.search + '#Driver-view'
    this.template
    .querySelector("c-navigation-menu")
    .toggleStyle("Team");
  }

  redirectToMyTeam(event){
    if(event.detail !== 'Dashboard'){
    this.isProfile = false;
    this.mileageApproval = false;
    this.resources = false;
    this.mileageView = false;
    this.notificationViewClicked = false;
    this.mileageSummary = false;
    this.mileageSummaryView = false;
    this.teamList = true;
    this.showDriverView = false;
    this.isDashboard = false;
    this.contactTitle = "My Team";
    this.isHomePage = true;
      window.location.href =
        location.origin +
        location.pathname +
        location.search +
        "#Team";
      this.template
        .querySelector("c-navigation-menu")
        .toggleStyle("Team");
    }else{
      document.title = "Admin Dashboard";
      let url =  location.origin + location.pathname + location.search
      this.contactTitle = this.userName;
      this.notificationModal = false;
      this.notificationViewClicked = false;
      this.mileageView = false;
      this.showDriverView = false;
      this.showUsers = false;
      this.showTools = false;
      this.showReports = false;
      this.reportDetail = false;
      this.resources = false;
      this.isHomePage = false;
      this.isProfile = true;
      this.isDashboard = false;
      this.template.querySelector('c-navigation-menu').toggleStyle('');
      this.modifyUrl(document.title, url)
    }
  }

  popStateMessage = (event) => {
    console.log("inside popState", this.lastMonth, this.lastMonthSelected);
    const url = new URL(document.location);
    const state = window.performance.getEntriesByType("navigation")[0].type;
    console.log("Main---->", url.hash, event);
    let params = new URL(document.location).searchParams;
    let address = url.hash;
    let showteam = params.get("showteam");
    let v = showteam === "false" ? false : true;
    console.log("inside popState", address);
    if (address === "#Mileage-Approval") {
      document.title = "Mileage Approval";
      this.contactTitle = "Unapproved Mileage";
      this.isHomePage = true;
      this.notificationModal = false;
      this.isProfile = false;
      this.mileageApproval = true;
      this.teamList = false;
      this.mileageView = false;
      this.mileageSummary = false;
      this.mileageSummaryView = false;
      this.showDriverView = false;
      this.resources = false;
      this.notificationViewClicked = false;
      this.getAllUnapprove(v);
      this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Approval');
      console.log("inside approval", this.isProfile);
    } else if (address === "#Mileage-Approval-Flag") {
      if(state === 'reload'){
        window.history.go(window.history.length - window.history.length - 1);
      }else{
        document.title = "Mileage Approval";
        this.contactTitle = "Unapproved Mileage";
        this.isHomePage = true;
        this.notificationModal = false;
        this.isProfile = false;
        this.mileageApproval = false;
        this.resources = false;
        this.teamList = false;
        this.mileageView = false;
        this.mileageSummary = false;
        this.notificationViewClicked = false;
        this.mileageSummaryView = false;
        this.showDriverView = false;
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Approval');
      }
    } else if (address === "#Team") {
      document.title = "Team";
      this.contactTitle = "My Team";
      this.isHomePage = true;
      this.notificationModal = false;
      this.notificationViewClicked = false;
      this.isProfile = false;
      this.mileageApproval = false;
      this.resources = false;
      this.mileageView = false;
      this.mileageSummary = false;
      this.mileageSummaryView = false;
      this.teamList = true;
      this.showDriverView = false;
      this.getAllTeam(v);
      this.template.querySelector('c-navigation-menu').toggleStyle('Team');
    } else if (address === "#Mileage-Summary") {
      document.title = "Mileage Summary";
      this.contactTitle = "Mileage Summary";
      this.isHomePage = true;
      this.notificationModal = false;
      this.notificationViewClicked = false;
      this.isProfile = false;
      this.mileageApproval = false;
      this.resources = false;
      this.teamList = false;
      this.mileageView = false;
      this.mileageSummaryView = false;
      this.getAccountMonthList();
      this.getAllReimbursement(v, this.lastMonthSelected);
      this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary');
      this.mileageSummary = true;
      this.showDriverView = false;
    } else if (address === "#Mileage-Summary-Detail") {
      if(state === 'reload'){
        window.history.go(window.history.length - window.history.length - 1);
      }else{
        document.title = "Mileage Summary";
        this.contactTitle = this.dashboardTitle;
        this.isHomePage = true;
        this.notificationModal = false;
        this.notificationViewClicked = false;
        this.isProfile = false;
        this.mileageApproval = false;
        this.resources = false;
        this.teamList = false;
        this.mileageView = false;
        this.mileageSummary = false;
        this.mileageSummaryView = true;
        this.showDriverView = false;
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary');
        }
    } else if (address === "#Mileage-Summary-Risk") {
      document.title = "High Risk";
      this.contactTitle = "High Risk";
      this.isHomePage = true;
      this.notificationModal = false;
      this.notificationViewClicked = false;
      this.isProfile = false;
      this.mileageView = false;
      this.mileageApproval = false;
      this.resources = false;
      this.teamList = false;
      this.getAccountMonthList();
      this.getMileageHighRisk(v, false, this.lastMonthSelected);
      this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary');
      this.mileageSummary = true;
      this.mileageSummaryView = false;
      this.showDriverView = false;
    } else if (address === "#Mileage-Summary-High") {
        document.title = "High Mileage";
        this.contactTitle = "High Mileage";
        this.isHomePage = true;
        this.notificationModal = false;
        this.notificationViewClicked = false;
        this.isProfile = false;
        this.mileageApproval = false;
        this.resources = false;
        this.mileageView = false;
        this.teamList = false;
        this.getAccountMonthList();
        this.getMileageHighRisk(v, true, this.lastMonthSelected);
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary');
        this.mileageSummary = true;
        this.mileageSummaryView = false;
        this.showDriverView = false;
      } else if (address === "#Mileage-Preview") {
        console.log("Mile", this.mileageRecord)
        document.title = "Mileage Preview";
        this.contactTitle = "Mileage Preview";
        this.notificationViewClicked = false;
        this.notificationModal = false;
        this.isHomePage = true;
        this.isProfile = false;
        this.mileageApproval = false;
        this.resources = false;
        this.teamList = false;
        this.mileageSummary = false;
        this.mileageSummaryView = false;
        this.mileageView = true;
        this.getDriverList();
        this.getStatus();
        this.showDriverView = false;
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Preview');
      } else if (address === '#Notifications') {
          // this.myProfile = (this.myProfile) ? false : true;
          // console.log("Profile", this.myProfile)
          this.notificationViewClicked = true;
          this.notificationModal = true;
          this.isHomePage = (this.isHomePage) ? true : false;
          this.mileageApproval = (this.mileageApproval) ? true : false;
          setTimeout(()=>{
            this.notificationViewClicked = false;
          }, 1000)
          this.teamList =  (this.teamList) ? true : false;
          this.mileageSummary = (this.mileageSummary) ? true : false;
          this.mileageSummaryView = (this.mileageSummaryView) ? true : false;
          this.mileageView = (this.mileageView) ? true : false;
          this.showDriverView = (this.mileageView) ? true : false;
          this.resources = (this.resources) ? true : false;
          this.myProfile = (this.myProfile) ? true : false;
          if(this.showTools){
            if(this.template.querySelector('c-user-tools')){
              this.template.querySelector('c-user-tools').closeChildDialog();
            }
          }
           // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
      } else if(address === '#Driver-view' || address === '#Mileage'){
        if(state === 'reload'){
          window.history.go(window.history.length - window.history.length - 1);
        }else{
          document.title = "Team";
          this.isHomePage = true;
          this.notificationViewClicked = false;
          this.notificationModal = false;
          this.isProfile = false;
          this.mileageApproval = false;
          this.resources = false;
          this.teamList = false;
          this.mileageView = false;
          this.mileageSummary = false;
          this.mileageSummaryView = false;
          this.showDriverView = true;
          this.contactTitle = this.driverProfileName;
          this.template.querySelector('c-navigation-menu').toggleStyle('Team');
        }
      } else if (address === '#Videos') {
        document.title = 'Videos/Training'
        this.contactTitle = "Videos/Training";
        this.myProfile = false;
        this.notificationViewClicked = false;
        this.notificationModal = false;
        this.isProfile = false;
        this.mileageApproval = false;
        this.resources = false;
        this.teamList = false;
        this.mileageView = false;
        this.mileageSummary = false;
        this.mileageSummaryView = false;
        this.showDriverView = false;
        this.isHomePage = true;
        this.resources = true;
        this.template.querySelector("c-navigation-menu").toggleStyle('Videos');
    } else {
          document.title = "Manager Dashboard";
          this.contactTitle = this.userName;
          this.notificationModal = false;
          this.notificationViewClicked = false;
          this.mileageView = false;
          this.showDriverView = false;
          this.resources = false;
          this.isHomePage = false;
          this.isProfile = true;
          this.template.querySelector('c-navigation-menu').toggleStyle('');
      }

    this.template
      .querySelector("c-dashboard-profile-header")
      .setSource(this.isHomePage);
  
  };

   renderedCallback(){
    if (this.calendarJsInitialised) {
      return;
    }
    
    console.log("Inside rendered")
    if(this.mileageView){
      console.log("Inside rendered mileage")
      loadScript(this, jQueryMinified)
      .then(() => {
          console.log('jquery loaded')
          Promise.all([
            loadStyle(this, datepicker + "/minifiedCustomDP.css"),
            loadStyle(this, datepicker + "/datepicker.css"),
            loadStyle(this, customMinifiedDP),
            loadScript(this, datepicker + '/datepicker.js')
          ]).then(() => {
              this.calendarJsInitialised = true;
              console.log("script datepicker loaded--");
            })
            .catch((error) => {
              console.error(error);
            });
      })
      .catch(error => {
        console.log('jquery not loaded ' + error )
      })
    }
  }

  backToDashboard(){
    document.title = "Admin Dashboard";
    let url =  location.origin + location.pathname + location.search
    this.contactTitle = this.userName;
    this.notificationModal = false;
    this.notificationViewClicked = false;
    this.mileageView = false;
    this.showDriverView = false;
    this.showUsers = false;
    this.showTools = false;
    this.showReports = false;
    this.reportDetail = false;
    this.resources = false;
    this.isHomePage = false;
    this.isProfile = true;
    this.isDashboard = false;
    this.singleUser = false;
    this.template.querySelector('c-navigation-menu').toggleStyle('');
    this.modifyUrl(document.title, url)
  }

  emailSent(event){
    var emailOfContact
    if(event.detail.contactEmail !== '' && event.detail.contactEmail != null && event.detail.contactEmail !== undefined){
        emailOfContact = event.detail.contactEmail;
        sendMlogWelcomeEmail({
            accountID: this._accountId,
            empEmail: emailOfContact
        })
        .then((result) => {
            if (result === "\"OK\"") {
                this.dispatchEvent(
                    new CustomEvent("sent", {
                        detail: event.detail
                    })
                );
            }else{
                this.dispatchEvent(
                    new CustomEvent("senterror", {
                        detail: 'Error While Sending Email'
                    })
                );
            }
            console.log(result);
        })
    }else{
        this.dispatchEvent(
            new CustomEvent("senterror", {
                detail: 'Please provide your email address'
            })
        );
    }
 }

  closeNotification(){
    let divElement = this.template.querySelector('.vue-sidebar');
    const url = new URL(document.location);
    let address = url.hash;
  
    if (divElement) {
      divElement.classList.remove("transition");
      divElement.classList.add("transition-back");
      setTimeout(() => {
        this.notificationModal = false;
        if (address === "#Notifications") {
            window.history.go(
            window.history.length - window.history.length - 1
            );
      }
      }, 1000);
     
    }
   // this.notificationModal = false;
  }

  handleYearChange(event){
      this.defaultYear = event.detail.value;
      this.getContactNotification();
      console.log("Year change-", this.defaultYear);
  }


  handleMonthChange(event){
      this.defaultMonth = event.detail.value;
      this.getContactNotification();
      console.log("month change-",  this.defaultMonth);
  }


  handleOutsideClick = (event) => {
    console.log("OUtside", event, this.notificationViewClicked)
    if(!this.notificationViewClicked){
        this.closeNotification();
    }   
  }

  
  handleKeyDown = (event) =>{
    if (event.keyCode === 27) {
       // console.log('Esc key pressed.');
        if(!this.notificationViewClicked){
          this.closeNotification();
        }  
    }
 // console.log("keyboard###", event, this.notificationViewClicked)
  }

  handleLiveNotification = (event) => {
      event.stopPropagation();
  }

  getLastYear(){
    var current, year, count = 5, i, list = [];
    current = new Date();
    year = current.getFullYear();
    for (i = year; i > year - count; i--) {
        let obj = {}
        obj.id = i;
        obj.label = (i).toString();
        obj.value = (i).toString();
        list.push(obj);
     }

     return list
  }

  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  connectedCallback() {
    console.log(this.userRole)
    /*Get logged in user id */
    const idParamValue = this.getUrlParamValue(window.location.href, "id");
    /*Get logged in user's account id */
    const aidParamValue = this.getUrlParamValue(window.location.href, "accid");
    const showIsTeam = this.getUrlParamValue(window.location.href, "showteam");
   // const manager = this.getUrlParamValue(window.location.href, 'managerid');
    const current = new Date();
    this.defaultYear = (current.getFullYear()).toString();
    this.defaultMonth = current.toLocaleString('default', {
        month: 'long'
    })
    this.yearList = this.getLastYear();
    current.setMonth(current.getMonth()-1);
    const previousMonth = current.toLocaleString('default', { month: 'long' });
    this.lastMonth = previousMonth;
    this.lastMonthSelected = this.lastMonth;
    this._contactId = idParamValue;
    this._accountId = aidParamValue;
    this.isTeamShow = showIsTeam;
    this.getAccountMonthList();
    this.getDriverList();
    this.getStatus();
    this.contactTitle = this.userName;
    this.isProfile = true;
    console.log("Guest", this.isGuestUser);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('click', this._handler = this.handleOutsideClick.bind(this));
    window.addEventListener("popstate", this.popStateMessage);

    if (window.location.hash !== "") {
      setTimeout(() => {
        this.popStateMessage();
      }, 10);
    }
    this.getContactNotification();

    /*Apex imperatively method call to get contact information */
     /* getDriverDetailsClone({
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
          this.mapLocation = (contactList[0].Map_Country__c !== undefined) ? contactList[0].Map_Country__c : 'None';
          console.log("this.mapLocation",  this.mapLocation);
          console.log("Name", this.userName, this.userEmail);
          this.getContactNotification();
        }
      })
      .catch((error) => {
        console.log("getDriverDetailsClone error", error.message);
      });*/
  }
}