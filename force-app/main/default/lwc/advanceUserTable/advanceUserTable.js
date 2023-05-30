/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api, track } from 'lwc';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import datepicker from "@salesforce/resourceUrl/calendar";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import {
  openEvents
} from 'c/utils';
import {validateDate} from 'c/commonLib';
// eslint-disable-next-line no-unused-vars
var flatpickdp = {};
var timepickdp = {};
export default class AdvanceUserTable extends LightningElement {
  @api selectViewList;
  @track _count = 0;
  currentDate;
  changeValue;
  currentTime;
  className;
  dropdownList;
  sortedColumn = 'tripdate';
  sortedDirection = 'asc';
  previousIcon = '';
  singleTrip = false;
  searchPreviousIcon = '';
  cssText = 'cPadding';
  cssPreviousText = 'cPadding';
  downloadIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Info/download.png';
  datepickerInitialized = false;
  contentLen = 0;
  rowElementId = '';
  keyFields = ["id", "name", "address"];
  @api placeholder;
  @api isSortable;
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
  @api norecordMessage;
  @track norecord = false;
  value = "";
  optVal = [
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6TEAQ"
      },
      "value": 2001129930,
      "Destination_Name__c": "avecia",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "avecia",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6UEAQ"
      },
      "value": 2001129932,
      "Destination_Name__c": "CES",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "avecia",
      "label": "CES",
      "Origin_Name__c": "avecia"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6VEAQ"
      },
      "value": 2001131927,
      "Destination_Name__c": "EB",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "EB",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6jEAA"
      },
      "value": 2001118716,
      "Destination_Name__c": "Home",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Project Andover",
      "label": "Home",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6kEAA"
      },
      "value": 2001118721,
      "Destination_Name__c": "Project",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "Project Andover",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6lEAA"
      },
      "value": 2001118724,
      "Destination_Name__c": "Home",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Project Andover",
      "label": "Home",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6mEAA"
      },
      "value": 2001118728,
      "Destination_Name__c": "Project",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "Project Andover",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6nEAA"
      },
      "value": 2001118733,
      "Destination_Name__c": "Home",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Project Andover",
      "label": "Home",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7PEAQ"
      },
      "value": 2001120968,
      "Destination_Name__c": "798 Mill St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "51 County Rd, Mattapoisett, MA 02739",
      "label": "798 Mill St, Marion, MA 02738",
      "Origin_Name__c": "51 County Rd"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7QEAQ"
      },
      "value": 2001121763,
      "Destination_Name__c": "1180 Innovation Way",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "798 Mill St, Marion, MA 02738",
      "label": "1180 Innovation Way, Fall River, MA 02720",
      "Origin_Name__c": "798 Mill St"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7REAQ"
      },
      "value": 2001122232,
      "Destination_Name__c": "6 Christopher St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "1180 Innovation Way, Fall River, MA 02720",
      "label": "6 Christopher St, South Kingstown, RI 02879",
      "Origin_Name__c": "1180 Innovation Way"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7NEAQ"
      },
      "value": 2001120557,
      "Destination_Name__c": "798 Mill St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Christopher Street, Wakefield-Peacedale, RI 02879",
      "label": "798 Mill St, Marion, MA 02738",
      "Origin_Name__c": "Christopher Street"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7OEAQ"
      },
      "value": 2001120938,
      "Destination_Name__c": "51 County Rd",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "798 Mill St, Marion, MA 02738",
      "label": "51 County Rd, Mattapoisett, MA 02739",
      "Origin_Name__c": "798 Mill St"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7WEAQ"
      },
      "value": 2001124620,
      "Destination_Name__c": "6 Christopher St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "61 County Rd, Mattapoisett, MA 02739",
      "label": "6 Christopher St, South Kingstown, RI 02879",
      "Origin_Name__c": "61 County Rd"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7XEAQ"
      },
      "value": 2001125009,
      "Destination_Name__c": "154 Wethersfield Dr",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "6 Christopher St, South Kingstown, RI 02879",
      "label": "154 Wethersfield Dr, Warwick, RI 02886",
      "Origin_Name__c": "6 Christopher St"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r00000y5ppeEAA"
      },
      "value": 200918820,
      "Destination_Name__c": "Pacific Commons Shopping Center",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "2942–2998 Cheswycke Terr, Fremont, CA  94536",
      "label": "Pacific Commons Shopping Center, 43621 Pacific Commons Blvd, Fremont, CA  94538",
      "Origin_Name__c": "2942–2998 Cheswycke Terr"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6cEAA"
      },
      "value": 2001144931,
      "Destination_Name__c": "Home",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "EB",
      "label": "Home",
      "Origin_Name__c": "EB"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6dEAA"
      },
      "value": 2001099879,
      "Destination_Name__c": "C.E.S",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Project Andover",
      "label": "C.E.S",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6bEAA"
      },
      "value": 2001144925,
      "Destination_Name__c": "EB",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "EB",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6oEAA"
      },
      "value": 2001118740,
      "Destination_Name__c": "Project",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "Project Andover",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6pEAA"
      },
      "value": 2001118742,
      "Destination_Name__c": "Home",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Project Andover",
      "label": "Home",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6qEAA"
      },
      "value": 2001118748,
      "Destination_Name__c": "Home",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Project Andover",
      "label": "Home",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6rEAA"
      },
      "value": 2001118746,
      "Destination_Name__c": "Project",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Home",
      "label": "Project Andover",
      "Origin_Name__c": "Home"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv6sEAA"
      },
      "value": 2001118750,
      "Destination_Name__c": "Home",
      "Trip_Origin__c": "Project Andover",
      "label": "Home",
      "Origin_Name__c": "Project"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7AEAQ"
      },
      "value": 2001113460,
      "Destination_Name__c": "Unnamed Road",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "375 Armistice Blvd, Pawtucket, RI 02861",
      "label": "Unnamed Road, Attleboro, MA 02703",
      "Origin_Name__c": "375 Armistice Blvd"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7BEAQ"
      },
      "value": 2001113640,
      "Destination_Name__c": "6 Christopher St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Unnamed Road, Attleboro, MA 02703",
      "label": "6 Christopher St, South Kingstown, RI 02879",
      "Origin_Name__c": "Unnamed Road"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7CEAQ"
      },
      "value": 2001113965,
      "Destination_Name__c": "798 Mill St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "6 Christopher St, South Kingstown, RI 02879",
      "label": "798 Mill St, Marion, MA 02738",
      "Origin_Name__c": "6 Christopher St"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7DEAQ"
      },
      "value": 2001115769,
      "Destination_Name__c": "72 Newport Ave",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "798 Mill St, Marion, MA 02738",
      "label": "72 Newport Ave, East Providence, RI 02916",
      "Origin_Name__c": "798 Mill St"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7EEAQ"
      },
      "value": 2001115980,
      "Destination_Name__c": "Pawtucket",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "72 Newport Ave, East Providence, RI 02916",
      "label": "Pawtucket, Pawtucket, RI 02861",
      "Origin_Name__c": "72 Newport Ave"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7FEAQ"
      },
      "value": 2001116870,
      "Destination_Name__c": "704 Thacher St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Pawtucket, Pawtucket, RI 02861",
      "label": "704 Thacher St, Attleboro, MA 02703",
      "Origin_Name__c": "Pawtucket"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7GEAQ"
      },
      "value": 2001117039,
      "Destination_Name__c": "Christopher Street",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "704 Thacher St, Attleboro, MA 02703",
      "label": "Christopher Street, Wakefield-Peacedale, RI 02879",
      "Origin_Name__c": "704 Thacher St"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7HEAQ"
      },
      "value": 2001117425,
      "Destination_Name__c": "263 Jenckes Hill Rd",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "Christopher Street, Wakefield-Peacedale, RI 02879",
      "label": "263 Jenckes Hill Rd, Lincoln, RI 02865",
      "Origin_Name__c": "Christopher Street"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7IEAQ"
      },
      "value": 2001118532,
      "Destination_Name__c": "622 George Washington Hwy",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "263 Jenckes Hill Rd, Lincoln, RI 02865",
      "label": "622 George Washington Hwy, Lincoln, RI 02865",
      "Origin_Name__c": "263 Jenckes Hill Rd"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7SEAQ"
      },
      "value": 2001123327,
      "Destination_Name__c": "425 Nathan Ellis Highway",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "6 Christopher Street, Wakefield-Peacedale, RI 02879",
      "label": "425 Nathan Ellis Highway, Mashpee, MA 02649",
      "Origin_Name__c": "6 Christopher Street"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7TEAQ"
      },
      "value": 2001123745,
      "Destination_Name__c": "1196 Sandwich Rd",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "425 Nathan Ellis Hwy, Mashpee, MA 02649",
      "label": "1196 Sandwich Rd, Falmouth, MA 02536",
      "Origin_Name__c": "425 Nathan Ellis Hwy"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7UEAQ"
      },
      "value": 2001123768,
      "Destination_Name__c": "798 Mill St",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "1196 Sandwich Rd, Falmouth, MA 02536",
      "label": "798 Mill St, Marion, MA 02738",
      "Origin_Name__c": "1196 Sandwich Rd"
    },
    {
      "attributes": {
        "type": "Employee_Mileage__c",
        "url": "/services/data/v55.0/sobjects/Employee_Mileage__c/a0B3r000013rv7VEAQ"
      },
      "value": 2001124569,
      "Destination_Name__c": "61 County Rd",
      "listclass": "slds-listbox__item",
      "Trip_Origin__c": "798 Mill St, Marion, MA 02738",
      "label": "61 County Rd, Mattapoisett, MA 02739",
      "Origin_Name__c": "798 Mill St"
    }
  ]
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

  @api searchByKey(_keyValue) {
    if (_keyValue && _keyValue.length > 0) {
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
    } else {
      this.search = false;
      this.norecord = false;
      this.sortedDirection = this.previousIcon;
      this.pagedData = this.modelData;
    }
    this.displaySortIcon(this.sortedColName, this.sortedDirection);
    this.gotoPage(this.currentPage, this.pagedData)
  }

  @api  openForm(){
     this.singleTrip = true;
  }

  calculateDistance(){
   // this.template.querySelector('c-distance-query').getDistance();
  }

  validateField(event){
    event.target.value = event.target.value
    .replace(/[^\d.]/g, '')             // numbers and decimals only
    .replace(/(^\.*)\./g, '$1')          // single dot retricted
    .replace(/(\..*)\./g, '$1')          // decimal can't exist more than once
    .replace(/(\.[\d]{2})./g, '$1');    // not more than 2 digits after decimal
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
      pageBlock.forEach(item => {
        if (item.dataset.id) {
          // eslint-disable-next-line radix
          if (parseInt(item.dataset.id) === nextPage) {
            item.classList.add('active')
          } else {
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
      pageBlock.forEach(item => {
        if (item.dataset.id) {
          // eslint-disable-next-line radix
          if (parseInt(item.dataset.id) === nextPage) {
            item.classList.add('active')
          } else {
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

  totalPages(maxPage) {
    var j;
    for (j = 1; j <= maxPage; j++) {
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

  getTotalMileage() {
    let data = this.proxyToObj(this.modelData);
    let totalAmt = 0;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        totalAmt = totalAmt + parseFloat(data[i].mileage);
      }
    }
    return totalAmt;
  }

  editLocation(event){
    console.log(this.changeValue)
    let locate = event.currentTarget ? event.currentTarget.dataset.label : '';
    locate = (this.changeValue === undefined) ? locate : this.changeValue;
    let locationValue = this.template.querySelector('c-select2-dropdown').getLocationId(locate);
    this.dispatchEvent(
      new CustomEvent("editlocation", {
        detail: JSON.stringify(locationValue)
      })
    );
    console.log("Val----", JSON.stringify(locationValue),  event.currentTarget.dataset.label)
    console.log("location name----", locationValue.name)
    console.log("location address----", locationValue.address)
    console.log("location id----", locationValue.id)
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
        // a[colName] = (a[colName].indexOf('$') > -1) ? a[colName].replace(/\$/g, "") : a[colName];
        // b[colName] = (b[colName].indexOf('$') > -1) ? b[colName].replace(/\$/g, "") : b[colName];
        a = (a[colName] == null || a[colName] === 'null') ? '' : parseFloat(a[colName])
        b = (b[colName] == null || b[colName] === 'null') ? '' : parseFloat(b[colName])
        return a > b ? 1 * isReverse : -1 * isReverse;
      }
      if (colType === "Integer") {
        // eslint-disable-next-line radix
        a = (a[colName] == null || a[colName] === 'null') ? '' : parseInt(a[colName])
        // eslint-disable-next-line radix
        b = (b[colName] == null || b[colName] === 'null') ? '' : parseInt(b[colName])
        return a > b ? 1 * isReverse : -1 * isReverse;
      }
      if (colType === "Date") {
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
    } else {
      this.searchPreviousIcon = this.sortedDirection
    }
    this.sortedColName = colName;
    this.displaySortIcon(colName, this.sortedDirection);
    this.gotoPage(this.currentPage, this.pagedData);
  }

  defaultSort(column, type) {
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
      if (colType === "Date") {
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
    } else {
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


  filterList(data, keyFields){
    console.log(data)
    data.forEach(element => {
      let model = [];
      for (const key in element) {
          if (Object.prototype.hasOwnProperty.call(element, key)) {
              let singleValue = {}
              if (keyFields.includes(key) !== false) {
                  singleValue.id = (key === 'id' ) ? element[key] : '';
                  singleValue.label = (key === 'name' || key === 'address') ? element[key] : '';
                  singleValue.value = (key === 'id' ) ? element[key] : '';
                  model.push(singleValue);
              }
          }
      }
      this.dropdownList = model;
      console.log("Filtered", JSON.stringify(this.dropdownList))
    });
  }


  proxyToObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  proxyToObject(e) {
    return JSON.parse(e)
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getDatasetId(event){
    console.log("Trigger--->",event.detail.value);
  }

  getDatasetLocationId(event){
    console.log("Trigger from to--->",event.detail.value);
  }


 async connectedCallback() {
    // Initialize data table to the specified current page (should be 1)
  //  console.log("Trip", JSON.stringify(this.modelData))
    this.currentDate = validateDate(new Date());
    let time = new Date();
    this.currentTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    this.contentLen = this.modelData.length;
    this.className = (this.scrollable) ? 'slds-scrollable_y slds-p-right_small slds-p-left_small' : 'slds-p-right_small slds-p-left_small';
    // this.dropdownList  = this.proxyToObject(this.selectViewList);
    // this.filterList(JSON.parse(this.dropdownList), this.keyFields)
   // console.log(this.dropdownList ,typeof(this.dropdownList), JSON.parse(this.dropdownList))
    if (this.isPaginate) {
      this.sortedColumn = this.columns[0].colName;
      this.gotoPage(this.currentPage, this.modelData);
      this.totalPages(this.maxPages);
    } else {
      this.pagedData = [];
      this.pagedData = this.modelData;
    }

    if (!this.modelData.length) {
      this.norecord = true;
      this.nopagedata = true;
    }

    if (this.modelData.length > 8) {
      this.searchVisible = true;
    } else {
      this.searchVisible = false;
    }
  }

  intializeDatepickup(){
      let $jq = jQuery.noConflict();
      let $input = $jq(this.template.querySelectorAll('.date-selector'))
      console.log($input.length)
      $input.each(function() {
            let _self2 = $jq(this)
            let $btn = $jq(this).next()
            $jq(this).datepicker({

              // inline mode
              inline: false,

              // additional CSS class
              classes: 'flatpickr-cal',

              // language
              language: 'en',

              // start date
              startDate: new Date(),
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
              keyboardNav: true,

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
                  // console.log('explain:', date, formattedDate, dpicker, _self2.val());
                  // console.log('selected date', date);
              },
              
              onShow: function (dp, animationCompleted) {
              //_self.value = dp.$el.val()
              if (!animationCompleted) {
                if (dp.$datepicker.find('span.datepicker--close--button').html()===undefined) { /*ONLY when button don't existis*/
                    dp.$datepicker.find('div.datepicker--buttons').append('<span  class="datepicker--close--button">Close</span>');
                    dp.$datepicker.find('span.datepicker--close--button').click(function() {
                      dp.hide();
                    });
                    //_self.value = dp.$el.val();
                  //dp.show();
                  // dp.selectDate(new Date(_self2.val()));
                  //console.log("flat date---",dp.$el, dp, dp.$el.val());
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
            }).data('datepicker').selectDate(new Date(_self2.val()))
            $btn.on('click', function(){
              _self2.focus();
            });
      })
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      //setTimeout(()=>{this.singleTrip = false}, 1000);
			//})
      // let $btn = $(this.template.querySelector('.input-button')),
      // $calInput = $(this.template.querySelectorAll('.date-selector')),
		  // dp = $calInput.datepicker({showEvent: 'none'}).data('datepicker');

			// $btn.on('click', function(){
			// 	dp.show();
			// 	$calInput.focus();
			// });
	}

  intializeTimepicker(){
    const timeDiv = this.template.querySelectorAll('.time-flatpickr');
    timeDiv.forEach((element) => {
      // if(element.value === ""){
      timepickdp = flatpickr(element, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        onChange: function(dateStr){
        //  instance.close();
          if(dateStr === null || dateStr === ''){
            element.value = dateStr
          }
        }
        // onChange: function (selectedDates, dateStr, instance) {
        //  // console.log(selectedDates, dateStr, instance);
        //   instance.close(); //Close datepicker on date select
        // }
        // locale: {
        //   firstDayOfWeek: 1 // start week on Monday
        // }
      });
      //}
    })
  }

  handleChangeDate(evt) {
    evt.preventDefault();
    const sDate = {
      dateString: evt.target.value,
      dateJs: flatpickdp.selectedDates
    };
    console.log("sDate", sDate.dateJs, sDate.dateString)
    evt.preventDefault();
  }

  handleChange(evt) {
    this.changeValue = evt.detail.value;
    console.log("changed---", evt.detail.value)
  }

  handleIncrement(){
   // if(this._count !== 0){
     // this._count += 1;
     this._count = Number((this._count + 1).toFixed(2))
      console.log("increment", this._count)
   // }
  }

  handleDecrement(){
    if(this._count !== 0){
      let x = this._count
      let int_part = Math.trunc(x); // returns 3
      let float_part = Number((x-int_part).toFixed(2))
      this._count = (int_part <= 0) ? int_part : Number(((int_part - 1) + float_part).toFixed(2));
      console.log("decrement", this._count)
    }
  }

  handleInputIncrement(event){
    console.log("event---", event.target.value)
    this._count = parseFloat(event.target.value)
  }

  handleChangeTime(evt){
    //evt.preventDefault();
    evt.preventDefault();
    // const sTime = {
    //   dateString: evt.target.value,
    //   dateJs: flatpickdp.selectedDates
    // };
    // console.log("sDate", sDate.dateJs, sDate.dateString)
    // evt.preventDefault();
    console.log("sDateTime", timepickdp, evt.target.value)
  }

 

  renderedCallback() {
    console.log('inside picker')
    let pageBlock
    if(this.datepickerInitialized){
      return;
    }
    pageBlock = this.template.querySelectorAll('.page-num-block');
    if (pageBlock) {
      pageBlock.forEach(item => {
        if (item.dataset.id) {
          // eslint-disable-next-line radix
          if (parseInt(item.dataset.id) === this.currentPage) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        }
      })
    }
    Promise.all([
      loadScript(this, datepicker + '/jquery3v.min.js'),
      loadScript(this, resourceImage + '/mburse/assets/datepicker/flatpickr.js'),
      loadStyle(this, resourceImage + '/mburse/assets/datepicker/customMinifiedDatePicker.css'),
      loadStyle(this, resourceImage + '/mburse/assets/datepicker/flatpickr.min.css'),
      loadScript(this, datepicker + '/popper.min.js'),
      loadScript(this, datepicker + '/datepicker.js'),
      loadScript(this, datepicker + '/datepicker.en.min.js'),
      loadStyle(this, datepicker + '/minifiedCustomDP.css'),
      loadStyle(this, datepicker + '/datepicker.css')
    ])
      .then(() => {
       // this.datepickerInitialized = true;
        this.intializeTimepicker();
        this.intializeDatepickup();
        console.log("script loaded")
      }).catch(error => {
        console.log(JSON.stringify(error.message), error);
      })

  }



  handleDownload(event) {
    event.stopPropagation();
    openEvents(this, event.currentTarget.dataset.key);
  }

  previewTrip(event) {
    // data-id of row <tr> -- >
    event.stopPropagation();
    this.singleTrip = false;
    this.changeValue = undefined;
    let count = 0;
    let targetId = event.currentTarget.dataset.id;
   // if(this.rowElementId !== targetId){
      console.log("target", targetId, this.template.querySelectorAll(
        `[data-id="${targetId}"],.content_view`
      ))
      // Display list of rows with class name 'content'
      let row = this.template.querySelectorAll(
        `[data-id="${targetId}"],.content_view`
      );
  
      for (let i = 0; i < row.length; i++) {
        let view = row[i];
        if (
          view.className === "row collapsible"
        ) {
          if (targetId === view.dataset.id) {
           // if (view.style.display === "table-row" || view.style.display === "")
              view.classList.add('active');
          } else {view.classList.remove('active')};
        } else if (view.className === "row content_view") {
          count ++;
          if (targetId === view.dataset.id) {
            if (view.style.display === "table-row") { view.classList.remove('active'); view.style.display = "none";}
            else {  view.classList.add('active'); view.style.display = "table-row"; }
          }
        }
      }
      this.dispatchEvent(
        new CustomEvent("disable", {
          detail: count
        })
      );
      //this.rowElementId = targetId;
   // }
   
  }

  closeSingleTrip(){
    this.singleTrip = false;
  }

  closeTrip(event) {
    event.stopPropagation();
    // data-id of row <tr> -- >
    this.rowElementId  = '';
    let targetId = event.currentTarget.dataset.id;
    console.log("target", targetId, this.template.querySelectorAll(
      `[data-id="${targetId}"],.content_view`
    ))
    // Display list of rows with class name 'content'
    let row = this.template.querySelectorAll(
      `[data-id="${targetId}"],.content_view`
    );

    let count = 0;

    for (let i = 0; i < row.length; i++) {
      let view = row[i];
      if (
        view.className === "row collapsible active"
      ) {
        if (targetId === view.dataset.id) {
         // if (view.className === "table-row" || view.style.display === "")
            view.classList.remove('active');
        }else {view.classList.add('active')};
      } else if (view.className === "row content_view active") {
        count ++;
        if (targetId === view.dataset.id) {
          count = count - 1;
          if (view.style.display === "table-row")  { view.classList.remove('active'); view.style.display = "none";}
          else { view.classList.add('active'); view.style.display = "table-row"; }
        }
      }
    }
   
    this.dispatchEvent(
      new CustomEvent("disable", {
        detail: count
      })
    );
  }
}