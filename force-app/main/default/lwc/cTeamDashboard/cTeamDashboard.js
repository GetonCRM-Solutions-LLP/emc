import {
    LightningElement,
    track,
    api
} from 'lwc';
import fetchMileagesSize from "@salesforce/apex/TestReportController.fetchMileagesSize";
import setEmployeeNameLWC from "@salesforce/apex/AdminLWCDashboardController.setEmployeeNameLWC";
import unapprovedReimbursementsClone from "@salesforce/apex/AdminLWCDashboardController.getAllDriversLastMonthUpdatedUnapprovedReimburseClone";
import driversLastMonthUpdatedReimbursements from "@salesforce/apex/AdminLWCDashboardController.getAllDriversLastMonthUpdatedReimbursements";
import approveReimbursementsLWC from "@salesforce/apex/AdminLWCDashboardController.approveReimbursementsLWC";
import CheckBatchStatusLWC from "@salesforce/apex/AdminLWCDashboardController.CheckBatchStatusLWC";
import UpdatedReimListLWC from "@salesforce/apex/AdminLWCDashboardController.UpdatedReimListLWC";
import approveMileagesCloneLWC from "@salesforce/apex/AdminLWCDashboardController.approveMileagesCloneLWC";
export default class CTeamDashboard extends LightningElement {
    @track tableHeaders = [{
            name: "name",
            label: "Name",
            thClass: "vertical_align",
            arrowUp: true,
            arrowDown: false
        },
        {
            name: "totalMileages",
            label: "Submitted Mileage",
            cssClass: "head-title",
            arrowUp: false,
            arrowDown: false
        },
        {
            name: "rejectedMileages",
            label: "Flagged Mileage ",
            cssClass: "head-title",
            arrowUp: false,
            arrowDown: false
        },
        {
            name: "approvedMileages",
            label: "Approved Mileage",
            cssClass: "head-title",
            arrowDown: false,
            arrowDown: false
        },
    ];

    tableUnapproveHeaders = [{
            name: "name",
            label: "Name",
            thClass: "vertical_align",
            arrowUp: false,
            arrowDown: false
        },
        {
            name: "totalMileages",
            label: "Unapproved Mileage",
            cssClass: "head-title",
            arrowUp: false,
            arrowDown: false
        },
        {
            name: "approvedMileages",
            label: "Approved Mileage",
            cssClass: "head-title",
            arrowDown: false,
            arrowDown: false
        },
    ];
    keyFields = ["name", "totalMileages", "rejectedMileages", "approvedMileages"]
    unapproveKey = ["name", "totalMileages", "approvedMileages"]
    objectsData = [];
    excelDataForUnapprove = [];
    nameofEmployee;
    fileNameformyteam;
    fileNameforunapprove;
    filename;
    xlsHeader = []; // store all the headers of the the tables
    workSheetNameList = []; // store all the sheets name of the the tables
    xlsData = []; // store all tables data
    tableBody = [];
    librariesLoaded = false;
    lengthofUnapproveReimb = false;
    showRecordForUnapprove = false;
    lengthofMyTeam = false;
    showRecordForMyTeam = false;
    @track teamList = [];
    @track teamListforUnapprove = [];
    unapproveTList = [];
    myTeamReimbursement = [];
    unApprovedReimbusement = [];
    contactIdList = [];
    url_locate;
    contactId;
    accId;
    cssClass;
    isSpinner = false;
    isDownloading = false;
    displayUnapproveBtn = false;
    displayTeamBtn = false;
    displayApproveBtn = false;
    displayUnBtn = false;
    get showTeamClass() {
        this.cssClass = (this.showTeam === 'false') ? 'nav-pill-link active' : 'nav-pill-link';
        return this.cssClass;
    }
    get companyTabClass() {
        this.cssClass = (this.showTeam === 'true') ? 'nav-pill-link active' : 'nav-pill-link';
        return this.cssClass;
    }
    @track error;
    @track searchFields;
    @track showData = false;
    @track mileages; //All mileages available for data table    
    @track showUnapproveTable = false;
    @track showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    @track rowNumberOffset; //Row number
    checkboxType = true; //Checkbox

    renderList(v) {
        this.recordsToDisplay = v;
    }

    @api updateUnapproveTable(u) {
        var tList = JSON.parse(u);
        tList.forEach(element => {
            let rows = [];
            for (const key in element) {
                let singleValue = {}
                if (this.unapproveKey.includes(key) != false) {
                    singleValue.key = key;
                    singleValue.value = element[key];
                    singleValue.isLink = (key === 'name') ? true : false;
                    singleValue.isApprovalProcessing = (element.reimbursementApproval === true) ? true : false;
                    singleValue.unappoveList = true;
                    singleValue.isNumber = (key === 'totalMileages' || key === 'rejectedMileages' || key === 'approvedMileages') ? true : false;
                    rows.push(singleValue);
                }
            }

            element.keyFields = this.mapOrder(rows, this.unapproveKey, 'key');
            element.checkboxforapprove = (element.status != 'Approved' && element.totalMileages > '0.00' && !element.reimbursementApproval) ? true : false;
            element.isApproveDate = (element.status == 'Approved' && element.totalMileages > '0.00') ? true : false;
        });
        console.log('element', tList);
        this.unapproveTList = tList;
        if(this.lengthofUnapproveReimb === true || this.lengthofMyTeam === true){
            this.recordsToDisplay = tList;
            this.template.querySelector('c-c-paginator').setRecordsToDisplay()
        }
      
    }
    @api approvalProcess() {
        var tableList = this.tableBody;
        var unapproveTableList = this.unapproveTList;
        tableList.forEach((item) => {
            item.keyFields.forEach((r) => {
                r.isApprovalProcessing = true;
            });
            if (item.totalMileages > '0.00') {
                if (item.isSelected && item.status != 'Approved') {
                    item.reimbursementApproval = true;
                    item.checkboxforapprove = false;
                }
            }
        });

        unapproveTableList.forEach((item) => {
            item.keyFields.forEach((r) => {
                r.isApprovalProcessing = true;
            });
            if (item.totalMileages > '0.00') {
                if (item.isSelected && item.status != 'Approved') {
                    item.reimbursementApproval = true;
                    item.checkboxforapprove = false;
                }
            }
        });

        console.log("approvalProcess", unapproveTableList)

        this.tableBody = tableList;
        this.unapproveTList = unapproveTableList;
        if(this.lengthofUnapproveReimb === true || this.lengthofMyTeam === true){
            this.template.querySelector('c-c-paginator').renderPageNumber();
        }
        if (this.showUnapproveTable === true) {
            this.renderList(unapproveTableList);
        } else {
            this.renderList(tableList);
        }   
    }
    //Capture the event fired from the paginator component
    handlePaginatorChange(event) {
        this.recordsToDisplay = JSON.parse(event.detail);
        this.showData = (this.recordsToDisplay.length != 0) ? true : false;
        if (this.recordsToDisplay[0] != undefined) {
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
        }

    }

    togglePill(element) {
        element.classList.toggle("active");
    }
    pageData(bool, data) {
        var dataList = data;
        for (let i = 0; i < dataList.length; i++) {
            if (dataList[i]) {
                dataList[i].isSelected = bool;
            }
        }
        return dataList;
    }

    bodyList(bool, data) {
        var bodyList = data;
        for (let i = 0; i < bodyList.length; i++) {
            if (bodyList[i]) {
                bodyList[i].isSelected = bool;
            }
        }
        return bodyList;
    }

    handleAllRowSelection(event) {
        var _tCount = 0;
        this.displayTeamBtn = (event.detail === true) ? true : false;
        if(this.lengthofUnapproveReimb === true || this.lengthofMyTeam === true){
            this.recordsToDisplay = [...this.pageData(event.detail, this.recordsToDisplay)];
        }
        this.tableBody = [...this.bodyList(event.detail, this.tableBody)];
        for (let i = 0; i < this.tableBody.length; i++) {
            if (this.tableBody[i].totalMileages > '0.00') {
                if (this.tableBody[i].isSelected && this.tableBody[i].status != 'Approved') {
                    this.myTeamReimbursement.push(this.tableBody[i].id);
                    _tCount++;
                }
            }

        }
        if (_tCount > 0) {
            this.myTeamReimbursement = this.removeDuplicateValue(this.myTeamReimbursement);
        } else {
            this.myTeamReimbursement = []
        }
        console.log("team reimbursement", this.myTeamReimbursement);

    }
    handleAllUnapproveRowSelection(event) {
        var count = 0;
        this.displayUnapproveBtn = (event.detail === true) ? true : false;
        if(this.lengthofUnapproveReimb === true || this.lengthofMyTeam === true){
            this.recordsToDisplay = [...this.pageData(event.detail, this.recordsToDisplay)];
        }
        this.unapproveTList = [...this.bodyList(event.detail, this.unapproveTList)];
        for (let i = 0; i < this.unapproveTList.length; i++) {
            if (this.unapproveTList[i].isSelected) {
                if (this.unapproveTList[i].reimbursementIdList.length > 0) {
                    for (let j = 0; j < this.unapproveTList[i].reimbursementIdList.length; j++) {
                        this.unApprovedReimbusement.push(this.unapproveTList[i].reimbursementIdList[j])
                    }

                }
                count++;
            }
        }
        if (count > 0) {
            this.unApprovedReimbusement = this.removeDuplicateValue(this.unApprovedReimbusement);
        }

        if (event.detail === false) {
            this.unApprovedReimbusement = [];
        }

        console.log("unapprove", this.unApprovedReimbusement)
    }
    CheckStatus(runTime) {
        let self = this;
        var reimCount = 0;
        CheckBatchStatusLWC({
                batchprocessid: runTime.Id
            })
            .then(result => {
                if (result === 'Completed') {
                    this.isSpinner = true;
                    UpdatedReimListLWC({
                            did: this.contactId,
                            accid: this.accId,
                            showTeamRecord: this.showTeam
                        })
                        .then(result => {
                            if (result != null && result != '') {
                                this.dispatchEvent(
                                    new CustomEvent("approvalmessage", {
                                        detail: 'approval success'
                                    })
                                );
                                let rdata = JSON.parse(result[0].replace(/(&quot\;)/g, "\""));
                                let udata = JSON.parse(result[1].replace(/(&quot\;)/g, "\""));
                                console.log("Check unapprove", udata);
                                rdata = this.sortByName(rdata, 'name');
                                rdata.forEach(element => {
                                    let rows = [];
                                    for (const key in element) {
                                        let singleValue = {}
                                        if (this.keyFields.includes(key) != false) {
                                            singleValue.key = key;
                                            singleValue.value = element[key];
                                            singleValue.isLink = (key === 'name') ? true : false;
                                            singleValue.isApprovalProcessing = (element.reimbursementApproval === true) ? true : false;
                                            singleValue.isNumber = (key === 'totalMileages' || key === 'rejectedMileages' || key === 'approvedMileages') ? true : false;
                                            rows.push(singleValue);
                                        }
                                    }
                                    if (element.totalMileages > '0.00' && element.status != 'Approved') {
                                        reimCount++;
                                    }
                                    this.displayApproveBtn = (reimCount > 0) ? true : false;
                                    element.checkboxforapprove = ((element.status == 'Pending' || element.status == '' || element.status == undefined) && element.totalMileages > '0.00' && !element.reimbursementApproval) ? true : false;
                                    element.isApproveDate = ((element.status == 'Approved' || element.status == 'Rejected') && element.totalMileages > '0.00') ? true : false;
                                    element.keyFields = this.mapOrder(rows, this.keyFields, 'key');
                                });

                                this.tableBody = rdata
                                this.recordsToDisplay = rdata

                                udata.forEach(element => {
                                    let rows = [];
                                    for (const key in element) {
                                        let singleValue = {}
                                        if (this.unapproveKey.includes(key) != false) {
                                            singleValue.key = key;
                                            singleValue.value = element[key];
                                            singleValue.isLink = (key === 'name') ? true : false;
                                            singleValue.unappoveList = true;
                                            singleValue.isApprovalProcessing = (element.reimbursementApproval === true) ? true : false;
                                            singleValue.isNumber = (key === 'totalMileages' || key === 'rejectedMileages' || key === 'approvedMileages') ? true : false;
                                            rows.push(singleValue);
                                        }
                                    }

                                    element.keyFields = this.mapOrder(rows, this.unapproveKey, 'key');
                                    element.checkboxforapprove = (element.status != 'Approved' && element.totalMileages > '0.00' && !element.reimbursementApproval) ? true : false;
                                    element.isApproveDate = (element.status == 'Approved' && element.totalMileages > '0.00') ? true : false;
                                });

                                this.unapproveTList = udata;
                                if (this.showUnapproveTable === true) {
                                    this.recordsToDisplay = udata;
                                }
                                this.isSpinner = false;
                                setTimeout(function () {
                                    location.reload();
                                }, 2000);
                            }
                        }).catch(error => {
                            console.log({
                                error
                            });
                        })
                } else if (result.includes("Failed=")) {
                    var errResult = result.split("=");
                } else {
                    setTimeout(function () {
                        self.CheckStatus(runTime);
                    }, 5000);
                }
            }).catch(error => {
                console.log({
                    error
                });
            })
    }
    approveReimbursementOfDriver() {
        approveReimbursementsLWC({
                reimbursements: JSON.stringify(this.myTeamReimbursement),
                did: this.contactId,
                accid: this.accId,
                showTeamRecord: this.showTeam,
                updateThreshold: JSON.stringify(this.contactIdList)
            })
            .then(result => {
                this.isSpinner = true;
                if (result != null && result != '') {
                    this.isSpinner = false;
                    this.dispatchEvent(new CustomEvent('openmodalforapproval', {
                        detail: 'Approval Process'
                    }));
                    this.CheckStatus(result);
                }
            })
            .catch(error => {
                console.log({
                    error
                });
            })
    }

    unapproveReimbursementsofDriver() {
        console.log("unapprove reimbursement", this.unApprovedReimbusement)
        approveMileagesCloneLWC({
                mileages: JSON.stringify(this.unApprovedReimbusement),
                did: this.contactId,
                accid: this.accId,
                showTeamRecord: this.showTeam,
            })
            .then(result => {
                if (result != null && result != '') {
                    this.dispatchEvent(new CustomEvent('openmodalforapproval', {
                        detail: 'Approval Process'
                    }));
                    this.CheckStatus(result);
                }
            })
            .catch(error => {
                console.log({
                    error
                });
            })
    }
    lengthOfTeamCheckbox() {
        var _teamTable = this.tableBody;
        var _lengthCount = 0;
        for (let i = 0; i < _teamTable.length; i++) {
            if ((_teamTable[i].status == 'Pending' || _teamTable[i].status == '' || _teamTable[i].status == undefined) && _teamTable[i].totalMileages > '0.00') {
                _lengthCount++;
            }
        }
        return _lengthCount;

    }

    lengthOfUnapproveCheckbox() {
        var _unteamTable = this.unapproveTList;
        var _countLength = 0;
        for (let i = 0; i < _unteamTable.length; i++) {
            if ((_unteamTable[i].status != 'Approved' && _unteamTable[i].totalMileages > '0.00')) {
                _countLength++;
            }
        }
        return _countLength;
    }
    checkUncheckRow(id, value, table) {
        var _tbody = table
        for (let i = 0; i < _tbody.length; i++) {
            _tbody[i].isSelected = (_tbody[i].contactid === id) ? value : _tbody[i].isSelected;
        }

        return true;
    }

    childMethodCall(c) {
        this.template.querySelector('c-dashboard-table').manageSelectAllStyle(c);
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

            if (exists == false && value != "") {
                newArray.push(value);
            }
        })

        return newArray;
    }
    handleRowSelection(event) {
        var _target = event.detail.rowId;
        var _checkbox = event.detail.checked;
        var _reimbID = event.detail.reimbId;
        var _total = this.tableBody.length;
        var _body = this.tableBody;
        var _lengthOfChk = this.lengthOfTeamCheckbox();
        var _tcount = 0;
        if (this.checkUncheckRow(_target, _checkbox, this.tableBody)) {
            for (let i = 0; i < _total; i++) {
                if (_body[i].totalMileages > '0.00') {
                    if (_body[i].isSelected && _body[i].status != 'Approved') {
                        this.myTeamReimbursement.push(_body[i].id);
                        _tcount++;
                    }
                }
            }
        }


        this.displayTeamBtn = (_tcount > 0) ? true : false;
        if (_tcount > 0) {
            this.myTeamReimbursement = this.removeDuplicateValue(this.myTeamReimbursement);
            if (_checkbox === false) {
                this.myTeamReimbursement.forEach((el) => {
                    if (el === _reimbID) {
                        this.myTeamReimbursement = this.myTeamReimbursement.filter(item => item !== _reimbID);
                    }
                })
            }

        } else {
            this.myTeamReimbursement = [];
        }
        console.log("single row", this.myTeamReimbursement)
        if (_tcount === _total || _tcount === _lengthOfChk) {
            this.childMethodCall(true)
        } else {
            this.childMethodCall(false);
        }
    }

    handleUnapproveRowSelection(event) {
        var _untarget = event.detail.rowId;
        var _reID = event.detail.unapproveId;
        var _uncheckbox = event.detail.checked;
        var _untotal = this.unapproveTList.length;
        var _unbody = this.unapproveTList;
        var _checkboxLen = this.lengthOfUnapproveCheckbox();
        var _untcount = 0;
        if (this.checkUncheckRow(_untarget, _uncheckbox, this.unapproveTList)) {
            for (let i = 0; i < _untotal; i++) {
                if (_unbody[i].totalMileages > '0.00') {
                    if (_unbody[i].isSelected) {
                        console.log(_unbody[i].reimbursementIdList);
                        if (_unbody[i].reimbursementIdList.length > 0) {
                            for (let j = 0; j < _unbody[i].reimbursementIdList.length; j++) {
                                this.unApprovedReimbusement.push(_unbody[i].reimbursementIdList[j])
                            }

                        }
                        _untcount++;
                    }
                }
            }
        }
        this.displayUnapproveBtn = (_untcount > 0) ? true : false;
        if (_untcount > 0) {
            this.unApprovedReimbusement = this.removeDuplicateValue(this.unApprovedReimbusement);
            if (_uncheckbox === false) {
                this.unApprovedReimbusement.forEach((el) => {
                    if (el === _reID) {
                        this.unApprovedReimbusement = this.unApprovedReimbusement.filter(item => item !== _reID)
                    }
                })
            }
        } else {
            this.unApprovedReimbusement = [];
        }

        console.log("unapprove check", this.unApprovedReimbusement)
        if (_untcount === _untotal || _untcount === _checkboxLen) {
            this.childMethodCall(true)
        } else {
            this.childMethodCall(false);
        }
    }
    mapOrder(array, order, key) {
        array.sort(function (a, b) {
            var A = a[key],
                B = b[key];
            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }
        });

        return array;
    }
    sortByName(dlist, keyName) {
        dlist.sort(function (a, b) {
            var nameA = (a[keyName] == null) ? '' : a[keyName].toLowerCase(),
                nameB = (b[keyName] == null) ? '' : b[keyName].toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })

        return dlist;
    }

    myTeamTabClick() {
        this.url_locate = "/apex/LWC_Profile_Page?accid=" + this.accId + "&id=" + this.contactId + "&showteam=" + "false";
        location.assign(this.url_locate);
    }
    unApproveTabClick() {
        var unCount = 0;
        this.showTable = false;
        this.showUnapproveTable = true;
        this.searchFields = "Unapprove Tab"
        var unapproveTab = this.template.querySelector('[data-id="unapprove-pills"]');
        var companyTab = this.template.querySelector('[data-id="showteam-pills"]');
        var myTeamTab = this.template.querySelector('[data-id="myteam-pills"]');
        if (myTeamTab.className.includes('active')) {
            this.togglePill(myTeamTab);
        }
        if (companyTab.className.includes('active')) {
            this.togglePill(companyTab);
        }
        if (!unapproveTab.className.includes('active')) {
            this.togglePill(unapproveTab);
        }
        this.unapproveTList.forEach(element => {
            if (element.totalMileages > '0.00' && element.status != 'Approved') {
                unCount++;
            }
            if (this.showUnapproveTable) {
                this.displayApproveBtn = (unCount > 0) ? true : false;
            } else {
                this.displayApproveBtn = false;
            }
        });
    }
    showTeamTabClick() {
        this.url_locate = "/apex/LWC_Profile_Page?accid=" + this.accId + "&id=" + this.contactId + "&showteam=" + "true";
        location.assign(this.url_locate);
    }


    handleOpenModalForUnapprove(event) {
        this.dispatchEvent(new CustomEvent('openmodalforunapprovedata', {
            detail: event.detail
        }));
    }

    alertForProcessing(event) {
        this.dispatchEvent(new CustomEvent('alertprocessing', {
            detail: event.detail
        }));
    }
    dateFormat() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return month.toString() + day.toString() + year.toString() + hour.toString() + minute.toString() + second.toString();
    }

    getURL() {
        var url_string = location.href;
        var url = new URL(url_string);
        this.contactId = url.searchParams.get("id");
        this.accId = url.searchParams.get("accid");
        var showteam = url.searchParams.get("showteam");
        this.showTeam = showteam;
    }
    connectedCallback() {
        console.log('connected callback');
        this.getURL();
        var reimCount = 0;
        setEmployeeNameLWC({
            conId: this.contactId
        }).then(result => {
            if (result) {
                var emp = result.split(",");
                this.nameofEmployee = emp[1];
                this.fileNameformyteam = this.nameofEmployee + '\'s My Team Mileage ' + this.dateFormat() + '.xlsx';
                this.fileNameforunapprove = this.nameofEmployee + '\'s Unapproved Mileage ' + this.dateFormat() + '.xlsx';
            }
        });


        driversLastMonthUpdatedReimbursements({
                did: this.contactId,
                accid: this.accId,
                showTeamRecord: this.showTeam,
            })
            .then(result => {
                this.showTable = true;
                this.searchFields = "Team Tab"
                let data = JSON.parse(result);
                console.log("Data", data);
                this.lengthofMyTeam = (data.length > 30) ? true : false;
                this.showRecordForMyTeam = (data.length != 0) ? true : false;
                data = this.sortByName(data, 'name');
                this.objectsData.push(["Name", "Month", "Status", "Approved Mileage", "Approval Threshold", "Submited Mileage", "Rejected Mileage"])
                data.forEach(element => {
                    let rows = [];
                    for (const key in element) {
                        let singleValue = {}
                        if (this.keyFields.includes(key) != false) {
                            singleValue.key = key;
                            singleValue.value = element[key];
                            singleValue.isLink = (key === 'name') ? true : false;
                            singleValue.isNumber = (key === 'totalMileages' || key === 'rejectedMileages' || key === 'approvedMileages') ? true : false;
                            singleValue.isApprovalProcessing = (element.reimbursementApproval === true) ? true : false;
                            rows.push(singleValue);
                        }
                    }
                    if (element.totalMileages > '0.00' && element.status != 'Approved') {
                        reimCount++;
                    }
                    this.displayApproveBtn = (reimCount > 0) ? true : false;
                    element.checkboxforapprove = ((element.status == 'Pending' || element.status == '' || element.status == undefined) && element.totalMileages > '0.00' && !element.reimbursementApproval) ? true : false;
                    element.isApproveDate = ((element.status == 'Approved' || element.status == 'Rejected') && element.totalMileages > '0.00') ? true : false;
                    element.keyFields = this.mapOrder(rows, this.keyFields, 'key');
                    this.objectsData.push([element.name, element.month, element.status, element.approvedMileages, (element.threshold != null || element.threshold != undefined) ? (element.threshold).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : element.threshold, element.totalMileages, element.rejectedMileages])
                });

                this.teamList = data;
                this.tableBody = this.teamList
                console.log(this.tableBody)

            })
            .catch(error => {
                console.log({
                    error
                });
            })

        unapprovedReimbursementsClone({
                did: this.contactId,
                accid: this.accId,
                showTeamRecord: this.showTeam,
            })
            .then(result => {
                let unapprovedata = JSON.parse(result);
                console.log("Result", unapprovedata);
                this.lengthofUnapproveReimb = (unapprovedata.length > 30) ? true : false;
                this.showRecordForUnapprove = (unapprovedata.length != 0) ? true : false;
                this.excelDataForUnapprove.push(["Name", "Month", "Approval Threshold", "Approved Mileage", "Submited Mileage"])
                unapprovedata.forEach(element => {
                    let rows = [];
                    for (const key in element) {
                        let singleValue = {}
                        if (this.unapproveKey.includes(key) != false) {
                            singleValue.key = key;
                            singleValue.value = element[key];
                            singleValue.isLink = (key === 'name') ? true : false;
                            singleValue.isApprovalProcessing = (element.reimbursementApproval === true) ? true : false;
                            singleValue.unappoveList = true;
                            singleValue.isNumber = (key === 'totalMileages' || key === 'rejectedMileages' || key === 'approvedMileages') ? true : false;
                            rows.push(singleValue);
                        }
                    }

                    element.keyFields = this.mapOrder(rows, this.unapproveKey, 'key');
                    element.checkboxforapprove = (element.status != 'Approved' && element.totalMileages > '0.00' && !element.reimbursementApproval) ? true : false;
                    element.isApproveDate = (element.status == 'Approved' && element.totalMileages > '0.00') ? true : false;
                    this.excelDataForUnapprove.push([element.name, element.month, (element.threshold != null || element.threshold != undefined) ? (element.threshold).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : element.threshold, element.approvedMileages, element.totalMileages]);
                });

                this.teamListforUnapprove = unapprovedata;
                this.unapproveTList = this.teamListforUnapprove;

            })
            .catch(error => {
                console.log({
                    error
                });
            })

        // fetchMileagesSize()
        // .then(response => {
        //     this.showTable = true;
        //     let data = JSON.parse(response);
        //     // console.log({data});
        //     data.forEach(element => {
        //        let rows = [];
        //        let arrayItem = {}
        //        element.Contact_Id_Name__c = element.EmployeeReimbursement__r.Contact_Id_Name__c;
        //        element.isSelected = false;
        //     //     arrayItem.Id = element.Id;
        //     //     arrayItem.Contact_Id_Name__c = element.EmployeeReimbursement__r.Contact_Id_Name__c;
        //     //     arrayItem.Origin_Name__c = element.Origin_Name__c;
        //     //     arrayItem.Destination_Name__c = element.Destination_Name__c;
        //     //     arrayItem.Mileage__c = element.Mileage__c;
        //     //     arrayItem.Trip_Date__c = element.Trip_Date__c;
        //         for (const key in element) {
        //             let singleValue = {}
        //             if(this.keyFields.includes(key) != false) {
        //                 singleValue.key = key;
        //                 singleValue.value = element[key];
        //                 singleValue.isLink = (key === 'Contact_Id_Name__c') ? true : false;
        //                 singleValue.isNumber = (key === 'Mileage__c') ? true : false;
        //                 rows.push(singleValue);
        //             }
        //         }
        //         arrayItem.detail = element;
        //         arrayItem.keyFields = this.mapOrder(rows, this.keyFields, 'key');
        //     //     console.log("rows", rows);
        //      this.tableBody.push(arrayItem);
        //      //this.tableBody.push(rows);
        //     });
        //     console.log(this.tableBody)
        // })
        // .catch(error => {
        //     console.log({error});
        // });
    }
    // formating the data to send as input to  xlsxMain component
    xlsFormatter(data, sheetName) {
        // let Header = data[0]
        // this.xlsHeader.push(Header);
        this.workSheetNameList.push(sheetName);
        this.xlsData.push(data);
    }

    // calling the download function from xlsxMain.js
    async download() {
        let _self , sheet;
        _self = this;
        _self.xlsHeader = []; // store all the headers of the the tables
        _self.workSheetNameList = []; // store all the sheets name of the the tables
        _self.xlsData = []; 
         sheet = _self.nameofEmployee + '\'s My Team Mileage';
         await _self.xlsFormatter(_self.objectsData, sheet);
        if(_self.xlsData.length > 0) {
                _self.template.querySelector("c-xlsx-mockup").download();
        }
    }

    async unapproveDownload() {
        let unsheet, _self;
        _self = this;
        _self.xlsHeader = []; // store all the headers of the the tables
        _self.workSheetNameList = []; // store all the sheets name of the the tables
        _self.xlsData = []; 
        unsheet = _self.nameofEmployee + '\'s Unapprove Mileage'
        await _self.xlsFormatter(_self.excelDataForUnapprove, unsheet);
        if(_self.xlsData.length > 0){
            _self.template.querySelector("c-xlsx-mockup").download();
        }
    }
}