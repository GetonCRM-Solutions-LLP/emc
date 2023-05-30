import { LightningElement , api } from 'lwc';
import { loadStyle , loadScript } from 'lightning/platformResourceLoader';
import DRIVER_TAX_REPORT from '@salesforce/resourceUrl/MilegesDynamicTable';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import deleteMileages from '@salesforce/apex/GetDriverData.deleteMileages';
import approveMileages from '@salesforce/apex/GetDriverData.approveMileages';
import fetchMileages from '@salesforce/apex/GetDriverData.fetchMileageslwc';
import datepicker from '@salesforce/resourceUrl/calendar';
import customMinifiedDP  from '@salesforce/resourceUrl/modalCalDp';
import mileageListData from '@salesforce/apex/GetDriverData.mileageListData';
import deleteTrips from '@salesforce/apex/GetDriverData.deleteTrips';
import MassSyncTrips from '@salesforce/apex/GetDriverData.MassSyncTrips';
import fetchHighRiskValues from '@salesforce/apex/GetDriverData.highRiskMileages';
import {
  formatData,
  dateTypeFormat,
  excelFormatDate,
  yearMonthDate
} from 'c/commonLib';
export default class NewDatatableComponent extends LightningElement {
  @api accId ;
  @api adminId;
  contactId;
  accountId;
  Accounts = [];
  MilegesData = [];
  MilegesDatanew = [];
  searchdata = [];
  searchKey = '';
  searchDataLength = false;
  headershow = false;
  pagination = false;
  checkinTolltip = false;
  pageSize = '25';
  totalrows;
  totalmileage = 0;
  pageSizeOptions = [{Id:1,label:'25',value:'25'},{Id:2,label:'50',value:'50'},{Id:3,label:'100',value:'100'},{Id:4,label:'200',value:'200'}];
  openmodel = false;
  recordid;
  isopen = false;
  ascsorticon = false;
  dscsorticon = false;
  @api driver;
  number = 0;
  reverse = false;
  approveRejectData = [];
  isAlertEnabled = false;
  // isLoading = false;
  alertMessage='';
  paginatinrecord = [];
  mapIcon = resourceImage + '/mburse/assets/map_point.png';
  title='';
  isFalse=true;
  modalclass = "slds-modal slds-fade-in-open ";
  headerclass = "slds-modal__header header-preview hedear-style_class";
  subheaderClass = "slds-modal__title slds-hyphenate hedear-style_class";
  modalcontentstyle = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
  styleheader = "slds-modal__container"
  closebtnclass = "close-notify"
  modalcontentmessage;
  updatetext;
  btnlabel;
  advancesearch = false;
  celenderdropdown = false;
  filename;
  xlsHeader = [];
  xlsData = [];
  temp = [];
  currentDate;
  fromDate = '';
  toDate = '';
  calStartDate;
  calendDate;
  csvFiledata = [];
  _accid;
  _adminid;
  @api driverData;
  driverDataNew;
  syStDate;
  syEnDate;
  @api monthList ;
  @api driverList;
  @api statusList;
  typeList = [{Id : 1 , label : 'All Types' , value : 'All Types'},{Id : 1 , label : 'High Risk' , value : 'High Risk'}];
  // driveroption = [];
  /** Class name decorator added by megha */
  @api mainClass;
  className = 'slds-scrollable_y slds-p-right_small slds-p-left_small';
  @api norecordMessage;
  visibleRecords;
  user ='';
  tripStatus='';
  
   TypeOptions = [ { fieldlabel: 'Date & Time', fieldName: 'datetime' },
                            { fieldlabel: 'Driver', fieldName: 'Driver' },
                            { fieldlabel: 'Mileage', fieldName: 'mileage' },
                            { fieldlabel: 'From', fieldName: 'from' },
                            { fieldlabel: 'To', fieldName: 'to' },
                            { fieldlabel: 'Tags', fieldName: 'tags' },
                            { fieldlabel: 'Notes', fieldName: 'notes' }];

    
     getUrlParamValue(url, key) {
      return new URL(url).searchParams.get(key);
    }

    connectedCallback(){
      this._accid  = this.getUrlParamValue(window.location.href, 'accid')
      this._adminid  = this.getUrlParamValue(window.location.href, 'id')
      this.getmilegeslist(this.driverData);
    }

    renderedCallback() {
      Promise.all([loadStyle(this, DRIVER_TAX_REPORT + '/MilesgesCSS/milegesDetailCSS.css')]);
    }
    
    get options() {
      var optionList;
      var currentDate = new Date();
      var previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      var lastSyncMonth = dateTypeFormat(previousDate);
      var currentSyncMonth = dateTypeFormat(currentDate);
      optionList = [{
          label: lastSyncMonth,
          value: lastSyncMonth
      }, {
          label: currentSyncMonth,
          value: currentSyncMonth
      }];
      return optionList;
    }

    get driveroption() {
      var driverlist = JSON.parse( JSON.stringify( this.driverList ) ).sort( ( a, b ) => {
        a = a.value ? a.value.toLowerCase() : ''; // Handle null values
        b = b.value ? b.value.toLowerCase() : '';
        return a > b ? 1 : -1;
      });;
      let driverarray = [{id: 1,label:'All Active Users',value:'All Active Users'}].concat(driverlist);
      return driverarray;
    }
    get statusoption() {
      return JSON.parse(JSON.stringify(this.statusList));
    }
    get monthoptions() {
      var monthoption = JSON.parse(  this.monthList ).sort( ( a, b ) => {
        return a.id < b.id ? 1 : -1;
      });
      let arr2 = [{label:'Calendar',value:'Calendar'}].concat(monthoption);
      return arr2;
    }
    @api getmilegeslist(data){
     let accdata = [];
     let dateformatenew;
     let enddateformate;
     let dateformate;
     let acctdata = JSON.parse(data);
     console.log("acc data1",data);
     console.log("acc data2",acctdata);

     for(let index  = 0 ; index < acctdata.length ; index++){
           
           //for trip date
           if(acctdata[index].Trip_Date__c != undefined){
             let objectDate = new Date(acctdata[index].Trip_Date__c);
             
             let day = objectDate.getDate();
             if (day < 10) {
               day = '0' + day;
             }
             let month = objectDate.getMonth() + 1;
             if (month < 10) {
               month = '0' + month;
             }
             let year = objectDate.getYear();
             year = year.toString();
             
             dateformate = month+'/'+day+'/'+year.substring(1);
           }else{
             dateformate = '';
           }
           
           //for starttime
           if(acctdata[index].ConvertedStartTime__c != undefined){
             let startendTime = new Date(acctdata[index].ConvertedStartTime__c);
             let convertedTime = startendTime.toLocaleTimeString("en-US", {
               timeZone: "America/Panama",
               hour: "2-digit",
               minute: "2-digit",
             });
              dateformatenew = convertedTime + ' - ';
             
           }else{
             dateformatenew = '';
           }    
           
           //for endtime
           if(acctdata[index].ConvertedEndTime__c != undefined){
             let endTime = new Date(acctdata[index].ConvertedEndTime__c);
             let convertedEndTime = endTime.toLocaleTimeString("en-US", {
               timeZone: "America/Panama",
               hour: "2-digit",
               minute: "2-digit",
             });
             enddateformate = convertedEndTime;
           }else{
             enddateformate = '';
           } 
           if(acctdata[index].Tracing_Style__c != undefined){
            if(acctdata[index].Tracing_Style__c.length > 0){
              this.checkinTolltip = true;
            }else{
              this.checkinTolltip = false;
            }
           }
           accdata.push({Id : acctdata[index].Id , Date:dateformate ,IsSelected : false, checkinicon : false ,TrackingTolltip : this.checkinTolltip, Status : acctdata[index].Trip_Status__c , rowSelected:"tbody-header" ,iconcolor:"checkin_icon",timeColor:'start_time',
                         StartTime : dateformatenew,EndTime : enddateformate,DriverName : acctdata[index].EmployeeReimbursement__r.Contact_Id_Name__c , Mileges : acctdata[index].Mileage__c , 
                         From : acctdata[index].Original_Origin_Name__c  == undefined ? acctdata[index].Origin_Name__c == undefined ? '': acctdata[index].Origin_Name__c : acctdata[index].Original_Origin_Name__c, 
                         Triporigion : acctdata[index].Trip_Origin__c,
                         To : acctdata[index].Original_Destination_Name__c == undefined ? acctdata[index].Destination_Name__c == undefined ? '': acctdata[index].Destination_Name__c : acctdata[index].Original_Destination_Name__c ,  
                         Toorigion : acctdata[index].Trip_Destination__c,
                         weekday:acctdata[index].Day_Of_Week__c == undefined ? '' : acctdata[index].Day_Of_Week__c.substring(0, 3), 
                         Tags : acctdata[index].Tag__c == undefined ? '' : acctdata[index].Tag__c , 
                         Notes :  acctdata[index].Notes__c == undefined ? '' : acctdata[index].Notes__c , 
                         Activity : acctdata[index].Activity__c == undefined ? '' : acctdata[index].Activity__c , 
                         DriveTime: acctdata[index].Driving_Time__c == undefined ?  0 : acctdata[index].Driving_Time__c,
                         StayTime:  acctdata[index].Stay_Time__c == undefined ? 0 : acctdata[index].Stay_Time__c,
                         fromlatitude:acctdata[index].From_Location__Latitude__s == undefined ?  0 : acctdata[index].From_Location__Latitude__s,
                         fromlongitude: acctdata[index].From_Location__Longitude__s == undefined ?  0 : acctdata[index].From_Location__Longitude__s,
                         tolatitude: acctdata[index].To_Location__Latitude__s == undefined ?  0 : acctdata[index].To_Location__Latitude__s,
                         tolongitude: acctdata[index].To_Location__Longitude__s == undefined ?  0 : acctdata[index].To_Location__Longitude__s,
                         tripId:acctdata[index].Trip_Id__c == undefined ? 0 : acctdata[index].Trip_Id__c,
                         triplog: acctdata[index].Triplog_Map__c == undefined ? '' : acctdata[index].Triplog_Map__c,
                         timezone: acctdata[index].TimeZone__c == undefined ? '' : acctdata[index].TimeZone__c,
                         waypoint: acctdata[index].Way_Points__c == undefined ? null : acctdata[index].Way_Points__c,
                         EmailID : acctdata[index].EmployeeReimbursement__r.Contact_Id__r.External_Email__c,
                         TrackingStyle : acctdata[index].Tracing_Style__c == undefined ?  '' : acctdata[index].Tracing_Style__c
             });
         }
         
         this.Accounts = accdata;
         this.driverDataNew = accdata;
         console.log("in loop",this.Accounts)
         if (this.Accounts.length != 0) {
           this.searchDataLength = true;
           this.totalrows = this.Accounts.length;
           console.log("in loop",this.Accounts.length)
           this.pagination = true;
           this.headershow = true;
           if(this.template.querySelector('c-new-paginator')){
             this.template.querySelector('c-new-paginator').updateRecords(this.Accounts , this.pageSize)
           }  
           this.dispatchEvent(
            new CustomEvent("showloader", { detail : ''})
          );
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("hideloader", { detail : ''})
            );
          },2000);  
         } else {
           this.searchDataLength = false;
           this.pagination = false;
           this.headershow = false;
           this.totalrows = this.Accounts.length;
         }
     }

    pageEventClick(event){
      let pageeventdata = [...event.detail.records];
      this.MilegesData = JSON.parse(JSON.stringify(pageeventdata))
      let mileges = 0;
        this.MilegesData.forEach(rowItem => {
          mileges = mileges + rowItem.Mileges;
          if(rowItem.fromlatitude == 0){
              rowItem.checkinicon = false;
          }else{
              rowItem.checkinicon = true;
          }
          
          if(rowItem.Status === "Approved") {
            rowItem.rowSelected = 'row collapsible row-approved-color';
            rowItem.iconcolor = 'checkin_icon';
            rowItem.timeColor  = 'start_time';
          }else if(rowItem.Status === "Rejected") {
            rowItem.rowSelected = 'row collapsible row-rejected-color';
            rowItem.iconcolor = 'reject_checkin_icon';
            rowItem.timeColor  = 'reject_time';
          } else{
            rowItem.rowSelected = 'row collapsible';
            rowItem.iconcolor = 'reject_checkin_icon';
            rowItem.timeColor  = 'start_time';
          } 
        })
        if(this.MilegesData.length > 0){
          this.headershow = true;
          this.celenderdropdown = true;
          if(this.template.querySelector('.CheckUncheckAll')){
            let checkboxes = this.template.querySelector('.CheckUncheckAll')
            checkboxes.checked = false;
          }
          this.totalmileage = mileges.toFixed(2);
        }else{
          this.celenderdropdown = false;
          this.headershow = false;
          this.totalmileage = 0.00;
        }
        this.MilegesDatanew = this.MilegesData;
    }
    
    handleRecordsPerPage(event){
      if(this.MilegesData.length > 0){
        this.pageSize = event.detail.value;
        this.dispatchEvent(
          new CustomEvent("showloader", { detail : ''})
        );
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("hideloader", { detail : ''})
          );
          this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
          this.celenderdropdown = true;
        },1000);  
      }  
    }

    IsAllCheckForApprove(event) {
      let checked = event.target.checked;
      let checkboxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
      for(let i=0; i<checkboxes.length; i++) {
        checkboxes[i].checked = checked;
      }
    }

    handleCheckbox(event){
      if(event.target.checked == false ){
        let checkboxes = this.template.querySelector('.CheckUncheckAll')
            checkboxes.checked = false;
      }
    }
    handleicon(event){
      this.sortRecs(event);
    }

    sortRecs(event){
      if(this.MilegesData.length > 0){
        let colName = event.currentTarget.dataset.name;
        if(colName == 'Driver' ){
          this.updateSorting(colName ,'DriverName')
        }else if(colName == 'Mileage'){
          this.updateSorting(colName, 'Mileges')
        }else if(colName == 'From'){
          this.updateSorting(colName ,'From')
        }else if(colName == 'To'){
          this.updateSorting(colName , 'To')
        }else if(colName == 'Tags'){
          this.updateSorting(colName , 'Tags')
        }else if(colName == 'Notes'){
          this.updateSorting(colName , 'Notes')
        }else if(colName == 'Date & Time'){
          this.updateSorting(colName , 'Date')
        }
      }
    }

    updateSorting(colname , field){
      this.template.querySelectorAll('.sorting_dsc').forEach(dsc =>{
        dsc.classList.remove('asc-style');
      }) 
      this.template.querySelectorAll('.sorting_asc').forEach(asc =>{
        asc.classList.remove('asc-style');
      })
       
      if(this.reverse  == false){
        this.MilegesData = JSON.parse( JSON.stringify( this.MilegesData ) ).sort( ( a, b ) => {
          a = a[ field ] ? a[ field ].toLowerCase() : ''; // Handle null values
          b = b[ field ] ? b[ field ].toLowerCase() : '';
          return a < b ? 1 : -1;
      });;
        this.reverse = true;
        this.template.querySelector(`.sorting_dsc[data-name="${colname}"]`).classList.add('asc-style'); 
        this.template.querySelector(`.sorting_asc[data-name="${colname}"]`).classList.remove('asc-style');
      }else{
        this.MilegesData = JSON.parse( JSON.stringify( this.MilegesData ) ).sort( ( a, b ) => {
          a = a[ field ] ? a[ field ].toLowerCase() : ''; // Handle null values
          b = b[ field ] ? b[ field ].toLowerCase() : '';
          return a > b ? 1 : -1;
        });;
        this.reverse = false;
        this.template.querySelector(`.sorting_asc[data-name="${colname}"]`).classList.add('asc-style'); 
        this.template.querySelector(`.sorting_dsc[data-name="${colname}"]`).classList.remove('asc-style');
      }
    }

    handleKeyPress(event){
      this.searchKey = event.target.value;
      if(this.MilegesData.length > 0){
        this.filterDropdownList(this.searchKey);
      }else{
        this.searchDataLength = false;
        this.totalmileage = 0.00;
        // this.totalrows = 0;
        this.headershow = false;
        this.pagination = false;
        this.celenderdropdown = false;
      }  
    }
    
    handleKeyCode(event){
      if(event.key === "Backspace"){
          this.MilegesData = this.MilegesDatanew;
          this.searchDataLength = true;
          this.headershow = true;
          this.pagination = true;
          this.celenderdropdown = true;
      }
    }

    filterDropdownList(key) {
      const filteredOptions = this.MilegesData.filter(filteritem => JSON.stringify(filteritem).toUpperCase().includes(key.toUpperCase()));
      this.MilegesData = filteredOptions;
      if(this.MilegesData.length > 0){
        this.searchDataLength = true;

      }else{
        this.searchDataLength = false;
        this.totalmileage = 0.00;
        // this.totalrows = 0;
        this.headershow = false;
        this.pagination = false;
        this.celenderdropdown = false;
      }
    }
    
    /** Added By Megha (Row Open on click of TR) Starts--- */
    previewTrip(event) {
      // event.stopPropagation();
     this.recordid = event.currentTarget.dataset.id;
        // Display list of rows with class name 'content'
      if(event.target.dataset.elementType != "checkbox"){
        let row = this.template.querySelectorAll(
          `[data-id="${this.recordid}"],.content_view`
        );
        
        for (let i = 0; i < row.length; i++) {
          let view = row[i];
          if (view.className === "row collapsible" || view.className === "row collapsible row-approved-color" || view.className === "row collapsible row-rejected-color") {
            if (this.recordid === view.dataset.id) {
             // if (view.style.display === "table-row" || view.style.display === "")
                view.classList.add('active');
            } else {view.classList.remove('active')};
          } else if (view.className === "row content_view") {
            if (this.recordid === view.dataset.id) {
              if (view.style.display === "table-row") { view.classList.remove('active'); view.style.display = "none";}
              else {  view.classList.add('active'); view.style.display = "table-row"; }
            }
          } 
        }
       
        this.MilegesData.forEach(newindex =>{
          if(newindex.Id === this.recordid){
            this.template.querySelector(`c-editable-datatable[data-id="${this.recordid}"]`).openmodal(newindex.Id , newindex.DriverName , newindex.Date ,newindex.Mileges ,newindex.From , newindex.To ,newindex.Tags , newindex.Notes , newindex.Activity ,newindex.DriveTime ,newindex.StayTime,newindex.fromlatitude,newindex.fromlongitude,newindex.tolatitude,newindex.tolongitude,newindex.tripId,newindex.triplog,newindex.timezone,newindex.waypoint,newindex.StartTime ,newindex.EndTime);
          }
          return newindex;
        })
      }  
    }

    //** (Row Close on click of TR) */
    closeTrip(event) {
      // data-id of row <tr> -- >
      this.rowElementId  = '';
       this.recordid = event.currentTarget.dataset.id;
      console.log("target", this.recordid, this.template.querySelectorAll(
        `[data-id="${this.recordid}"],.content_view`
      ))
      // Display list of rows with class name 'content'
      let row = this.template.querySelectorAll(
        `[data-id="${this.recordid}"],.content_view`
      );
  
      for (let i = 0; i < row.length; i++) {
        let view = row[i];
        if (
          view.className === "row collapsible active" || view.className === "row collapsible row-approved-color active" || view.className === "row collapsible row-rejected-color active"
        ) {
          if (this.recordid === view.dataset.id) {
              view.classList.remove('active');
          }else {view.classList.add('active')};
        } else if (view.className === "row content_view active") {
          if (this.recordid === view.dataset.id) {
            if (view.style.display === "table-row")  { view.classList.remove('active'); view.style.display = "none";}
            else { view.classList.add('active'); view.style.display = "table-row"; }
          }
        }
      }
    }
    /** Ends --- */
    handleRefresh(event){
      let data = this.Accounts;
      data.forEach(rowindex =>{
        if(rowindex.Id === event.detail.userid){
          rowindex.Notes = event.detail.usernote;
          rowindex.Tags = event.detail.usertag;
          rowindex.StayTime = event.detail.userstaytime;
          this.template.querySelector('c-editable-datatable').closeModal();
          // this.isLoading = true;
          this.dispatchEvent(
            new CustomEvent("showloader", { detail : ''})
          );
          setTimeout(() => {
            // this.isLoading = false;
            this.dispatchEvent(
              new CustomEvent("hideloader", { detail : ''})
            );
            this.template.querySelector(`.row[data-id="${rowindex.Id}"]`).classList.add('hightlight_row');
            this.dispatchEvent(
              new CustomEvent("toastmessage", {
                detail: {
                  errormsg: "success",
                  message:"Record Successfully Updated."
                } 
              })
            );
            setTimeout(() => {
                this.template.querySelector(`.row[data-id="${rowindex.Id}"]`).classList.remove('hightlight_row');
            }, 3000);
          }, 1000);
          
        }
        return rowindex;
      })
      this.Accounts = data;
      this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
    }

    getcheckboxtrue(){
      let listofarray = [];
      let checkboxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
      for(let i=0; i<checkboxes.length; i++) {
        if(checkboxes[i].checked == true){
          listofarray.push({
            Id: this.MilegesData[i].Id,
            employeeEmailId: this.MilegesData[i].EmailID,
          });
        }
      }
      this.approveRejectData = JSON.stringify(listofarray);
      console.log("getcheckboxtrue",this.approveRejectData.length)
    }

    handleUnapproveClick(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          //this.SetToasterrorMessage("Select atleast one trip to unapprove.");
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to unapprove."
              } 
            })
          );
        }else{
          this.btnlabel = "Cancel";
          this.openmodal("Unapprove Trips","Are you sure you want to unapprove the selected trips ?");
          this.updatetext = "Not Approved Yet";
        }
      }
    }
    handleRejectClick(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          //this.SetToasterrorMessage("Select atleast one trip to reject.");
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to reject."
              } 
            })
          );
        }else{
          this.btnlabel = "No";
          this.openmodal("Mileage Status","The mileage approval and flagging process could take several minutes. Would you like to receive an email when the process is complete ?");
          this.updatetext = "Rejected";
        }
      }  
    }
    handleApproveClick(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          //this.SetToasterrorMessage("Select atleast one trip to approve.");
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to approve."
              } 
            })
          );
        }else{
          this.btnlabel = "No";
          this.openmodal("Mileage Status","The mileage approval and flagging process could take several minutes. Would you like to receive an email when the process is complete ?");
          this.updatetext = "Approved";
        }
      }
    }
    handleDeleteTrips(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          // this.SetToasterrorMessage("Select atleast one trip to delete.");
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to delete."
              } 
            })
          );
        }else{
          this.btnlabel = "No";
          this.openmodal("Delete Trip Status","Are you sure you want to delete the selected trips ?");
          this.updatetext = "delete";
        }
      }  
    }
   
    openmodal(textofheader , contentmessage ){
      this.title=textofheader;
      this.modalcontentmessage = contentmessage;
      if (this.template.querySelector('c-user-profile-modal')) {
          this.template.querySelector('c-user-profile-modal[data-id="mileges"]').show();
      }
    }

    handlemodalYes(){
      let updateidlist = [];
      updateidlist = this.approveRejectData;

      if(this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="mileges"]').hide();
      }
      if(this.updatetext == "Not Approved Yet"){
        this.updateMileges(updateidlist ,"Trip Successfully unapproved", false , true , true);
      }else if(this.updatetext == "Approved"){
        this.updateMileges(updateidlist ,"Trip Successfully approved", true , true , false);
      }else if(this.updatetext == "Rejected"){
        this.updateMileges(updateidlist ,"Trip Successfully rejected", false , false , false);
      }else{
        deleteMileages({emailaddress: updateidlist })
        .then((data) => {
          const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
          const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
          fetchMileages({accID : accidparavalue,AdminId: idparavalue,limitSize : 7000,offset : 100})
          .then((result) => {
            let accresult = JSON.parse(JSON.stringify(result))
            console.log('accresult',accresult)
            this.getmilegeslist(accresult);
            //this.isLoading = true;
            this.dispatchEvent(
              new CustomEvent("showloader", { detail : ''})
            );
            setTimeout(() => {
              //this.isLoading = false;
              this.dispatchEvent(
                new CustomEvent("hideloader", { detail : ''})
              );
              this.dispatchEvent(
                new CustomEvent("toastmessage", {
                  detail: {
                    errormsg: "success",
                    message:"Trip Successfully deleted."
                  } 
                })
              );
            }, 2000);
          })
          .catch((error) => {
            console.log(error)
          });
          
         
          let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
          for(let i=0; i<boxes.length; i++) {
            if(boxes[i].checked == true){
              boxes[i].checked = false;
            }
          }
          this.approveRejectData =  [];
        })
        .catch((error) => {
          console.log(error)
        });
      }
    }
    closeModal(){
      let updateidlist = [];
      updateidlist = this.approveRejectData;

      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="mileges"]').hide();
      }
      if(this.updatetext == "Approved"){
        this.updateMileges(updateidlist ,"Trip Successfully approved", true , false , false);
      }else if(this.updatetext == "Rejected"){
        this.updateMileges(updateidlist ,"Trip Successfully rejected", false , false , false);
      }
      let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
      for(let i=0; i<boxes.length; i++) {
        if(boxes[i].checked == true){
          boxes[i].checked = false;
        }
      }
    }
    handleCloseModal(){
      let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
          for(let i=0; i<boxes.length; i++) {
            if(boxes[i].checked == true){
              boxes[i].checked = false;
            }
          }
    }

    updateMileges(listofId , toastmsg ,approve , unapprove , sendmail){
      approveMileages({
        checked: approve,
        emailaddress: listofId,
        sendEmail: sendmail,
        unapprove: unapprove
      })
      .then((result) => {
          if(result){
            // this.SetToastsuccessMessage(toastmsg);
            // this.isLoading = true;
            this.dispatchEvent(
              new CustomEvent("showloader", { detail : ''})
            );
            setTimeout(() => {
              // this.isLoading = false;
              this.dispatchEvent(
                new CustomEvent("hideloader", { detail : ''})
              );
              this.dispatchEvent(
                new CustomEvent("toastmessage", {
                  detail: {
                    errormsg: "success",
                    message:toastmsg
                  } 
                })
              );
            }, 2000);
            
            let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
            for(let i=0; i<boxes.length; i++) {
              if(boxes[i].checked == true){
                boxes[i].checked = false;
              }
            }
            let formateddata = JSON.parse(this.approveRejectData);
            for(let j=0; j<formateddata.length;j++){
              this.Accounts.forEach(account => {
                if(account.Id == formateddata[j].Id){
                  if(approve == true){
                    account.Status = 'Approved';
                  }else if(unapprove == true){
                    account.Status = 'Not Approved Yet';
                  }else{
                    account.Status = 'Rejected';
                  }
                }
              })
            }
            this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
            this.approveRejectData =  [];
          }
      })
      .catch((error) => {
          console.log(error)
      })
    }
    handlevaluechange(event){
      this.selectedMonth = event.detail.value;
    }
    /// click on sync all button
    async handleSyncAll(){
      // if(this.MilegesData.length > 0){
        this.styleheader = "slds-modal__container slds-m-top_medium modal_width"
        if (this.template.querySelector('c-user-profile-modal')) {
          this.template.querySelector('c-user-profile-modal[data-id="syncall"]').show();
          
        }
      // }  
    }
    async handlemodalselect(){
      if (this.selectedMonth != undefined) { 
        var today = new Date();
        var now = new Date(today.getFullYear(), today.getMonth(), 1);
        var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.syStDate = yearMonthDate(now);
        this.syEnDate = yearMonthDate(last);
        
          let deleteResult = await deleteTrips({
            accountId: this._accid,
            month: this.selectedMonth
          });
          console.log("M1", deleteResult);
          if (deleteResult) {
            let massResult = await MassSyncTrips({
                  accountId: this._accid,
                  startDate: this.syStDate,
                  endDate: this.syEnDate,
                  month: this.selectedMonth,
                  tripStatus: 'U',
                  activityStatus: 'Business'
                });
                console.log("M2", massResult);
                if (massResult) {
                  let finalMassResult = await MassSyncTrips({
                        accountId: this._accid,
                        startDate: this.syStDate,
                        endDate: this.syEnDate,
                        month: this.selectedMonth,
                        tripStatus: 'S',
                        activityStatus: 'Business'
                      });
                      console.log("Mass Result", finalMassResult);
                      if(finalMassResult){
                            this.handlesynccloseModal();
                            // this.isLoading = true
                            this.dispatchEvent(
                              new CustomEvent("showloader", { detail : ''})
                            );
                            setTimeout(() => {
                              // this.isLoading = false
                              this.dispatchEvent(
                                new CustomEvent("hideloader", { detail : ''})
                              );
                              if(finalMassResult === 'Success'){
                                setTimeout(() => {
                                  this.dispatchEvent(
                                    new CustomEvent("toastmessage", {
                                      detail: {
                                        errormsg: "success",
                                        message:"Please wait for few minutes. mileage sync process is running in background!"
                                      } 
                                    })
                                  );
                                })    
                                setTimeout(() => {
                                    location.reload();
                                }, 1000);
                              }
                            }, 1000);
                      }

                }
          }
      }
    }
    handlesynccloseModal(){
      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="syncall"]').hide();
      }
    }
    exportTripsByDate(){
      // if(this.MilegesData.length > 0){
        if (this.template.querySelector('c-user-profile-modal')) {
          this.template.querySelector('c-user-profile-modal[data-id="export_trip"]').show();
          Promise.all([loadScript(this, datepicker + '/jquery3v.min.js'),
          loadScript(this, resourceImage + '/mburse/assets/datepicker/flatpickr.js'),
          loadStyle(this, resourceImage + '/mburse/assets/datepicker/customMinifiedDatePicker.css'),
          loadStyle(this, resourceImage + '/mburse/assets/datepicker/flatpickr.min.css'),
          loadScript(this, datepicker + '/popper.min.js'),
          loadScript(this, datepicker + '/datepicker.js'),
          //loadScript(this, datepicker + '/datepicker.en.min.js'),
          loadScript(this, datepicker + '/datepicker.en.js'),
          loadStyle(this, datepicker + '/minifiedCustomDP.css'),
          loadStyle(this, datepicker + '/datepicker.css'),
          loadStyle(this, customMinifiedDP)])
          .then((result)=>{
             this.intializeDatepickup();
          })
          .catch(error => {
            console.error({
                message : 'error while loading calendar',
                error
            })
          })
        // }
      }  
    }
   
    exportSelectedTrips(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          // this.SetToasterrorMessage("Select atleast one trip to Export.");
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to Export.."
              } 
            })
          );
        }else{
          let exportSelectedData = [];
          var checkbox = this.template.querySelectorAll(
            ".checkboxCheckUncheckSearch"
          );
          
          if (this.MilegesData.length != 0) {
            var i,exportTripData = [],j = checkbox.length;
            for (i = 0; i < j; i++) {
              if (checkbox[i].checked == true) {
                exportTripData.push({Driver:this.MilegesData[i].DriverName , Email:this.MilegesData[i].EmailID,Status:this.MilegesData[i].Status,TripDate:this.MilegesData[i].Date,
                                    Day:this.MilegesData[i].weekday,Starttime:this.MilegesData[i].StartTime,EndTime:this.MilegesData[i].EndTime,StayTime:this.MilegesData[i].StayTime,
                                    Drivetime:this.MilegesData[i].DriveTime,totaltime:this.MilegesData[i].DriveTime,Activity:this.MilegesData[i].Activity,Mileges:this.MilegesData[i].Mileges,
                                    from:this.MilegesData[i].From,from:this.MilegesData[i].From,to:this.MilegesData[i].To,to:this.MilegesData[i].To,
                                    tags:this.MilegesData[i].Tags,notes:this.MilegesData[i].Notes,notes:this.MilegesData[i].Notes});
              }
            }
          } 
          if(exportTripData.length != 0){
            this.xlsFormatter(exportTripData);
            exportTripData = [];
          }
        }
      }  
    }
    handleexportcloseModal(){
      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="export_trip"]').hide();
      }
    }
    handleButtonClick(){
        this.advancesearch = true;
    }
    handleclosesearch(){
      // this.template.querySelector('.advance_search').style.visibility = "hidden";
      this.advancesearch = false;
    }
     // Send formatted excel data to child component 'c-excel-sheet'
  xlsFormatter(data) {
    let Header = Object.keys(data[0]);
    
      Header[0] = "Driver";
      Header[1] = "Email";
      Header[2] = "Status";
      Header[3] = "Date";
      Header[4] = "Day";
      Header[5] = "Start Time";
      Header[6] = "End Time";
      Header[7] = "Stay Time";
      Header[8] = "Drive Time";
      Header[9] = "Total Time";
      Header[10] = "Activity";
      Header[11] = "Mileage (mi)";
      Header[12] = "From Location Name";
      Header[13] = "From Location Address";
      Header[14] = "To Location Name";
      Header[15] = "To Location Address";
      Header[16] = "State";
      Header[17] = "Tags";
      Header[18] = "Notes";
      Header[19] = "Tracking Method";
    
    if(this.xlsHeader.length > 0){
      this.xlsHeader = [];
      this.xlsHeader.push(Header);
    }else{
      this.xlsHeader.push(Header);
    }
    if(this.xlsData.length > 0){
      this.xlsData = [];
      this.xlsData.push(data);
    }else{
      this.xlsData.push(data);
    }
    
    console.log("this.xlsData",JSON.stringify(this.xlsData))
    this.template.querySelector("c-excel-sheet").download(this.xlsHeader, this.xlsData);
  }
 
  intializeDatepickup(){
    let $jq = jQuery.noConflict();
    let $input = $jq(this.template.querySelectorAll('.date-selector'));
    $input.each(function(index) {
      console.log("index",index)
          let _self2 = $jq(this)
          let $btn = $jq(this).next()
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
            onSelect: function(date, formattedDate, dpicker){
                //datepicker.$el.val(_self2.val())
                 console.log('explain:', date, formattedDate, dpicker, _self2.val());
                 if(index ==  0){
                  let fromdate = date;
                   this.fromDate =  fromdate;
                 }
                 if(index ==  1){
                  let todate = date;
                  this.toDate =  todate;
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
            _self2.focus();
          });
    })
  }

  handledownloadCSV(){
     const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
      const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
      let fdate = this.template.querySelector(`.date-selector[data-id="from_date"]`).value;
      let todate = this.template.querySelector(`.date-selector[data-id="to_date"]`).value;
      
      let convertFromDate = excelFormatDate(fdate);
      let convertToDate = excelFormatDate(todate);
      let resData = mileageListData({
        accId: accidparavalue,
        adminId: idparavalue,
        startDate: convertFromDate,
        endDate: convertToDate
      });
      resData.then(function(result) {
        console.log("response->",result) // "Some User token"
        var exportCSV = [];
        let res = result;
        exportCSV = formatData(res);
        let exportCSVdata= JSON.parse(JSON.stringify(exportCSV))
        
          if(exportCSVdata.length > 0) {
            let rowEnd = '\n';
            let csvString = '';
            let regExp = /^[0-9/]*$/gm;
            let regExpForTime = /^[0-9:\sAM|PM]*$/gm
            let decimalExp = /^(\d*\.)?\d+$/gm
            // this set elminates the duplicates if have any duplicate keys
            let rowData = new Set();
            let csvdata = exportCSVdata;
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
            a.setAttribute('download',  'all_trips_' + fdate + '_to_' + todate + '.csv')
            window.document.body.appendChild(a);
            a.click();
          }
     })
  }
  handlefilterdata(event){
    // this.isLoading = true;
    this.dispatchEvent(
      new CustomEvent("showloader", { detail : ''})
    );
    setTimeout(() => {
        // this.isLoading = false;
        this.dispatchEvent(
          new CustomEvent("hideloader", { detail : ''})
        );
        this.MilegesData = [];
        this.totalmileage = 0.00;
        this.totalrows = 0;
        this.headershow = false;
        this.pagination = false;
        this.celenderdropdown = false;
        this.searchDataLength = false;
        let accountData = JSON.stringify(event.detail)
        if(accountData.length > 2){
          this.getmilegeslist(accountData);
        }
    },2000); 
  }
  handleToastMessage(event){
    this.dispatchEvent(
      new CustomEvent("toastmessage", {
        detail: {
          errormsg: "error",
          message:event.detail
        } 
      })
    );
  }
  handlemousedown(event) {
      event.preventDefault();
  }

  handlemonthchange(event){
    let month = event.detail.value;
    this.Accounts = this.driverDataNew;
    if(month == "Calendar"){
      this.pagination = true;
      this.searchDataLength = true;
      this.totalrows = this.Accounts.length;
      if(this.template.querySelector("c-new-paginator")){
        this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
      }
    }else{
      // Get the month number (0-indexed)
      const date = new Date(`${month} 1`);
      const monthNumber = date.getMonth() + 1;

      const filteredRecords = this.Accounts.filter(record => {
        const date = new Date(record.Date);
        return date.getMonth() + 1 == monthNumber;
      });
      this.Accounts = filteredRecords;
      if(filteredRecords.length == 0){
          this.searchDataLength = false;
          this.pagination = false;
          this.totalmileage = 0;
          this.totalrows = 0;
      }else{
          this.searchDataLength = true;
          this.totalrows = this.Accounts.length;
          if(this.template.querySelector("c-new-paginator")){
            this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
          }
      }
    }
  }

  handleTypechange(event){
    let type = event.detail.value;
    if(type == "All Types"){
      this.getmilegeslist(this.driverData);
    }else{
      fetchHighRiskValues({accID : this._accid , AdminId : this._adminid , limitSize : 10000 , offset : 100})
      .then((result) => {
        console.log("result",JSON.parse(JSON.stringify(result)))
        this.getmilegeslist(JSON.stringify(result));
      })
      .catch((error) => {
         console.log("error",error)
      })
    }
  }
 
  handledriverchange(event){
    this.user = event.detail.value;
    this.Accounts = this.driverDataNew;
    if(this.user == "All Active Users"){
      this.pagination = true;
      this.searchDataLength = true;
      this.totalrows = this.Accounts.length;
      if(this.template.querySelector("c-new-paginator")){
        this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
      }
    }else{
      const filteredOptions = this.Accounts.filter(item => item.DriverName == this.user);
      this.Accounts = filteredOptions;
      if(filteredOptions.length == 0){
          this.searchDataLength = false;
          this.pagination = false;
          this.totalmileage = 0;
          this.totalrows = 0;
      }else{
          this.searchDataLength = true;
          this.totalrows = this.Accounts.length;
          if(this.template.querySelector("c-new-paginator")){
            this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
          }
      }
    }  
  }  
  
  handlestatuschange(event){
    this.tripStatus = event.detail.value;
    console.log("status",this.tripStatus)
    this.Accounts = this.driverDataNew;
    if(this.tripStatus == "All Status"){
      this.pagination = true;
      this.searchDataLength = true;
      this.totalrows = this.Accounts.length;
      if(this.template.querySelector("c-new-paginator")){
        this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
      }
    }else{
      const filteredOptions = this.Accounts.filter(item => item.Status == this.tripStatus);
      this.Accounts = filteredOptions;
      
      if(filteredOptions.length == 0){
         this.searchDataLength = false;
         this.pagination = false;
         this.totalmileage = 0;
         this.totalrows = 0;
      }else{
         this.searchDataLength = true;
         this.pagination = true;
         this.totalrows = this.Accounts.length;
         if(this.template.querySelector("c-new-paginator")){
          this.template.querySelector("c-new-paginator").updateRecords(this.Accounts, this.pageSize);
        }
      }
    }
  }  
}