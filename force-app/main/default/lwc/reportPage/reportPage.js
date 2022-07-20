import { api, LightningElement,track } from 'lwc';
import jsonData from '@salesforce/resourceUrl/reportdata';
import getMangerData from '@salesforce/apex/NewReportDetailsController.getMangerData';
import getReportDetailNew from '@salesforce/apex/NewReportDetailsController.getReportDetailNew';
export default class ReportPage extends LightningElement {
    @track showData = false;
    searchBox = true;
    recordsToDisplay = []; //Records to be displayed on the page
    reportName;
    reportsoql;
    reportdatetimefields = [];
    reportdatefields = [];
    reportdatetimetotimefields = [];
    headerfields = [];
    numericheaderarray = [];
    report;
    reportHeader = [];
    valueofkey = [];
    datetotimeFields = [];
    keyFields = [];
    datevalues = '';
    reportList = [];
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

    rearrangeValue(aList){
        let a, count, _self = this;
        for(a = 0; a < aList.length; a++){
            // eslint-disable-next-line no-loop-func
            _self.keyFields.forEach(function(key){
               count =  Object.keys(aList[a]).indexOf(key);
               if(count === -1){
                    aList[a][key] = '';
               }
            })
        }
      return aList;
    }
    //Capture the event fired from the paginator component
    handlePaginatorChange(event) {
        console.log('inside paginator component');
        this.recordsToDisplay = JSON.parse(event.detail);
        this.showData = (this.recordsToDisplay.length !== 0) ? true : false;
        if (this.recordsToDisplay[0] !== undefined) {
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
        }
     }

     consolidateJson(getdata,i, apifieldstoheader,datefields){
        let _self = this;
        Object.keys(getdata).forEach(function(key){
            if(key !== "attributes")
            {
                if(typeof getdata[key]=="object")
                {
                    _self.consolidatejson(getdata[key],i);
                }
                else
                {
                    if(apifieldstoheader.has(key))
                    {
                      if(datefields.has(key))
                        {
                            _self.datevalues = getdata[key].split('-');
                            _self.valueofkey.push(apifieldstoheader.get(key), _self.datevalues[1]+"/"+ _self.datevalues[2]+"/"+ _self.datevalues[0]);
                        }
                        else
                        {
                            _self.valueofkey.push(apifieldstoheader.get(key),getdata[key]);
                        }
                    }
                }
            }
        });
     }

    connectedCallback() {
        // Create a request for the JSON data and load it synchronously,
        // parsing the response as JSON into the tracked property
        var apifieldstoheader, j, headertoapifields, i, numericheadertoapifields, datetimefields, datefields, 
        datetotimefields, map3, _self = this;
        getReportDetailNew({
            reportid: "a0Q3r00000J62DPEAZ"
        }).then((response) => {
            console.log("response", response)
            this.report = response
            if (this.report.Numeric_Fields__c !== undefined) {
                if (this.report.Numeric_Fields__c.includes(',')) {
                    this.headerfields = this.report.Numeric_Fields__c.split(',');
                } else {
                    this.headerfields.push(this.report.Numeric_Fields__c.trim());
                }
            }
            if (this.report.Date_Time_Fields__c !== undefined) {
                if (this.report.Date_Time_Fields__c.includes(',')) {
                    this.reportdatetimefields = this.report.Date_Time_Fields__c.split(',');
                } else {
                    this.reportdatetimefields.push(this.report.Date_Time_Fields__c.trim());
                }
            }
            this.query1tosplit = this.report.Report_Soql__c.split('from');
            this.queryfieldslist = this.query1tosplit[0].split('select')[1].trim().split(',');
            if (this.report.Date_Fields__c !== undefined) {
                if (this.report.Date_Fields__c.includes(',')) {
                    this.reportdatefields = this.report.Date_Fields__c.split(',');
                } else {
                    this.reportdatefields.push(this.report.Date_Fields__c.trim());
                }
            }
            if (this.report.Date_Time_To_Time__c !== undefined) {
                if (this.report.Date_Time_To_Time__c.includes(',')) {
                    this.reportdatetimetotimefields = this.report.Date_Time_To_Time__c.split(',');
                } else {
                    this.reportdatetimetotimefields.push(this.report.Date_Time_To_Time__c);
                }
            }
            if (this.report.Report_Header__c !== undefined) {
                if (this.report.Report_Header__c.includes(',')) {
                    this.headerlisttosplit = this.report.Report_Header__c.split(',');
                } else {
                    this.headerlisttosplit.push(this.report.Report_Header__c);
                }
            }
            if (this.report.Use_Bussiness_Unit__c !== undefined) {
                this.businessUnitSelectOrNot = this.report.Use_Bussiness_Unit__c;
            }
            if (this.report.Use_Driver_List__c !== undefined) {
                this.driverListSelectOrNot = this.report.Use_Driver_List__c;
            }
            if (this.report.Use_Manager_List__c !== undefined) {
                this.managerListSelectOrNot = this.report.Use_Manager_List__c;
            }

            headertoapifields = new Map();
            for(j = 0;j<this.queryfieldslist.length;j++)
            {
                if(this.queryfieldslist[j].includes('.'))
                {
                    headertoapifields.set(this.headerlisttosplit[j],this.queryfieldslist[j].split('.')[1]);
                }
                else
                {
                    headertoapifields.set(this.headerlisttosplit[j],this.queryfieldslist[j]);
                }
            }

            apifieldstoheader = new Map();
            for(j = 0;j<this.queryfieldslist.length;j++)
            {
                if(this.queryfieldslist[j].includes('.'))
                {
                    apifieldstoheader.set(this.queryfieldslist[j].split('.')[1],this.headerlisttosplit[j]);
                }
                else
                {
                    apifieldstoheader.set(this.queryfieldslist[j],this.headerlisttosplit[j]);
                }
            }

            numericheadertoapifields = new Map();
            for(j = 0;j<this.headerfields.length;j++){
                 if(apifieldstoheader.has(this.headerfields[j]))
                 {
                     numericheadertoapifields.set(this.headerfields[j],apifieldstoheader.get(this.headerfields[j]));
                    this.numericheaderarray.push(numericheadertoapifields.get(this.headerfields[j]));
                 }
            }
           
            datetimefields = new Map();
            for(j = 0;j<this.reportdatetimefields.length;j++)
            {
                if(apifieldstoheader.has(this.reportdatetimefields[j]))
                {
                    datetimefields.set(this.reportdatetimefields[j],apifieldstoheader.get(this.reportdatetimefields[j]));
                }
            }

           datefields = new Map();
            for(j = 0;j<this.reportdatefields.length;j++)
            {
                if(apifieldstoheader.has(this.reportdatefields[j]))
                {
                    datefields.set(this.reportdatefields[j],apifieldstoheader.get(this.reportdatefields[j]));
                }
            }

            console.log("datefields", datefields)
            datetotimefields = new Map();
            for(j = 0;j<this.reportdatetimetotimefields.length;j++)
            {
                if(apifieldstoheader.has(this.reportdatetimetotimefields[j]))
                {
                    datetotimefields.set(this.reportdatetimetotimefields[j],apifieldstoheader.get(this.reportdatetimetotimefields[j]));
                }
            }
            console.log("datetimefields",datetotimefields);
            console.log("Query Fields",JSON.stringify(this.queryfieldslist));
            console.log("headerlisttosplit", JSON.stringify(this.headerlisttosplit));
            console.log("apifieldstoheader", apifieldstoheader)
            for(const [key, value] of datetotimefields){
                 this.datetotimeFields.push(value);
             }

            for(const [key, value] of apifieldstoheader){
               let reportobj ={}
                reportobj.name = key;
                reportobj.label = value;
                reportobj.thClass = "head-title vertical_align";
                reportobj.cssClass = "slds-cell-fixed";
                reportobj.arrowUp = false;
                reportobj.arrowDown =false;
                this.keyFields.push(value);
                this.reportHeader.push(reportobj);
            }
        }).catch((error) => {
            console.log("error", error)
        })


        getMangerData({
            reportid: "a0Q3r00000J62DPEAZ",
            accId: "0010Z00001ygUenQAE",
            conId: "0030Z00003NFLRoQAP"
        }).then((result) => {
            let resultList = JSON.parse(result);
            console.log("resultList", result, typeof(result));
            map3 = new Map();
            for(i = 0;i<resultList.length;i++)
            {
                // eslint-disable-next-line no-loop-func
                Object.keys(resultList[i]).forEach(function(key){
                    if(key !== "attributes")
                    {
                        if(typeof resultList[i][key]=="object")
                        {
                            _self.consolidateJson(resultList[i][key],i, apifieldstoheader, datefields);
                        }
                        else
                        {
                            if(apifieldstoheader.has(key))
                            {
                               if(datefields.has(key))
                                {
                                    _self.datevalues = resultList[i][key].split('-');
                                    _self.valueofkey.push(apifieldstoheader.get(key), _self.datevalues[1]+"/"+ _self.datevalues[2]+"/"+ _self.datevalues[0]);
                                }
                                else
                                {
                                    _self.valueofkey.push(apifieldstoheader.get(key),resultList[i][key]);
                                }
                            }
                        }
                    }
                });
                map3.set(i, _self.valueofkey);
                _self.valueofkey = [];
            }
     
           let finnalArr = [];
            map3.forEach(function (item, key) {
                let arrayvalues = map3.get(key);
                let finnalData = {};
                let ind = -1;
                arrayvalues.forEach(function (element, index) {
                    if (index > ind) {
                        let keyData = item[index];
                        if (keyData === 'Variable Reimbursement') {
                            finnalData[keyData] = '$' + arrayvalues[index + 1]
                        } else {
                            finnalData[keyData] = arrayvalues[index + 1]
                        }

                        ind = index + 1;
                    }
                });
                finnalArr.push(finnalData);
                finnalArr = _self.rearrangeValue(finnalArr)
            });

            for (i = 0; i < finnalArr.length; i++) {
                let rows = [];
                // eslint-disable-next-line guard-for-in
                for (const e in finnalArr[i]) {
                        let obj = {}
                        //if (value.includes(e) !== false) {
                            obj.key = e;
                            obj.value = (finnalArr[i][e] === undefined || finnalArr[i][e] === null || finnalArr[i][e] === '') ? '' : (this.datetotimeFields.includes(e)) ? Date.parse(finnalArr[i][e]) : finnalArr[i][e];
                            obj.dateTimeField = (this.datetotimeFields.includes(e)) ? true : false;
                           
                            if(e === 'Origin' || e === 'Destination'){
                                console.log("e", e, finnalArr[i][e]);
                                if((finnalArr[i][e] !== undefined && finnalArr[i][e] !== null && finnalArr[i][e] !== '')){
                                    obj.truncate = true;
                                }else{
                                    obj.truncate = false;
                                }
                            }else{
                                obj.truncate = false;
                            }
                            rows.push(obj);
                       // }
                        finnalArr[i].keyFields = _self.mapOrder(rows, _self.keyFields, 'key')
                   // }
                }
            }
          
            this.reportList = finnalArr;
            console.log("Final array", JSON.stringify( this.reportList));
        }).catch((err) => {
            console.log('Error log---------------------', err.message)
        })
      
    //     for(i = 0 ; i < resultList.length; i++) {
    //         let rows = [];
    //         // eslint-disable-next-line guard-for-in
    //         for(const e in resultList[i]){
    //             for(const [key] of apifieldstoheader){
    //                 let obj = {}
    //                 if(key.includes(e) !== false){
    //                     obj.key = e;
    //                     obj.value = resultList[i][e];
    //                     rows.push(obj);
    //                 }
    //                 resultList[i].keyFields = this.mapOrder(rows, this.keyFields, 'key')
    //              }
    //         }
    //     }
    //    this.reportList = resultList
    //    console.log("Report List", JSON.stringify(this.reportList))
    }

    proxyToObj(obj){
        return JSON.parse(JSON.stringify(obj));
    }
}