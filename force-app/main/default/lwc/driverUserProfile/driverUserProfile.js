import { LightningElement, api, wire } from 'lwc';
import carImage from '@salesforce/resourceUrl/EmcCSS';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getDriverDetails  from '@salesforce/apex/DriverDashboardLWCController.getDriverDetails';
import getReimbursementData from '@salesforce/apex/DriverDashboardLWCController.getReimbursementData';
import getMileages from "@salesforce/apex/DriverDashboardLWCController.getMileages";
import getGasPriceandRate from "@salesforce/apex/DriverDashboardLWCController.getGasPriceandRate";
import getAllReimbursements from "@salesforce/apex/DriverDashboardLWCController.getAllReimbursements";
import getDrivingState  from '@salesforce/apex/DriverDashboardLWCController.getDrivingState';
import {
    events
} from 'c/utils';
export default class DriverUserProfile extends LightningElement {
    profileCarImage = carImage + '/emc-design/assets/images/car.png';
    milesIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/1.png';
    moneyIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/2.png';
    variableRateIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/3.png';
    fuelIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/4.png';
    maginifyIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/5.png';
    umbrellaIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/6.png';
    milesPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/7.png';
    calendarPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/8.png';
    carPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/9.png';
    insurancePlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/10.png';
    searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
    flagIcon = resourceImage + '/mburse/assets/Vector.png';
    flagRejectIcon = resourceImage + '/mburse/assets/mBurse-Icons/Tooltip/flag.png';
    unapproveIcon = resourceImage + '/mburse/assets/mBurse-Icons/Tooltip/unapprove.png';
    approveIcon = resourceImage + '/mburse/assets/mBurse-Icons/Tooltip/approve.png';
    checkMark = resourceImage + '/mburse/assets/mBurse-Icons/check.png';
    crossMark = resourceImage + '/mburse/assets/mBurse-Icons/Cross.png';
    circle = resourceImage + '/mburse/assets/mBurse-Icons/Ellipse.png';
    cross = resourceImage + '/mburse/assets/mBurse-Icons/notify-cancel.png';
    error = resourceImage + '/mburse/assets/mBurse-Icons/Error-notify.png';
    @api isNotify;
    @api notifyMessageList;
    @api notifyMessage;
    @api reimbursementYtd;
    @api excelYtd;
    headerModalText = '';
    ytd = false;
    biweekYtd = false;
    modalLength = false;
    modalStyle = '';
    headerText = '';
    monthText = '';
    lastMonth = '';
    subTitle = '';
    thisMonth = '';
    vehicleType = '';
    planYear = '';
    complianceMileage = '';
    vehicleValue = '';
    insurancePlan = '';
    complianceStatus = '';
    annualMileage = '';
    annualReimbursement = '';
    templateName = '';
    lastMonthMiles = '';
    thisMonthMiles = '';
    halfFixedAmount = '';
    fixedAmount = '';
    variableRate = '';
    monthfuelPrice = '';
    lastMonthMileageRate = '';
    lastMilesZero = '';
    thisMilesZero = '';
    halfFixedZero= '';
    fixedAmountZero = '';
    fuelPriceZero = '';
    mileageRateZero = '';
    year = '';
    address = '';
    vehicleImage;
    chartList;
    contactName;
    renderedInitialized = false;
    planInsurance = false;
    planMileage = false;
    planVehicleAge = false;
    planVehicleValue = false;
    planCompliance = false;
    isSortable = false;
    isValid = false;
    isFalse = false;
    isTrue = true;
    isScrollable = true;
    download = true;
    variable = true;
    view = false;
    viewAllNotification = false;
    lastModelList;
    originalModelList;
    modalKeyFields;
    modalListColumn;
    lastMonthColumn = [{
            id: 1,
            name: "Trip date",
            colName: "tripdate",
            colType: "Date",
            arrUp: true,
            arrDown: false
        },
        {
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
            name: "Approved",
            colName: "approveddate",
            colType: "Date",
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
            name: "Variable Amount",
            colName: "variableamount",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        }
    ];
    lastMonthKeyFields = ["tripdate", "originname", "destinationname", "submitteddate", "approveddate", "mileage", "variableamount"]
    thisMonthColumn = [{
        id: 1,
        name: "Trip date",
        colName: "tripdate",
        colType: "Date",
        arrUp: true,
        arrDown: false
    },
    {
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
        name: "Mileage",
        colName: "mileage",
        colType: "Decimal",
        arrUp: false,
        arrDown: false
    }
    ];
    thisMonthKeyFields = ["tripdate", "originname", "destinationname", "mileage"]
    gasPriceColumn = [{
        id: 1,
        name: "",
        colName: "ReimMonth",
        colType: "String",
        arrUp: false,
        arrDown: false
    },{
            id: 2,
            name: "Gas Prices",
            colName: "fuelPrice",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        },
        {
            id: 3,
            name: "Mileage Rate",
            colName: "VariableRate",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        }
    ];
    gasPriceKeyFields = ["ReimMonth", "fuelPrice", "VariableRate"]
    biweekKeyFields = ["month", "variableRate", "mileage","varibleAmount","fixed1","fixed2","fixed3","totalFixedAmount", "avgToDate"]
    biweekColumn = [{
        id: 1,
        name: "",
        colName: "month"
    },
    {
        id: 2,
        name: "Mi Rate",
        colName: "variableRate"
    },
    {
        id: 3,
        name: "Mileage",
        colName: "mileage"
    },
    {
        id: 4,
        name: "Variable",
        colName: "varibleAmount"
    },
    {
        id: 5,
        name: "Fixed 1",
        colName: "fixed1"
    },
    {
        id: 6,
        name: "Fixed 2",
        colName: "fixed2"
    },
    {
        id: 7,
        name: "Fixed 3",
        colName: "fixed3"
    },{
        id: 8,
        name: "Total",
        colName: "totalFixedAmount"
    },{
        id: 9,
        name: "Avg to Date",
        colName: "avgToDate"
    }
    ]

    monthKeyFields = [
        "month",
        "fuel",
        "mileage",
        "variableRate",
        "varibleAmount",
        "fixedAmount",
        "totalReimbursements",
        "avgToDate"
    ]

    monthColumn = [
        {
          id: 1,
          name: "",
          colName: "month"
        },
        {
          id: 2,
          name: "Fuel",
          colName: "fuel"
        },
        {
          id: 3,
          name: "Mileage",
          colName: "mileage"
        },
        {
          id: 4,
          name: "Mi Rate",
          colName: "variableRate"
        },
        {
          id: 5,
          name: "Variable",
          colName: "varibleAmount"
        },
        {
          id: 6,
          name: "Fixed",
          colName: "fixedAmount"
        },
        {
          id: 7,
          name: "Total",
          colName: "totalReimbursements"
        },{
            id: 8,
            name: "Avg to Date",
            colName: "avgToDate"
        }
    ]
    paginatedModal = false;
    @api sectionClass;
    @api contactId;
    @api accountId;
    @api chartInfo;

    getNumber(num) {
       // if (this.contactDetails) {
        //    if (num != null) {
                return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          //  }
      //  }
    }

    getMonthName(monthIndex){
        let daymonth = new Array();
        daymonth[0] = "January";
        daymonth[1] = "February";
        daymonth[2] = "March";
        daymonth[3] = "April";
        daymonth[4] = "May";
        daymonth[5] = "June";
        daymonth[6] = "July";
        daymonth[7] = "August";
        daymonth[8] = "September";
        daymonth[9] = "October";
        daymonth[10] = "November";
        daymonth[11] = "December";
        return  daymonth[monthIndex]
    }

    proxyToObject(e) {
        return JSON.parse(e)
    }

    mapOrder(array, order, key) {
        array.sort(function (a, b) {
            var A = a[key],
                B = b[key];
            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            }
            return -1;
        });

        return array;
    }

    sortByMonthAsc(data, colName) {
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        data.sort((a, b) => {
          return months.indexOf(a[colName]) - months.indexOf(b[colName]);
        });
        return data;
      }
      
    dynamicBinding(data, keyFields) {
        data.forEach(element => {
            let model = [];
            for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                    let singleValue = {}
                    if (keyFields.includes(key) !== false) {
                        singleValue.key = key;
                        singleValue.value = (element[key] === "null" || element[key] === null) ? "" : (key === "variableRate" || key === "varibleAmount" || key === 'fixed1' || key === 'fixed2' || 
                        key === 'fixed3' || 
                        key === 'totalFixedAmount' || key === "totalReimbursements") ? element[key].replace(/\$/g, "").replace(/\s/g, "") : element[key];
                        // singleValue.isCurrency = (key === 'variableamount' || key === 'VariableRate' || key === 'variableRate'  || key === 'varibleAmount' || key === 'fixed1' || key === 'fixed2' || key === 'fixed3' || key === 'totalFixedAmount') ? true : false;
                        singleValue.truncate = (key === 'originname' || key === 'destinationname') ? true : false;
                        singleValue.bold = (key === "month" || key === "ReimMonth") ? true : false;
                        singleValue.tooltip = (key === 'originname' || key === 'destinationname') ? true : false;
                        singleValue.tooltipText = (key === 'originname') ? (element.origin != null ? element.origin : 'This trip was manually entered without an address.') : (element.destination != null ? element.destination : 'This trip was manually entered without an address.');
                        singleValue.twoDecimal = (key === "mileage" )? true : false;
                        singleValue.isfourDecimalCurrency = (key === 'variableRate' || key === 'VariableRate') ? true : false;
                        singleValue.istwoDecimalCurrency = (key === "fuel" || key === "avgToDate" ||
                        key === "fixedAmount" ||
                        key === "totalReimbursements" ||
                        key === "fuelPrice" ||
                        key === "varibleAmount" ||
                        key === 'variableamount' ||
                        key === 'fixed1' || key === 'fixed2' || 
                        key === 'fixed3' || 
                        key === 'totalFixedAmount' ||
                        key === "totalReim" ||
                        key === "variable") ? true : false;
                        
                        singleValue.hasLeadingZero = ((key === "fuel" ||
                        key === "fixedAmount" ||
                        key === "totalReimbursements" ||
                        key === "variableRate" ||
                        key === "varibleAmount" ||
                        key === "fuelPrice" ||
                        key === 'variableamount' || 
                        key === 'VariableRate' ||
                        key === 'totalFixedAmount' ||
                        key === "totalReim" ||
                        key === "variable" || key === "mileage" ||
                        key === "fixed1" || key === "fixed2" ||
                        key === "fixed3") && ((element[key] !== "null" || element[key] !== null) && (singleValue.value !== '0.00') && (singleValue.value !== '0.0000')) && (/^0+/).test(singleValue.value) === true) ? (singleValue.value).replace(/^0+/, '') : null;
                        model.push(singleValue);
                    }
                }
            }
            element.rejectedClass = (element.status === 'Rejected') ? 'rejected' : '';
            element.isYtd = (this.templateName === 'Biweek' || this.templateName === 'Monthly') ? true : false;
            element.isYtdBiweek = (this.templateName === 'Biweek') ? true : false;
            element.keyFields = this.mapOrder(model, keyFields, 'key');
        });
    }

    showAll(){
        this.dispatchEvent(
            new CustomEvent("modal", {
              detail: ''
            })
          );
        // this.viewAllNotification = true;
        // console.log(this.viewAllNotification)
        // if(this.viewAllNotification){
        //     this.template.querySelector('c-user-profile-modal').show();
        // }
        //this.template.querySelector('.notify-container').classList.remove('overflow');
    }

    handleChange(event) {
		this._value = event.target.value;
        this.template.querySelector('c-user-data-table').searchByKey(this._value, this.lastModelList)
	}

    handleClose(event) {
        var eId = event.target.dataset.id;
        this.dispatchEvent(
            new CustomEvent("close", {
              detail: eId
            })
          );
    }
    
    // @api hide(eId){
    //     this.template.querySelector(`.notify-text[data-id="${eId}"]`).classList.add('slds-hide');
    // }


    getLastMonthMileage(){
       // this.viewAllNotification = false;
        this.paginatedModal = true;
        this.isScrollable = true; 
        this.isSortable = true;
        this.download = true;
        this.variable = true;
        this.ytd = false;
        this.biweekYtd = false;
        getMileages({
            clickedMonth: this.lastMonth,
            year: this.year,
            contactId: this.contactId
        })
        .then(data => {
            let resultData = data[0].replace(/\\/g, '');
            this.headerText = 'Last month';
            this.monthText =  '(' + this.lastMonth + ')';
            this.lastModelList = JSON.parse(resultData);
            this.modalLength = this.lastModelList.length > 0 ? true : false;
            this.originalModelList = JSON.parse(resultData);
            this.modalListColumn = this.lastMonthColumn;
            this.modalKeyFields = this.lastMonthKeyFields;
            console.log("My getMileages list->", resultData);
            this.dynamicBinding(this.lastModelList, this.modalKeyFields);
            this.template.querySelector('c-user-profile-modal').show();
        })
        .catch(error => {
            console.log({
                error
            });
        });
    }

    getThisMonthMileage(){
       // this.viewAllNotification = false;
        this.paginatedModal = true;
        this.isScrollable = true;
        this.isSortable = true;
        this.download = true;
        this.ytd = false;
        this.biweekYtd = false;
        this.variable = false;
        getMileages({
            clickedMonth: this.thisMonth,
            year: this.year,
            contactId: this.contactId
        })
        .then(data => {
            let resultData = data[0].replace(/\\/g, '');
            this.headerText = 'This month';
            this.monthText =  '(' + this.thisMonth + ')';
            this.lastModelList = JSON.parse(resultData);
            this.modalLength = this.lastModelList.length > 0 ? true : false;
            this.originalModelList = JSON.parse(resultData);
            this.modalListColumn = this.thisMonthColumn;
            this.modalKeyFields = this.thisMonthKeyFields;
            console.log("My getMileages list->", resultData);
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
        })
        .catch(error => {
            console.log({
                error
            });
        });
    }

    getGasPrice(){
        this.templateName = 'Gas Price';
       // this.viewAllNotification = false;
        this.ytd = false;
        this.biweekYtd = false;
        this.paginatedModal = false;
        this.isScrollable = false;
        this.isSortable = false;
        this.modalStyle = 'slds-modal slds-modal_x-small slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__faster';
        getGasPriceandRate({
            contactId : this.contactId
        })
        .then(data => {
            let gasPriceList = this.proxyToObject(data);
            this.headerText = '';
            this.monthText =  '';
            this.lastModelList = this.sortByMonthAsc(gasPriceList, "ReimMonth");
            this.originalModelList = gasPriceList;
            this.modalListColumn = this.gasPriceColumn;
            this.modalKeyFields = this.gasPriceKeyFields;
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
            console.log("gasPrice ----", gasPriceList)
        })
    }

    getBiweekReimbursement(){
        this.templateName = 'Biweek';
       // this.viewAllNotification = false;
        this.biweekYtd = true;
        this.paginatedModal = false;
        this.isScrollable = false;
        this.isSortable = false;
        this.modalStyle = 'slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__faster';
        getAllReimbursements({
            year: this.year,
            contactId : this.contactId,
            accountId : this.accountId
        })
        .then(data => {
            let biweekReimbursementList = this.proxyToObject(data[0]);
            this.ytd = (biweekReimbursementList.length > 0) ? true : false;
            this.headerText = '';
            this.monthText =  '';
            this.lastModelList = this.sortByMonthAsc(biweekReimbursementList, "month");
            this.originalModelList = biweekReimbursementList;
            this.modalListColumn = this.biweekColumn;
            this.modalKeyFields = this.biweekKeyFields;
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
            console.log("getAllReimbursements ----", data)
        })
    }

    getMonthReimbursement(){
        this.templateName = 'Monthly';
      //  this.viewAllNotification = false;
        //this.ytd = true;
        this.biweekYtd = false;
        this.paginatedModal = false;
        this.isScrollable = false;
        this.isSortable = false;
        this.modalStyle = 'slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__faster';
        getAllReimbursements({
            year: this.year,
            contactId : this.contactId,
            accountId : this.accountId
        })
        .then(data => {
            let biweekReimbursementList = this.proxyToObject(data[0]);
            this.ytd = (biweekReimbursementList.length > 0) ? true : false;
            this.headerText = '';
            this.monthText =  '';
            this.lastModelList = this.sortByMonthAsc(biweekReimbursementList, "month");
            this.originalModelList = biweekReimbursementList;
            this.modalListColumn = this.monthColumn;
            this.modalKeyFields = this.monthKeyFields;
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
            console.log("getAllReimbursements ----", data)
        })
    }

    excelToExport(data, file, sheet){
        this.template.querySelector('c-export-excel').download(data, file, sheet);
    }

    dateTime(date){
        var yd, ydd,ymm, yy, hh, min ,sec;
        yd = date
        ydd = yd.getDate();
        ymm = yd.getMonth() + 1;
        yy = yd.getFullYear();
        hh = yd.getHours();
        min = yd.getMinutes();
        sec = yd.getSeconds();
        ydd = (ydd < 10) ? ('0' + ydd) : ydd;
        ymm = (ymm < 10) ? ('0' + ymm) : ymm;
        console.log(ymm + ydd);
        console.log(yy.toString(), hh.toString(), min.toString(), sec.toString());
        return  ymm.toString() + ydd.toString() + yy.toString() + hh.toString() + min.toString() + sec.toString();
    }

    downloadUserTrips(){
        if(this.headerText === 'This month'){
            let mileage = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s This Month Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'This Month Mileage Report';
            mileage.push(["Contact Email", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status"])
            this.lastModelList.forEach((item)=>{
                mileage.push([item.emailaddress,  item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status])
            })
            this.excelToExport(mileage, fileName, sheetName);
        }else{
            let mileage = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Last Month Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Last Month Mileage Report';
            mileage.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Variable Rate", "Amount", "Notes", "Tags"])
            this.lastModelList.forEach((item)=>{
                mileage.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount,item.notes, item.tag])
            })
            this.excelToExport(mileage, fileName, sheetName);
        }
    }

    downloadAllRecord(){
        if(this.templateName === 'Gas Price'){
            let downloadList = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Mileage Report';
            downloadList.push(["Month", "Gas Prices", "Mileage Rate"])
            this.lastModelList.forEach((item)=>{
                downloadList.push([item.ReimMonth, item.fuelPrice, item.VariableRate])
            })
            this.excelToExport(downloadList, fileName, sheetName);
        }else if(this.templateName === 'Monthly'){
            let downloadList = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Mileage Report';
            downloadList.push(["Month", "Fuel", "Mileage", "Mi Rate", "Variable", "Fixed", "Total","Average To Date"])
            this.lastModelList.forEach((item)=>{
                downloadList.push([item.month, item.fuel, item.mileage,  item.variableRate, item.varibleAmount,  item.fixedAmount,  item.totalReimbursements, item.avgToDate])
            })
            downloadList.push(["YTD", "", this.excelYtd.mileageCalc, "", this.excelYtd.varibleAmountCalc, this.excelYtd.totalMonthlyFixedCalc, this.excelYtd.totalFixedAmountCalc, this.excelYtd.totalAVGCalc])
            this.excelToExport(downloadList, fileName, sheetName);
        }else{
            let downloadList = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Mileage Report';
            downloadList.push(["Month", "Mi Rate", "Mileage", "Variable", "Fixed 1", "Fixed 2", "Fixed 3", "Total", "Average To Date"])
            this.lastModelList.forEach((item)=>{
                downloadList.push([item.month, item.variableRate, item.mileage,  item.varibleAmount,  item.fixed1,  item.fixed2,  item.fixed3,  item.totalFixedAmount, item.avgToDate])
            })
            downloadList.push(["YTD", "", this.excelYtd.mileageCalc,  this.excelYtd.varibleAmountCalc, this.excelYtd.fixed1Calc, this.excelYtd.fixed2Calc,  this.excelYtd.fixed3Calc,  this.excelYtd.totalFixedAmountCalc, this.excelYtd.totalAVGCalc])
            this.excelToExport(downloadList, fileName, sheetName);
        }
      
    }

    @wire(getDriverDetails, {
        contactId:'$contactId'
    })driverDetailInfo({data,error}) {
        if (data) {
            let contactList = this.proxyToObject(data);
            this.vehicleImage = contactList[0].Car_Image__c;
            this.vehicleType = contactList[0].Vehicle_Type__c;
            this.contactName = contactList[0].Name;
            this.address = contactList[0].MailingCity + ', ' + contactList[0].MailingState +' '+ contactList[0].MailingPostalCode;
            this.planInsurance = (contactList[0].Insurance__c !== undefined) ? (contactList[0].Insurance__c === 'Yes') ? true : false : false;
            // this.planMileage =    (contactList[0].Mileage_Meet__c !== undefined) ? (contactList[0].Mileage_Meet__c === 'Yes') ? true : false : false;
            this.planVehicleAge =  (contactList[0].Vehicle_Age__c !== undefined) ?  (contactList[0].Vehicle_Age__c === 'Yes') ? true : false : false;
            this.planVehicleValue = (contactList[0].Vehicle_Value_Check__c !== undefined) ?   (contactList[0].Vehicle_Value_Check__c === 'Yes') ? true : false : false;
            this.planCompliance =  (contactList[0].compliancestatus__c !== undefined) ?  (contactList[0].compliancestatus__c === 'Yes') ? true : false : false;
            this.planYear = (contactList[0].Plan_Years__c !== undefined) ?  contactList[0].Plan_Years__c : 0;
            this.complianceMileage = (contactList[0].Compliance_Mileage__c !== undefined) ? contactList[0].Compliance_Mileage__c : 0;
            this.vehicleValue = (contactList[0].Vehicle_Value__c !== undefined) ? (contactList[0].Vehicle_Value__c) : 0;
            this.insurancePlan = (contactList[0].Insurance_Plan__c !== undefined) ? contactList[0].Insurance_Plan__c : '';
            this.complianceStatus = (contactList[0].compliancestatus__c !== undefined) ? contactList[0].compliancestatus__c : '';
            this.annualMileage = (contactList[0].Total_Approved_Mileages__c !== undefined) ? contactList[0].Total_Approved_Mileages__c : '0';
            this.annualReimbursement = (contactList[0].Total_reimbursment__c !== undefined) ? contactList[0].Total_reimbursment__c : '0';
            this.isValid = parseFloat(this.annualMileage) >= parseFloat(this.complianceMileage) ? true : false;
            this.planMileage =   (this.isValid) ?  true : false;
            console.log("getDriverDetails data", data)
        }else if(error){
            console.log("getDriverDetails error", error.message)
        }
    }

    @wire(getReimbursementData, {
        contactId:'$contactId'
    })reimbursementData({data,error}) {
        if (data) {
            let reimbursementData = this.proxyToObject(data);
            this.lastMilesZero = (reimbursementData.lastmonthmiles !== '0.00' && (/^0+/).test(reimbursementData.lastmonthmiles) === true) ? (reimbursementData.lastmonthmiles).replace(/^0+/, '') : null;
            this.thisMilesZero = (reimbursementData.currentmonthmiles !== '0.00' && (/^0+/).test(reimbursementData.currentmonthmiles) === true) ? (reimbursementData.currentmonthmiles).replace(/^0+/, '') : null;
            this.halfFixedZero= (reimbursementData.halfFixedAmount !== '0.00' && (/^0+/).test(reimbursementData.halfFixedAmount) === true) ? (reimbursementData.halfFixedAmount).replace(/^0+/, '') : null;
            this.fixedAmountZero = (reimbursementData.fixedAmount !== '0.00' && (/^0+/).test(reimbursementData.fixedAmount) === true) ? (reimbursementData.fixedAmount).replace(/^0+/, '') : null;
            this.fuelPriceZero = (reimbursementData.lastmonthfuelprice !== '0.00' && (/^0+/).test(reimbursementData.lastmonthfuelprice) === true) ? (reimbursementData.lastmonthfuelprice).replace(/^0+/, '') : null;
            this.mileageRateZero = (reimbursementData.lastmonthmileagerate !== '0.00' && (/^0+/).test(reimbursementData.lastmonthmileagerate) === true) ? (reimbursementData.lastmonthmileagerate).replace(/^0+/, '') : null;
            this.lastMonthMiles = (reimbursementData.lastmonthmiles) ? reimbursementData.lastmonthmiles : 0;
            this.thisMonthMiles = (reimbursementData.currentmonthmiles) ? reimbursementData.currentmonthmiles : 0;
            this.halfFixedAmount = (reimbursementData.halfFixedAmount) ? reimbursementData.halfFixedAmount : 0;
            this.fixedAmount = (reimbursementData.fixedAmount) ? reimbursementData.fixedAmount : 0;
            this.monthfuelPrice = (reimbursementData.lastmonthfuelprice) ? reimbursementData.lastmonthfuelprice : 0;
            this.lastMonthMileageRate = (reimbursementData.lastmonthmileagerate) ? reimbursementData.lastmonthmileagerate : 0;
            console.log("getReimbursementData data",data)
        }else if(error){
            console.log("getReimbursementData error", error)
        }
    }

    connectedCallback(){
        let currDate = new Date();
        let monthNo = currDate.getMonth();
        let previousMonthNo = currDate.getMonth() - 1;
        this.year = currDate.getFullYear();
        this.thisMonth = this.getMonthName(monthNo);
        this.lastMonth = (previousMonthNo > 0) ? this.getMonthName(previousMonthNo) : this.getMonthName(11);
        console.log(this.thisMonth, this.lastMonth)
        if(this.chartInfo){
            console.log("chart",this.chartInfo[0])
            this.chartList = this.chartInfo[0]
        }
        this.headerModalText = 'Notifications';

        getDrivingState({
            contactId: this.contactId
        }).then((result) =>{
            if(result){
                console.log("Driving state", result)
                let drivingState = this.proxyToObject(result);
                if(drivingState.length > 0){
                    if(drivingState[0].Driving_States__c !== undefined){
                        let states = drivingState[0].Driving_States__c.split(';');
                        this.subTitle = states.join(', ')
                    }
                }
              
                console.log("Driving state", result)
            }
        })

    }

    // renderedCallback(){
    //     if (this.renderedInitialized) {
    //         return;
    //     }
    //     this.renderedInitialized = true;
    //     if(this.contactData){
    //         let currentDay = new Date(), currentYear = '', selectedYear='';
    //         this.headerModalText = 'Notifications';
    //         //this.view = (this.notification.length > 1) ? true : false;
    //         if(currentDay.getMonth() === 0){
    //             currentYear = currentDay.getFullYear() - 1;
    //             selectedYear = currentYear.toString();
    //         }else{
    //             currentYear = currentDay.getFullYear();
    //             // eslint-disable-next-line no-unused-vars
    //             selectedYear = currentYear.toString();
    //         }
    //       this.driverNotification(this.contactData[0].Notification_Message__c, this.contactData[0].Notification_Date__c, this.contactData[0].Insurance_Upload_Date__c);
    //     }
    // }

    redirectToReimbursement(){
        events(this, '');
    }
}