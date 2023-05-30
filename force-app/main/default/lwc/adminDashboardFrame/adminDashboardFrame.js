/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, track } from 'lwc';
import logo from '@salesforce/resourceUrl/EmcCSS';
import guest from '@salesforce/user/isGuest';
import myTeamDetails from "@salesforce/apex/ManagerDashboardController.myTeamDetails";
import getDriverDetails from "@salesforce/apex/ManagerDashboardController.getDriverDetails";
import getAllDriversLastMonthReimbursements from "@salesforce/apex/ManagerDashboardController.getAllDriversLastMonthReimbursements";
import getAllDriversLastMonthUnapprovedReimbursementsclone from "@salesforce/apex/ManagerDashboardController.getAllDriversLastMonthUnapprovedReimbursementsclone";
import getUnapprovedMileages from "@salesforce/apex/ManagerDashboardController.getUnapprovedMileages";
import getMileages from '@salesforce/apex/ManagerDashboardController.getMileages';
import contactReimMonthList from '@salesforce/apex/ManagerDashboardController.contactReimMonthList';
import accountMonthList from '@salesforce/apex/ManagerDashboardController.accountMonthList';
import reimbursementForHighMileageOrRisk from "@salesforce/apex/ManagerDashboardController.reimbursementForHighMileageOrRisk";

export default class AdminDashboardFrame extends LightningElement {
    isGuestUser = guest;
    section = 'main';
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
    mileageContactName = '';
    listOfDriver;
    myTeamList;
    listOfReimbursement;
    unapproveMileages;
    viewMileages;
    nameFilter = '';
    monthSelected = '';
    isProfile = false;
    mileageApproval = false;
    teamList = false;
    mileageSummary = false;
    mileageSummaryView = false;
    driverName = '';
    unapproveReimbursements = '';
    driverList;
    mileageMonthList = '';
    mileageAccountList = ''
    teamColumn = [{
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
        arrDown: false,
    }, {
        id: 3,
        name: "Fixed Amount",
        colName: "fixedamount",
        colType: "Decimal",
        arrUp: false,
        arrDown: false,
    }
    ];
    teamKeyFields = ["name", "activationDate", "fixedamount"]

    summaryColumn = [{
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
        arrDown: false,
    }, {
        id: 3,
        name: "Flagged",
        colName: "rejectedMileages",
        colType: "Decimal",
        arrUp: false,
        arrDown: false,
    }, {
        id: 4,
        name: "Total Mileage",
        colName: "totalMileages",
        colType: "Decimal",
        arrUp: false,
        arrDown: false,
    }
    ];
    summaryKeyFields = ["name", "approvedMileages", "rejectedMileages", "totalMileages"]

    summaryDetailColumn = [{
        id: 1,
        name: "Trip Date",
        colName: "tripdate",
        colType: "Date",
        arrUp: false,
        arrDown: false
    },{
        id: 2,
        name: "Origin",
        colName: "originname",
        colType: "String",
        arrUp: false,
        arrDown: false,
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
    summaryDetailKeyFields = ["tripdate", "originname", "destinationname", "submitteddate", "status", "mileage", "variableamount"]

    @track isHomePage = false;
    @api showTeam;
    managerProfileMenu = [{
        "id": 1,
        "label": "Mileage",
        "menuItem": [{
            "menuId": 101,
            "menu": "Mileage-Approval",
            "menuLabel" : "Approval",
            "menuClass": "active",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Approval.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Approval.png'
        },{
            "menuId": 102,
            "menu": "Mileage-Summary",
            "menuLabel" : "Summary",
            "menuClass": "active",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Mileage_summary.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Mileage_summary.png'
        },{
            "menuId": 103,
            "menu": "Mileage-Preview",
            "menuLabel" : "Preview",
            "menuClass": "active",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Historical_Mileage.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Historical_Mileage.png'
        }]
        }, {
        "id": 2,
        "label": "Plan management",
        "menuItem": [{
            "menuId": 201,
            "menu": "Team",
            "menuLabel" : "Team",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Drivers_list.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Drivers_list.png'
        }]
    }, {
        "id": 3,
        "label": "Help & info",
        "menuItem": [{
            "menuId": 301,
            "menu": "Notifications",
            "menuLabel" : "Notifications",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Notifications.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Notifications.png'
        },{
            "menuId": 302,
            "menu": "Videos",
            "menuLabel" : "Videos/Training",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Driver_Videos_Training.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Driver_Videos_Training.png'
        }]
    }]

    //selectList = [];
    selectList = [{
        "id": 1,
        "label": "January",
        "value": "January"
    },{
        "id": 2,
        "label": "February",
        "value": "February"
    },{
        "id": 3,
        "label": "March",
        "value": "March"
    },{
        "id": 4,
        "label": "April",
        "value": "April"
    },{
        "id": 5,
        "label": "May",
        "value": "May"
    },{
        "id": 6,
        "label": "June",
        "value": "June"
    },{
        "id": 7,
        "label": "July",
        "value": "July"
    },{
        "id": 8,
        "label": "August",
        "value": "August"
    },{
        "id": 9,
        "label": "September",
        "value": "September"
    },{
        "id": 10,
        "label": "October",
        "value": "October"
    },{
        "id": 11,
        "label": "November",
        "value": "November"
    },{
        "id": 12,
        "label": "December",
        "value": "December"
    }]

    /*Return json to array data */
    proxyToObject(e) {
        return JSON.parse(e)
    }

    /*Get parameters from URL*/
    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    /* sidebar open/close arrow navigation event*/
    handleSidebarToggle(event) {
        console.log("From navigation new", event.detail)
        this.section = (event.detail === 'sidebar close') ? 'sidebar-open' : 'main';
        this.template.querySelector('c-dashboard-profile-header').styleHeader(event.detail);
    }

    /* Logout button event on header*/
    handleLogout() {
        // eslint-disable-next-line no-restricted-globals
        location.href = '/app/secur/logout.jsp';
    }

    getMileageList(event){
        this.isProfile = false;
        this.contactTitle = 'Unapproved Mileage';
        this.isHomePage = true;
        window.location.href = location.origin + location.pathname + location.search + '#Mileage-Approval';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Approval');
        this.listOfDriver = event.detail;
    }

    getMyTeamList(event){
        this.isProfile = false;
        this.mileageApproval = false;
        this.teamList = true;
        this.contactTitle = 'Team';
        this.isHomePage = true;
        window.location.href = location.origin + location.pathname + location.search + '#Team';
        this.template.querySelector('c-navigation-menu').toggleStyle('Team');
        this.myTeamList = event.detail;
        console.log("My team", this.myTeamList)
    }

    redirectToMileage(){
        this.isProfile = false;
        this.mileageApproval = true;
        this.contactTitle = 'Unapproved Mileage';
        this.isHomePage = true;
        window.location.href = location.origin + location.pathname + location.search + '#Mileage-Approval';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Approval');
    }

    redirectToSummary(){
        this.isProfile = false;
        this.mileageApproval = false;
        this.mileageSummaryView = false;
        this.mileageSummary = true
        this.contactTitle = 'Mileage Summary';
        this.isHomePage = true;
        window.location.href = location.origin + location.pathname + location.search + '#Mileage-Summary';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary');
    }

    redirectToHighRiskMileage(){
        this.isProfile = false;
        this.mileageApproval = false;
        this.mileageSummaryView = false;
        this.mileageSummary = true
        this.contactTitle = 'High Risk';
        this.isHomePage = true;
        window.location.href = location.origin + location.pathname + location.search + '#Mileage-Summary-Risk';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary');
    }

    getMileageHighRisk(boolean){
        this.listOfReimbursement = ''
        reimbursementForHighMileageOrRisk({
            managerId: this._contactId,
            accountId: this._accountId,
            month: 'May',
            showteam: boolean,
            highMileage: false,
            role: 'Manager'
        }).then((data) =>{
            console.log("reimbursementForHighMileageOrRisk Method", data);
            let resData = data.replace(/\\/g, '');
            this.listOfReimbursement = resData;
        }).catch((error) => {
            console.log("reimbursementForHighMileageOrRisk error", error)
        })
    }

    getUnapproveMileage(event){
        var arrayInput, original, filterList;
        // this.dispatchEvent(
        //     new CustomEvent("show", {
        //         detail: "spinner"
        //     })
        // );
        console.log("Unapproved-->", JSON.stringify(event.detail));
        this.contactTitle = 'Unapproved Mileage';
        this.nameFilter = event.detail.type;
        this.isHomePage = true;
        window.location.href = location.origin + location.pathname + location.search + '#Mileage-Approval-Flag';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Approval');
        this.unapproveMileages = '';
        this.unapproveReimbursements = event.detail.data;
        getUnapprovedMileages({
            reimbursementDetails: event.detail.data, 
            accountId: this. _accountId
        }).then((data) =>{
            console.log("MEthod", data);
            let resData = data.replace(/\\/g, '');
            this.isProfile = false;
            this.mileageApproval = false;
            arrayInput = this.proxyToObject(resData);
            original = arrayInput;
           
            if(event.detail.type === 'High Risk'){
                filterList = arrayInput.mileagesList.filter(function (b) {
                    return b.highRiskMileage === true
                });
              this.unapproveMileages = JSON.stringify(filterList);
            }else{
                filterList = original.mileagesList;
                this.unapproveMileages = JSON.stringify(filterList);
            }
            this.driverName = arrayInput.name;

           
            console.log("driver unapprove mileage---",  arrayInput);
            // this.dispatchEvent(
            //     new CustomEvent("hide", {
            //         detail: "spinner"
            //     })
            // );
        }).catch((error) => {
            console.log("getUnapproveMileages error", error)
        })
    }

    getListMileages(contactId, month){
        var arrayList;
        getMileages({
            clickedMonth: month, 
            clickedYear: '2023',
            did: contactId
        }).then((data) =>{
            var pattern = /\\\\|\'/g;
            var resultdata = data.replace(pattern, '\\');
            arrayList = resultdata;
            this.viewMileages = arrayList;
            console.log("getMileage Data", data, this.viewMileages);
        }).catch((error) => {
            console.log("getMileage error", error)
        })
    }

    review(a){
        if(a){
            let monthA = this.proxyToObject(a), array = [];
            for(let i = 0; i < monthA.length; i++){
                let obj = {}
                obj.id = i + 1;
                obj.label = monthA[i];
                obj.value = monthA[i];
                array.push(obj)
            }
    
            return JSON.stringify(array);
        }
            return a
    }

    refreshDetailSummary(event){
        console.log("Detail---", event.detail, this.contactUserId)
        this.viewMileages = '';
        this.monthSelected = event.detail;
        this.contactTitle = this.mileageContactName + ' ' + this.monthSelected + ' Mileage';
        this.getListMileages(this.contactUserId, event.detail);
    }
    
    getMileage(event){
        let detailList = JSON.parse(event.detail);
        let contactId = detailList.contactid;
        this.contactUserId = contactId;
        this.mileageContactName = detailList.name;
        this.isHomePage = true;
        this.isProfile = false;
        this.mileageApproval = false;
        this.mileageSummary = false;
        this.mileageSummaryView = true;
        this.viewMileages = '';
        window.location.href = location.origin + location.pathname + location.search + '#Mileage-Summary-Detail';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage-Summary'); 
        console.log("event--", contactId, event.detail)
        contactReimMonthList({
            contactId: contactId
        }).then((data) =>{
            let monthName = (data) ? (JSON.parse(data))[0] : '';
            this.mileageMonthList = this.review(data);
            this.monthSelected = (monthName) ? monthName : '';
            this.contactTitle = detailList.name + ' ' + this.monthSelected + ' Mileage';
            this.getListMileages(contactId, this.monthSelected);
            console.log("contactReimMonthList Data", data, this.monthSelected, this.mileageMonthList);
        }).catch((error) => {
            console.log("contactReimMonthList error", error)
        })
       
    }

    showSpinner(event){
        this.dispatchEvent(
            new CustomEvent("show", {
                detail: event.detail
            })
        );
    }

    hideSpinner(event){
        this.dispatchEvent(
            new CustomEvent("hide", {
                detail: event.detail
            })
        );
    }

    showToast(event){
        this.dispatchEvent(
            new CustomEvent('toast', {
                detail: event.detail
            })
        )
    }

    handleComplete(){
        var arrayInput;
        this.dispatchEvent(
                new CustomEvent("show", {
                    detail: "spinner"
                })
        );
        this.unapproveMileages = '';
        getAllDriversLastMonthUnapprovedReimbursementsclone({
            accountId: this._accountId, 
            contactId: this._contactId, 
            showTeam: false
        }).then((b) =>{
            let resultDriver  = b.replace(/\\'/g, "\'")
            this.listOfDriver = resultDriver;
        }).catch((error) => {
            console.log("getAllDriversLastMonthUnapprovedReimbursementsclone error", error)
        })
       
        if(this.unapproveReimbursements){
            getUnapprovedMileages({
                reimbursementDetails: this.unapproveReimbursements, 
                accountId: this. _accountId
            }).then((data) =>{
                console.log("driver unapprove mileage 4---", data);
                this.isProfile = false;
                this.mileageApproval = false;
                arrayInput = this.proxyToObject(data);
                this.driverName = arrayInput.name;
                this.unapproveMileages = JSON.stringify(arrayInput.mileagesList);
                console.log("driver unapprove mileage 4---", this.unapproveMileages, arrayInput);
                this.dispatchEvent(
                    new CustomEvent("hide", {
                        detail: "spinner"
                    })
                );
            }).catch((error) => {
                console.log("getUnapproveMileages error", error)
            })
        }
    
    }

    getAllReimbursement(boolean){
        getAllDriversLastMonthReimbursements({
            accountId: this. _accountId, 
            contactId: this. _contactId, 
            showTeam: boolean
        }).then((b) =>{
            let driverResult  = b.replace(/\\'/g, "\'");
            this.listOfReimbursement = driverResult;
            console.log("List of getAllDriversLastMonthReimbursements", this.listOfReimbursement)
        }).catch((error) => {
            console.log("getAllDriversLastMonthReimbursements error", error)
        })
    }

    getAllUnapprove(boolean){
        getAllDriversLastMonthUnapprovedReimbursementsclone({
            accountId: this. _accountId, 
            contactId: this. _contactId, 
            showTeam: boolean
        }).then((b) =>{
            let resultDriver  = b.replace(/\\'/g, "\'");
            this.listOfDriver = resultDriver;
        }).catch((error) => {
            console.log("getAllDriversLastMonthUnapprovedReimbursementsclone error", error)
        })
    }

    getUserInfo(){
        getDriverDetails({
            managerId: this._contactId
        }).then((data) =>{
            if(data){
                let _data = this.proxyToObject(data);
                this.driverList = _data;
                this.userEmail = _data[0].External_Email__c;
                this.userName = _data[0].Name;
                this.firstName = _data[0].FirstName;
               console.log("driverList", data, this.driverList)
           }
        }).catch((error) => {
            console.log("getDriverDetails error", error)
        })
    }

    getAccountMonthList(){
        accountMonthList({
            accountId: this._accountId
        }).then((data) => {
            if(data){
                this.mileageAccountList = this.review(data);
                console.log("Month---", data)
            }
        })
    }

    getAllTeam(boolean){
        myTeamDetails({
            managerId: this. _contactId,
            accountId: this. _accountId,
            showteam: boolean
        }).then((data) =>{
            let result  = data.replace(/\\'/g, "\'")
            this.myTeamList = result;
            console.log("myTeamDetails List---", data);
        }).catch((error) => {
            console.log("myTeamDetails error", error)
        })
    }

    popStateMessage = (event) => {
        console.log("inside popState")
        const url = new URL(document.location);
        let params = new URL(document.location).searchParams;
        let address = url.hash;
        let showteam = params.get("showteam");
        let v = (showteam === 'false') ? false : true;
        console.log("inside popState", address)
        if (address === '#Mileage-Approval') {
            document.title = 'Mileage Approval'
            this.contactTitle = 'Unapproved Mileage';
            this.isHomePage = true;
            this.isProfile = false;
            this.mileageApproval = true;
            this.teamList = false;
            this.getAllUnapprove(v);
            console.log("inside approval", this.isProfile)
         } else if(address === '#Mileage-Approval-Flag'){
            document.title = 'Mileage Approval'
            this.contactTitle = 'Unapproved Mileage';
            this.isHomePage = true;
            this.isProfile = false;
            this.mileageApproval = false;
            this.teamList = false;
         } else if(address === '#Team'){
            document.title = 'Team'
            this.contactTitle = 'Team';
            this.isHomePage = true;
            this.isProfile = false;
            this.mileageApproval = false;
            this.teamList = true;
            this.getAllTeam(v);
         } else if(address === '#Mileage-Summary'){
            document.title = 'Mileage Summary'
            this.contactTitle = 'Mileage Summary';
            this.isHomePage = true;
            this.isProfile = false;
            this.mileageApproval = false;
            this.teamList = false;
            this.getAllReimbursement(v);
            this.mileageSummary = true;
         } else if(address === '#Mileage-Summary-Detail'){
            document.title = 'Mileage Summary'
            this.isHomePage = true;
            this.isProfile = false;
            this.mileageApproval = false;
            this.teamList = false;
            this.mileageSummary = false;
            this.mileageSummaryView = true;
         } else if(address === '#Mileage-Summary-Risk'){
            document.title = 'High Risk'
            this.isHomePage = true;
            this.isProfile = false;
            this.mileageApproval = false;
            this.teamList = false;
            this.getMileageHighRisk(v);
            this.mileageSummary = true;
            this.mileageSummaryView = false;
         }else {
            this.contactTitle = this.userName;
            this.isHomePage = false;
            this.isProfile = true;
        }

        this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
        console.log('Main---->', url.hash, event)
    }

    connectedCallback(){
        /*Get logged in user id */
        const idParamValue = this.getUrlParamValue(window.location.href, 'id');
          /*Get logged in user's account id */
        const aidParamValue = this.getUrlParamValue(window.location.href, 'accid');
        this._contactId = idParamValue;
        this._accountId = aidParamValue;
        this.getUserInfo();
        this.getAccountMonthList();
        this.contactTitle = this.userName;
        this.isProfile = true;
        console.log("Guest", this.isGuestUser)
        window.addEventListener('popstate', this.popStateMessage);

        if(window.location.hash !== ''){
            setTimeout(() => {this.popStateMessage()} , 10);
        }
    }
}