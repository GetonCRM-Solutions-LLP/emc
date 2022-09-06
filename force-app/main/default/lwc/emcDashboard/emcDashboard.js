import {
    LightningElement,
    track
} from 'lwc';
import setEmployeeNameLWC from "@salesforce/apex/AdminLWCDashboardController.setEmployeeNameLWC";
import getManager from "@salesforce/apex/TestReportController.getManager";
import chartData from "@salesforce/apex/TestReportController.getChartData";
import getAllDriversLastMonthUpdatedUnapprovedReimburseClone1LWC from "@salesforce/apex/AdminLWCDashboardController.getAllDriversLastMonthUpdatedUnapprovedReimburseClone1LWC";
import reimbursement from "@salesforce/apex/DriverDashboardFromAdminManager.getAllDriversLastMonthUpdatedReimbursements";
import getUnapprovedMileages from "@salesforce/apex/DriverDashboardFromAdminManager.getUnapprovedMileages";
import approvalTopMsg from '@salesforce/label/c.mileageApprovalTopMsg';
import approvalBottomMsg from '@salesforce/label/c.mileageApprovalBottomMsg';
export default class EmcDashboard extends LightningElement {
    tableHeaders = [{
            name: "Name",
            label: "Manager Name",
            arrowUp: false,
            arrowDown: false
        },
        {
            name: "Email",
            label: "Email",
            arrowUp: false,
            arrowDown: false
        },
    ];
    modelColumns = [{
            id: 1,
            name: "Trip Date",
            colName: "tripdate",
            arrUp: true,
            arrDown: false
        },
        {
            id: 2,
            name: "Origin",
            colName: "origin",
            arrUp: false,
            arrDown: false
        },
        {
            id: 3,
            name: "Dest.",
            colName: "destination",
            arrUp: false,
            arrDown: false
        },
        {
            id: 4,
            name: "Submitted",
            colName: "submitteddate",
            arrUp: false,
            arrDown: false
        },
        {
            id: 5,
            name: "Approved",
            colName: "approveddate",
            arrUp: false,
            arrDown: false
        },
        {
            id: 6,
            name: "Mileage",
            colName: "mileage",
            arrUp: false,
            arrDown: false
        },
        {
            id: 7,
            name: "Variable Amount",
            colName: "variableamount",
            arrUp: false,
            arrDown: false
        }
    ];
    modelData;
    objectsData = [];
    records = [];
    xlsHeader = []; // store all the headers of the the tables
    workSheetNameList = []; // store all the sheets name of the the tables
    xlsData = []; // store all tables data
    nameofEmployee;
    fileNameformanager;
    isModalOpen = false;
    isSpinner = false;
    isSpinnerForModal = false;
    showRecord = false;
    headerTop = approvalTopMsg;
    middleTop = approvalBottomMsg;
    contactId;
    accId;
    showTeam;
    testReimbursement = {
        approvedMileages: "108.40",
        contactid: "0030Z00003RIGVJQA5",
        isLockDate: false,
        isSelected: false,
        isSelectedEmailReminder: false,
        managerName: null,
        mileageid: null,
        mileagesList: null,
        month: "09-2021",
        name: "Harshad Pipaliya",
        reimbursementApproval: false,
        reimbursementIdList: ['a003r00000k9CzcAAE'],
        reimbursementid: "a003r00000k9CzcAAE",
        status: "Pending",
        threshold: "0.00",
        totalMileages: "0.00"
    }
    keyFields = ["Name", "Email"];
    modelKeyFields = ["tripdate", "origin", "destination", "submitteddate", "approveddate", "mileage", "variableamount"]
    tableList = [];
    chartContent;
    content = 'The modal content';
    header = 'The modal header';
    @track searchFields;
    @track showData = false;
    @track showTable = false;
    @track chartVisible = false;
    @track recordsToDisplay = []; //Records to be displayed on the page
    @track rowNumberOffset; //Row number
    checkboxType = false; //Checkbox
    isTrue = true;
    isFalse = false;
    modelName = "";
    lengthofmanager = false;
    //Capture the event fired from the paginator component
    handlePaginatorChange(event) {
        console.log(event.detail);
        this.recordsToDisplay = JSON.parse(event.detail);
        this.showData = (this.recordsToDisplay.length != 0) ? true : false;
        console.log("list", this.recordsToDisplay)
        if (this.recordsToDisplay[0] != undefined) {
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
        }

    }

    searchResult(searchText, data) {
        let result = [];
        for (const key in data) {
            let res;
            for (const item in data[key]) {
                if (this.keyFields.includes(item)) {
                    //hasOwnProperty : Returns true if the object has the specified property as own property; false otherwise.
                    if (data[key].hasOwnProperty.call(data[key], item)) {
                        const element = data[key][item];
                        if (element) {
                            res = element.toString().toUpperCase().includes(searchText);
                            if (res) {
                                result.push(data[key]);
                                console.log("result: ", result);
                                break;
                            }
                        }
                    }
                }
            }

        }
        return result;
    }
    handleKeyChange(event) {
         var searchKey;
         if(this.lengthofmanager === false){
            searchKey = event.detail.data.searchKey.toUpperCase();
            if(searchKey != undefined){
                console.log("inside search key: ", searchKey);
               this.tableList = this.searchResult(searchKey, this.records);
            }
            this.showRecord =  (this.tableList.length != 0) ? true : false;
        }else{
            searchKey = event.detail.data.searchKey;
            this.template.querySelector('c-c-paginator').handleDynamicSearch(searchKey);
        }
    }
    handleHeaderChange(event) {
        this.header = event.target.value;
    }

    handleContentChange(event) {
        this.content = event.target.value;
    }

    handleShowFirstModal() {
        console.log("modal body",(this.template.querySelectorAll('c-emc-modal')[0]));
        const modal = this.template.querySelectorAll('c-emc-modal')[0];
        modal.show();
    }

    handleShowSecondModal() {
        const modal = this.template.querySelectorAll('c-emc-modal')[1];
        modal.show();
    }

    handleCancelModal() {
        const modal = this.template.querySelector('c-emc-modal');
        modal.hide();
    }

    handleCloseModal() {
        const modal = this.template.querySelector('c-emc-modal');
        modal.hide();
    }

    closeModal() {
        this.isModalOpen = false;
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

    cancelProcess() {
        this.template.querySelector('c-c-team-dashboard').approvalProcess();
    }
    okforapprove(){
        this.isSpinnerForModal = true;
        getAllDriversLastMonthUpdatedUnapprovedReimburseClone1LWC({
            did: this.contactId,
            accid: this.accId,
            showTeamRecord: this.showTeam
        }).then(result => {
            console.log(result);
            if(result){
                this.template.querySelector('c-c-team-dashboard').updateUnapproveTable(result)
                const mileageModal = this.template.querySelectorAll('c-emc-modal')[4];
                mileageModal.hide();
                this.isModalOpen = false;
                this.isSpinnerForModal = false;
            }
        }).catch(error => {
            console.log({
                error
            });
        })
    }
    modalForApproval(event) {
        this.isSpinner = true;
        let self = this;
        if (event.detail) {
            setTimeout(()=>{
                self.isSpinner = false;
                const modal = self.template.querySelectorAll('c-emc-modal')[2];
                modal.show();
            }, 2000);
        }
    }
    alertModalForProcessing(event){
        console.log('modal->',this.template.querySelectorAll('c-emc-modal'))
        if(event.detail){
            const modal = this.template.querySelectorAll('c-emc-modal')[3];
            modal.show();
        }
    }
    modalForUnapprove(event) {
        var result;
        this.isSpinner = true;
        if (event.detail) {
            this.modelName = event.detail.name;
            getUnapprovedMileages({
                    reimbursementDetails: JSON.stringify(event.detail),
                })
                .then(data => {
                    var resultData = data.replace(/\\/g, '');
                    result = JSON.parse(resultData);
                    this.modelData = result.mileagesList;
                    this.modelData = this.sortByDate(this.modelData, 'tripdate')
                    this.modelData.forEach(element => {
                        let model = [];
                        if (element.status === "Approved") {
                            element.isSelected = true;
                        } else if (element.status === "Rejected") {
                            element.isChecked = true;
                        } else if (element.status === "Not Approved Yet") {
                            element.isSelected = false;
                            element.isChecked = false;
                        }
                        for (const key in element) {
                            let singleValue = {}
                            if (this.modelKeyFields.includes(key) != false) {
                                singleValue.key = key;
                                singleValue.value = element[key];
                                singleValue.isCurrency = (key === 'variableamount') ? true : false;
                                model.push(singleValue);
                            }
                        }
                        element.keyFields = this.mapOrder(model, this.modelKeyFields, 'key');

                    });
                    console.log("model", this.modelData);
                    this.isSpinner = false;
                    this.isModalOpen = true;

                })
                .catch(error => {
                    console.log({
                        error
                    });
                });
        }
    }

    mileageApproval(event){
        let self = this;
        this.isSpinnerForModal = true;
        this.template.querySelector('c-model-data-table').addbackdrop(true);
        if (event.detail) {
            setTimeout(()=>{
                const modal = self.template.querySelectorAll('c-emc-modal')[4];
                modal.show();
                self.isSpinnerForModal = false;
            }, 2000)
          
        }
    }

  
    toastEvent(event) {
        var flagCount = 0,
            approveCount = 0;
        if (event.detail) {
            flagCount = (event.detail.flag) ? event.detail.flag : 0;
            approveCount = (event.detail.approve) ? event.detail.approve : 0;
            this.dispatchEvent(
                new CustomEvent("toastformodal", {
                    detail: {
                        lengthOfFlag: flagCount,
                        lengthOfApprove: approveCount
                    }
                })
            );
        }
    }
    messageForApproval(event){
        const modal = this.template.querySelectorAll('c-emc-modal')[3];
        if(modal){
            modal.hide();
        }
    
        this.dispatchEvent(
            new CustomEvent("toastforapproval", {
                detail: event.detail
            })
        );
    }
    sortByDate(dlist, keyName) {
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
    connectedCallback() {
        var url_string = location.href;
        var url = new URL(url_string);
        this.contactId = url.searchParams.get("id");
        this.accId = url.searchParams.get("accid");
        var showteam = url.searchParams.get("showteam");
        this.showTeam = showteam;
        getManager({
                did:this.contactId,
                accid:  this.accId
            })
            .then(data => {
                this.showTable = true;
                console.log("list of manager", JSON.parse(data));
                let listOfManager = JSON.parse(data);
                this.lengthofmanager = (listOfManager.length > 30) ? true : false;
                this.showRecord =  (listOfManager.length != 0) ? true : false;
                listOfManager = this.sortByDate(listOfManager, 'Name');
                this.objectsData.push(["Name", "Email"]);
                listOfManager.forEach(element => {
                    let rows = [];
                    for (const key in element) {
                        let singleValue = {}
                        if (this.keyFields.includes(key) != false) {
                            singleValue.key = key;
                            singleValue.value = element[key];
                            singleValue.href =  (key === 'Email') ? "mailto:" + element[key] : "";
                            singleValue.isEmail = (key === 'Email') ? true : false;
                            rows.push(singleValue);
                        }
                    }
                    element.keyFields = this.mapOrder(rows, this.keyFields, 'key');
                    this.objectsData.push([element.Name, element.Email]);
                });
                this.tableList = listOfManager;
                this.records = listOfManager;
                console.log("Table list", this.tableList);
              
            })
            .catch(error => {
                console.log({
                    error
                });
            });

            setEmployeeNameLWC({
                conId: this.contactId
            }).then(result => {
                if (result) {
                    var emp = result.split(",");
                    this.nameofEmployee = emp[1];
                    this.fileNameformanager = this.nameofEmployee + '\'s Manager ' + this.dateFormat() + '.xlsx';
                }
            });
        chartData({
                did:this.contactId,
                showteam: this.showTeam,
                accid:  this.accId
            })
            .then(data => {
                this.chartVisible = true;
                this.chartContent = data;
                console.log("chart list->", JSON.parse(data));
            })
            .catch(error => {
                console.log({
                    error
                });
            });

        reimbursement({
                did: this.contactId,
                accid: this.accId,
                showTeamRecord: this.showTeam,
            })
            .then(data => {
                console.log("My Team list->", JSON.parse(data));
            })
            .catch(error => {
                console.log({
                    error
                });
            });
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
         sheet = _self.nameofEmployee + '\'s Manager List';
         await _self.xlsFormatter(_self.objectsData, sheet);
         console.log("xlxs data", _self.xlsData)
        if(_self.xlsData.length > 0) {
                _self.template.querySelector("c-xlsx-mockup").download();
        }
    }
}