import { LightningElement , api } from 'lwc';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getDriverManagerDropdownList from '@salesforce/apex/ReportDetailsController.getDriverManagerList';
import getReportDetails from '@salesforce/apex/ReportDetailsController.getReportDetail';
import getManagerDriverDetails from '@salesforce/apex/ReportDetailsController.getAllManagers';
import { loadStyle , loadScript } from 'lightning/platformResourceLoader';
import jQueryMinified from '@salesforce/resourceUrl/jQueryMinified';
import datepicker from '@salesforce/resourceUrl/calendar';
import customMinifiedDP  from '@salesforce/resourceUrl/modalCalDp';
import updateEditableField from "@salesforce/apex/ReportDetailsController.updateEditableField";
import accountMonthList from "@salesforce/apex/ReportDetailsController.monthList";

import getAllReportSoql from '@salesforce/apex/ReportDetailsController.getAllReportSoql';
import postTotalReimbursementForAllUser from '@salesforce/apex/ReportDetailsController.postTotalReimbursementForAllUser';
import biweekpayperiod from '@salesforce/apex/ReportListController.payPeriodDateList';
import NewEnglandGypsum from '@salesforce/label/c.NewEnglandGypsum';
import SPBS_Account from '@salesforce/label/c.SPBS_Account';
import SALESFORCE_LIMIT_MSG from '@salesforce/label/c.Info_message_for_salesforce_limit';


import WORK_BOOK from "@salesforce/resourceUrl/xlsx";
export default class ReportDetail extends LightningElement {
    istrue = false;
    sortable = true;
    recordDisplay = true;
    classToTable = 'slds-table--header-fixed_container p-top-v1';
    isScrollable = true;
    paginatedModal = true;
    // @api modelList;
    @api reportId;
    @api monthList;
    isSort = true;
    searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
   
    ishow = false;
    header =[];
    detail=[];
    modaldata;
    DriverManager;
    value = '';
    picklist = [];
    reportName='';
    detaildata = [];
    headerdata = [];
    keyArray=[];
    filterdata = [];
    headerfields;
    formattedArray  = [];
    finaldata = [];
    searchdata = [];
    exceldata = [];
    searchkey = '';
    from_Date = '';
    to_Date = '';
    monthlyDropdown = false;
    weeklyDropdown = false;
    dateRange = false;
    monthoption = [];
    librariesLoaded = false;
    manager = '';
    selectedmonth= '';
    reportsoql = '';
    _accid;
    _adminid;
    reportType;
    DriverManagerList = [];
    detailsoql;
    anual_tax = false;
    showbuttons = false;
    concurbtn = false;
    Weekoptions = [];
    selectedweek;
    placeholder='';
    editableView = true;
    editable_feilds ;
    updatebtn = false;
    updatedList = [];
    editablefield='';
    limitOfrecord = 0;
    dateArray = [];
    numberArray = [];
    remId;
    isSearchEnable = true;
    sortOrder = '';
    columnName = '';
    columnType = '';
    withoutupdatedate;
  
renderedCallback(){
   
    loadScript(this, jQueryMinified)
      .then(() => {
          console.log('jquery loaded')
          Promise.all([
            loadStyle(this, datepicker + "/minifiedCustomDP.css"),
            loadStyle(this, datepicker + "/datepicker.css"),
            loadStyle(this, customMinifiedDP),
            loadScript(this, datepicker + '/datepicker.js')
          ]).then(() => {
            //   this.calendarJsInitialised = true;
              console.log("script datepicker loaded--");
              this.intializeDatepickup1();
            })
            .catch((error) => {
              console.error(error);
            });
      })
      .catch(error => {
        console.log('jquery not loaded ' + error )
      })
      if (this.librariesLoaded) return;
      this.librariesLoaded = true;
      //to load static resource for xlsx file
      Promise.all([loadScript(this, WORK_BOOK)])
        .then(() => {
          console.log("success");
        })
        .catch(error => {
          console.log("failure");
        });
}
getUrlParamValue(url, key) {
  return new URL(url).searchParams.get(key);
}
getBiweekLIst(){
  biweekpayperiod({accId:this._accid})
  .then(result => {
      var payarray = new Array();
      payarray = result.split(",");
      let finaldata =JSON.parse(JSON.stringify(payarray));
      console.log("finaldata",finaldata)
      finaldata.forEach(element => {
          let list = element.split(' to ')[0];
          let list1 = element.split(' to ')[1];
          let finallist = (list.split('-')[1]+'/'+list.split('-')[2]+'/'+list.split('-')[0].substring(2,4)) + ' - '+ (list1.split('-')[1]+'/'+list1.split('-')[2]+'/'+list1.split('-')[0].substring(2,4));
          this.Weekoptions.push({label:finallist,value:finallist});
      })
      this.Weekoptions = JSON.parse(JSON.stringify(this.Weekoptions))
  })
  .catch(error => {
      console.log("biweek error",error)
  })
}
connectedCallback(){
  this.dispatchEvent(
    new CustomEvent("show", { detail :''})
  );
  console.log("this.reportId",this.reportId)
    this._accid  = this.getUrlParamValue(window.location.href, 'accid')
    this._adminid  = this.getUrlParamValue(window.location.href, 'id')
    if(NewEnglandGypsum == this._accid || SPBS_Account == this._accid){
      this.concurbtn = true;
    }
    this.getBiweekLIst();
    if( this.reportId != 'TAX123'){
      getReportDetails({reportid : this.reportId})
      .then(result => {
          console.log("detail",result)
          // console.log("detail",JSON.parse(result))
         let jsondata = result.replace(/\'/g, "\\'");
         console.log("jsondata",jsondata)

          let resultdata = JSON.parse(jsondata);
         console.log("resultdata",resultdata)

          this.reportType = resultdata.Report_Type__c;
          if(resultdata.Numeric_Fields__c != undefined){
            let numericfield = resultdata.Numeric_Fields__c 
            var headerarry = new Array();
            headerarry = numericfield.split(",");
            this.dateArray =JSON.parse(JSON.stringify(headerarry));
          }
          if(resultdata.Date_Fields__c != undefined){
            let datefield = resultdata.Date_Fields__c 
            var headerarry_date = new Array();
            headerarry_date = datefield.split(",");
            this.numberArray =JSON.parse(JSON.stringify(headerarry_date));
          }
          
         
          let showfilter = resultdata.Filter_By__c == undefined ?  '' : resultdata.Filter_By__c
          this.reportName = resultdata.Name;
          this.limitOfrecord = resultdata.Limit__c == undefined ? 0 : resultdata.Limit__c;

          if(resultdata.Editable_Fields__c != undefined){
            this.editablefield = resultdata.Editable_Fields__c
            var editarry = new Array();
            editarry = this.editablefield.split(",");
            this.editable_feilds =JSON.parse(JSON.stringify(editarry));
          }
          if(showfilter.length > 0){
              if(showfilter.includes('Monthly')){
                  // this.getAccountMonthList()
                  this.monthlyDropdown = true;
                  this.weeklyDropdown = false;
                  this.dateRange = false;
              }else if(showfilter.includes('Biweek Reimbursement')){
                  this.weeklyDropdown = true;
                  this.dateRange = false;
                  this.monthlyDropdown = false;
                 
              }else if(showfilter == 'Dates'){
                var currentDate = new Date();
                var getmonth = currentDate.getMonth()
                let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() , 1);
                let enddate = new Date(currentDate.getFullYear(), getmonth, 0)
                let convertdate ;
                let convertmonth;
                if(startDate.getMonth() < 9 ){
                  convertdate = '0'+startDate.getMonth();
                }else{
                  convertdate = startDate.getMonth();
                }
                if(startDate.getDate() < 9 ){
                  convertmonth = '0'+startDate.getDate();
                }else{
                  convertmonth = startDate.getDate();
                }
                let getyear = startDate.getYear();
                getyear = getyear.toString();
                this.from_Date = convertdate+'/'+convertmonth+'/'+getyear.substring(1);
                let endconvertdate ;
                let endconvertmonth;
                if(enddate.getMonth() < 9 ){
                  endconvertdate = '0'+(enddate.getMonth()+1);
                }else{
                  endconvertdate = enddate.getMonth()+1;
                }
                if(enddate.getDate() < 9 ){
                  endconvertmonth = '0'+enddate.getDate();
                }else{
                  endconvertmonth = enddate.getDate();
                }
                this.to_Date = endconvertdate+'/'+endconvertmonth+'/'+getyear.substring(1);
                  this.dateRange = true;
                  this.monthlyDropdown = false;
                  this.weeklyDropdown = false;
              }
          }
  
          if(resultdata.Use_Manager_List__c == true){
              this.DriverManager = 'Manager';
          }else{
              this.DriverManager = 'Driver';
          }
          this.placeholder = 'Select '+this.DriverManager;
          getManagerDriverDetails({accountId : this._accid,role : this.DriverManager})
          .then(result => {
              this.DriverManagerList = JSON.parse(result);
              if(this.DriverManagerList.length > 2){
                this.DriverManagerList.forEach(index => {
                  this.picklist.push({label:index.Name,value:index.Id})
                })
                this.picklist = JSON.parse(JSON.stringify(this.picklist))
              }
             
          })
          .catch(error => {
              console.log("error",error)
          })
  
          var headerstr = resultdata.Report_Header__c;
          var headerarry = new Array();
          headerarry = headerstr.split(",");
          this.headerdata = JSON.parse(JSON.stringify(headerarry))
  
          var detailstr = resultdata.Report_Soql__c;
          this.reportsoql = resultdata.Report_Soql__c;
          var detailarray = new Array();
          detailarray = detailstr.split(" ");
          let detaildata = JSON.parse(JSON.stringify(detailarray[1]))
          var detailarraynew = new Array();
          detailarraynew = detaildata.split(",");
          this.detail = detailarraynew;
          let detaildatanew = JSON.parse(JSON.stringify(detailarraynew))
          this.detailsoql = JSON.parse(JSON.stringify(detailarraynew));

          var imageList=[];
          let coltype;
          for(let i=0;i<this.headerdata.length;i++){
            coltype = 'String';
            if(this.dateArray.length > 0){
              this.dateArray.forEach(col => {
                if(col == detaildatanew[i]){
                  coltype = 'Integer'
                }
              })
            }  
            
            if(this.numberArray.length > 0){
              this.numberArray.forEach(col1 => {
                console.log("col1 == detaildatanew[i]",col1+'-----'+ detaildatanew[i])
                if(col1 == detaildatanew[i]){
                  coltype = 'Date'
                }
              })
            }
            
            if(i== 0){
              if(this.reportName == 'Onboarding Status Report' || this.reportName == 'Employee Roster Report'){
                this.columnName = "Activation Date";
                this.columnType = 'Date';
                this.sortOrder = 'asc';
              }else{
                this.columnName = this.headerdata[i];
                this.columnType = coltype;
                this.sortOrder = 'desc';
              }
              imageList.push({id:i,name:this.headerdata[i] ,colName:this.headerdata[i],colType:coltype,arrUp:true,arrDown:false});
            }else{
              imageList.push({id:i,name:this.headerdata[i] ,colName:this.headerdata[i],colType:coltype,arrUp:false,arrDown:false});
            }
          }
          this.header = JSON.parse(JSON.stringify(imageList));
         console.log("this.header",this.header)

          getDriverManagerDropdownList({accountId : this._accid , contactId : this._adminid, reportId : this.reportId , checkLimit : this.limitOfrecord})
          .then(result => {
            console.log("data",result)

              let data = JSON.parse(result)
              console.log("data",data)
              if(this.DriverManager == 'Manager'){
                this.detaildata = JSON.parse(JSON.parse(data[1]));
              }else{
                this.detaildata = JSON.parse(JSON.parse(data[0]));
              }
              if(this.detaildata.length > 0){
                this.showbuttons = true;
                
                console.log("this.detaildata",this.detaildata)
                if(this.reportName == 'Employee Roster Report'){
                  this.detaildata.forEach(element => {
                    if(element.Activation_Date__c != undefined){
                      var actdate = element.Activation_Date__c;
                      element.Activation_Date__c = actdate.split('-')[1]+'/'+actdate.split('-')[2]+'/'+actdate.split('-')[0];
                    }
                    if(element.Deactivated_Date__c != undefined){
                      var dctdate = element.Deactivated_Date__c;
                      element.Deactivated_Date__c = dctdate.split('-')[1]+'/'+(dctdate.split('-')[2]).slice(0, 2)+'/'+dctdate.split('-')[0];
                    }
                  })
                }else if(this.reportName == 'Onboarding Status Report'){
                  this.detaildata.forEach(element => {
                    if(element.Schedule_Driver_Meeting__c == true){
                      element.Schedule_Driver_Meeting__c = 'Yes';
                    }else if(element.Schedule_Driver_Meeting__c == false){
                      element.Schedule_Driver_Meeting__c = 'No';
                    }
                  })
                }else if(this.reportName == 'Commuter and Actual Mileage Report'){
                  this.detaildata.forEach(element => {
                    if(element.Trip_Date__c != undefined){
                      var actdate = element.Trip_Date__c;
                      element.Trip_Date__c = actdate.split('-')[1]+'/'+actdate.split('-')[2]+'/'+actdate.split('-')[0];
                    }
                    if(element.Approved_Date__c != undefined){
                      var approvedt = element.Approved_Date__c;
                      element.Approved_Date__c = approvedt.split('-')[1]+'/'+approvedt.split('-')[2]+'/'+approvedt.split('-')[0];
                    }
                    
                    if(element.ConvertedStartTime__c != undefined){
                      var starttime = element.ConvertedStartTime__c;
                      var time = new Date(starttime);
                      var ampm = time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
                      element.ConvertedStartTime__c = (starttime.split('T')[1]).slice(0, 5)+ ' '+ampm.split(' ')[1];
                    }
                    if(element.ConvertedEndTime__c != undefined){
                      var endtime = element.ConvertedEndTime__c;
                      var time1 = new Date(endtime);
                      var ampm1 = time1.toLocaleString('en-US', { hour: 'numeric', hour12: true })
                      element.ConvertedEndTime__c = (endtime.split('T')[1]).slice(0, 5)+ ' '+ampm1.split(' ')[1];
                    }
                  })  
                }
                  this.recordDisplay = true;
                  
                  this.headerfields = new Map();
                  for(var i=0 ; i < detaildatanew.length ; i++){
                      if(detaildatanew[i].includes('.')){
                          this.headerfields.set(detaildatanew[i].split('.')[1],this.headerdata[i]);
                      }else{
                          this.headerfields.set(detaildatanew[i],this.headerdata[i]);
                      }
                  }
                  this.headerfields.set('Id','Id');
                  // this.headerfields.set(Id,Id);
                  console.log("this.headerfields",this.headerfields)
                  for(var i=0;i<this.detaildata.length;i++){
                      Object.keys(this.detaildata[i]).forEach((key) => {
                                  if(key != "attributes"){
                                      if(typeof this.detaildata[i][key] == "object"){
                                          this.nestedJsonRead(this.detaildata[i][key] , i);
                                      }else{
                                          if(this.headerfields.has(key)){
                                              this.keyArray.push(i,this.headerfields.get(key),this.detaildata[i][key]);
                                          }
                                      }
                                  }
                      })
                  }
                  console.log("keyArray",JSON.parse(JSON.stringify(this.keyArray)))
                  var temp = [];
                 
                  for(let k=0;k<this.keyArray.length;k++){
                      if(k % 3 == 0){
                          temp.push({[this.keyArray[k+1]]:this.keyArray[k+2] ,index: this.keyArray[k]})
                      }
                  }
                  let temparray =  JSON.parse(JSON.stringify(temp));

                  let groupedData = [];
                  for (var i = 0; i < temparray.length; i++) {
                      var item = temparray[i];
                      if (!groupedData[item.index]) {
                          groupedData[item.index] = [];
                      }
  
                      var m = 0;
                      Object.keys(item).forEach(key => {
                          m = m+1;
                          if(m == 1){
                            // if(key == 'Id'){
                            //   groupedData[item.index].push({id:item[key]});
                            // }else{
                              groupedData[item.index].push({[key]:item[key]});
                            // }
                           
                          }
                        }); 
                    }
                    
                    // Log or use the grouped data
                    let objarray = JSON.parse(JSON.stringify(groupedData));
                  console.log("objarray",objarray)
                    
                    for(var h=0;h<objarray.length;h++){
                      
                      let finalObj ;
                      for(var n=0;n<objarray[h].length;n++){
                          finalObj =  Object.assign({}, ...objarray[h]);
                      }
                      objarray[h] = finalObj;
                    }
                    this.finaldata = JSON.parse(JSON.stringify(objarray))
                    
                    this.exceldata =JSON.parse(JSON.stringify(objarray));
                    console.log("final data",this.finaldata)
                  this.dynamicBinding(this.finaldata,  this.headerdata)
                  // console.log("final data",this.finaldata)
                  this.ishow = true;
                  this.dispatchEvent(
                    new CustomEvent("hide", { detail :''})
                  );
              }else{
                  this.showbuttons = false;
                  this.ishow = true;
                  this.recordDisplay = false;
                  this.dispatchEvent(
                    new CustomEvent("hide", { detail :''})
                  );
              }
          })
          .catch(error => {
              console.log("error for dropdown list",error)
          })
      
      })
      .catch(error => {
          console.log("error for report list",JSON.parse(JSON.stringify(error)))
          
      })
    }else{
        this.anual_tax = true;
         this.dispatchEvent(
          new CustomEvent("hide", { detail :''})
        );
    }
   

}

handleenter(){
  if(this.Weekoptions.length > 6){
    if(this.template.querySelector(`c-dropdown-select[data-id="bi_week"]`)){
      console.log("hiii",this.template.querySelector(`c-dropdown-select[data-id="bi_week"]`))
      this.template.querySelector(`c-dropdown-select[data-id="bi_week"]`).toggleStyle(true) ;  
    }   
  }  
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

nestedJsonRead(data , i){
    Object.keys(data).forEach(key => {
        if(key != "attributes"){
            if(typeof data[key] == "object"){
                this.nestedJsonRead(data[key] , i);
            }else{
                if(this.headerfields.has(key)){
                    this.keyArray.push(i,this.headerfields.get(key),data[key]);
                }
            }
        }
    })
}
dynamicBinding(data, keyFields) {
  console.log("keyFields",keyFields)
  // console.log("data",data)

    data.forEach(element => {
        let model = [];
        keyFields.forEach(key => {
                let singleValue = {}
                    singleValue.key = key;
                    singleValue.value = element[key] == undefined ? null : element[key];

                    this.header.forEach(element1 => {
                      if(element1.colName == key){
                        singleValue.keyType = element1.colType;
                      }
                    })
                    if(this.editablefield){
                        if(this.editablefield.includes(key+'-') ){
                          singleValue.proratedInput = true;
                        }else{
                          singleValue.proratedInput = false;
                        }
                    }else{
                      singleValue.proratedInput = false;
                    }
                    singleValue.id = element['Id'];
                  model.push(singleValue);
        })
        // element.id = element['Id'];
        element.keyFields = this.mapOrder(model, keyFields, 'key');
    });
    console.log("datanew",JSON.stringify(data))
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

handleDriverChange(event){
  console.log("event.detail.value",event.detail.value)
  if(event.detail.value == undefined){
    this.manager = '';
  }else{
    this.manager = event.detail.value;
  }
}
handleChangebysearch(event){
  this.updatebtn = false;
    this.searchkey = event.target.value;
    this.isSearchEnable = this.searchkey == "" ? true : false;
    if(this.template.querySelector('c-user-preview-table')){
        this.template.querySelector('c-user-preview-table').searchByKey(this.searchkey);
    }
   
} 
handleClearInput(event){
  this.searchkey = "";
  this.isSearchEnable = this.searchkey == "" ? true : false;
  this.template
  .querySelector("c-user-preview-table")
  .searchByKey(this.searchkey);
}
handleClose(){
    this.dispatchEvent(
        new CustomEvent("closemodal", { })
    );
}
handlemonthchange(event){
    this.selectedmonth = event.detail.value;
}
handleweekchange(event){
  this.selectedweek = event.detail.value;
  this.template.querySelector(`c-dropdown-select[data-id="bi_week"]`).toggleStyle(false);
}
intializeDatepickup1(){
    let $jq = jQuery.noConflict();
    let $input =  $jq(this.template.querySelectorAll('.date-selector'));
    let _self = this;
    $input.each(function(index) {
      console.log("index",index)
          let _self2 =  $jq(this)
          let $btn =  $jq(this).next()
          console.log("this",this)
          $jq(this).datepicker({

            // inline mode
            inline: false,

            // additional CSS class
            classes: 'flatpickr-cal',

            // language
            language: 'en',

            // start date
            startDate: new Date(),
            //selectedDates: new Date(),
            
            // array of day's indexes
            weekends: [6, 0],

            // custom date format
            dateFormat:'mm/dd/yy',

            // Alternative text input. Use altFieldDateFormat for date formatting.
            altField: '',

            // Date format for alternative field.
            altFieldDateFormat: '@',

            // remove selection when clicking on selected cell
            toggleSelected: false,

            // keyboard navigation
            keyboardNav: false,

            // position
            position: 'bottom left',
            offset: 12,

            // days, months or years
            view: 'days',
            minView: 'days',
            showOtherMonths: true,
            selectOtherMonths: true,
            moveToOtherMonthsOnSelect: true,

            showOtherYears: true,
            selectOtherYears: true,
            moveToOtherYearsOnSelect: true,

            minDate: '',
            maxDate: '',
            disableNavWhenOutOfRange: true,

            multipleDates: false, // Boolean or Number
            multipleDatesSeparator: ',',
            range: false,
            isMobile: false,
            // display today button
            todayButton: new Date(),

            // display clear button
            clearButton: false,
            
            // Event type
            showEvent: 'focus',

            // auto close after date selection
            autoClose: true,

            // navigation
            monthsFiled: 'monthsShort',
            prevHtml: '<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',
            nextHtml: '<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',
            navTitles: {
                days: 'M <i>yyyy</i>',
                months: 'yyyy',
                years: 'yyyy1 - yyyy2'
            },
            
            // timepicker
            datepicker: true,
            timepicker: false,
            onlyTimepicker: false,
            dateTimeSeparator: ' ',
            timeFormat: '',
            minHours: 0,
            maxHours: 24,
            minMinutes: 0,
            maxMinutes: 59,
            hoursStep: 1,
            minutesStep: 1,
            // callback events
            onSelect: function(date, formattedDate, datepicker){
                //datepicker.$el.val(_self2.val())
                console.log('explain:', date, formattedDate, datepicker, _self2.val());
                console.log('selected date', date);
                //  console.log('explain:', date, formattedDate, dpicker, _self2.val());
                 if(index ==  0){
                  console.log("if index",index)
                  // let fromdate = date;
                 this.from_Date =  date;
                 }
                 if(index ==  1){
                  console.log("if index",index)
                  // let todate = date;
                  this.to_Date =  date;
                 }
                 console.log("if index",this.from_Date + this.to_Date)
            },
            onShow: function (dp, animationCompleted) {
              console.log('selected date');
              //_self.value = dp.$el.val()
              if (!animationCompleted) {
                if (dp.$datepicker.find('span.datepicker--close--button').html()===undefined) { /*ONLY when button don't existis*/
                    dp.$datepicker.find('div.datepicker--buttons').append('<span  class="datepicker--close--button">Close</span>');
                    dp.$datepicker.find('span.datepicker--close--button').click(function() {
                      dp.hide();
                      console.log('onshow');
                    });
                }
              }
            },
            // onShow: '',
            onHide: '',
            onChangeMonth: '',
            onChangeYear: '',
            onChangeDecade: '',
            onChangeView: '',
            // eslint-disable-next-line consistent-return
            onRenderCell: function(date){
                if (date.getDay() === 0) {
                      return {
                          classes: 'color-weekend-sunday'
                      }
                }
                  if (date.getDay() === 6) {
                      return {
                          classes: 'color-weekend-saturday'
                      }
                }
            }
          })//.data('datepicker').selectDate(new Date(_self2.val()))
          $btn.on('click', function(){
            console.log('btnon');
            _self2.datepicker({showEvent: 'none'}).data('datepicker').show();
            _self2.focus();
          });
    })
  }

  handleCopy(){
    const parent = this.template.querySelector('c-user-preview-table');
    let target = parent.children[1].offsetParent;
    if(target  !== null || target !== undefined){
        let targetchildren = target.children[2];
        if(targetchildren  !== null || targetchildren !== undefined){
            let child1 = targetchildren.children[0]
                    console.log("table", child1)
                    this.dispatchEvent(
                        new CustomEvent("copy", {
                        detail:child1
                        })
                    );
        }
    }
  }
  handlePrint() {
    // const parent = this.template.querySelector('c-user-preview-table');
    // let target = parent.children[0].offsetParent;
    // if(target  !== null || target !== undefined){
    //     let targetchildren = target.children[1];
    //     if(targetchildren  !== null || targetchildren !== undefined){
    //         let child1 = targetchildren.offsetParent
    //         if(child1  !== null || child1 !== undefined){
    //             let child2 = child1.offsetParent
    //             if(child2 !== null || child2 !== undefined){
    //               let table = child2.children[2];
           
    //               this.dispatchEvent(
    //                 new CustomEvent("print", {
    //                   detail:table
    //                 })
    //               );
    //             }
    //         }    
    //     }
    // }    
    const parent = this.template.querySelector('c-user-preview-table');
    let target = parent.children[1].offsetParent;
    if(target  !== null || target !== undefined){
        let targetchildren = target.children[2];
        if(targetchildren  !== null || targetchildren !== undefined){
            let child1 = targetchildren.children[0]
                    console.log("table", child1)
                    this.dispatchEvent(
                        new CustomEvent("print", {
                        detail:child1
                        })
                    );
        }
    }
  }
  handleCreateExcel(){
    let exceldata = [];
    console.log("this.exceldata",this.exceldata)
    this.exceldata.forEach(element => {
        let model = [];
        this.headerdata.forEach(key => {
          let keyvalue ;
            if(element[key] == undefined){
              keyvalue = null;
            }else{
              keyvalue = element[key];
            }
            model.push({[key]:keyvalue});
        });
         exceldata.push(Object.assign({}, ...model));

    });  
    exceldata =JSON.parse(JSON.stringify(exceldata))
    console.log("exceldata",exceldata)
    if(exceldata.length > 0){
        let tempheader = [];
        let tempworkSheetNameList = [];
        let tempxlsData = [];
        let name = '';
        var makeDate = new Date();
        var month = makeDate.getMonth()+1;
        var today = makeDate.getDate();
        var toyear =makeDate.getFullYear();
        var hours = makeDate.getHours();
        var minutes = makeDate.getMinutes();
        var second = makeDate.getSeconds();
        
        var finaldate =  (month < 10 ? '0'+month : month) +today+toyear+hours+minutes+second;
        //push data , custom header , filename and worksheetname for detail xlsx file
        tempheader.push(this.headerdata);
        if(this.reportName == "Final Variable Report for Terminated Drivers" || this.reportName == "Commuter and Actual Mileage Report"){
          tempworkSheetNameList.push(finaldate);
        }else{
          tempworkSheetNameList.push(this.reportName);
        }
       
        tempxlsData.push(exceldata);
        name = this.reportName+' '+finaldate+'.xlsx';
        //Download Summary report(xlsx file)
        if(tempxlsData.length > 0){
            console.log("in if")
            this.callcreatexlsxMethod(tempheader ,name, tempworkSheetNameList , tempxlsData);
        }
    }        
  }
  handleCreateCSV(){
    let name = '';
    var makeDate = new Date();
    var month = makeDate.getMonth()+1;
    var today = makeDate.getDate();
    var toyear =makeDate.getFullYear();
    var hours = makeDate.getHours();
    var minutes = makeDate.getMinutes();
    var second = makeDate.getSeconds();
    
   var finaldate =  (month < 10 ? '0'+month : month) +today+toyear+hours+minutes+second;
   name = this.reportName+' '+finaldate;
   let exceldata = [];
   this.exceldata.forEach(element => {
       let model = [];
       this.headerdata.forEach(key => {
           model.push({[key]:element[key]});
       });
        exceldata.push(Object.assign({}, ...model));

   });        
   
   exceldata =JSON.parse(JSON.stringify(exceldata))
   if (exceldata) {
 
    let rowEnd = '\n';
    let csvString = '';
    let regExp = /^[0-9/]*$/gm;
    let regExpForTime = /^[0-9:\sAM|PM]*$/gm
    let decimalExp = /^(\d*\.)?\d+$/gm
    // this set elminates the duplicates if have any duplicate keys
    let rowData = new Set();
    let csvdata = exceldata;
    csvdata.forEach(function (record) {
      Object.keys(record).forEach(function (key) {
        rowData.add(key);
      });
    });
    rowData = Array.from(rowData);
    
    csvString += rowData.join(',');
    csvString += rowEnd;

    var i = 0;
    for(let i=0; i < csvdata.length; i++){
      let colVal = 0;
      // validating keys in data
      for(let key in rowData) {
          if(rowData.hasOwnProperty(key)) {
              let rowKey = rowData[key];
              if(colVal > 0){
                  csvString += ',';
              }
              // If the column is undefined, it as blank in the CSV file.
              let value = csvdata[i][rowKey] === undefined ? '' : csvdata[i][rowKey];
              if (value != null || value != '') {
                if (value.match) {
                  if (value.match(regExp) || value.match(regExpForTime) || value.match(decimalExp)) {
                    csvString += '="' + value + '"';
                  } else {
                    csvString += '"' + value + '"';
                  }
                } else {
                  csvString += '"' + value + '"';
                }
              } else {
                csvString += '"' + value + '"';
              }
          }
          colVal++;
      }
      csvString += rowEnd;
      console.log("csvString",csvString)
    }
    /* Updated change on 27-09-2021 */
    var universalBOM = "\uFEFF";
    var a = window.document.createElement('a');
    a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString));
    a.setAttribute('target', '_self');
    a.setAttribute('download',  name + '.csv')
    window.document.body.appendChild(a);
    a.click();
    // exportCSVFile(this.headerdata, this.exceldata, name)
    }
  }
  callcreatexlsxMethod(headerList , filename , worksheetNameList , sheetData ){
    const XLSX = window.XLSX;
    let xlsData = sheetData;
    let xlsHeader = headerList;
    let ws_name = worksheetNameList;
    let createXLSLFormatObj = Array(xlsData.length).fill([]);
    //let xlsRowsKeys = [];
    /* form header list */
      xlsHeader.forEach((item, index) => createXLSLFormatObj[index] = [item])
      
    /* form data key list */
      xlsData.forEach((item, selectedRowIndex)=> {
          let xlsRowKey = Object.keys(item[0]);

          item.forEach((value, index) => {
              var innerRowData = [];
              xlsRowKey.forEach(item=>{
                console.log("valur of key",value[item])
                  innerRowData.push(value[item]);
              })

              createXLSLFormatObj[selectedRowIndex].push(innerRowData);
          })
      });

    /* creating new Excel */
    var wb = XLSX.utils.book_new();
    console.log("wb",wb)
    /* creating new worksheet */
    var ws = Array(createXLSLFormatObj.length).fill([]);
    console.log("ws",ws.length)
    for (let i = 0; i < ws.length; i++) {
      /* converting data to excel format and puhing to worksheet */
      let data = XLSX.utils.aoa_to_sheet(createXLSLFormatObj[i]);
      ws[i] = [...ws[i], data];
      console.log("ws[i]",ws_name[i] )
      

      /* Add worksheet to Excel */
      XLSX.utils.book_append_sheet(wb, ws[i][0], ws_name[i]);
    }
    console.log("filename")
    /* Write Excel and Download */
    XLSX.writeFile(wb, filename);
    console.log("filename")

  }

  handleApply(){
    this.dispatchEvent(
      new CustomEvent("show", { detail :''})
    );
   
    let months ;
    this.monthList.forEach(month => {
      if(this.selectedmonth == month.label){
        months = month.value;
      }
    })
    
    let managerId ;
    this.DriverManagerList.forEach(row => {
      if(row.Name == this.manager){
        managerId = row.Id;
      }
    })
   if(this.selectedweek){
    //2023-03-24
    let sdate = this.selectedweek.split('-')[0];
    let edate = this.selectedweek.split('-')[1];

      this.from_Date = sdate.split('/')[0]+'/'+sdate.split('/')[1]+'/20'+sdate.split('/')[2];
      this.to_Date = edate.split('/')[0]+'/'+edate.split('/')[1]+'/20'+edate.split('/')[2];
      console.log("date", this.from_Date )
   }else{
    if(this.from_Date){
      this.from_Date = this.template.querySelector(`.date-selector[data-id="fromDate"]`).value ;
      this.to_Date = this.template.querySelector(`.date-selector[data-id="toDate"]`).value ;
    }  
   }
   if(this.from_Date == undefined){
    this.from_Date = null;
    this.to_Date = null;
   }
   console.log("onboarding status",this.to_Date+'--->this.from_Date'+this.from_Date)
  //  if(this.reportName == 'Onboarding Status Report'){
    this.reportsoql = this.reportsoql.replaceAll(/\\/g, '');
    const replacedString =  this.reportsoql.replace(/\\\\/g, '');
    console.log("this.reportsoql",replacedString)
    this.reportsoql = replacedString;
  //  }
    getAllReportSoql({reportSoql : this.reportsoql,
                      reporttype : this.reportType,
                      selectedManager : managerId,
                      tripStartDate : this.from_Date,
                      tripEndDate : this.to_Date,
                      contactid : this._adminid,
                      accountid : this._accid,
                      reportid : this.reportId,
                      driverormanager : this.DriverManager,
                      monthVal :  months,
                      checkLimit : this.limitOfrecord})
  .then((result) => {
        this.searchdata = [];
        this.filterdata = JSON.parse(result);
        console.log("length1", this.filterdata)

        console.log("length1", this.filterdata.length)
        if(this.filterdata.length > 0){
          if(this.reportName == 'Employee Roster Report'){
            this.filterdata.forEach(element => {
              if(element.Activation_Date__c != undefined){
                var actdate = element.Activation_Date__c;
                element.Activation_Date__c = actdate.split('-')[1]+'/'+actdate.split('-')[2]+'/'+actdate.split('-')[0];
              }
              if(element.Deactivated_Date__c != undefined){
                var dctdate = element.Deactivated_Date__c;
                element.Deactivated_Date__c = dctdate.split('-')[1]+'/'+(dctdate.split('-')[2]).slice(0, 2)+'/'+dctdate.split('-')[0];
              }
            })
          }else if(this.reportName == 'Onboarding Status Report'){
            this.filterdata.forEach(element => {
              if(element.Schedule_Driver_Meeting__c == true){
                element.Schedule_Driver_Meeting__c = 'Yes';
              }else if(element.Schedule_Driver_Meeting__c == false){
                element.Schedule_Driver_Meeting__c = 'No';
              }
            })
          }else if(this.reportName == 'Commuter and Actual Mileage Report'){
            this.filterdata.forEach(element => {
              if(element.Trip_Date__c != undefined){
                var actdate = element.Trip_Date__c;
                element.Trip_Date__c = actdate.split('-')[1]+'/'+actdate.split('-')[2]+'/'+actdate.split('-')[0];
              }
              if(element.Approved_Date__c != undefined){
                var approvedt = element.Approved_Date__c;
                element.Approved_Date__c = approvedt.split('-')[1]+'/'+approvedt.split('-')[2]+'/'+approvedt.split('-')[0];
              }
              
              if(element.ConvertedStartTime__c != undefined){
                var starttime = element.ConvertedStartTime__c;
                var time = new Date(starttime);
                var ampm = time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
                element.ConvertedStartTime__c = (starttime.split('T')[1]).slice(0, 5)+ ' '+ampm.split(' ')[1];
              }
              if(element.ConvertedEndTime__c != undefined){
                var endtime = element.ConvertedEndTime__c;
                var time1 = new Date(endtime);
                var ampm1 = time1.toLocaleString('en-US', { hour: 'numeric', hour12: true })
                element.ConvertedEndTime__c = (endtime.split('T')[1]).slice(0, 5)+ ' '+ampm1.split(' ')[1];
              }
            })  
          }
          this.showbuttons = true;
          this.recordDisplay = true;
          this.headerfields = new Map();
          for(var i=0 ; i < this.detailsoql.length ; i++){
              if(this.detailsoql[i].includes('.')){
                  this.headerfields.set(this.detailsoql[i].split('.')[1],this.headerdata[i]);
              }else{
                  this.headerfields.set(this.detailsoql[i],this.headerdata[i]);
              }
          }
          this.headerfields.set('Id','Id');
          console.log("this.filterdata.length",this.filterdata.length)
          this.keyArray = [];
          for(var i=0;i<this.filterdata.length;i++){
              Object.keys(this.filterdata[i]).forEach((key) => {
                          if(key != "attributes"){
                              if(typeof this.filterdata[i][key] == "object"){
                                  this.nestedJsonRead(this.filterdata[i][key] , i);
                              }else{
                                  if(this.headerfields.has(key)){
                                      this.keyArray.push(i,this.headerfields.get(key),this.filterdata[i][key]);
                                  }
                              }
                          }
              })
          }
          this.keyArray = JSON.parse(JSON.stringify(this.keyArray))
          console.log("this.keyArray",this.keyArray)

          var temp1 = [];
         
          for(let k=0;k<this.keyArray.length;k++){
              if(k % 3 == 0){
                temp1.push({[this.keyArray[k+1]]:this.keyArray[k+2] ,index: this.keyArray[k]})
              }
          }
          let temparray1 =  JSON.parse(JSON.stringify(temp1));
          console.log("temparray",temparray1)
          let groupedData1 =[];
          for (var i = 0; i < temparray1.length; i++) {
              var item = temparray1[i];
              if (!groupedData1[item.index]) {
                  groupedData1[item.index] = [];
              }

              var m = 0;
              Object.keys(item).forEach(key => {
                  m = m+1;
                  if(m == 1){
                  //  groupedData1[item.index].push({[key]:item[key]});
                    if(key == 'Id'){
                            groupedData1[item.index].push({Id:item[key]});

                            }else{
                              groupedData1[item.index].push({[key]:item[key]});

                            }
                   console.log("groupedData1",JSON.parse(JSON.stringify(groupedData1)))
                  }
                }); 
            }
            
            // Log or use the grouped data
            let objarr = JSON.parse(JSON.stringify(groupedData1));
            console.log("objarr",objarr)
            for(var h=0;h<objarr.length;h++){
              
              let finalObj1 ;
              for(var n=0;n<objarr[h].length;n++){
                finalObj1 =  Object.assign({}, ...objarr[h]);
              }
              objarr[h] = finalObj1;
            }
            
            this.searchdata = JSON.parse(JSON.stringify(objarr));
            this.exceldata =JSON.parse(JSON.stringify(objarr));
            console.log("this.searchdata",this.searchdata)
            this.dynamicBinding(this.searchdata,  this.headerdata)
            setTimeout(() => {
              this.dispatchEvent(
                new CustomEvent("hide", { detail : ''})
              );
            },2000); 
            this.template.querySelector('c-user-preview-table').tableListRefresh(this.searchdata) ;
            if(this.limitOfrecord > 0){
              let originalString = SALESFORCE_LIMIT_MSG;
              console.log("replace string",originalString)

              console.log("replace string",originalString.replace("2000",this.limitOfrecord))
              this.dispatchEvent(
                new CustomEvent("toastmessage", {
                  detail: {
                      errormsg: "info",
                      message:originalString.replace("2000",this.limitOfrecord)
                  } 
                })
              )
            }
      }else{
          this.showbuttons = false;
          // this.recordDisplay = false;
          this.searchdata = [];
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("hide", { detail : ''})
            );
          },2000); 
          this.template.querySelector('c-user-preview-table').tableListRefresh(this.searchdata) ;
         
      }
    })
    .catch(error => {
          console.log("failure",error);
          this.showbuttons = false;
          // this.recordDisplay = false;
          this.searchdata = [];
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("hide", { detail : ''})
            );
          },2000); 
          this.template.querySelector('c-user-preview-table').tableListRefresh(this.searchdata) ;
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                  errormsg: "error",
                  message:"System Error: A team member has been notified to identify and address the issue within a working day.If it is urgent, please contact support for a solution."
              } 
            })
          )
    });
  }
  handleConcur(){
    this.dispatchEvent(
      new CustomEvent("show", { detail :''})
    );
    postTotalReimbursementForAllUser({accId : this._accid})
    .then((result) => {
     
        this.dispatchEvent(
          new CustomEvent("hide", { detail : ''})
        );
    })
    .catch(error => {
          console.log("failure",error);
          this.dispatchEvent(
            new CustomEvent("hide", { detail : ''})
          );
    });
  }
  showupdatebtn(){
    this.updatebtn = true;
  }
  handleUpdateList(event){
    this.updatebtn = true;
    console.log("input value",event.detail.inputValue)
    let updateJson = JSON.parse(event.detail.list);
    console.log("updateJson",updateJson)

    this.remId = updateJson.Id ;
    let str1 ;
    this.editable_feilds.forEach(index => {
      if(index.split('-')[0] == event.detail.key){
        str1 = index.split('-')[1];
      }
    })
    let finalJson = [];
    finalJson.push({Id : updateJson.Id , [str1] : event.detail.inputValue})
		// this.updatedList =Object.assign({}, ...finalJson);
    this.updatedList.push(finalJson)
    console.log("employeeList",JSON.parse(JSON.stringify(this.updatedList)))

    if(this.searchdata.length > 2){
    let tempdata1 = JSON.parse(JSON.stringify(this.searchdata));
    tempdata1.forEach(searchdatanew => {
      console.log("searchdatanew",searchdatanew.Id +'-----'+ this.remId)
        if(searchdatanew.Id == this.remId){
          searchdatanew.keyFields.forEach(col1 => {
            if(col1.key == event.detail.key){
              col1.value = event.detail.inputValue;
            }
          })
        }
        this.template.querySelector('c-user-preview-table').tableListRefresh(tempdata1) ;
        this.searchdata=tempdata1;
      })
    }else{
      let tempdata = JSON.parse(JSON.stringify(this.finaldata));
      tempdata.forEach(searchdata => {
        if(searchdata.Id == this.remId){
          searchdata.keyFields.forEach(col => {
            if(col.key == event.detail.key){
              col.value = event.detail.inputValue;
            }
          })
        }
      })
      this.template.querySelector('c-user-preview-table').tableListRefresh(tempdata) ;
      this.finaldata = tempdata;
    }
  }
  handleupdate(){
    const mergedArray = [].concat(...this.updatedList);
    const mergedObjects = {};
    // Loop through the inputArray
    for (const obj of mergedArray) {
      const id = obj.Id;
      if (!mergedObjects[id]) {
        // If the ID doesn't exist in mergedObjects, create a new object
        mergedObjects[id] = { Id: id };
      }
      // Merge the properties from the current object into the merged object
      Object.assign(mergedObjects[id], obj);
    }
    // Convert the mergedObjects object back into an array
    const deduplicatedArray = Object.values(mergedObjects);
    console.log(JSON.stringify(deduplicatedArray));
    

    updateEditableField({data : JSON.stringify(deduplicatedArray) , idOfRecord : this.remId})
    .then((result) => {
      this.dispatchEvent(
        new CustomEvent("toastmessage", {
          detail: {
              errormsg: "success",
              message:"Data Update Successfully"
          } 
        })
      )
      this.updatebtn = false;
    })
    .catch(error => {
      console.log("failure",error);
    });
    this.updatebtn = false;
  }
  handleCancel(){
    this.updatebtn = false;
    let canceldata ;
    if(this.searchdata.length > 2){
      canceldata = this.searchdata;
    }else{
      canceldata = this.finaldata;
    }
    this.dynamicBinding(canceldata,  this.headerdata)
    if(this.searchdata.length > 2){
      this.searchdata = canceldata;
    }else{
      this.finaldata = canceldata;
    }
    this.template.querySelector('c-user-preview-table').tableListRefresh( canceldata) ;
  }
}

// 0033r000042KVO6AAO