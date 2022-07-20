import { LightningElement, api, track } from 'lwc';
const DELAY = 100;
const recordsPerPage = [30,50,100,150,200];
const pageNumber = 1;
const showIt = 'visibility:visible';
const hideIt = 'visibility:hidden'; //visibility keeps the component space, but display:none doesn't
export default class CPaginator extends LightningElement {
    @api showSearchBox = false; //Show/hide search box; valid values are true/false
    @api showPagination; //Show/hide pagination; valid values are true/false
    @api pageSizeOptions = recordsPerPage; //Page size options; valid values are array of integers
    @api totalRecords; //Total no.of records; valid type is Integer
    @api records; //All records available in the data table; valid type is Array 
    @track pageSize; //No.of records to be displayed per page
    @track totalPages; //Total no.of pages
    @track pageNumber = pageNumber; //Page number
    @track searchKey; //Search Input
    @track controlPagination = showIt;
    @track controlPrevious = hideIt; //Controls the visibility of Previous page button
    @track controlNext = showIt; //Controls the visibility of Next page button
    recordsToDisplay = []; //Records to be displayed on the page
    @api options;
    @api  searchStyle; // Dynamically set css for search bar

    @api renderPageNumber(){
        this.pageNumber = 1
        this.setPaginationControls();
    }
    //Called after the component finishes inserting to DOM
    connectedCallback() {
        if(this.pageSizeOptions && this.pageSizeOptions.length > 0) 
            this.pageSize = this.pageSizeOptions[0];
        else{
            this.pageSize = this.totalRecords;
            this.showPagination = false;
        }
        this.controlPagination = this.showPagination === false ? hideIt : showIt;
        this.setRecordsToDisplay();
    }

    handleRecordsPerPage(event){
        this.pageSize = event.target.value;
        this.setRecordsToDisplay();
    }
    handlePageNumberChange(event){
        let key = Number(event.key);
        console.log(key);
        if (isNaN(key) || event.key === null || event.key === ' ') {
            if(event.keyCode === 13){
                this.pageNumber = event.target.value;
                this.setRecordsToDisplay();
            }else{
                event.preventDefault(); 
            }
        }
       
    }
    previousPage(){
        this.pageNumber = this.pageNumber-1;
        this.setRecordsToDisplay();
    }
    nextPage(){
        this.pageNumber = this.pageNumber+1;
       // console.log(this.records);
        this.setRecordsToDisplay();
    }
    @api setRecordsToDisplay(searchRecord){
        this.recordsToDisplay = [];
        if(!this.pageSize)
            this.pageSize = (searchRecord != null || searchRecord != undefined) ? searchRecord : this.totalRecords;

        this.totalPages = Math.ceil(this.totalRecords/this.pageSize);

        this.setPaginationControls();

        this.listOfRecords =  (searchRecord != null || searchRecord != undefined) ? searchRecord : this.totalRecords;
        for(let i=(this.pageNumber-1)*this.pageSize; i < this.pageNumber*this.pageSize; i++){
            if(i === this.listOfRecords) break;
            this.recordsToDisplay.push(this.records[i]);
        }
       // console.log("from page ", this.recordsToDisplay);
        this.dispatchEvent(new CustomEvent('paginatorchange', {detail: JSON.stringify(this.recordsToDisplay)})); //Send records to display on table to the parent component
    }
    setPaginationControls(){
        //Control Pre/Next buttons visibility by Total pages
        if(this.totalPages === 1){
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }else if(this.totalPages > 1){
           this.controlPrevious = showIt;
           this.controlNext = showIt;
        }
        //Control Pre/Next buttons visibility by Page number
        if(this.pageNumber <= 1){
            this.pageNumber = 1;
            this.controlPrevious = hideIt;
        }else if(this.pageNumber >= this.totalPages){
            this.pageNumber = this.totalPages;
            this.controlNext = hideIt;
        }
        //Control Pre/Next buttons visibility by Pagination visibility
        if(this.controlPagination === hideIt){
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }
    }

    searchResult(searchText, data) {
        var keys = this.options
        var result = JSON.parse(data).filter(row => 
            keys.some(key =>
                String(row[key]).toLowerCase().includes(searchText.toLowerCase())
            )
        );
        // let result = [];
        // for (const key in data) {
        //     let res;
        //     for (const item in data[key]) {
        //         if (this.options.includes(item)) {
        //             //hasOwnProperty : Returns true if the object has the specified property as own property; false otherwise.
        //             if (data[key].hasOwnProperty.call(data[key], item)) {
        //                 const element = data[key][item];
        //                 if (element) {
        //                     res = element.toString().toUpperCase().includes(searchText);
        //                     if (res) {
        //                         result.push(data[key]);
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //     }

        // }
        return result;
    }
   async handleKeyChange(event) {
       // window.clearTimeout(this.delayTimeout);
        var searchKey = event.detail.data.searchKey.toUpperCase();
        if(searchKey){
            //this.dispatchEvent(new CustomEvent('listenfromchild', {detail: { list: JSON.stringify(this.records), sKey: searchKey}}));
                this.controlPagination = hideIt;
                this.setPaginationControls();
                this.recordsToDisplay = await this.searchResult(searchKey, JSON.stringify(this.records));
                this.dispatchEvent(new CustomEvent('paginatorchange', {detail: JSON.stringify(this.recordsToDisplay)})); //Send records to display on table to the parent component
        }else{
            this.controlPagination = showIt;
            this.setRecordsToDisplay();
        } 
         
    }

    @api handleDynamicSearch(searchK){
        var searchKey = searchK.toUpperCase();
        var searchRecords = JSON.stringify(this.records);
        var searchResults = [];
        if(searchKey){
          //  this.dispatchEvent(new CustomEvent('listenfromchild', {detail: { list: JSON.stringify(searchRecords), sKey: searchKey}}));
                this.controlPagination = hideIt;
                this.setPaginationControls();
                searchResults = this.searchResult(searchKey,searchRecords);
                this.recordsToDisplay = searchResults
                this.dispatchEvent(new CustomEvent('paginatorchange', {detail: JSON.stringify(this.recordsToDisplay)})); //Send records to display on table to the parent component
        }else{
            this.controlPagination = showIt;
            this.setRecordsToDisplay();
        } 
    }
}