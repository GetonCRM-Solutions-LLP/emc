import { LightningElement  , api} from 'lwc';
import fetchLookUpValues from '@salesforce/apex/GetDriverData.fetchLookUpValues';
import getMilegesData from '@salesforce/apex/GetDriverData.getMilegesData';
import {
  excelFormatDate
} from 'c/commonLib';
export default class AdvanceSearchComponent extends LightningElement {
    greeting;
    @api accId;
    @api adminId;
    @api selectedStatus;
    @api selectedDriver;  
    options = [];
    tagoptions = [];
    Trackingoptions = [];
    Statusoptions = [];
    activityoptions = [];
    fromlocationoptions = [];
    value='';
    picklist=[{label:'All Drivers',value:'All Drivers'}];
    tagpicklist = [{label:'All Tags',value:'All Tags'}];
    Statuspicklist = [{label:'All Status',value:'All Status'}];
    Trackingpicklist = [{label:'All Tracking Methods',value:'All Tracking Methods'}];
    activitypicklist = [{label:'All Activities',value:'All Activities'}];
    fromlocationpicklist = [];
    fromdate='';
    todate='';
    isActive = true;
    formatNumberStart=null;
    formatNumberend=null;
    Driver='';
    Tag='';
    status='';
    track='';
    activity='';
    fromlocation='';
    tolocation='';
    frommileges = '';
    tomileges = '';
    driverId = '';
    allowRenderCallback = true;
    
    renderedCallback(){
      if(this.allowRenderCallback == true){
        setTimeout(() => {
          if(this.template.querySelectorAll('.date-selector').length > 0){
            this.intializeDatepickupnew();
          }
        },1000);
      }  
    }

    connectedCallback(){
      this.getDriverOption();
      this.getTagsOption();
      this.getStatusOption();
      this.getTrackingOption();
      this.getActivityOption();
      this.getFromLocation();
      if(this.selectedDriver.length > 0){
        if(this.template.querySelector(`c-select2-dropdown[data-id="driver"]`)){
          this.template.querySelector(`c-select2-dropdown[data-id="driver"]`).selectedValue = this.selectedDriver;
        }
      }
      if(this.selectedStatus.length > 0){
        if(this.template.querySelector(`c-select2-dropdown[data-id="status_dropdown"]`)){
          this.template.querySelector(`c-select2-dropdown[data-id="status_dropdown"]`).selectedValue = this.selectedStatus;
        }
      }
    }
   
    keyHandler(event) {
      const keyCode = event.keyCode || event.which;
      const keyValue = String.fromCharCode(keyCode);
      const regex = /^[0-9.]*$/; // Regular expression to match numbers and decimal point
      if (!regex.test(keyValue)) {
        event.preventDefault(); // Prevent input if the key is not a number or decimal point
      }
    }
   
    handleActiveDriver(event){
      this.options = [];
      this.picklist = [{label:'All Drivers',value:'All Drivers'}];
      if(event.target.checked  == true){
        this.isActive = event.target.checked;
        console.log(this.options)
        this.getDriverOption();
        this.template.querySelector(`c-select2-dropdown[data-id="driver_dropdown"]`).options = this.options;
      }else{
        this.isActive = event.target.checked;
        console.log(this.options)
         this.getDriverOption();
        this.template.querySelector(`c-select2-dropdown[data-id="driver_dropdown"]`).options = this.options;
      }
    }
    intializeDatepickupnew(){
      console.log("datetime",this.fromdate + this.todate )
        let $jq = jQuery.noConflict();
        let $input = $jq(this.template.querySelectorAll('.date-selector'))
        let _self = this
        $input.each(function(index) {
              let _self2 = $jq(this)
              console.log("before")
              let $btn = $jq(this).next()
              console.log("after")

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

                     if(index ===  0){
                      let fromdate = date;
                      _self.fromdate =  fromdate;
                     }
                     if(index ===  1){
                      let todate = date;
                      _self.todate =  todate;
                     }
                     
                },
                
                onShow: function (dp, animationCompleted) {
                if (!animationCompleted) {
                  if (dp.$datepicker.find('span.datepicker--close--button').html()===undefined) { /*ONLY when button don't existis*/
                      dp.$datepicker.find('div.datepicker--buttons').append('<span  class="datepicker--close--button">Close</span>');
                      dp.$datepicker.find('span.datepicker--close--button').click(function() {
                        dp.hide();
                      });
                  }
                }
              },
                //onShow: '',
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
              console.log("complete")
              $btn.on('click', function(){
                _self2.focus();
              });
              

        })
      }
      ///for Driver Options
      getDriverOption(){
        fetchLookUpValues({
          accId:this.accId,
          adminId:this.adminId,
          accField:'AccountId',
          searchKey: 'Name',
          idOfDriver: '',
          fieldName: 'Name',
          ObjectName: 'Contact',
          keyField: 'Id',
          whereField: '',
          isActive: this.isActive
        }) 
        .then((result) => {
          let data = JSON.parse( JSON.stringify( result ) ).sort( ( a, b ) => {
            a = a.Name ? a.Name.toLowerCase() : ''; // Handle null values
            b = b.Name ? b.Name.toLowerCase() : '';
            return a > b ? 1 : -1;
          });;
          data.forEach(element => {
            this.picklist.push({label:element.Name,value:element.Id})
          });
          this.options = JSON.parse(JSON.stringify(this.removeDuplicate(this.picklist , it => it.value)));
        })
        .catch((error) => {
          console.log(error)
        })
      }
      ///for Tags option
      getTagsOption(){
        fetchLookUpValues({
          accId:this.accId,
          adminId:'',
          accField:'EmployeeReimbursement__r.Contact_Id__r.AccountId',
          searchKey: 'Tag__c',
          idOfDriver: '',
          fieldName: 'Tag__c',
          ObjectName: 'Employee_Mileage__c',
          keyField: 'Id',
          whereField: '',
          isActive: this.isActive
        }) 
        .then((result) => {
          let data = JSON.parse( JSON.stringify( result ) ).sort( ( a, b ) => {
            a = a.Tag__c ? a.Tag__c.toLowerCase() : ''; // Handle null values
            b = b.Tag__c ? b.Tag__c.toLowerCase() : '';
            return a > b ? 1 : -1;
          });;
          data.forEach(element  => {
            this.tagpicklist.push({label:element.Tag__c,value:element.Tag__c})
          });
          this.tagoptions = JSON.parse(JSON.stringify(this.removeDuplicate(this.tagpicklist , it => it.value)));
          
        })
        .catch((error) => {
          console.log(error)
        })
        
      }
       ///for Tracking option
       getTrackingOption(){
        fetchLookUpValues({
          accId:this.accId,
          adminId:'',
          accField:'EmployeeReimbursement__r.Contact_Id__r.AccountId',
          searchKey: 'Tracing_Style__c',
          idOfDriver: '',
          fieldName: 'Tracing_Style__c',
          ObjectName: 'Employee_Mileage__c',
          keyField: 'Id',
          whereField: '',
          isActive: ''
        }) 
        .then((result) => {
          console.log("result",result)
          let data = JSON.parse( JSON.stringify( result ) ).sort( ( a, b ) => {
            a = a.Tracing_Style__c ? a.Tracing_Style__c.toLowerCase() : ''; // Handle null values
            b = b.Tracing_Style__c ? b.Tracing_Style__c.toLowerCase() : '';
            return a > b ? 1 : -1;
          });;
          data.forEach(element => {
              this.Trackingpicklist.push({label:element.Tracing_Style__c,value:element.Tracing_Style__c})
          });
          this.Trackingoptions = JSON.parse(JSON.stringify(this.removeDuplicate(this.Trackingpicklist , it => it.value)));
        })
        .catch((error) => {
          console.log(error)
        })
      }
      ///for Status option
      getStatusOption(){
        fetchLookUpValues({
          accId:this.accId,
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
          data.forEach(element => {
            if(element.Trip_Status__c != undefined){
              this.Statuspicklist.push({label:element.Trip_Status__c,value:element.Trip_Status__c})
            }
          });
          this.Statusoptions = JSON.parse(JSON.stringify(this.removeDuplicate(this.Statuspicklist , it => it.value)));
          
        })
        .catch((error) => {
          console.log(error)
        })
      }
      ///for Activity option
      getActivityOption(){
        fetchLookUpValues({
          accId:this.accId,
          adminId:'',
          accField:'EmployeeReimbursement__r.Contact_Id__r.AccountId',
          searchKey: 'Activity__c',
          idOfDriver: '',
          fieldName: 'Activity__c',
          ObjectName: 'Employee_Mileage__c',
          keyField: 'Id',
          whereField: '',
          isActive: ''
        }) 
        .then((result) => {
          let data = JSON.parse( JSON.stringify( result ) ).sort( ( a, b ) => {
            a = a.Activity__c ? a.Activity__c.toLowerCase() : ''; // Handle null values
            b = b.Activity__c ? b.Activity__c.toLowerCase() : '';
            return a > b ? 1 : -1;
          });;
          data.forEach(element => {
            if(element.Activity__c != undefined){
              this.activitypicklist.push({label:element.Activity__c,value:element.Activity__c})
            }  
          });
          this.activityoptions = JSON.parse(JSON.stringify(this.removeDuplicate(this.activitypicklist , it => it.value)));
          
        })
        .catch((error) => {
          console.log(error)
        })
      }
      ///for From Location Options
      getFromLocation(){
        fetchLookUpValues({
          accId:this.accId,
          adminId:'',
          accField:'EmployeeReimbursement__r.Contact_Id__r.AccountId',
          searchKey: 'Trip_Origin__c',
          idOfDriver: this.driverId,
          fieldName: 'Trip_Origin__c',
          ObjectName: 'Employee_Mileage__c',
          keyField: 'Id',
          whereField: 'EmployeeReimbursement__r.Contact_Id__c',
          isActive: ''
        }) 
        .then((result) => {
          let data = JSON.parse( JSON.stringify( result ) ).sort( ( a, b ) => {
            a = a.Trip_Origin__c ? a.Trip_Origin__c.toLowerCase() : ''; // Handle null values
            b = b.Trip_Origin__c ? b.Trip_Origin__c.toLowerCase() : '';
            return a > b ? 1 : -1;
          });;
          data.forEach(element => {
            if(element.Trip_Origin__c != undefined){
              this.fromlocationpicklist.push({label:element.Trip_Origin__c,value:element.Trip_Origin__c})
            }
          });
          this.fromlocationoptions = JSON.parse(JSON.stringify(this.removeDuplicate(this.fromlocationpicklist , it => it.value)));
         
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
      handleDriverChange(event){
        this.allowRenderCallback = false;
        
        this.selectedDriver = event.detail.value;
        this.fromlocationpicklist = [];
        this.fromlocationoptions = [];
        if(this.selectedDriver != null){
          for(let i = 0;i<this.options.length;i++){
            if(this.options[i].label == this.selectedDriver){
              this.driverId = this.options[i].value;
              this.getFromLocation();
        //       this.template.querySelector(`.date-selector[data-id="from_date"]`).value = this.fromdate;
        // this.template.querySelector(`.date-selector[data-id="to_date"]`).value = this.todate;
            }
          }
        }else{
          this.driverId = '';
          this.getFromLocation();
        }
      }
      handleTagChange(event){
        this.Tag = event.detail.value;
        console.log(event.detail.value)
      }
      handleStatusChange(event){
        this.selectedStatus = event.detail.value;
        console.log(event.detail.value)
      }
      handleFromLocationChange(event){
        this.fromlocation = event.detail.value;
        console.log(event.detail.value)
      }
      handleToLocationChange(event){
        this.tolocation = event.detail.value;
        console.log(event.detail.value)
      }
      handleChangeStart(event){
        this.frommileges = event.target.value;
        console.log(event.detail.value)
      }
      handleChangeEnd(event){
        this.tomileges = event.target.value;
        console.log(event.detail.value)
      }
      handleTrackChange(event){
        this.track = event.detail.value;
        console.log(event.detail.value)
      }
      handleActivityChange(event){
        this.activity = event.detail.value;
        console.log(event.detail.value)
      }
      handleReset(){
        this.template.querySelector('.milege_from').value =  null;
        this.template.querySelector('.milege_to').value =  null;
        this.template.querySelector(`.date-selector[data-id="from_date"]`).value = '';
        this.template.querySelector(`.date-selector[data-id="to_date"]`).value = '';
        this.template.querySelector(`c-select2-dropdown[data-id="driver_dropdown"]`).selectedValue = '';
        this.template.querySelector(`c-select2-dropdown[data-id="tag_dropdown"]`).selectedValue = '';
        this.template.querySelector(`c-select2-dropdown[data-id="status_dropdown"]`).selectedValue = '';
        this.template.querySelector(`c-select2-dropdown[data-id="fromlocation_dropdown"]`).selectedValue = '';
        this.template.querySelector(`c-select2-dropdown[data-id="tolocation_dropdown"]`).selectedValue = '';
        this.template.querySelector(`c-select2-dropdown[data-id="track_dropdown"]`).selectedValue = '';
        this.template.querySelector(`c-select2-dropdown[data-id="activity_dropdown"]`).selectedValue = '';
        this.driverId = '';
        this.fromlocation = '';
        this.tolocation = '';
        this.frommileges = '';
        this.tomileges = '';
        this.Tag =  '';
        this.activity =  '';
        this.track = '';
        this.fromdate = '';
        this.todate = '';
      }
      handleclosesearch(){
          const selectEvent = new CustomEvent('closeevent', {
           });
          this.dispatchEvent(selectEvent);
      }
      handleSearchEvent() {
        let startdate = this.template.querySelector(`.date-selector[data-id="from_date"]`).value;
            let todate = this.template.querySelector(`.date-selector[data-id="to_date"]`).value;
            let convertFromDate ;
            let convertToDate ;
            if(startdate.length > 0){
              convertFromDate = excelFormatDate(startdate);
            }else{
              convertFromDate =  null;
            }
            if(todate.length > 0){
              convertToDate = excelFormatDate(todate);
            }else{
              convertToDate =  null;
            }
            console.log("this.driverId.length",convertFromDate + ' '+convertToDate)
            
            if(this.driverId.length == 0 && this.fromlocation.length == 0 && this.tolocation.length == 0 &&  this.frommileges.length == 0 && this.tomileges.length == 0 &&
               this.Tag.length == 0 && this.track.length == 0 && this.selectedStatus.length == 0 && this.activity.length == 0 && convertFromDate == null && convertToDate == null){
              console.log("in if")
              const selectEvent = new CustomEvent('toastevent', { detail: 'Select atleast one filter to search.' });
                  this.dispatchEvent(selectEvent);
            }else{
              getMilegesData({
                accountId: this.accId,
                AdminId: this.adminId,
                idOfDriver: this.driverId,
                StartDate: convertFromDate,
                EndDate: convertToDate,
                OriginName: this.fromlocation,
                DestinationName: this.tolocation,
                ActiveDriver: this.isActive,
                StartMileage: this.frommileges,
                EndMileage: this.tomileges,
                TripStatus: this.selectedStatus,
                TrackingMethod: this.track,
                Tag:  this.Tag ,
                Notes: null,
                Activity: this.activity,
                limitSize: 10000,
                offset: 100
              })
              .then((result) => {
                  let accresult = JSON.parse(JSON.stringify(result))
                  console.log('accresult',accresult)
                  const selectEvent = new CustomEvent('filterevent', { detail: accresult });
                  this.dispatchEvent(selectEvent);
                  //this.handleclosesearch()
              })
              .catch((error) => {
                console.log(error)
              });
            }
    }
    handlemousedownonsearch(event) {
      event.preventDefault();
  }
}

///c/advanceSearchComponentString dateString = '2022-03-23'; // replace with your desired date string
// Date myDate = Date.valueOf(dateString);
// String todateString = '2022-03-26'; // replace with your desired date string
// Date myDate1 = Date.valueOf(dateString);
// GetDriverData.getMilegesData('0010Z00001ygUenQAE','0030Z00003RI514QAD', '',myDate, myDate1,'','',true,'','','','','' , null,'',10000,100);