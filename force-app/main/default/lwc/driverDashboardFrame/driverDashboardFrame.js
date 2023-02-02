/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable guard-for-in */
import {
    LightningElement,
    api, wire, track
} from 'lwc';
import logo from '@salesforce/resourceUrl/EmcCSS';
import redirectionURL from '@salesforce/apex/NewAccountDriverController.loginRedirection';
import getAllReimbursements from "@salesforce/apex/DriverDashboardLWCController.getAllReimbursements";
import getDriverDetails from '@salesforce/apex/DriverDashboardLWCController.getDriverDetailsClone';
import getCompanyLogoUrl from '@salesforce/apex/DriverDashboardLWCController.getCompanyLogoUrl';
import getCustomSettings from '@salesforce/apex/DriverDashboardLWCController.getCustomSettings';
export default class DriverDashboardFrame extends LightningElement {
    @track notifyList;
    @track notificationList;
    @api chartData;
    section = 'main';
    insuranceVideo;
    contentCss;
    videoCss;
    contactInformation;
    isTripType = 'MyTrip';
    ytdList;
    excelYtdList;
    @track isTrip = true;
    @track isAttendance = false;
    notificationModal = false;
    isFalse = false;
    dateOfExpiration = '';
    contentMessage = '';
    subMessage = '';
    myProfile = true;
    reimbursementView = false;
    manualEntryView = false;
    reimbursementArchive = false;
    viewNotification = false;
    headerModalText = '';
    modalClass = '';
	headerClass = '';
	subheaderClass = '';
	modalContent = '';
	styleHeader = '';
	styleClosebtn = '';
    insuranceView = false;
    resources = false;
    locationUploadView = false;
    complianceView = false;
    liabilityView = false;
    tripView = false;
    biweek = false;
    monthOfTrip;
    yearOfTrip;
    startDt;
    endDt;
    biweekId;
    userName;
    firstName;
    userEmail;
    userTriplogId;
    companyLogoUrl;
    @track isNotify = false;
    @track isHomePage = false;
    _contactId;
    _accountId;
    driverProfileMenu = [{
        "id": 1,
        "label": "Mileage",
        "menuItem": [{
            "menuId": 101,
            "menu": "Mileage",
            "menuLabel" : "Mileage",
            "menuClass": "active",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Historical_Mileage.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Historical_Mileage.png'
        }, {
            "menuId": 102,
            "menu": "Archive",
            "menuLabel" : "Archive",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Archive.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Archive.png'
        }, {
            "menuId": 103,
            "menu": "Manual-Entry",
            "menuLabel" : "Manual Entry",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Manual_Entry.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Manual_Entry.png'
        }]
    }, {
        "id": 2,
        "label": "Plan management",
        "menuItem": [{
            "menuId": 201,
            "menu": "Insurance-Upload",
            "menuLabel" : "Insurance Upload",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Insurance_Upload.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Insurance_Upload.png'
        }, {
            "menuId": 202,
            "menu": "Locations",
            "menuLabel" : "Locations",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Locations.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Locations.png'
        }, {
            "menuId": 203,
            "menu": "Notifications",
            "menuLabel" : "Notifications",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Notifications.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Notifications.png'
        }, {
            "menuId": 204,
            "menu": "Compliance",
            "menuLabel" : "Compliance",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Compliance.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Compliance.png'
        }, {
            "menuId": 205,
            "menu": "Tax-Liability",
            "menuLabel" : "Tax Liability",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Tax_Liability.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Tax_Liability.png'
        }]
    }, {
        "id": 3,
        "label": "Help & info",
        "menuItem": [{
            "menuId": 301,
            "menu": "Videos",
            "menuLabel" : "Videos/Training",
            "menuClass": "",
            "logo": logo + '/emc-design/assets/images/Icons/PNG/Green/Driver_Videos_Training.png',
            "logoHov": logo + '/emc-design/assets/images/Icons/PNG/White/Driver_Videos_Training.png'
        }]
    }]

    @wire(getCompanyLogoUrl, {
        accountId: '$_accountId'
    }) getCompanyLogo({ data, error }) {
        if (data) {
            this.companyLogoUrl = (data !== '' || data !== undefined || data !== null) ? JSON.parse(data) : data;
        } else if (error) {
            console.log("loggo", error);
        }
    }

    // renderedCallback(){
    //     const url = new URL(document.location);
    //     // let address = params.get('#'); // is the string "Jonathan Smith".
    //     setTimeout(function (){
    //      console.log('Main---->', url.hash)
    //     }, 2000)
    // }

    proxyToObject(e) {
        return JSON.parse(e)
    }

    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    driverNotification(message, date, insuranceDt) {
        //  if (this.isInformation) {
        var notification = [], currentDate, deadline, mileageMsg, pastDate, fourthOfMonth, monthName, insuranceMsg, insuranceMsg1, dateOpt;
        currentDate = new Date(); /** "2021-07-31" */
        deadline = 5;
        /** Custom Notification **/
        if (message != null) {
            notification.push({
                value: message,
                dt: date
            }
            );
        }
        /** Driver Notification - 5 days before the mileage Monthly and bi-weekly notifications for upcoming mileage sync  **/

        fourthOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 4);
        if (currentDate > fourthOfMonth) {
            fourthOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 4);
            pastDate = new Date(fourthOfMonth);
            pastDate.setDate(pastDate.getDate() - deadline);
            monthName = fourthOfMonth.toLocaleString('default', {
                month: 'long'
            });
        } else {
            pastDate = new Date(fourthOfMonth);
            pastDate.setDate(pastDate.getDate() - deadline);
            monthName = currentDate.toLocaleString('default', {
                month: 'long'
            });
            // console.log(pastDate, fourthOfMonth);
        }

        if (currentDate >= pastDate && currentDate < fourthOfMonth) {
            mileageMsg = "Mileage will be automatically synced " + monthName + " 3 at 11:59 PM PST.";
            notification.push({
                value: mileageMsg,
                dt: new Date()
            });
        }

        /** Driver Notification - Insurance deadline 5 days before the insurance request dates (Jan 1 and June 30) to support the email that is sent to drivers.  **/

        dateOpt = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        };
        let cDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('fr-CA', dateOpt);
        let firstMonth = new Date(currentDate.getFullYear(), 0, 1);
        let sixthMonth = new Date(currentDate.getFullYear(), 6, 0);
        let first = new Date(firstMonth.getFullYear(), 0, 1).toLocaleDateString('fr-CA', dateOpt);
        if (cDate > first) {
            firstMonth = new Date(currentDate.getFullYear() + 1, 0, 1);
        }
        let insurancePastDate = new Date(firstMonth);
        insurancePastDate.setDate(insurancePastDate.getDate() - deadline);
        let insuranceEndDate = new Date(sixthMonth);
        insuranceEndDate.setDate(insuranceEndDate.getDate() - deadline);
        if (currentDate >= insurancePastDate && currentDate < firstMonth) {
            insuranceMsg = "Happy Holidays – Don’t forget to upload your insurance dec page next week.";
            notification.push({
                value: insuranceMsg,
                dt: new Date()
            });
        }
        if (currentDate >= insuranceEndDate && currentDate < sixthMonth) {
            insuranceMsg1 = "You have to upload your most recent insurance declaration page(s) in 5 days.";
            notification.push({
                value: insuranceMsg1,
                dt: new Date()
            });
        }

        /** Driver Notification - 35 days after the first request for insurance (January 31 and July 31) to support a new email that will be sent to all drivers that have not uploaded their insurance.  **/
        let emailMsg;
        let lastDayOfSeventh = new Date(currentDate.getFullYear(), 7, 0).toLocaleDateString('fr-CA', dateOpt);;
        let lastDay = new Date(currentDate.getFullYear(), 1, 0).toLocaleDateString('fr-CA', dateOpt);;
        if (cDate === lastDayOfSeventh || cDate === lastDay) {
            emailMsg = "In 5 days, you could forfeit your fixed amount unless you upload your insurance declaration page(s).";
            notification.push({
                value: emailMsg,
                dt: new Date()
            });
        }
        // console.log(notification);

        /** Trigger-based notifications */
        let day = currentDate.getDate();
        let approvalMsg;
        let flaggedMsg;
        let pendingMsg;
        let insuranceUpload;
        let pastDay;
        let nameOfMonth;
        let fourth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 4).toLocaleDateString('fr-CA', dateOpt);
        if (cDate >= fourth) {
            pastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
            nameOfMonth = pastDay.toLocaleString('default', {
                month: 'long'
            });
        } else {
            pastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
            nameOfMonth = pastDay.toLocaleString('default', {
                month: 'long'
            });
        }
        let mileageObject;
        this.mileageList.forEach((m) => {
            if (nameOfMonth === m.month) {
                mileageObject = m;
            }
        })
        // console.log(mileageObject);
        if (mileageObject !== undefined) {
            /** Trigger-based notifications - Display mileage approval (total for the month) – should disappear after the lock date or by the 18th of the month */
            if (mileageObject.totalApprove !== undefined) {
                if (mileageObject.lockdate === null && day < 18) {
                    approvalMsg = "For " + nameOfMonth + " you had " + mileageObject.totalApprove + " approved miles";
                    notification.push({
                        value: approvalMsg,
                        dt: new Date()
                    });
                }
            }

            /** Trigger-based notifications - When mileage is flagged for the month (total for the month) until the 18th of the month or the lock date */
            if (mileageObject.totalRejected !== undefined) {
                if ((mileageObject.lockdate != null)) {
                    flaggedMsg = "For " + nameOfMonth + " you had " + mileageObject.totalRejected + " flagged miles";
                    notification.push({
                        value: emailMsg,
                        dt: new Date()
                    });
                } else {
                    if (day <= 18) {
                        flaggedMsg = "For " + nameOfMonth + " you had " + mileageObject.totalRejected + " flagged miles";
                        notification.push({
                            value: flaggedMsg,
                            dt: new Date()
                        });
                    }
                }
            }


            /** Trigger-based notifications - Display the total of unapproved mileage (mileage that was unapproved after the 18th or the lock date). This number should be displayed until the 3rd of the next month.*/
            if (mileageObject.totalPending !== undefined) {
                if ((mileageObject.lockdate != null)) {
                    pendingMsg = "For " + nameOfMonth + " you had " + mileageObject.totalPending + " miles that were not yet approved";
                    notification.push({
                        value: emailMsg,
                        dt: new Date()
                    });
                } else {
                    if (day >= 18) {
                        pendingMsg = "For " + nameOfMonth + " you had " + mileageObject.totalPending + " miles that were not yet approved";
                        notification.push({
                            value: pendingMsg,
                            dt: new Date()
                        });
                    }
                }
            }


        }

        /** Trigger-based notifications - 4.	Thank you for uploading your insurance – immediately after uploading an insurance */

        let isDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('fr-CA');
        let insuranceDate = insuranceDt;
        if (insuranceDate != null) {
            if (isDate === insuranceDate) {
                insuranceUpload = "Thank you for uploading your insurance, our team will evaluate your insurance by the end of the month"
                notification.push({
                    value: insuranceUpload,
                    dt: new Date()
                });
            }
        }

        let messageList = [];
        for (let index = 0; index < notification.length; index++) {
            const element = {}
            element.Id = index;
            element.message = notification[index].value;
            element.date = notification[index].dt;
            messageList.push(element);
        }

        this.notifyList = messageList;
        this.notificationList = this.notifyList.slice(0, 2);
        console.log("notifications--", this.notifyList, JSON.stringify(this.notifyList), this.notifyList.length)
        this.isNotify = (this.notifyList.length > 0) ? true : false;
        // }
    }

    handleNotification(event) {
        // eslint-disable-next-line radix
        var rd = parseInt(event.detail);
        for (let i = 0; i < this.notifyList.length; i++) {
            if (this.notifyList[i].Id === rd) {
                this.notifyList.splice(i, 1);
            }
        }
        this.notificationList = this.notifyList.slice(0, 2);
        this.isNotify = (this.notifyList.length > 0) ? true : false;
    }

    handleClose(event) {
        // console.log("id", event.target.dataset.id)
        // eslint-disable-next-line radix
        var eId = parseInt(event.target.dataset.id);
        for (let i = 0; i < this.notifyList.length; i++) {
            if (this.notifyList[i].Id === eId) {
                this.notifyList.splice(i, 1);
            }
        }
        this.notificationList = this.notifyList.slice(0, 2);
        this.isNotify = (this.notifyList.length > 0) ? true : false;
    }


    viewAllNotification() {
        this.headerModalText = 'Notifications';
        this.modalClass = "slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__delay-1s"
        this.headerClass = "slds-modal__header header-preview slds-p-left_xx-large slds-clearfix"
        this.subheaderClass = "slds-text-heading slds-hyphenate slds-float_left"
        this.modalContent = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
        this.styleHeader = "slds-modal__container slds-m-top_medium"
        this.styleClosebtn = "close-notify"
        // eslint-disable-next-line no-restricted-globals
        this.notificationModal = true;
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal').show();
        }
    }

    editEntryTripLocation(){
        this.headerModalText = 'Edit Location';
        this.modalClass = "slds-modal slds-modal_medium slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__delay-1s"
        this.headerClass = "slds-modal__header header-preview slds-p-left_xx-large slds-clearfix"
        this.subheaderClass = "slds-text-heading slds-hyphenate slds-float_left"
        this.modalContent = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
        this.styleHeader = "slds-modal__container slds-m-top_medium"
        this.styleClosebtn = "close-notify"
        // eslint-disable-next-line no-restricted-globals
        this.notificationModal = false;
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal').show();
        }
    }

    handleSidebarToggle(event) {
        console.log("From navigation", event.detail)
        this.section = (event.detail === 'sidebar close') ? 'sidebar-open' : 'main';
        this.contentCss = (event.detail === 'sidebar close') ? "slds-align_absolute-center content-flex content-open" : "slds-align_absolute-center content-padding2-close content-flex";
        this.videoCss = (event.detail === 'sidebar close') ?   "slds-align_absolute-center video-container video-padding" : "slds-align_absolute-center video-container video-padding-close"
        this.template.querySelector('c-dashboard-profile-header').styleHeader(event.detail);
        if (this.template.querySelector('c-driver-reimbursement-profile')) {
            this.template.querySelector('c-driver-reimbursement-profile').styleElement(event.detail);
        }
    }

    navigateToInsurance() {
        this.insuranceView = true;
        this.contentCss = (this.section === 'sidebar-open') ? "slds-align_absolute-center content-flex content-open" : "slds-align_absolute-center content-padding2-close content-flex";
        this.videoCss = (this.section === 'sidebar-open') ?   "slds-align_absolute-center video-container video-padding" : "slds-align_absolute-center video-container video-padding-close"
        // this.contentCss = "slds-align_absolute-center content-padding2-close content-flex";
        // this.videoCss = "slds-align_absolute-center video-container video-padding-close"
        this.reimbursementView = false;
        this.manualEntryView = false;
        this.reimbursementArchive = false;
        this.complianceView = false;
        this.liabilityView = false;
        this.tripView = false;
        this.locationUploadView = false;
        this.resources = false;
        this.notificationModal = false;
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Insurance-Upload';
        this.template.querySelector('c-navigation-menu').toggleStyle('Insurance-Upload');
    }

    navigateToResource(){
        this.insuranceView = false;
        this.reimbursementView = false;
        this.manualEntryView = false;
        this.reimbursementArchive = false;
        this.complianceView = false;
        this.liabilityView = false;
        this.tripView = false;
        this.locationUploadView = false;
        this.notificationModal = false;
        this.resources = true;
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Videos';
        this.template.querySelector('c-navigation-menu').toggleStyle('Videos');
    }

    navigateToPage() {
        this.isHomePage = true;
        this.reimbursementView = true;
        this.manualEntryView = false;
        this.myProfile = false;
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Mileage';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage');
        this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
    }

    // takeMeToMenu(event) {
    //     // eslint-disable-next-line @lwc/lwc/no-async-operation
    //     setTimeout(() => {
    //         this.template.querySelector('c-dashboard-profile-header').styleLink(event.detail);
    //     }, 10)
    //     //this.template.querySelector('c-dashboard-profile-header').styleLink(event.detail);
    //     this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
    // }

    reimbursementArchived(event) {
        this.isHomePage = true;
        this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
        this.myProfile = false;
        this.reimbursementView = false;
        this.manualEntryView = false;
        this.reimbursementArchive = true;
        this.isTripType = event.detail;
        this.dispatchEvent(
            new CustomEvent("profile", {
                detail: 'isHide'
            })
        );
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Archive';
        this.template.querySelector('c-navigation-menu').toggleStyle('Archive');
    }

    switchToCompliance() {
        this.liabilityView = false;
        this.complianceView = true;
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Compliance';
        this.template.querySelector('c-navigation-menu').toggleStyle('Compliance');
    }

    switchToLiability() {
        this.liabilityView = true;
        this.complianceView = false;
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Tax-Liability';
        this.template.querySelector('c-navigation-menu').toggleStyle('Tax-Liability');
    }

    navigateToReimbursement() {
        this.isTrip = (this.isTripType === 'MyTrip') ? true : false;
        this.isAttendance = (this.isTripType === 'timeAttendance') ? true : false;
        this.myProfile = false;
        this.isHomePage = true;
        this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
        this.reimbursementView = true;
        this.manualEntryView = false;
        this.reimbursementArchive = false;
        // eslint-disable-next-line no-restricted-globals
        window.location.href = location.origin + location.pathname + location.search + '#Mileage';
        this.template.querySelector('c-navigation-menu').toggleStyle('Mileage');
    }

    showModalEvent(event){
        this.headerModalText = '';
        this.modalClass = "slds-modal modal_info slds-is-fixed slds-fade-in-open animate__animated animate__slideInUp animate__fast"
        this.headerClass = "slds-modal__header resource-header slds-clearfix"
        this.subheaderClass = ""
        this.modalContent = "slds-modal__content content"
        this.styleHeader = "slds-modal__container slds-m-top_medium"
        this.styleClosebtn = "close-message"
        this.contentMessage = 'You have successfully added '+ event.detail + ' new locations.';
        this.subMessage = 'Your locations should show up after your next data sync..'
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal').show();
        }
    }

    showModalListEvent(){
        this.headerModalText = '';
        this.modalClass = "slds-modal modal_info slds-is-fixed slds-fade-in-open animate__animated animate__slideInUp animate__fast"
        this.headerClass = "slds-modal__header resource-header slds-clearfix"
        this.subheaderClass = ""
        this.modalContent = "slds-modal__content content"
        this.styleHeader = "slds-modal__container slds-m-top_medium"
        this.styleClosebtn = "close-message"
        this.contentMessage = 'Your location has been updated';
        this.subMessage = 'Your locations should show up in the listing..'
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal').show();
        }
    }

    handleCloseModal(){
        if(!this.notificationModal){
                if(this.template.querySelector('c-user-location')){
                    this.template.querySelector('c-user-location').generateView();
                }
        }
    }

    myTripDetail(event) {
        this.biweek = event.detail.boolean;
        console.log("biweek", this.biweek)
        if (event.detail.boolean !== undefined) {
            if (event.detail.boolean === false) {
                this.monthOfTrip = event.detail.month;
                this.yearOfTrip = event.detail.year;
                this.tripView = true;
            } else {
                let listVal = event.detail.trip;
                this.startDt = listVal.startDate;
                this.endDt = listVal.endDate;
                this.biweekId = listVal.id;
                this.tripView = true;
            }
        }

        // console.log("trips", event.detail.month, event.detail.year)
        // console.log("trips", this.startDt,  this.endDt, this.biweekId)
    }

    revertToReimbursement() {
        this.isAttendance = false;
        this.isTrip = true;
        console.log("trip boolean", this.isAttendance, this.isTrip)
        this.myProfile = false;
        this.tripView = false;
        this.isHomePage = true;
        this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
        // this.isTrip = (this.isTripType === 'MyTrip') ? true : false;
        // this.isAttendance = (this.isTripType === 'timeAttendance') ? true : false;

    }

    viewDashboardProfile() {
        // this.myProfile = true;
        var splitText, splitName;
        window.history.back();
        setTimeout(()=>{
            const url = new URL(document.location);
            let address = url.hash;
            console.log("window.history", address);
            if(address === undefined || address === '')
                  redirectionURL({ contactId: this._contactId })
                  .then((result) => {
                        let urlDirect = window.location.origin + result;
                        window.open(urlDirect, '_self');
                    })
            else
                splitText = address.split('#');
                splitName = (splitText.length > 0) ? splitText[1] : '';
                this.template.querySelector('c-navigation-menu').toggleStyle(splitName);
        }, 1000)
    }

    handleToast() {
        this.dispatchEvent(
            new CustomEvent("toast", {
                detail: ""
            })
        );
    }

    showSpinner(event) {
        console.log("navigate spin")
        this.dispatchEvent(
            new CustomEvent("profile", {
                detail: event.detail
            })
        );
    }

    showToastEvent(event){
        this.dispatchEvent(
            new CustomEvent("location", {
                detail: event.detail
            })
        );
    }

    throwError(event){
        this.dispatchEvent(
            new CustomEvent("toast", {
                detail: event.detail
            })
        );
    }

    handleLogout() {
        // eslint-disable-next-line no-restricted-globals
        location.href = '/app/secur/logout.jsp';
    }

    // renderedCallback(){
    //     const url = new URL(document.location);
    //    // let address = params.get('#'); // is the string "Jonathan Smith".
    //     console.log('Main---->', url.hash)
    // }

    popStateMessage = (event) => {
        this.myProfile = false;
        this.tripView = false;
        const url = new URL(document.location);
        let address = url.hash;
        if (address === '#Archive') {
            document.title = 'Archive'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = true;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
             setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Insurance-Upload') {
            document.title = 'My Insurance Upload'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = true;
            this.contentCss = (this.section === 'sidebar-open') ? "slds-align_absolute-center content-flex content-open" : "slds-align_absolute-center content-padding2-close content-flex";
            this.videoCss = (this.section === 'sidebar-open') ?   "slds-align_absolute-center video-container video-padding" : "slds-align_absolute-center video-container video-padding-close"
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('Insurance-Upload');
            }, 10)
        } else if (address === '#Manual-Entry') {
            document.title = 'Manual Entry'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = true;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Notifications') {
            this.myProfile = (this.myProfile) ? true : false;
            this.notificationModal = true;
            this.isHomePage = (this.isHomePage) ? true : false;
            this.reimbursementView = (this.reimbursementView) ? true : false;
            this.reimbursementArchive = (this.reimbursementArchive) ? true : false;
            this.complianceView = (this.complianceView) ? true : false;
            this.manualEntryView = (this.manualEntryView) ? true : false;
            this.insuranceView = (this.insuranceView) ? true : false;
            this.resources = (this.resources) ? true : false;
            this.locationUploadView = (this.locationUploadView) ? true : false;
            this.liabilityView = (this.liabilityView) ? true : false;
            if (this.template.querySelector('c-user-profile-modal')) {
                this.headerModalText = 'Notifications';
                this.modalClass = "slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__delay-1s"
			    this.headerClass = "slds-modal__header header-preview slds-p-left_xx-large slds-clearfix"
			    this.subheaderClass = "slds-text-heading slds-hyphenate slds-float_left"
			    this.modalContent = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
			    this.styleHeader = "slds-modal__container slds-m-top_medium"
			    this.styleClosebtn = "close-notify"
                this.template.querySelector('c-user-profile-modal').show();
            }
             // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Compliance') {
            document.title = 'Compliance'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = true;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
              setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Mileage') {
            document.title = 'Mileage'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = true;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Tax-Liability') {
            document.title = 'Tax Liability'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = true;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
              setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Locations') {
            document.title = 'Locations'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = true;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
              setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        } else if (address === '#Videos') {
            document.title = 'Videos/Training'
            this.myProfile = false;
            this.notificationModal = false;
            this.isHomePage = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = true;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
         setTimeout(() => {
            this.template.querySelector('c-dashboard-profile-header').styleLink('Videos')
         }, 10);
        } else {
            this.isHomePage = false;
            this.notificationModal = false;
            this.myProfile = true;
            this.reimbursementView = false;
            this.manualEntryView = false;
            this.reimbursementArchive = false;
            this.complianceView = false;
            this.insuranceView = false;
            this.resources = false;
            this.liabilityView = false;
            this.locationUploadView = false;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
              setTimeout(() => {
                this.template.querySelector('c-dashboard-profile-header').styleLink('');
            }, 10)
        }
         // eslint-disable-next-line @lwc/lwc/no-async-operation
         //  setTimeout(() => {
           // this.template.querySelector('c-dashboard-profile-header').styleLink(event.detail);
       // }, 10)
        //this.template.querySelector('c-dashboard-profile-header').styleLink(event.detail);
        this.template.querySelector('c-dashboard-profile-header').setSource(this.isHomePage);
        // let address = params.get('#'); // is the string "Jonathan Smith".
        //setTimeout(function (){
        console.log('Main---->', url.hash, event)
        // }, 1000)
    }

    connectedCallback() {
        var currentDay = new Date(), currentYear = '', selectedYear = '';
        const idParamValue = this.getUrlParamValue(window.location.href, 'id');
        const aidParamValue = this.getUrlParamValue(window.location.href, 'accid');
        this._contactId = idParamValue;
        this._accountId = aidParamValue;
        this.isHomePage = false;
        window.addEventListener('popstate', this.popStateMessage);
        getCustomSettings()
            .then((result) => {
                this.insuranceVideo = result.Insurance_Link__c;
                if(window.location.hash !== ''){
                    setTimeout(() => {this.popStateMessage()} , 10);
                 }
                console.log("getCustomSettings", result)
            }).catch((error) => {
                console.log("getCustomSettings", error)
            })

            if (currentDay.getMonth() === 0) {
                currentYear = currentDay.getFullYear() - 1;
                selectedYear = currentYear.toString();
            } else {
                currentYear = currentDay.getFullYear();
                selectedYear = currentYear.toString();
            }

            getAllReimbursements({
                year: selectedYear,
                contactId: this._contactId,
                accountId: this._accountId
            })
            .then((result) => {
                let reimbursementList = this.proxyToObject(result[0]);
                this.mileageList = reimbursementList;
                this.excelYtdList = this.proxyToObject(result[1]);
                this.ytdList = this.proxyToObject(result[1]);
                if (this.ytdList) {
                    this.ytdList.varibleAmountCalc = (this.ytdList.varibleAmountCalc) ? this.ytdList.varibleAmountCalc.replace(/\$/g, "") : this.ytdList.varibleAmountCalc;
                    this.ytdList.totalFixedAmountCalc = (this.ytdList.totalFixedAmountCalc) ? this.ytdList.totalFixedAmountCalc.replace(/\$/g, "") : this.ytdList.totalFixedAmountCalc;
                    this.ytdList.totalMonthlyFixedCalc = (this.ytdList.totalMonthlyFixedCalc) ? this.ytdList.totalMonthlyFixedCalc.replace(/\$/g, "") : this.ytdList.totalMonthlyFixedCalc;
                    this.ytdList.totalAVGCalc = (this.ytdList.totalAVGCalc) ? this.ytdList.totalAVGCalc.replace(/\$/g, "") : this.ytdList.totalAVGCalc;
                }
                console.log("getAllReimbursement", result)
                getDriverDetails({
                    contactId: this._contactId
                }).then((data) => {
                    if (data) {
                        let contactList = this.proxyToObject(data);
                        this.contactInformation = data;
                        this.userTriplogId = contactList[0].Triplog_UserID__c;
                        this.userEmail = contactList[0].External_Email__c;
                        this.userName = contactList[0].Name;
                        this.firstName = contactList[0].FirstName;
                        this.dateOfExpiration = contactList[0].Expiration_Date__c;
                        console.log("Name", this.userName, this.userEmail)
                        this.driverNotification(contactList[0].Notification_Message__c, contactList[0].Notification_Date__c, contactList[0].Insurance_Upload_Date__c);
                        // eslint-disable-next-line @lwc/lwc/no-async-operation
                        setTimeout(() => {
                            this.dispatchEvent(
                                new CustomEvent("show", {
                                    detail: "spinner"
                                })
                            );
                        }, 10);
                    }
                }).catch((error) => {
                    console.log("getDriverDetails error", error.message)
                })
            })
            .catch((error) => {
                console.log("getAllReimbursements error", error);
            });

    }
}