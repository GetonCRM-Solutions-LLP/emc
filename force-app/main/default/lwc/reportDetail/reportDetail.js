import { LightningElement , api } from 'lwc';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getDriverManagerDropdownList from '@salesforce/apex/ReportDetailsController.getDriverManagerList';
import getReportDetails from '@salesforce/apex/ReportDetailsController.getReportDetail';
import getManagerDriverDetails from '@salesforce/apex/ReportDetailsController.getAllManagers';
import { loadStyle , loadScript } from 'lightning/platformResourceLoader';
import jQueryMinified from '@salesforce/resourceUrl/jQueryMinified';
import datepicker from '@salesforce/resourceUrl/calendar';
import customMinifiedDP  from '@salesforce/resourceUrl/modalCalDp';
import accountMonthList from "@salesforce/apex/ManagerDashboardController.accountMonthList";
import getAllReportSoql from '@salesforce/apex/ReportDetailsController.getAllReportSoql';

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
connectedCallback(){
  console.log("this.reportId",this.reportId)
    this._accid  = this.getUrlParamValue(window.location.href, 'accid')
    this._adminid  = this.getUrlParamValue(window.location.href, 'id')
    
    if( this.reportId != 'TAX123'){
      var date = new Date();
      let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      let enddate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
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
        endconvertdate = '0'+enddate.getMonth();
      }else{
        endconvertdate = enddate.getMonth();
      }
      if(enddate.getDate() < 9 ){
        endconvertmonth = '0'+enddate.getDate();
      }else{
        endconvertmonth = enddate.getDate();
      }
      this.to_Date = endconvertdate+'/'+endconvertmonth+'/'+getyear.substring(1);
     
      getReportDetails({reportid : this.reportId})
      .then(result => {
        
          let resultdata = JSON.parse(result);
          console.log("detail",resultdata)
          this.reportType = resultdata.Report_Type__c;
          let datefield = resultdata.Date_Fields__c
          let datetimefield = resultdata.Date_Time_Fields__c
          let numericfield = resultdata.Numeric_Fields__c
          let showfilter = resultdata.Filter_By__c == undefined ?  '' : resultdata.Filter_By__c
          this.reportName = resultdata.Name;
  
          if(showfilter.length > 0){
              if(showfilter.includes('Monthly')){
                  this.getAccountMonthList()
                  this.monthlyDropdown = true;
                  this.weeklyDropdown = false;
                  this.dateRange = false;
              }else if(showfilter.includes('Biweekly')){
                  this.weeklyDropdown = true;
                  this.dateRange = false;
                  this.monthlyDropdown = false;
              }else if(showfilter == 'Dates'){
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
  
          getManagerDriverDetails({accountId : this._accid,role : this.DriverManager})
          .then(result => {
              this.DriverManagerList = JSON.parse(result);
              this.DriverManagerList.forEach(index => {
                  this.picklist.push({label:index.Name,value:index.Id})
              })
              this.picklist = JSON.parse(JSON.stringify(this.picklist))
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
          console.log("detail",JSON.parse(JSON.stringify(this.detail)))
          let detaildatanew = JSON.parse(JSON.stringify(detailarraynew))
          this.detailsoql = JSON.parse(JSON.stringify(detailarraynew));
          var imageList=[];
          let coltype;
          for(let i=0;i<this.headerdata.length;i++){
          if(datefield == detaildatanew[i]){
                  coltype = 'Date'
          }else if(datetimefield == detaildatanew[i]){
                  coltype = 'Datetime'
          }else if(numericfield == detaildatanew[i]){
                  coltype = 'Decimal'
          }else{
                  coltype = 'String'
          }
          imageList.push({id:i,name:this.headerdata[i] ,colName:detaildatanew[i],colType:coltype,arrUp:false,arrDown:false});
          }
          this.header = JSON.parse(JSON.stringify(imageList));
          console.log("header",this.header)
          getDriverManagerDropdownList({accountId : '0010Z00001ygUen' , contactId : '0030Z00003NFLRo', reportId : this.reportId})
          .then(result => {
              let data = JSON.parse(result)
              if(data[1].length > 8){
                  this.recordDisplay = true;
                  this.detaildata = JSON.parse(JSON.parse(data[1]));
                  this.headerfields = new Map();
                  for(var i=0 ; i < detaildatanew.length ; i++){
                      if(detaildatanew[i].includes('.')){
                          this.headerfields.set(detaildatanew[i].split('.')[1],this.headerdata[i]);
                      }else{
                          this.headerfields.set(detaildatanew[i],this.headerdata[i]);
                      }
                  }
                  
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
                           groupedData[item.index].push({[key]:item[key]});
                          }
                        }); 
                    }
                    
                    // Log or use the grouped data
                    let objarray = JSON.parse(JSON.stringify(groupedData));
  
                    for(var h=0;h<objarray.length;h++){
                      
                      let finalObj ;
                      for(var n=0;n<objarray[h].length;n++){
                          finalObj =  Object.assign({}, ...objarray[h]);
                      }
                      objarray[h] = finalObj;
                    }
                    this.finaldata = JSON.parse(JSON.stringify(objarray))
                    this.exceldata =JSON.parse(JSON.stringify(objarray));
                  this.dynamicBinding(this.finaldata,  this.headerdata)
                  this.ishow = true;
              }else{
                  this.ishow = true;
                  this.recordDisplay = false;
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
    }
    

}
getAccountMonthList() {
    accountMonthList({
      accountId: '0010Z00001ygUen'
    }).then((data) => {
      if (data) {
        // let mileageAccount = data ? this.removeDuplicateValue(this.proxyToObject(data)) : [];
        let month = JSON.parse(data)
        console.log("monthoption",month)
        month.forEach(row => {
            this.monthoption.push({label : row , value : row})
        })
        this.monthoption = JSON.parse(JSON.stringify( this.monthoption))
        console.log("monthoption",this.monthoption)
      }
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
    data.forEach(element => {
        let model = [];
        keyFields.forEach(key => {
                let singleValue = {}
                    singleValue.key = key;
                    singleValue.value = element[key];
                  model.push(singleValue);
        })
        element.keyFields = this.mapOrder(model, keyFields, 'key');
    });
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
    this.manager = event.detail.value;
}
handleChange(event){
    this.searchkey = event.target.value;
    if(this.template.querySelector('c-user-preview-table')){
        this.template.querySelector('c-user-preview-table').searchByKey(this.searchkey);
    }
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
                 if(index ===  0){
                  let fromdate = date;
                 this.from_Date =  fromdate;
                 }
                 if(index ===  1){
                  let todate = date;
                  this.to_Date =  todate;
                 }
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
    let target = parent.children[0].offsetParent;
    if(target  !== null || target !== undefined){
        let targetchildren = target.children[2];
        if(targetchildren  !== null || targetchildren !== undefined){
            let child1 = targetchildren.children[0]
            if(child1  !== null || child1 !== undefined){
                let child2 = child1.children[0]
                if(child2 !== null || child2 !== undefined){
                    let table = child2.children[0];
                    console.log("table", parent.children)
                    this.dispatchEvent(
                        new CustomEvent("copy", {
                        detail:targetchildren
                        })
                    );
                }
            }
        }
    }
   

    
  }
  handlePrint() {
    const parent = this.template.querySelector('c-user-preview-table');
    let target = parent.children[0].offsetParent;
    if(target  !== null || target !== undefined){
        let targetchildren = target.children[2];
        if(targetchildren  !== null || targetchildren !== undefined){
            let table = targetchildren.children[0];
           
                this.dispatchEvent(
                  new CustomEvent("print", {
                    detail:table
                  })
                );
        }
    }    
  
  }
  handleCreateExcel(){
    let exceldata = [];
    this.exceldata.forEach(element => {
        let model = [];
        this.headerdata.forEach(key => {
            model.push({[key]:element[key]});
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
        tempworkSheetNameList.push(this.reportName);
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
    for (let i = 0; i < ws.length; i++) {
      /* converting data to excel format and puhing to worksheet */
      let data = XLSX.utils.aoa_to_sheet(createXLSLFormatObj[i]);
      ws[i] = [...ws[i], data];

      /* Add worksheet to Excel */
      XLSX.utils.book_append_sheet(wb, ws[i][0], ws_name[i]);
    }

    /* Write Excel and Download */
    XLSX.writeFile(wb, filename);
  }

  handleApply(){
    
    let managerId ;
    this.DriverManagerList.forEach(row => {
      if(row.Name == this.manager){
        managerId = row.Id;
      }
    })
   
    getAllReportSoql({reportSoql : this.reportsoql,
                      reporttype : this.reportType,
                      selectedManager : managerId,
                      tripStartDate : this.from_Date,
                      tripEndDate : this.to_Date,
                      contactid : this._adminid,
                      accountid : this._accid,
                      reportid : this.reportId,
                      driverormanager : this.DriverManager,
                      monthVal :  this.selectedmonth})
  .then((result) => {
        // console.log("success",JSON.parse(JSON.stringify(JSON.parse(result))));
        // this.filterdata = [];
        this.searchdata = [];
        this.filterdata = JSON.parse(result);
        console.log("length1", this.filterdata)
        if(this.filterdata.length > 2){
          this.recordDisplay = true;
          this.headerfields = new Map();
          for(var i=0 ; i < this.detailsoql.length ; i++){
              if(this.detailsoql[i].includes('.')){
                  this.headerfields.set(this.detailsoql[i].split('.')[1],this.headerdata[i]);
              }else{
                  this.headerfields.set(this.detailsoql[i],this.headerdata[i]);
              }
          }
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
                   groupedData1[item.index].push({[key]:item[key]});
                   console.log("groupedData1",groupedData1)
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
            // this.finaldata = [];
            
            this.searchdata = JSON.parse(JSON.stringify(objarr));
        console.log("length2",this.searchdata.length + this.searchdata)

            this.exceldata =JSON.parse(JSON.stringify(objarr));
          this.dynamicBinding(this.searchdata,  this.headerdata)
          // this.ishow = true;
          this.template.querySelector('c-user-preview-table').tableListRefresh(this.searchdata) ;
      }else{
          // this.ishow = true;
          this.recordDisplay = false;
      }
  })
  .catch(error => {
        console.log("failure",error);
  });
    
  }
}