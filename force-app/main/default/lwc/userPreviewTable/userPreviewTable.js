/* eslint-disable radix */
/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api, track } from 'lwc';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import {
    events, openEvents
} from 'c/utils';
export default class UserPreviewTable extends LightningElement {
    className;
    rowId;
    sortedColumn = 'tripdate';
    sortedDirection = 'asc';
    previousIcon = '';
    searchPreviousIcon = '';
    cssText = 'cPadding';
    cssPreviousText = 'cPadding';
    downloadIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Info/download.png';
    downloadAllIcon = resourceImage + '/mburse/assets/mBurse-Icons/download-all.png';
    @api headerDownload;
    @api headerName;
    @api isSortable;
    @api tripMonth;
    @api biweekValue;
    @api startDate;
    @api endDate;
    @api mainClass;
    @api rowDownload;
    @api scrollable;
    @api isPaginate;
    @api columns;
    @api options;
    @api pagedData;
    @api modelData;
    @api searchKey;
    @api editableView;
    @api isBiweek;
    @api norecordMessage;
    @track norecord = false;
    @track searchVisible = false;
    @api isDefaultSort = false;
    sortedData = [];
     // Current page of results on display
     currentPage = 1;

     // Current maximum pages in sourceData set
     maxPages = 1;
 
     //per page count
     displayRecordCount = 20;
     
     //search
     search = false;
     searchData = [];
     totalPage = [];
     // Indicators to disable the paging buttons
     disabledPreviousButton = false;
     disabledNextButton = false;
     librariesLoaded = false;
     sortedColName = '';
     accId;
     contactId;

    @api searchByKey(_keyValue){
        if(_keyValue && _keyValue.length > 0 ) {
                this.search = true;
                this.searchData = [];
                let data = this.modelData;
                let result = [];
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        let res;
                        for (const item in data[key]) {
                            if (this.options.includes(item)) {
                                //hasOwnProperty : Returns true if the object has the specified property as own property; false otherwise.
                                if (data[key].hasOwnProperty.call(data[key], item)) {
                                    const element = data[key][item];
                                    if (element) {
                                        res = element.toString().toLowerCase().includes(_keyValue.toLowerCase());
                                        if (res) {
                                            result.push(data[key]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            this.norecord = (!result.length) ? true : false
            this.pagedData = result;
            this.searchData = result;
            this.sortedDirection = this.previousIcon;
        }else{
            this.search = false;
            this.norecord = false;
            this.sortedDirection = this.previousIcon;
            this.pagedData = this.modelData;
        }
        this.displaySortIcon(this.sortedColName, this.sortedDirection);
        this.gotoPage(this.currentPage, this.pagedData)
        this.totalPages(this.maxPages);
    }

    @api refreshTable(_data){
        this.modelData = _data;
        this.pagedData = _data;
        this.gotoPage(this.currentPage, this.pagedData)
    }

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
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.pagedData = [];

            // Start the records at the page position
            recordStartPosition = this.displayRecordCount * (pageNumber - 1);

            // End the records at the record start position with an extra increment for the page size
            recordEndPosition = recordStartPosition + parseInt(this.displayRecordCount, 10);

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

                  //  this.template.querySelectorAll('.page-num-block').forEach(item=>{
                    
                  //  })
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

      // On next click
      handleButtonNext() {
        var nextPage = this.currentPage + 1;
        var maxPages = this.getMaxPages(this.getSource());
        var pageBlock = this.template.querySelectorAll('.page-num-block');
        if (nextPage > 0 && nextPage <= maxPages) {
            pageBlock.forEach(item=>{
                if(item.dataset.id){
                    // eslint-disable-next-line radix
                    if(parseInt(item.dataset.id) === nextPage){
                        item.classList.add('active')
                    }else{
                        item.classList.remove('active')
                    }
                }
            })
            this.gotoPage(nextPage, this.getSource());
        }
    }
    // On previous click
    handleButtonPrevious() {
        var nextPage = this.currentPage - 1;
        var maxPages = this.getMaxPages(this.getSource());
        var pageBlock = this.template.querySelectorAll('.page-num-block');
        if (nextPage > 0 && nextPage <= maxPages) {
            pageBlock.forEach(item=>{
                if(item.dataset.id){
                    // eslint-disable-next-line radix
                    if(parseInt(item.dataset.id) === nextPage){
                        item.classList.add('active')
                    }else{
                        item.classList.remove('active')
                    }
                }
            })
            this.gotoPage(nextPage, this.getSource());
        }

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
            divideValue = arrayLength / this.displayRecordCount;
            console.log("divide value", divideValue)
            // Round up to the next Integer value for the actual number of pages
            result = Math.ceil(divideValue);
        }

        this.maxPages = result;
        return result;
    }

    totalPages(maxPage){
        var j;
        this.totalPage = [];
        for(j = 1;j<=maxPage;j++){
            this.totalPage.push(j)
        }
    }

    getTotalVarAmount() {
        let data = this.proxyToObj(this.modelData);
        let totalVar = 0;
        if (data) {
            for (let i = 0; i < data.length; i++) {
                totalVar = totalVar + parseFloat(data[i].variableamount);
            }
        }
        return totalVar;
    }

    getTotalMileage(){
        let data = this.proxyToObj(this.modelData);
        let totalAmt = 0;
        if (data) {
            for (let i = 0; i < data.length; i++) {
                totalAmt = totalAmt + parseFloat(data[i].mileage);
            }
        }
        return totalAmt;
    }

    sort(event) {
        let colName = event ? event.target.dataset.name : undefined;
        let colType = event ? event.target.dataset.type : undefined;
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
            if (colType === "Decimal") {
                a[colName] = (a[colName].indexOf('$') > -1) ? a[colName].replace(/\$/g, "") : a[colName];
                b[colName] = (b[colName].indexOf('$') > -1) ? b[colName].replace(/\$/g, "") : b[colName];
                a = (a[colName] == null || a[colName] === 'null') ? '' : parseFloat(a[colName])
                b = (b[colName] == null || b[colName] === 'null') ? '' : parseFloat(b[colName])
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
            if (colType === "Integer") {
                a = (a[colName] == null || a[colName] === 'null') ? '' : parseInt(a[colName])
                b = (b[colName] == null || b[colName] === 'null') ? '' : parseInt(b[colName])
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
            if(colType === "Date"){
                a = (a[colName] == null) ? '' : new Date(a[colName].toLowerCase())
                b = (b[colName] == null) ? '' : new Date(b[colName].toLowerCase())
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
                a = (a[colName] == null || a[colName] === '') ? '' : a[colName].toLowerCase();
                b = (b[colName] == null || b[colName] === '') ? '' : b[colName].toLowerCase();
                return a > b ? 1 * isReverse : -1 * isReverse;
            
        });
        //this.sortedData = this.pagedData
        if (!this.search) {
            this.previousIcon = this.sortedDirection
            this.modelData = this.pagedData;
        }else{
            this.searchPreviousIcon = this.sortedDirection
        }
        this.sortedColName = colName;
        this.displaySortIcon(colName, this.sortedDirection);
        this.gotoPage(this.currentPage, this.pagedData);
    }

    defaultSort(column, type){
        console.log("default", column, type);
        let colName = column ? column : undefined;
        let colType = type ? type : undefined;
        // eslint-disable-next-line vars-on-top
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
            if (colType === "Decimal") {
                a[colName] = (a[colName].indexOf('$') > -1) ? a[colName].replace(/\$/g, "") : a[colName];
                b[colName] = (b[colName].indexOf('$') > -1) ? b[colName].replace(/\$/g, "") : b[colName];
                console.log(a[colName], b[colName])
                a = (a[colName] == null || a[colName] === 'null') ? '' : parseFloat(a[colName])
                b = (b[colName] == null || b[colName] === 'null') ? '' : parseFloat(b[colName])
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
            if(colType === "Date"){
                a = (a[colName] == null) ? '' : new Date(a[colName].toLowerCase())
                b = (b[colName] == null) ? '' : new Date(b[colName].toLowerCase())
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
                a = (a[colName] == null || a[colName] === '') ? '' : a[colName].toLowerCase();
                b = (b[colName] == null || b[colName] === '') ? '' : b[colName].toLowerCase();
                return a > b ? 1 * isReverse : -1 * isReverse;
            
        });
        //this.sortedData = this.pagedData
        if (!this.search) {
            this.previousIcon = this.sortedDirection
            this.modelData = this.pagedData;
        }else{
            this.searchPreviousIcon = this.sortedDirection
        }
        this.sortedColName = colName;
        this.displaySortIcon(colName, this.sortedDirection);
        this.gotoPage(this.currentPage, this.pagedData);
    }
    
    displaySortIcon(colName, sortOrder) {
        let data = this.proxyToObj(this.columns);
        if (data) {
            for (let i = 0; i < data.length; i++) {
                data[i].arrUp = false;
                data[i].arrDown = false;
                if (data[i].colName === colName) {
                    if (sortOrder === 'asc') {
                        data[i].arrUp = true;
                    } else {
                        data[i].arrDown = true;
                    }

                }
            } 
        }
        console.log(this.columns);
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.columns = data;
    }

    getSource() {
        // if(this.sortedData.length > 0){
        //     if (this.search) {
        //         return this.searchData;
        //     } 
        //         return this.sortedData;
        // }
            if (this.search) {
                return this.searchData;
            } 
                return this.modelData;
    }

    validateInputField(event){
        let _name = event.currentTarget.dataset.name;
        if(_name === 'range'){
            event.target.value = event.target.value
            .replace(/[^\d]/g, '')             // numbers only
            .replace(/(^\.*)\./g, '$1')          // single dot retricted
            .replace(/(^[\d]{5})[\d]/g, '$1')   // not more than 4 digits at the beginning
        }
    }

    handleInput(event){
        let input = event.target.value;
        let keyName = event.currentTarget.dataset.name;
        let dataList = this.proxyToObj(this.modelData);
        let updatedList = [];
       // let element = dataList.find(ele  => ele.id === this.rowId);
        for (let i = 0; i < dataList.length; i++) {
            if(dataList[i].id === this.rowId){
                let keyList = dataList[i].keyFields;
                dataList[i][keyName] = (input !== null) ? (keyName === 'range') ? parseInt(input) : input : input;
                for(let j = 0; j < keyList.length; j++){
                    if(keyList[j].key === keyName){
                        keyList[j].value = input;
                    }
                }
            }
        }
        updatedList = dataList;
        this.modelData = dataList;
        this.pagedData = dataList;
        this.gotoPage(this.currentPage, this.pagedData)
        this.dispatchEvent(
            new CustomEvent("update", {
              detail: JSON.stringify(updatedList)
            })
          );
    }

    handleEditMode(event){
        let targetId = (event.currentTarget) ? event.currentTarget.dataset.id : undefined;
        this.rowId = targetId;
        let data = this.proxyToObj(this.modelData);
        if(targetId){
            this.dispatchEvent(
                new CustomEvent("editmode", {
                  detail: ''
                })
            );
            if (data) {
                for (let i = 0; i < data.length; i++) {
                  if(data[i].id === targetId){
                    data[i].isEdited = true;
                  }else{
                    data[i].isEdited = (!data[i].isEdited) ? false : true;
                  }
                }
                this.modelData = data;
                this.pagedData = data;
                this.gotoPage(this.currentPage, this.pagedData)
            }
        }
     
    }

    proxyToObj(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    connectedCallback() {
        // Initialize data table to the specified current page (should be 1)
       
        console.log("Trip", JSON.stringify(this.modelData), this.norecord)
        this.className = (this.scrollable) ? 'slds-scrollable_y slds-p-right_small' : 'slds-p-right_small';
        if(this.isPaginate){
            this.sortedColumn = this.columns[0].colName;
            this.gotoPage(this.currentPage, this.modelData);
            this.totalPages(this.maxPages);
        }else{
            this.pagedData = [];
            this.pagedData = this.modelData;
        }
     
        if (!this.modelData.length) {
            this.norecord = true;
            this.nopagedata = true;
        }

        if(this.modelData.length > 8){
            this.searchVisible = true;
        }else{
            this.searchVisible = false;
        }

        if(this.isDefaultSort){
            this.defaultSort('tripdate', 'Date') 
        }
    }

    renderedCallback(){
        var pageBlock = this.template.querySelectorAll('.page-num-block');
        let customIcon = this.template.querySelectorAll('.navigate');
        let _self = this;
        if(pageBlock){
            pageBlock.forEach(item=>{
                if(item.dataset.id){
                    // eslint-disable-next-line radix
                    if(parseInt(item.dataset.id) === this.currentPage){
                        item.classList.add('active')
                    }else{
                        item.classList.remove('active')
                    }
                }
            })
        }
        if(customIcon){
            customIcon.forEach(ev=>{
                ev.addEventListener('click', function(e){
                    // console.log("Icon----", e, e.currentTarget.dataset.name)
                    // console.log("Icon----", e, e.currentTarget.dataset.id, e.currentTarget.dataset.st, _self.isBiweek )
                    if(e.currentTarget.dataset.name !== undefined){
                        if(_self.isBiweek !== true){
                            events(_self, e.currentTarget.dataset.name)
                        }else{
                            events(_self, {
                                id: e.currentTarget.dataset.id,
                                startDate: e.currentTarget.dataset.st,
                                endDate: e.currentTarget.dataset.ed
                            })
                        }
                      
                    }
                    e.stopPropagation();
                });
            });
        }
    }

    handleDownload(event){
        event.stopPropagation();
        openEvents(this, event.currentTarget.dataset.key);
    }

    downloadAllTrips(){
        const tripEvent = new CustomEvent('view', {detail: this.tripMonth});
        this.dispatchEvent(tripEvent);
    }
}