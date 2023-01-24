import {
    LightningElement,
    api,
    track
} from 'lwc';
import setEmployeeNameLWC from "@salesforce/apex/AdminLWCDashboardController.setEmployeeNameLWC";
import approveMileagesLWC from "@salesforce/apex/AdminLWCDashboardController.approveMileagesLWC";
// import {loadStyle} from 'lightning/platformResourceLoader';
// import iconCss from '@salesforce/resourceUrl/iconCss';
const recordsPerPage = [10, 15, 20, 100];
export default class ModelDataTable extends LightningElement {
    sortedColumn = 'tripdate';
    sortedDirection = 'asc';
    resultData;
    emailOfEmployee;
    singleForApprove = false;
    singleForReject = false;
    allForApprove = false;
    allForReject = false;
    cssText = 'cPadding';
    cssPreviousText = 'cPadding';
    @api submitBool = false;
    @api appruveCheckboxes;
    @api options;
    @api modelHeadName;
    @api flagCheckboxes;
    @api appBool = false;
    @api flagBool = false;
    @track norecord = false;
    @api perPageMileage;
    @api perPageVariable;
    @track totalMileage;
    @track totalVarAmount;
    @api  isAllEnable = false;
    nopagedata = false;
    searchVisible = false;
    xlsHeader = [];
    xlsData = [];
    filename;
    workSheetNameList = [];
    // Partial JSON array of sourceData variable to bind to data table
    @api pagedData;
    @api currentmonth;
    @api theaddata;


    @track search = "";

    // Current page of results on display
    currentPage = 1;

    // Current maximum pages in sourceData set
    maxPages = 1;

    // Indicators to disable the paging buttons
    disabledPreviousButton = false;
    disabledNextButton = false;
    librariesLoaded = false;
    accId;
    contactId;
    @api tripdata;

    //add backdrop class
    @api addbackdrop(bool){
        if(bool){
            this.template.querySelector('.slds-backdrop').classList.add('blur');
            this.template.querySelector('.slds-modal').classList.add('index-blur');
        }
    }

    //remove backdrop class
    @api removebackdrop(bool){
        if(!bool){
            this.template.querySelector('.slds-backdrop').classList.remove('blur');
            this.template.querySelector('.slds-modal').classList.remove('index-blur');
        }
    }
    // Per page options 
    perPageOptions = recordsPerPage

    pageValue = recordsPerPage[1];

    displayAmmount = this.pageValue;

    handleRecordsPerPage(event) {
        this.pageValue = event.target.value;
        this.displayAmmount = this.pageValue;
        this.gotoPage(1, this.getSource());
    }

    searchResult(searchText, data) {
        let result = [];
        for (const key in data) {
            let res;
            for (const item in data[key]) {
                if (this.options.includes(item)) {
                    //hasOwnProperty : Returns true if the object has the specified property as own property; false otherwise.
                    if (data[key].hasOwnProperty.call(data[key], item)) {
                        const element = data[key][item];
                        if (element) {
                            res = element.toString().toUpperCase().includes(searchText);
                            if (res) {
                                result.push(data[key]);
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
        // window.clearTimeout(this.delayTimeout);
        var searchKey = event.detail.data.searchKey.toUpperCase();
        if (searchKey) {
            this.controlPagination = hideIt;
            this.setPaginationControls();
            this.recordsToDisplay = this.searchResult(searchKey, this.records);
            this.dispatchEvent(new CustomEvent('paginatorchange', {
                detail: JSON.stringify(this.recordsToDisplay)
            })); //Send records to display on table to the parent component
        } else {
            this.controlPagination = showIt;
            this.setRecordsToDisplay();
        }

    }

    searchData(event) {
        this.search = event.detail.data.searchKey.toUpperCase();
        var allRecords = this.tripdata;
        var searchResults = [];
        if (this.search) {
            searchResults = this.searchResult(this.search, allRecords);
            this.pagedData = searchResults;
            this.resultData = searchResults;
            this.norecord = (!searchResults.length) ? true : false;
            this.nopagedata = (!searchResults.length) ? true : false;
        } else {
            this.norecord = false;
            this.nopagedata = false;
            this.pagedData = this.tripdata;
        }

        this.gotoPage(this.currentPage, this.pagedData);
    }

    removeSearch() {
        this.search = "";
        this.gotoPage(this.currentPage, this.tripdata);
    }
    // On next click
    handleButtonNext() {
        var nextPage = this.currentPage + 1;
        var maxPages = this.getMaxPages(this.getSource());
        if (nextPage > 0 && nextPage <= maxPages) {
            this.gotoPage(nextPage, this.getSource());
        }
        this.toggleSubmit();
    }
    // On previous click
    handleButtonPrevious() {

        var nextPage = this.currentPage - 1;
        var maxPages = this.getMaxPages(this.getSource());

        if (nextPage > 0 && nextPage <= maxPages) {
            this.gotoPage(nextPage, this.getSource());
        }
        this.toggleSubmit();
    }

    // How many pages of results?
    getMaxPages(source) {

        // There will always be 1 page, at least
        var result = 1;
        // var data;
        // Number of elements on sourceData
        var arrayLength;

        // Number of elements on sourceData divided by number of rows to display in table (can be a float value)
        var divideValue;

        // Ensure sourceData has a value
        if (source.length) {

            arrayLength = source.length;

            // Float value of number of pages in data table
            divideValue = arrayLength / this.displayAmmount;

            // Round up to the next Integer value for the actual number of pages
            result = Math.ceil(divideValue);
        }

        this.maxPages = result;
        return result;
    }
    // Change page
    gotoPage(pageNumber, source) {

        var recordStartPosition, recordEndPosition;
        var i, arrayElement; // Loop helpers
        var maximumPages = this.maxPages;

        maximumPages = this.getMaxPages(source);

        // Validate that desired page number is available
        if (pageNumber > maximumPages || pageNumber < 0) {
            this.currentPage = 1;
            return;
        }

        // Reenable both buttons
        this.disabledPreviousButton = false;
        this.disabledNextButton = false;
        this.cssText = 'cPadding';
        this.cssPreviousText = (!this.disabledPreviousButton) ? 'cPadding' : 'cPadding disabled';
        // Is data source valid?
        if (source) {

            // Empty the data source used 
            this.pagedData = [];

            // Start the records at the page position
            recordStartPosition = this.displayAmmount * (pageNumber - 1);

            // End the records at the record start position with an extra increment for the page size
            recordEndPosition = recordStartPosition + parseInt(this.displayAmmount, 10);

            let mil = [];
            let varmout = [];
            // Loop through the selected page of records
            for (i = recordStartPosition; i < recordEndPosition; i++) {

                arrayElement = source[i];

                if (arrayElement) {
                    let tempData = this.proxyToObj(arrayElement);
                    // console.log(parseFloat(tempData.mileage));

                    if (tempData.mileage) {
                        tempData.mileage = parseFloat(tempData.mileage);
                        mil.push(tempData.mileage);
                    }
                    if (tempData.variableamount) {
                        tempData.variableamount = parseFloat(tempData.variableamount);
                        varmout.push(tempData.variableamount);
                    }

                    // Add data element for the data to bind
                    this.pagedData.push(arrayElement);
                }
            }
            // this.perPageMileage = mil.reduce((a, b) => a + b, 0);
            // console.log(this.perPageMileage);
            // console.log(this.pagedData[0]);
            this.perPageMileage = mil.reduce((a, b) => a + b, 0);
            this.perPageMileage = parseFloat(this.perPageMileage).toFixed(2);
            this.perPageMileage = this.numberWithCommas(this.perPageMileage);
            this.perPageVariable = varmout.reduce((a, b) => a + b, 0);
            this.perPageVariable = parseFloat(this.perPageVariable).toFixed(2);
            this.perPageVariable = this.numberWithCommas(this.perPageVariable);
            this.totalVarAmount = this.getTotalVarAmount();
            this.totalVarAmount = parseFloat(this.totalVarAmount).toFixed(2);
            this.totalVarAmount = this.numberWithCommas(this.totalVarAmount);
            this.totalMileage = this.getTotalMileage();
            this.totalMileage = parseFloat(this.totalMileage).toFixed(2);
            this.totalMileage = this.numberWithCommas(this.totalMileage);
            // Set global current page to the new page
            this.currentPage = pageNumber;

            // If current page is the final page then disable the next button
            if (maximumPages === this.currentPage) {
                this.disabledNextButton = true;
                this.cssText = 'cPadding disabled'
            }

            // If current page is the first page then disable the previous button
            if (this.currentPage === 1) {
                this.disabledPreviousButton = true;
                this.cssPreviousText = 'cPadding disabled'
            }

        }
    }

    getTotalVarAmount() {
        let data = this.proxyToObj(this.tripdata);
        let totalVar = 0;
        if (data) {
            for (var i = 0; i < data.length; i++) {
                totalVar = totalVar + parseFloat(data[i].variableamount);
            }
        }
        return totalVar;
    }

    getTotalMileage(){
        let data = this.proxyToObj(this.tripdata);
        let totalAmt = 0;
        if (data) {
            for (var i = 0; i < data.length; i++) {
                totalAmt = totalAmt + parseFloat(data[i].mileage);
            }
        }
        return totalAmt;
    }
    handleAppruve(event) {
        this.singleForApprove =  false;
        this.singleForReject =  false;
        this.allForApprove =  true;
        this.allForReject = false;
        let data = this.proxyToObj(this.tripdata);
        data.forEach((item, index) => {
            item.isSelected = event.target.checked;
            if (event.target.checked) {
                item.isChecked = !event.target.checked;
            }
        });
        this.tripdata = data;
        this.gotoPage(this.currentPage, this.tripdata);
        this.appBool = event.target.checked;
        if (this.appBool && this.flagBool) {
            this.flagBool = false;
        }
        // console.log('trip d', this.tripdata);
        this.toggleSubmit();
    }

    handleFlag(event) {
        this.singleForApprove =  false;
        this.singleForReject =  false;
        this.allForApprove = false;
        this.allForReject =  true;
        let data = this.proxyToObj(this.tripdata);
        data.forEach((item, index) => {
            item.isChecked = event.target.checked;
            if (event.target.checked) {
                item.isSelected = !event.target.checked;
            }
        });
        this.tripdata = data;
        this.gotoPage(this.currentPage, this.tripdata);
        this.flagBool = event.target.checked;
        if (this.appBool && this.flagBool) {
            this.appBool = false;
        }
        this.toggleSubmit();
    }

    handleAppruveForSingleRecord(event) {
        this.singleForApprove =  true;
        this.singleForReject = false;
        this.allForApprove = false;
        this.allForReject = false;
        if (this.appBool || this.flagBool) {
            this.appBool = false;
            this.flagBool = false;
        }
        let data = this.proxyToObj(this.tripdata);
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == event.target.value && event.target.name == 'appruve') {
                    data[i].isSelected = event.target.checked;
                    if (data[i].isChecked) {
                        data[i].isChecked = !event.target.checked;
                    }
                }
            }
        }
        this.tripdata = data;
        this.gotoPage(this.currentPage, this.tripdata);
        this.checkAllApruve();
        this.toggleSubmit();
    }

    handleFlagForSingleRecord(event) {
        this.singleForApprove =  false;
        this.singleForReject =  true;
        this.allForApprove = false;
        this.allForReject = false;
        if (this.appBool || this.flagBool) {
            this.appBool = false;
            this.flagBool = false;
        }
        let data = this.proxyToObj(this.tripdata);
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == event.target.value && event.target.name == 'flag') {
                    data[i].isChecked = event.target.checked;
                    if (data[i].isSelected) {
                        data[i].isSelected = !event.target.checked;
                    }
                }
            }
        }
        this.tripdata = data;
        this.gotoPage(this.currentPage, this.tripdata);
        this.checkAllFlag();
        this.toggleSubmit();
    }

    toggleSubmit() {
        if (this.pagedData) {
            for (var i = 0; i < this.pagedData.length; i++) {
                if ((this.pagedData[i].isSelected || this.pagedData[i].isChecked) && (!this.pagedData[i].isLockDate)) {
                    this.submitBool = true;
                    return;
                }
            }
            this.submitBool = false;
            return;
        }
    }

    checkAllApruve() {
        if (this.tripdata) {
            for (var i = 0; i < this.tripdata.length; i++) {
                if (!this.tripdata[i].isSelected) {
                    this.appBool = false;
                    return;
                }
            }
            this.appBool = true;
            return;
        }
    }

    checkAllFlag() {
        if (this.tripdata) {
            for (var i = 0; i < this.tripdata.length; i++) {
                if (!this.tripdata[i].isChecked) {
                    this.flagBool = false;
                    return;
                }
            }
            this.flagBool = true;
            return;
        }
    }

    handleSubmit() {
        var flagMileages = this.tripdata.filter(trip => trip.isChecked == true);
        var approveMileages = this.tripdata.filter(trip => trip.isSelected == true);
        var unapproveMileages = this.tripdata.filter(trip => trip.isUnapprove == true);
        console.log("Trip", this.singleForReject);
        console.log("Flag Mileages", this.singleForApprove)
        console.log("Approve Mileages", this.allForApprove);
        console.log("Unapprove Mileages", this.allForReject);
        if(this.singleForReject != true && this.singleForApprove != true && this.allForReject != true && this.allForApprove != true){
            this.dispatchEvent(
                new CustomEvent("showtoast", {
                    detail: {
                        flag: flagMileages,
                        approve: approveMileages
                    }
                })
            );
        }else{
            approveMileagesLWC({
                checked: JSON.stringify(flagMileages),
                selected: JSON.stringify(approveMileages),
                unapprove: JSON.stringify(unapproveMileages),
                name: this.modelHeadName,
                emailaddress: this.emailOfEmployee,
            }).then((result) => {
                if(result == 'success'){
                    this.dispatchEvent(
                        new CustomEvent("mileageapproval", {
                            detail: 'mileageApproval'
                        })
                    );
                    console.log("From Apex approveMileagesLWC", result);
                }
            })
        }
      
       
    }

    sort(event) {
        let colName = event ? event.target.name : undefined;
        var data;
        if (this.sortedColumn === colName)
            this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
        else
            this.sortedDirection = 'asc';

        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;

        if (colName)
            this.sortedColumn = colName;
        else
            colName = this.sortedColumn;

        data = this.getSource();
        this.pagedData = JSON.parse(JSON.stringify(data)).sort((a, b) => {

            if (colName == 'mileage' || colName == 'variableamount') {
                return parseFloat(a[colName]) > parseFloat(b[colName]) ? 1 * isReverse : -1 * isReverse;
            } else {
                a = a[colName] ? a[colName].toLowerCase() : '';
                b = b[colName] ? b[colName].toLowerCase() : '';
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
        });
        if (!this.search) {
            this.tripdata = this.pagedData;
        }
        console.log('pageddata', this.pagedData);
        this.displaySortIcon(colName, this.sortedDirection);
        this.gotoPage(this.currentPage, this.pagedData);
        console.log('pageddata after', this.pagedData);
    };

    displaySortIcon(colName, sortOrder) {
        let data = this.proxyToObj(this.theaddata);
        if (data) {
            for (var i = 0; i < data.length; i++) {
                data[i].arrUp = false;
                data[i].arrDown = false;

            };
            for (var i = 0; i < data.length; i++) {
                if (data[i].colName == colName) {
                    if (sortOrder == 'asc') {
                        data[i].arrUp = true;
                    } else {
                        data[i].arrDown = true;
                    }

                }
            };
        };
        console.log(this.theaddata);
        this.theaddata = data;
    }

    getSource() {
        if (this.search) {
            return this.resultData;
        } else {
            return this.tripdata;
        }
    }

    handleChnage(event) {
        // Creates the event with the data.
        const selectedEvent = new CustomEvent("closemodal", {
            detail: {
                isModalOpen: false
            },
        });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    handleDialogClose() {
        //Let parent know that dialog is closed (mainly by that cross button) so it can set proper variables if needed
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
    }
    proxyToObj(obj) {
        return JSON.parse(JSON.stringify(obj));
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

    tableToExcel() {
        let header = this.getHeaders();
        let exportData = this.getSource();
        exportData = this.proxyToObj(exportData);
        let formatData = [];
        for (let i = 0; i < exportData.length; i++) {
            formatData.push(this.excelData(exportData[i]));
        }
        this.xlsHeader.push(header);
        this.xlsData.push(formatData);
        let sheetName = this.modelHeadName +  '\'s Mileage'
        this.workSheetNameList.push(sheetName);
        this.template.querySelector("c-xlsx-mockup").download();
    }

    excelData = (exlData) => {
        var exportData = {};
        exportData.emailaddress = exlData.emailaddress;
        exportData.tracingstyle = exlData.tracingstyle;
        exportData.dayofweek = exlData.dayofweek;
        exportData.tripdate = exlData.tripdate;
        exportData.starttime = exlData.starttime;
        exportData.endtime = exlData.endtime;
        exportData.origin = exlData.origin;
        exportData.destination = exlData.destination;
        exportData.mileage = exlData.mileage;
        exportData.status = exlData.status;
        exportData.submitteddate = exlData.submitteddate;
        exportData.approveddate = exlData.approveddate;
        exportData.maintTyre = exlData.maintTyre;
        exportData.fuelRate = exlData.fuelRate;
        exportData.variablerate = exlData.variablerate;
        exportData.variableamount = exlData.variableamount;
        exportData.drivingtime = exlData.drivingtime;
        exportData.staytime = exlData.staytime;
        exportData.totaltime = exlData.totaltime;
        exportData.notes = exlData.notes;
        exportData.tag = exlData.tag;
        // exportData.tripdate = exlData.tripdate,
        // exportData.origin = exlData.origin,
        // exportData.destination = exlData.destination,
        // exportData.submitteddate = exlData.submitteddate,
        // exportData.approveddate = exlData.approveddate,
        // exportData.mileage = exlData.mileage,
        // exportData.variableamount = exlData.variableamount,
        // exportData.staytime = exlData.staytime,
        // exportData.drivingtime = exlData.drivingtime
        return exportData;
    }

    getHeaders() {
        let header = [];
        header[0] = "Contact Email";
        header[1] = "Tracking Style";
        header[2] = "Day Of Week";
        header[3] = "Trip Date";
        header[4] = "Start Time";
        header[5] = "End Time";
        header[6] = "Trip Origin";
        header[7] = "Trip Destination";
        header[8] = "Mileage";
        header[9] = "Status";
        header[10] = "Date Submitted";
        header[11] = "Date Approved";
        header[12] = "Maint/Tires";
        header[13] = "Fuel Rate";
        header[14] = "Variable Rate";
        header[15] = "Variable Amount";
        header[16] = "Drive Time";
        header[17] = "Stay Time";
        header[18] = "Total Time";
        header[19] = "Notes";
        header[20] = "Tags";
        return header;
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // On component initiation
    connectedCallback() {
        // Initialize data table to the specified current page (should be 1)
        console.log("Trip",this.tripdata)
        var url_string = location.href;
        var url = new URL(url_string);
        let chkcount = 0, approvedcount = 0, flagcount = 0, lockdatecount = 0;
        this.contactId = url.searchParams.get("id");
        this.accId = url.searchParams.get("accid");
        this.gotoPage(this.currentPage, this.tripdata);
        if (!this.tripdata.length) {
            this.norecord = true;
            this.nopagedata = true;
            this.searchVisible = true;
        }

        var source = this.getSource();
        if(source.length > 0){
          for (var i = 0; i < source.length; i++) {
            if (source[i].isLockDate === true) {
                lockdatecount++;
            }
              if ((source[i].status != 'None' && source[i].status != '') && source[i].mileage >= 0) {
                  chkcount++;
                  if (source[i].isSelected) {
                      approvedcount++;
                  } else if (source[i].isChecked) {
                      flagcount++;
                  }
              }
          }
  
          console.log("lockdate count:", lockdatecount)
       
          if (lockdatecount == 0) {
            this.isAllEnable = false;
          }else{
              this.isAllEnable = true;
          }
          console.log("enabled count:", this.isAllEnable)
          if(chkcount === approvedcount) {
              this.appBool = true;
              this.flagBool = false;
          }
  
          if(chkcount === flagcount) {
              this.appBool = false;
              this.flagBool = true;
          }
        }
        console.log("rendered->",this.getSource());
        setEmployeeNameLWC({
            conId: this.contactId
        }).then(result => {
            if(result){
                var emp = result.split(",");
                this.emailOfEmployee = emp[0];
            }
            console.log(result)
        });

        this.toggleSubmit();
        this.filename = this.modelHeadName + '\'s Mileage ' + this.dateFormat() + '.xlsx';
        console.log(this.filename);
    }

    renderedCallback(){
        var e =  this.template.querySelector('.perPageSelect');
        if(e)
            e.value = this.displayAmmount;
    }
}