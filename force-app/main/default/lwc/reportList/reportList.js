import { LightningElement } from 'lwc';
import getReports from '@salesforce/apex/ReportListController.getAllReports';
import updatelockdate from '@salesforce/apex/ReportListController.updateLockDate';
// import getpayperiodDate from '@salesforce/apex/BiweeklyPayPeriod.getPayPeriodDates';
import { NavigationMixin } from 'lightning/navigation';
import accountMonthList from "@salesforce/apex/ManagerDashboardController.accountMonthList";
import { loadStyle , loadScript } from 'lightning/platformResourceLoader';
import jQueryMinified from '@salesforce/resourceUrl/jQueryMinified';
import datepicker from '@salesforce/resourceUrl/calendar';
import customMinifiedDP  from '@salesforce/resourceUrl/modalCalDp';
import REPORT_LIST_STYLE from '@salesforce/resourceUrl/ReportListResource';
import ERMIPayPeriod from '@salesforce/label/c.ERMIPayPeriodDate';
import monthPicklist from '@salesforce/label/c.Ermi_Tax_Report_month_picklist';
import employeeTypePicklist from '@salesforce/label/c.Ermi_Tax_Report_employee_type_picklist';
import biweekpayperiod from '@salesforce/apex/ReportListController.payPeriodDateList';
import AccountYear from '@salesforce/apex/ReportListController.AccountYear';
import postVariablePaymentAPI from '@salesforce/apex/ReportListController.postVariablePaymentAPI';
import postFixedAmountAPI from '@salesforce/apex/ReportListController.postFixedAmountAPI';
import DeleteNetchexCallout from '@salesforce/apex/ReportListController.DeleteNetchexCallout';
 import postTimeSheetImportAPI from '@salesforce/apex/ReportListController.postTimeSheetImportAPI';
import taxLiabilityReport from '@salesforce/apex/ReportListController.taxLiabilityReport';
import downloadExcel from '@salesforce/apex/ReportListController.downLoadComplianceReport';
import postHalfFPFullDriverAPI  from '@salesforce/apex/ReportListController.postHalfFPFullDriverAPI';
import ErmiDriverList  from '@salesforce/apex/ReportListController.ErmiDriverList';
import CheckStatus  from '@salesforce/apex/ReportListController.CheckStatus';


export default class ReportList extends NavigationMixin(LightningElement) {
    reportname = [];
    reportdetailname = [];
    currentReport;
    reportID;
    title='Mileage Lock Date';
    isFalse=true;
    modalclass = "slds-modal slds-fade-in-open ";
    headerclass = "slds-modal__header header-preview hedear-style_class header_style";
    subheaderClass = "slds-modal__title slds-hyphenate hedear-style_class ";
    modalcontentstyle = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
    styleheader = "slds-modal__container container_style"
    closebtnclass = "close-notify"
    modalcontentmessage = 'Make sure your team has reviewed the details of each trip and the information is accurate. By generating your report you will lock the trips so they can not be edited.';
    modalcontentmessagenew = 'Are you sure you want to generate the report?';
    updatetext;
    btnlabel;
    picklist = [];
    istrue = false;
    header =[];
    detail=[];
    modaldata =[];
    monthoption = [];
    isLoading = false;
    _accid;
    _adminid;
    payperiodList = [];
    monthList = [];
    emptypeList = [];
    title='';
    empMonth='';
    empType = '';
    payperioddropdown = false;
    monthlytaxreport = false;
    byweeksubmit = false;
    downloadBtn = false;
    dateoption = [];
    buttonLabel='';
    fromdate = '';
    todate = '';
    netchexDate;
    anual_tax_detail = [];
    visibleAccounts = [];
    message = '';
    toastmsg = false;
    yearList =[];
    progress = 0;
    progressbar = false;
    year ;
    isAreaDisabled = true;
    // intervalId;
    // data;
   
    renderedCallback(){
        Promise.all([loadStyle(this, REPORT_LIST_STYLE + '/ReportListCSS/reportListstaticResouce.css')]);
          loadScript(this, jQueryMinified)
          .then(() => {
              console.log('jquery loaded')
              Promise.all([
                loadStyle(this, datepicker + "/minifiedCustomDP.css"),
                loadStyle(this, datepicker + "/datepicker.css"),
                loadStyle(this, customMinifiedDP),
                loadScript(this, datepicker + '/datepicker.js')
              ]).then(() => {
                  this.calendarJsInitialised = true;
                  console.log("script datepicker loaded--");
                })
                .catch((error) => {
                  console.error(error);
                });
          })
          .catch(error => {
            console.log('jquery not loaded ' + error )
          })
        
      }
      

      getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
      }
  
    connectedCallback(){
      
        this._accid  = this.getUrlParamValue(window.location.href, 'accid')
        this._adminid  = this.getUrlParamValue(window.location.href, 'id')
        this.getYear();
        this.getAccountMonthList();
        getReports({contactId : this._adminid})
        .then(result => {
            this.reportdata = JSON.parse(result);
            console.log("result",this.reportdata)
            this.reportdata.forEach(element => {
                element.currentReports.forEach(index =>{
                    this.reportdetailname.push({name:element.categoryName , reportname : index.reportName })
                })
            });
            this.reportdetailname.push({name:"Reimbursement Reports" , reportname : "Bi-Weekly Payment Report" })
                this.reportdetailname.push({name:"Reimbursement Reports" , reportname : "Time and Attendance Detail Report" })
                this.reportdetailname.push({name:"Reimbursement Reports" , reportname : "Time, Attendance and Mileage Summary Report" })
                this.reportdetailname.push({name:"Reimbursement Reports" , reportname : "Monthly Tax Report" })
                this.reportdetailname.push({name:"NetChex Payable Reports" , reportname : "Bi-weekly Time and Attendance Payment" })
                this.reportdetailname.push({name:"NetChex Payable Reports" , reportname : "Bi-weekly Salary and Full Time Fixed Payment" })
                this.reportdetailname.push({name:"NetChex Payable Reports" , reportname : "Monthly NetChex Variable Payment" })
                this.reportdetailname.push({name:"NetChex Payable Reports" , reportname : "Monthly Part Time Fixed Amount Payment" })
                this.reportdetailname.push({name:"NetChex Payable Reports" , reportname : "Delete NetChex Report" })
                this.reportdetailname.push({name:"Tax Liability Reports" , reportname : "Annual Tax Liability Report" })
                this.reportdetailname.push({name:"Tax Liability Reports" , reportname : "Tax Liability" })

            let reports =JSON.parse(JSON.stringify(this.reportdetailname));
            console.log("reports")
            let merged = Object.values(reports.reduce((a,{name, reportname }) => (
                (a[name] = a[name] || {name, reportname:[] })["reportname"].push(reportname), a
            ),{}))
            console.log("reportname",JSON.parse(JSON.stringify(merged)));
            this.reportname = JSON.parse(JSON.stringify(merged));
        })
        .catch(error => {
            console.log("error",error)
        })
    }

    // handleCopyEvent(event){
    //     this.dispatchEvent(
    //         new CustomEvent("copycontent", {
    //           detail: event.detail
    //         })
    //     );
    // }

    getPayPeriodOption(){
        var headerarry = new Array();
        headerarry = ERMIPayPeriod.split(",");
        const dateArray =JSON.parse(JSON.stringify(headerarry));
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const nextMonth = currentMonth === 1 ? 12 : currentMonth + 1;
        const filteredDates = dateArray.filter(dateRange => {
            const startDate = dateRange.split(' to ')[0];
            const endDate = dateRange.split(' to ')[1];
           return (startDate.split('-')[1] ==  currentMonth && endDate.split('-')[1] == currentMonth) || (startDate.split('-')[1] ==  lastMonth && endDate.split('-')[1] == lastMonth) || (startDate.split('-')[1] ==  nextMonth && endDate.split('-')[1] == nextMonth)||
           (startDate.split('-')[1] ==  currentMonth && endDate.split('-')[1] == nextMonth) || 
           (startDate.split('-')[1] ==  lastMonth && endDate.split('-')[1] == currentMonth)
          });
        let finaldata = JSON.parse(JSON.stringify(filteredDates));
        finaldata.forEach(element => {
            this.payperiodList.push({label:element,value:element});
        })
        this.payperiodList = JSON.parse(JSON.stringify(this.payperiodList))
    }
    getDateOption(){
        var makeDate = new Date();
       
          let monthNumber = makeDate.getMonth()+1;
          if(monthNumber < 10){
            monthNumber = '0'+monthNumber
          }
          let year = makeDate.getFullYear();
          let convertFromDate = year+'-'+monthNumber +'-01'
          let convertToDate = year+'-'+monthNumber +'-15'
          this.dateoption = [{label : convertFromDate , value:convertFromDate},
                            {label : convertToDate , value:convertToDate}]
    }

    getYear(){
        AccountYear({accountId : this._accid})
        .then(result => {
            let account = JSON.parse(JSON.stringify(result));
            // console.log("year",account)
            // account.forEach(year => {
                this.yearList.push({label:account.toString() , value:account.toString()})
            // })
            this.yearList = JSON.parse(JSON.stringify(this.yearList))
            
         })
         .catch(error => {
             console.log("error",error)
         })
    }
    
    handleReportopen(event){
        this.currentReport = event.target.dataset.item;
        let data = JSON.parse(JSON.stringify(this.reportdata))
        data.forEach(row => {
            row.currentReports.forEach(item => {
                if(item.reportName == this.currentReport){
                this.reportID = item.reportId;
                    if(item.lockDate == true){
                        if (this.template.querySelector('c-user-profile-modal')) {
                            this.template.querySelector('c-user-profile-modal[data-id="mileges"]').show();
                        }
                    }else{
                            this.dispatchEvent(
                                new CustomEvent("viewreport", {
                                  detail:{reportID : this.reportID , monthList : this.monthoption}
                                })
                              );
                    }
                     
                }
            })
        })
    if(this.currentReport == 'Time and Attendance Detail Report'){
            // console.log("in else",item.reportName)
            this.buttonLabel = 'Submit';
            this.title = 'Contact List';
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_detail_report"]').show();
                setTimeout(() => {
                    if(this.template.querySelectorAll('.date-selector').length > 0){
                      this.intializeDatepickupnew();
                    }
                  },1000);
            }
        }else if(this.currentReport == 'Bi-Weekly Payment Report'){
            biweekpayperiod({accId:this._accid})
            .then(result => {
                var payarray = new Array();
                payarray = result.split(",");
                let finaldata =JSON.parse(JSON.stringify(payarray));
                finaldata.forEach(element => {
                    this.payperiodList.push({label:element,value:element});
                })
                this.payperiodList = JSON.parse(JSON.stringify(this.payperiodList))
            })
            .catch(error => {
                console.log("error",error)
            })
            this.title = 'Bi-Weekly Payment Report';
            this.payperioddropdown = true;
            this.downloadBtn = true;
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').show();
            }
        }else if(this.currentReport == 'Time, Attendance and Mileage Summary Report'){
            this.getPayPeriodOption();
            this.title = 'Time, Attendance and Mileage Summary Report';
            this.payperioddropdown = true;
            this.downloadBtn = true;
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').show();
            }
        }else if(this.currentReport == 'Monthly Tax Report'){
            this.downloadBtn = true;
            var payarray = new Array();
            payarray = monthPicklist.split(",");
            let finaldata =JSON.parse(JSON.stringify(payarray));
            finaldata.forEach(element => {
                this.monthList.push({label:element,value:element});
            })
            this.monthList = JSON.parse(JSON.stringify(this.monthList))

            var emparray = new Array();
            emparray = employeeTypePicklist.split(",");
            let finaldatanew =JSON.parse(JSON.stringify(emparray));
            finaldatanew.forEach(element => {
                this.emptypeList.push({label:element,value:element});
            })
            this.emptypeList = JSON.parse(JSON.stringify(this.emptypeList))
            
            this.monthlytaxreport = true;
            this.title = 'Monthly Tax Report';
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').show();
            }
        }else if(this.currentReport == 'Bi-weekly Time and Attendance Payment'){
            this.downloadBtn = true;
            this.byweeksubmit = true;
            this.getPayPeriodOption();
            this.title = 'Time and Attendance Payment Report';
            this.payperioddropdown = true;
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').show();
            }
        }else if(this.currentReport == 'Bi-weekly Salary and Full Time Fixed Payment'){
            this.getPayPeriodOption();
            this.title = 'Salary and Full Time Fixed Amount Payment Report';
            this.payperioddropdown = true;
            this.byweeksubmit = true;

            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').show();
            }

        }else if(this.currentReport == 'Monthly NetChex Variable Payment'){
            this.getDateOption();
            this.title = 'Monthly Variable Payment Report';
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="netchex_variable_payment"]').show();
            }
        }else if(this.currentReport == 'Monthly Part Time Fixed Amount Payment'){
            this.getDateOption();
            this.title = 'Part Time Fixed Amount Payment Report';
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="netchex_variable_payment"]').show();
            }
        }else if(this.currentReport == 'Delete NetChex Report'){
            this.buttonLabel = 'Delete';
            this.title = 'Delete Netchex Report';
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="attendance_detail_report"]').show();
                setTimeout(() => {
                    if(this.template.querySelectorAll('.date-selector').length > 0){
                      this.intializeDatepickupnew();
                    }
                  },1000);
            }
        }
        else if(this.currentReport == 'Annual Tax Liability Report'){
            // this.buttonLabel = 'Delete';
            // this.title = 'Delete Netchex Report';
           
            taxLiabilityReport({accId:this._accid})
            .then(result => {
               console.log("taxLiabilityReport",JSON.parse(result))
               this.anual_tax_detail = JSON.parse(result);
               this.template.querySelector('c-simple-pagination').updateRecords(this.anual_tax_detail,10)
            })
            .catch(error => {
                console.log("error",error)
            })
            if (this.template.querySelector('c-user-profile-modal')) {
                this.template.querySelector('c-user-profile-modal[data-id="anual_tax_liability"]').show();
            }
        }else if(this.currentReport == "Tax Liability"){
            this.dispatchEvent(
                new CustomEvent("viewreport", {
                  detail:{reportID : 'TAX123' , monthList : this.monthoption}
                })
              );
        }
    }

    handlemodalSubmit(){
        updatelockdate({accountId : this._accid , contactId : this._adminid})
        .then(result => {
            this.closeModal();
            this.dispatchEvent(
                new CustomEvent("viewreport", {
                  detail:{reportID : this.reportID , monthList : this.monthoption}
                })
              );
        })
        .catch(error => {
            console.log("error",error)
        })
    }

    handlemodalDelete(){
        this.template.querySelector(`.flat-container[data-id="from"]`).classList.add('area_disable');
        this.template.querySelector(`.flat-container[data-id="to"]`).classList.add('area_disable');

        this.isAreaDisabled = true;
        if(this.currentReport == 'Time and Attendance Detail Report'){
            ErmiDriverList({startDate:this.fromdate,endDate:this.todate,accountId:this._accid})
            .then(result => {
                if (this.template.querySelector('c-user-profile-modal')) {
                    this.template.querySelector('c-user-profile-modal[data-id="attendance_detail_report"]').hide();
                }
                this.message = "Succesfully send data to netchex.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
            .catch(error => {
                this.message = "Failed to send data.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
        }else if(this.currentReport == 'Delete NetChex Report'){
            this.progressbar = true;
            DeleteNetchexCallout({startDate:this.fromdate,endDate:this.todate})
            .then(result => {
                this.progress = 20;
                let intervalId;
                const callCheckStatus = () => {
                    CheckStatus({longtime:Date.parse(result),batchName:'NetchexDeleteCallout'})
                    .then((acc) => {
                        this.progress = this.progress + 20;
                        let successresult = JSON.parse(acc);
                        console.log("status", successresult.enablePollar);
                        if (successresult.enablePollar == false) {
                            this.progress = 100;
                            clearInterval(intervalId);
                            this.template.querySelector(`.flat-container[data-id="from"]`).classList.remove('area_disable');
                            this.template.querySelector(`.flat-container[data-id="to"]`).classList.remove('area_disable');
                    
                            this.isAreaDisabled = false;
                            if (this.template.querySelector('c-user-profile-modal')) {
                                this.template.querySelector('c-user-profile-modal[data-id="attendance_detail_report"]').hide();
                            }
                            this.message = "Successfully deleted data.";
                            this.toastmsg = true;
                            setTimeout(() => {
                              this.toastmsg = false;
                            }, 2000);
                            this.progressbar = false;
                            this.progress = 0;
                           
                        }
                        // this.executeCheckStatusfordetail("Successfully deleted data.")
                    })
                    .catch(error => {
                        console.log("CheckStatus",error)
                    })
                };  
                callCheckStatus();
                intervalId = setInterval(callCheckStatus, 5000);

            })
            .catch(error => {
                this.message = "Failed deleted data.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
        }
        this.template.querySelector(`.date-selector[data-id="from_date"]`).value = '';
        this.template.querySelector(`.date-selector[data-id="to_date"]`).value = '';
        this.fromdate = null;
        this.todate = null;
    }

    closeModal(){
        if (this.template.querySelector('c-user-profile-modal[data-id="mileges"]')) {
            this.template.querySelector('c-user-profile-modal[data-id="mileges"]').hide();
        }
    }
    handleCloseModal(){
        this.monthlytaxreport = false;
        this.downloadBtn = false;
        this.byweeksubmit = false;
        this.payperioddropdown = false;
        this.progressbar = false;
        this.progress = 0;
        this.isAreaDisabled = true;
        this.fromdate = '';
        this.todate = '';
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
    handleselectPayPeriod(event){
        this.payperioddate = event.detail.value;
        this.isAreaDisabled = false;
    }
    handleselectMonth(event){
        this.empMonth = event.detail.value;
        this.isAreaDisabled = false;
    }
    handleselectemployeeType(event){
        let type  = event.detail.value;
         this.empType = type.replace(" ","%20")
         this.isAreaDisabled = false;
    }
    handleselectDate(event){
        this.netchexDate = event.detail.value;
        this.isAreaDisabled = false;
    }
    handledownloadsummary(){
        if(this.currentReport == 'Time, Attendance and Mileage Summary Report'){
            if(this.payperioddate){
                window.open("https://"+window.location.host+"/app/TimeandSummaryDetailReport?id="+this._accid+"&endDate="+this.payperioddate.split(' to ')[0]+"&startDate="+this.payperioddate.split(' to ')[1])
            }
            this.payperioddropdown = false; 
        }else if(this.currentReport == 'Bi-Weekly Payment Report'){
            if(this.payperioddate){
                window.open("https://"+window.location.host+"/app/PayDateReport?id="+this._accid+"&endDate="+this.payperioddate.split(' to ')[0]+"&startDate="+this.payperioddate.split(' to ')[1])
            }
            this.payperioddropdown = false; 
        }else if(this.currentReport == 'Monthly Tax Report'){
            if(this.empMonth &&  this.empType){
                window.open("https://"+window.location.host+"/app/TaxReportPage?month="+this.empMonth+"&empType="+this.empType)
            }
            this.monthlytaxreport = false;
        } else if(this.currentReport == 'Bi-weekly Time and Attendance Payment'){
            if(this.payperioddate){
                window.open("https://"+window.location.host+"/app/TimeSheetNetchexReport?id="+this._accid+"&startDate="+this.payperioddate.split(' to ')[1]+"&endDate="+this.payperioddate.split(' to ')[0])
            }
            this.payperioddropdown = false; 
            this.byweeksubmit = false;
        }     
         
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').hide();
        }  
        
    }
    handleSubmit(){
        this.template.querySelector(`.pay_period[data-id="pay_period"]`).classList.add('area_disable');
        this.isAreaDisabled = true;
        // this.isAreaDisabled = true;
        this.progressbar = true;
        if(this.currentReport == 'Bi-weekly Time and Attendance Payment'){
            
            postTimeSheetImportAPI({startDate:this.payperioddate.split(' to ')[0],endDate:this.payperioddate.split(' to ')[1],adminId:this._adminid})
            .then((data) => {
                this.progress = 20;
                let intervalId;
                const callCheckStatus = () => {
                    CheckStatus({longtime:Date.parse(data),batchName:'TimeSheetImportNetchexBatch'})
                    .then((acc) => {
                        if(this.progress < 90){
                            this.progress = this.progress + 15;
                        }
                        let successresult = JSON.parse(acc);
                        console.log("status", successresult.enablePollar);
                        // this.executeCheckStatusforbiweek("Succesfully send data to netchex.")
                        if (successresult.enablePollar == false) {
                            this.progress = 100;
                            clearInterval(intervalId);
                            this.template.querySelector(`.pay_period[data-id="pay_period"]`).classList.remove('area_disable');
                            this.isAreaDisabled = false;
                            if (this.template.querySelector('c-user-profile-modal')) {
                                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').hide();
                            }
                            this.message = "Succesfully send data to netchex.";
                            this.toastmsg = true;
                            setTimeout(() => {
                              this.toastmsg = false;
                            }, 2000);
                            this.progressbar = false;
                            this.progress = 0;
                            this.byweeksubmit = false;
                            this.payperioddropdown = false;
                        }
                    })
                    .catch(error => {
                        console.log("CheckStatus",error)
                    })
                };  
                callCheckStatus();
                intervalId = setInterval(callCheckStatus, 5000);
                
            })
            .catch(error => {
                this.message = "Faild send data to netchex.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
           
        }else if(this.currentReport == 'Bi-weekly Salary and Full Time Fixed Payment'){
            
            postHalfFPFullDriverAPI ({startDate:this.payperioddate.split(' to ')[0],endDate:this.payperioddate.split(' to ')[1],adminId:this._adminid})
            .then((data) => {
                this.progress = 20;
                let intervalId;
                const callCheckStatus = () => {
                    CheckStatus({longtime:Date.parse(data),batchName:'NetchexFulltimeHalfFPBatch'})
                    .then((acc) => {
                        if(this.progress < 90){
                            this.progress = this.progress + 15;
                        }
                        
                        let successresult = JSON.parse(acc);
                        console.log("status", successresult.enablePollar);
                        if (successresult.enablePollar == false) {
                            this.progress = 100;
                            clearInterval(intervalId);
                            this.template.querySelector(`.pay_period[data-id="pay_period"]`).classList.remove('area_disable');
                            this.isAreaDisabled = false;
                            if (this.template.querySelector('c-user-profile-modal')) {
                                this.template.querySelector('c-user-profile-modal[data-id="attendance_summary_report"]').hide();
                            }
                            this.message = "Full Time Fixed Amount Payment is succesfully send to netchex.";
                            this.toastmsg = true;
                            setTimeout(() => {
                              this.toastmsg = false;
                            }, 2000);
                            this.progressbar = false;
                            this.progress = 0;
                            this.byweeksubmit = false;
                            this.payperioddropdown = false;
                        }
                        // this.executeCheckStatusforbiweek("Full Time Fixed Amount Payment is succesfully send to netchex.")
                    })
                    .catch(error => {
                        console.log("CheckStatus",error)
                    })
                };  
                callCheckStatus();
                intervalId = setInterval(callCheckStatus, 5000);
            })
            .catch(error => {
                this.message = "Faild send data to netchex.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
            
        }
       
    }
  
   
    handleSubmitDate(){
        this.template.querySelector(`.pay_period[data-id="date"]`).classList.add('area_disable');
        this.isAreaDisabled = true;
        this.progressbar = true;
        if(this.currentReport == 'Monthly NetChex Variable Payment'){
            postVariablePaymentAPI({startDate:this.netchexDate ,adminId:this._adminid})
            .then((result) => {
                this.progress = 20;
                let intervalId;
                const callCheckStatus = () => {
                    CheckStatus({longtime:Date.parse(result),batchName:'NetchexVariablePaymentBatch'})
                    .then((acc) => {
                        if(this.progress < 90){
                            this.progress = this.progress + 15;
                        }
                        let successresult = JSON.parse(acc);
                        console.log("status", successresult.enablePollar);
                        // this.executeCheckStatus("Variable Payment is successfully sent to Netchex.")
                        if (successresult.enablePollar == false) {
                            this.progress = 100;
                            clearInterval(intervalId);
                            this.template.querySelector(`.pay_period[data-id="date"]`).classList.remove('area_disable');
                            this.isAreaDisabled = false;
                            if (this.template.querySelector('c-user-profile-modal')) {
                              this.template.querySelector('c-user-profile-modal[data-id="netchex_variable_payment"]').hide();
                            }
                            this.message = "Variable Payment is successfully sent to Netchex.";
                            this.toastmsg = true;
                            setTimeout(() => {
                              this.toastmsg = false;
                            }, 2000);
                            this.progressbar = false;
                            this.progress = 0;
                        }
                    })
                    .catch(error => {
                        console.log("CheckStatus",error)
                    })
                };  
                callCheckStatus();
                intervalId = setInterval(callCheckStatus, 5000);
               
            })
            .catch(error => {
                this.message = "Variable Payment is failed send to netchex.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
        }else if(this.currentReport == 'Monthly Part Time Fixed Amount Payment'){
            postFixedAmountAPI({startDate:this.netchexDate ,adminId:this._adminid})
            .then((data) => {
                console.log("result",data)
                this.progress = 20;
                let intervalId;
                const callCheckStatus = () => {
                    CheckStatus({longtime:Date.parse(data),batchName:'NetchexSalaryPartFixAmountBatch'})
                    .then((acc) => {
                        if(this.progress < 90){
                            this.progress = this.progress + 15;
                        }
                        let successresult = JSON.parse(acc);
                        console.log("status", successresult.enablePollar);
                        // this.executeCheckStatus("Fixed Amount Payment is succesfully send to netchex.")
                        if (successresult.enablePollar == false) {
                            this.progress = 100;
                            clearInterval(intervalId);
                            this.template.querySelector(`.pay_period[data-id="date"]`).classList.remove('area_disable');
                            this.isAreaDisabled = false;
                            if (this.template.querySelector('c-user-profile-modal')) {
                              this.template.querySelector('c-user-profile-modal[data-id="netchex_variable_payment"]').hide();
                            }
                            this.message = "Fixed Amount Payment is succesfully send to netchex.";
                            this.toastmsg = true;
                            setTimeout(() => {
                              this.toastmsg = false;
                            }, 2000);
                            this.progressbar = false;
                            this.progress = 0;
                        }
                    })
                    .catch(error => {
                        console.log("CheckStatus",error)
                    })
                };  
                callCheckStatus();
                intervalId = setInterval(callCheckStatus, 5000);
            })
            .catch(error => {
                this.message = "Fixed Amount Payment is failed send to netchex.";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            })
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
                  dateFormat:'yyyy-mm-dd',
      
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
                    //    if(this.fromdate.length > 0 && this.todate.length>0){
                    //     this.isAreaDisabled = false;
                    //    }
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
        handlemousedownonsearch(){

        }

        handlePageEvent(event) {
            this.visibleAccounts=[...event.detail.records]
        }
        handleselectYear(event){
            this.year = event.detail.value;
            console.log("year",this.year)
            this.isAreaDisabled = true;
        }
        handleCheckboxAll(event){
            let checked = event.target.checked;
            let checkboxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
            for(let i=0; i<checkboxes.length; i++) {
              checkboxes[i].checked = checked;
            }
        }
        handleCheckbox(event){

        }
        handleDownloadExcel(){
            let selectedId =[];
            let checkboxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
            for(let i=0; i<checkboxes.length; i++) {
                console.log("checkboxes[i].checked",checkboxes[i].checked)
              if(checkboxes[i].checked  == true){
                selectedId.push(this.visibleAccounts[i].reimbId)
              }
            }
            console.log(JSON.stringify(selectedId))
            downloadExcel({condata: JSON.stringify(selectedId),year:this.year})
            .then((data) => {
            let arrOfSummry = [];
            let summaryxlsData = [] ;
            // let tempheader = [];
            let resultdata = JSON.parse(data);
            console.log("resultdata",resultdata.length)
            if(resultdata.length > 0){
                this.template.querySelector('.modal_header').classList.add('area_disable');
                this.isAreaDisabled = true;
                resultdata.forEach(element =>{
                    arrOfSummry.push({drivername:element.drivername,employeeid:element.employeeid,emailid:element.emailid,imputedincome:element.imputedincome})
                    return arrOfSummry;
                })
                summaryxlsData = JSON.parse(JSON.stringify(arrOfSummry))
                console.log("in if",summaryxlsData)

                let summaryheadernew = [ "Employee Name","Employee ID","Employee Email","Imputed Income"];
                let tempheader = [];
                let tempworkSheetNameList = [];
                let tempxlsData = [];
                let name = '';
                //push data , custom header , filename and worksheetname for detail xlsx file
                tempheader.push(summaryheadernew);
                tempworkSheetNameList.push("Annual Tax Liability Report");
                tempxlsData.push(summaryxlsData);
                name = 'Annual Tax Liability Report.xlsx';
                //Download Summary report(xlsx file)
                    if(tempxlsData.length > 0){
                        console.log("in if")
                        this.callcreatexlsxMethod(tempheader ,name, tempworkSheetNameList , tempxlsData);
                    }
                    this.template.querySelector('.modal_header').classList.remove('area_disable');
                    this.isAreaDisabled = false;
                    if (this.template.querySelector('c-user-profile-modal')) {
                        this.template.querySelector('c-user-profile-modal[data-id="anual_tax_liability"]').hide();
                    } 

            }else{
                if (this.template.querySelector('c-user-profile-modal')) {
                    this.template.querySelector('c-user-profile-modal[data-id="anual_tax_liability"]').hide();
                } 
                this.message = "No data found for this driver";
                this.toastmsg = true;
                setTimeout(() => {
                    this.toastmsg = false;
                }, 2000);
            }        
            })
            .catch(error => {
                console.log("error",error)
            })
        }
        callcreatexlsxMethod(headerList , filename , worksheetNameList , sheetData ){
            //Download Summary report(xlsx file)
            // <c-download-C-S-V-File></c-download-C-S-V-File>
            console.log("in xl")
            this.template.querySelector("c-download-C-S-V-File").download(headerList , filename , worksheetNameList , sheetData);
        }
        // handleprint(event){
        //     this.dispatchEvent(
        //         new CustomEvent("printtable", {
        //           detail: event.detail
        //         })
        //       );
        // }
}