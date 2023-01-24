/* eslint-disable @lwc/lwc/no-api-reassignments */
/* eslint-disable no-useless-escape */
import { LightningElement, api, track } from "lwc";
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getAllReimbursements from "@salesforce/apex/DriverDashboardLWCController.getAllReimbursements";
import getMileages  from '@salesforce/apex/DriverDashboardLWCController.getMileages';
import getMileagesData from '@salesforce/apex/DriverDashboardLWCController.getMileagesData';
import getBiweekMileages  from '@salesforce/apex/DriverDashboardLWCController.getBiweekMileages';
import getAllMileages  from '@salesforce/apex/DriverDashboardLWCController.getAllMileages';
import biweeklyMileage from "@salesforce/apex/DriverDashboardLWCController.biweeklyMileage";
import TimeAttendance from "@salesforce/apex/DriverDashboardLWCController.TimeAttendance";
import getMileagesBasedTandAtt from "@salesforce/apex/DriverDashboardLWCController.getMileagesBasedTandAtt";
import {
  events, toastEvents
} from 'c/utils';
export default class AccordionView extends LightningElement {
  @api accordionData;
  @api contactId;
  @api accountId;
  @api contactInfo;
  @api isTandA;
  @api hrClass;
  @api  isDownloadAll;
  @api showArrowIcon;
  defaultYear = '';
  isScrollable = false;
  listVisible = false;
  isRowDn = true;
  sortable =  false;
  name;
  @track accordionList = [];
  accordionKeyFields;
  accordionListColumn;
  paginated = false;
  keyFields;
  isPayperiod = false;
  column;
  _RkeyFields;
  _Rcolumn;
  downloadIcon = resourceImage + '/mburse/assets/mBurse-Icons/download-all.png';
  proxyToObject(e) {
    return JSON.parse(e);
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

  sortByMonthDesc(data, colName) {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    data.sort((a, b) => {
      return months.indexOf(b[colName]) - months.indexOf(a[colName]);
    });
    return data;
  }

  sortByDateDesc(data, colName) {
    data.sort((a, b) => {
      a = a[colName] ? new Date(a[colName].toLowerCase()) : "";
      b = b[colName] ? new Date(b[colName].toLowerCase()) : "";
      return a > b ? -1 : 1;
    });
    return data;
  }

  dynamicBinding(data, keyFields) {
    data.forEach((element) => {
      let model = [];
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          let singleValue = {};
          if (keyFields.includes(key) !== false) {
            if (this.contactInfo.Biweek_Reimbursement__c) {
              singleValue.id = element.biweekId;
              singleValue.eDate = element.endDate;
              singleValue.sDate = element.startDate ;
            }
            singleValue.key = key;
            singleValue.value = (element[key] === "null" || element[key] === null) ? "" : (key === "variableRate" || key === "varibleAmount" || key === 'fixed1' || key === 'fixed2' || 
            key === 'fixed3' || 
            key === 'totalFixedAmount' || key === "totalReimbursements") ? element[key].replace(/\$/g, "").replace(/\s/g, "") : element[key];
            singleValue.icon = (!this.isTandA) ? (key === "month" || key === "startDate") ? true : false : false;
            singleValue.bold = (key === "totalReimbursements" || key === "totalReim") ? true : false;
            singleValue.twoDecimal = (key === "mileage" ) ? true : false;
            singleValue.isDate = (key === "startDate" || key === "endDate") ? true : false;
            singleValue.isfourDecimalCurrency = (key === 'variableRate' || key === 'VariableRate') ? true : false;
            singleValue.istwoDecimalCurrency = (key === "fuel" ||
                  key === "fixedAmount" ||
                  key === "totalReimbursements" ||
                  key === "varibleAmount" ||
                  key === "totalReim" ||
                  key === "variable") ? true : false;
             singleValue.hasLeadingZero = ((key === "fuel" ||
                key === "fixedAmount" ||
                key === "totalReimbursements" ||
                key === "variableRate" ||
                key === "varibleAmount" ||
                key === "totalReim" ||
                key === "variable" || key === "mileage" ||
                key === "fixed1" || key === "fixed2" ||
                key === "fixed3") && ((element[key] !== "null" || element[key] !== null) && (singleValue.value !== '0.00') && (singleValue.value !== '0.0000')) && (/^0+/).test(singleValue.value) === true) ? (singleValue.value).replace(/^0+/, '') : null;
            singleValue.isDate = (key === "startDate" || key === "endDate") ? true : false;
            model.push(singleValue);
          }
        }
      }

      if(!this.isTandA){
        if (this.contactInfo.Biweek_Reimbursement__c) {
          element.id = element.biweekId;
        }else{
          element.id = element.employeeReimbursementId;
        }
      }

      element.keyFields = this.mapOrder(model, keyFields, "key");
    });
  }

  filter(data, keyId){
    let object
    data.forEach(e => {
        if(e.id === keyId){
          object = e
        }
      })
      return object
  }

  getBiweekReimbursement(viewList, yearTo) {
    if (viewList) {
      // this.dispatchEvent(
      //   new CustomEvent("show", {
      //     detail: "isShow"
      //   })
      // );
      this._RkeyFields = [
        "startDate",
        "endDate",
        "mileage",
        "variableRate",
        "variable",
        "totalReim"
      ];
      this._Rcolumn = [
        {
          id: 1,
          name: "Start Date",
          colName: "startDate"
        },
        {
          id: 2,
          name: "End Date",
          colName: "endDate"
        },
        {
          id: 3,
          name: "Mileage",
          colName: "mileage"
        },
        {
          id: 4,
          name: "Mi Rate",
          colName: "variableRate"
        },
        {
          id: 5,
          name: "Variable",
          colName: "variable"
        },
        {
          id: 6,
          name: "Total",
          colName: "totalReim"
        }
      ];

      this.keyFields = this._RkeyFields;
      this.column = this._Rcolumn;
    }
    if (this.keyFields !== undefined && this.column !== undefined) {
      biweeklyMileage({
        conId: this.contactId,
        year: yearTo
      })
        .then((result) => {
          let resultBiweek = this.proxyToObject(result);
          this.accordionList = this.sortByDateDesc(resultBiweek, "startDate");
          this.listVisible = this.accordionList.length > 0 ? true : false;
          this.isDownloadAll = this.accordionList.length > 0 ? true : false;
          this.accordionListColumn = this.column;
          this.accordionKeyFields = this.keyFields;
          this.dynamicBinding(this.accordionList, this.accordionKeyFields);
          const accordionItem =
          this.template.querySelectorAll(".accordion-item");
          accordionItem.forEach((el) =>
            el.addEventListener("click", () => {
              if (el.classList.contains("active")) {
                if(this.showArrowIcon){
                  el.classList.remove("active");
                  this.isDownloadAll = false;
                  this.hrClass = false;
                }
              } else {
                accordionItem.forEach((el2) =>  {
                  if(this.showArrowIcon){
                    el2.classList.remove("active");
                    this.isDownloadAll = false;
                    this.hrClass = false;
                  }
                });
                el.classList.add("active");
                this.isDownloadAll = true;
                this.hrClass = true;
              }
            })
          );
          console.log("getBiweekReimbursement ----", result);
          this.dispatchEvent(
            new CustomEvent("show", {
              detail: "isHide"
            })
          );
        })
        .catch((error) => {
          console.log("getBiweekReimbursement error", error);
        });
    }
  }

  getReimbursementFromApex(viewList, yearTo) {
    if (viewList) {
      // this.dispatchEvent(
      //   new CustomEvent("show", {
      //     detail: "isShow"
      //   })
      // );
      this.defaultYear = yearTo;
      if (viewList.Bi_Week_Fixed_Amount__c) {
        /* Bi-weekly fixed and Monthly variable */
        this._RkeyFields = [
          "month",
          "fuel",
          "mileage",
          "variableRate",
          "varibleAmount",
          "fixed1",
          "fixed2",
          "fixed3",
          "totalReimbursements"
        ];
        this._Rcolumn = [
          {
            id: 1,
            name: "Month",
            colName: "month"
          },
          {
            id: 2,
            name: "Fuel",
            colName: "fuel"
          },
          {
            id: 3,
            name: "Mileage",
            colName: "mileage"
          },
          {
            id: 4,
            name: "Mi Rate",
            colName: "variableRate"
          },
          {
            id: 5,
            name: "Variable",
            colName: "varibleAmount"
          },
          {
            id: 6,
            name: "Fixed 1",
            colName: "fixed1"
          },
          {
            id: 7,
            name: "Fixed 2",
            colName: "fixed2"
          },
          {
            id: 8,
            name: "Fixed 3",
            colName: "fixed3"
          },
          {
            id: 9,
            name: "Total",
            colName: "totalReimbursements"
          }
        ];

        this.keyFields = this._RkeyFields;
        this.column = this._Rcolumn;
      } else if (viewList.Monthly_Reimbursement__c) {
        /* Monthly fixed and variable */
        this._RkeyFields = [
          "month",
          "fuel",
          "mileage",
          "variableRate",
          "varibleAmount",
          "fixedAmount",
          "totalReimbursements"
        ];
        this._Rcolumn = [
          {
            id: 1,
            name: "Month",
            colName: "month"
          },
          {
            id: 2,
            name: "Fuel",
            colName: "fuel"
          },
          {
            id: 3,
            name: "Mileage",
            colName: "mileage"
          },
          {
            id: 4,
            name: "Mi Rate",
            colName: "variableRate"
          },
          {
            id: 5,
            name: "Variable",
            colName: "varibleAmount"
          },
          {
            id: 6,
            name: "Fixed",
            colName: "fixedAmount"
          },
          {
            id: 7,
            name: "Total",
            colName: "totalReimbursements"
          }
        ];

        this.keyFields = this._RkeyFields;
        this.column = this._Rcolumn;
      } else {
        /* Monthly mileage rate */
        this._RkeyFields = [
          "month",
          "mileage",
          "variableRate",
          "varibleAmount",
          "totalReimbursements"
        ];
        this._Rcolumn = [
          {
            id: 1,
            name: "Month",
            colName: "month"
          },
          {
            id: 2,
            name: "Mileage",
            colName: "mileage"
          },
          {
            id: 3,
            name: "Mi Rate",
            colName: "variableRate"
          },
          {
            id: 4,
            name: "Variable",
            colName: "varibleAmount"
          },
          {
            id: 5,
            name: "Total",
            colName: "totalReimbursements"
          }
        ];

        this.keyFields = this._RkeyFields;
        this.column = this._Rcolumn;
      }
    }

    if (this.keyFields !== undefined && this.column !== undefined) {
      getAllReimbursements({
        year: yearTo,
        contactId: this.contactId,
        accountId: this.accountId
      })
        .then((result) => {
          let reimbursementList = this.proxyToObject(result[0]);
          this.accordionList = this.sortByMonthDesc(reimbursementList, "month");
          this.listVisible = this.accordionList.length > 0 ? true : false;
          this.isDownloadAll = this.accordionList.length > 0 ? true : false;
          this.accordionListColumn = this.column;
          this.accordionKeyFields = this.keyFields;
          this.dynamicBinding(this.accordionList, this.accordionKeyFields);
          const accordionItem =
            this.template.querySelectorAll(".accordion-item");
            accordionItem.forEach((el) =>
              el.addEventListener("click", () => {
                if (el.classList.contains("active")) {
                  if(this.showArrowIcon){
                    el.classList.remove("active");
                    this.hrClass = false;
                    this.isDownloadAll = false;
                    this.listVisible = false;
                  }
             
                } else {
                  accordionItem.forEach((el2) =>  {
                    if(this.showArrowIcon){
                      el2.classList.remove("active");
                      this.hrClass = false;
                      this.isDownloadAll = false;
                      this.listVisible = false;
                    }
                  });
                  el.classList.add("active");
                  this.hrClass = true;
                  this.isDownloadAll = true;
                }
              })
            );
          console.log("getAllReimbursements ----", result, this.hrClass);
          this.dispatchEvent(
            new CustomEvent("show", {
              detail: "isHide"
            })
          );
        })
        .catch((error) => {
          console.log("getAllReimbursements error", error);
        });
    }
  }

  getBiweekReim(viewList, yearTo) {
    this.defaultYear = yearTo;
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "isShow"
      })
    );
    if (viewList) {
      this._RkeyFields = [
        "startDate",
        "endDate",
        "mileage",
        "variableRate",
        "variable",
        "totalReim"
      ];
      this._Rcolumn = [
        {
          id: 1,
          name: "Start Date",
          colName: "startDate"
        },
        {
          id: 2,
          name: "End Date",
          colName: "endDate"
        },
        {
          id: 3,
          name: "Mileage",
          colName: "mileage"
        },
        {
          id: 4,
          name: "Mi Rate",
          colName: "variableRate"
        },
        {
          id: 5,
          name: "Variable",
          colName: "variable"
        },
        {
          id: 6,
          name: "Total",
          colName: "totalReim"
        }
      ];

      this.keyFields = this._RkeyFields;
      this.column = this._Rcolumn;
    }
    if (this.keyFields !== undefined && this.column !== undefined) {
      biweeklyMileage({
        conId: this.contactId,
        year: yearTo
      })
        .then((result) => {
          let resultBiweek = this.proxyToObject(result);
          this.accordionList = this.sortByDateDesc(resultBiweek, "startDate");
          this.listVisible = this.accordionList.length > 0 ? true : false;
          this.isDownloadAll = this.accordionList.length > 0 ? true : false;
          this.accordionListColumn = this.column;
          this.accordionKeyFields = this.keyFields;
          this.dynamicBinding(this.accordionList, this.accordionKeyFields);
          this.dispatchEvent(
            new CustomEvent("show", {
              detail: "isHide"
            })
          );
          console.log("getBiweekReimbursement ----", result);
        })
        .catch((error) => {
          console.log("getBiweekReimbursement error", error);
        });
    }
  }

  getReimbursement(viewList, yearTo) {
    this.defaultYear = yearTo;
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "isShow"
      })
    );
    if (viewList) {
      if (viewList.Bi_Week_Fixed_Amount__c) {
        /* Bi-weekly fixed and Monthly variable */
        this._RkeyFields = [
          "month",
          "fuel",
          "mileage",
          "variableRate",
          "varibleAmount",
          "fixed1",
          "fixed2",
          "fixed3",
          "totalReimbursements"
        ];
        this._Rcolumn = [
          {
            id: 1,
            name: "Month",
            colName: "month"
          },
          {
            id: 2,
            name: "Fuel",
            colName: "fuel"
          },
          {
            id: 3,
            name: "Mileage",
            colName: "mileage"
          },
          {
            id: 4,
            name: "Mi Rate",
            colName: "variableRate"
          },
          {
            id: 5,
            name: "Variable",
            colName: "varibleAmount"
          },
          {
            id: 6,
            name: "Fixed 1",
            colName: "fixed1"
          },
          {
            id: 7,
            name: "Fixed 2",
            colName: "fixed2"
          },
          {
            id: 8,
            name: "Fixed 3",
            colName: "fixed3"
          },
          {
            id: 9,
            name: "Total",
            colName: "totalReimbursements"
          }
        ];

        this.keyFields = this._RkeyFields;
        this.column = this._Rcolumn;
      } else if (viewList.Monthly_Reimbursement__c) {
        /* Monthly fixed and variable */
        this._RkeyFields = [
          "month",
          "fuel",
          "mileage",
          "variableRate",
          "varibleAmount",
          "fixedAmount",
          "totalReimbursements"
        ];
        this._Rcolumn = [
          {
            id: 1,
            name: "Month",
            colName: "month"
          },
          {
            id: 2,
            name: "Fuel",
            colName: "fuel"
          },
          {
            id: 3,
            name: "Mileage",
            colName: "mileage"
          },
          {
            id: 4,
            name: "Mi Rate",
            colName: "variableRate"
          },
          {
            id: 5,
            name: "Variable",
            colName: "varibleAmount"
          },
          {
            id: 6,
            name: "Fixed",
            colName: "fixedAmount"
          },
          {
            id: 7,
            name: "Total",
            colName: "totalReimbursements"
          }
        ];

        this.keyFields = this._RkeyFields;
        this.column = this._Rcolumn;
      } else {
        /* Monthly mileage rate */
        this._RkeyFields = [
          "month",
          "mileage",
          "variableRate",
          "varibleAmount",
          "totalReimbursements"
        ];
        this._Rcolumn = [
          {
            id: 1,
            name: "Month",
            colName: "month"
          },
          {
            id: 2,
            name: "Mileage",
            colName: "mileage"
          },
          {
            id: 3,
            name: "Mi Rate",
            colName: "variableRate"
          },
          {
            id: 4,
            name: "Variable",
            colName: "varibleAmount"
          },
          {
            id: 5,
            name: "Total",
            colName: "totalReimbursements"
          }
        ];

        this.keyFields = this._RkeyFields;
        this.column = this._Rcolumn;
      }
    }

    if (this.keyFields !== undefined && this.column !== undefined) {
      getAllReimbursements({
        year: yearTo,
        contactId: this.contactId,
        accountId: this.accountId
      })
        .then((result) => {
          let reimbursementList = this.proxyToObject(result[0]);
          this.accordionList = this.sortByMonthDesc(reimbursementList, "month");
          this.listVisible = this.accordionList.length > 0 ? true : false;
          this.isDownloadAll = this.accordionList.length > 0 ? true : false;
          this.accordionListColumn = this.column;
          this.accordionKeyFields = this.keyFields;
          this.dynamicBinding(this.accordionList, this.accordionKeyFields);
          this.dispatchEvent(
            new CustomEvent("show", {
              detail: "isHide"
            })
          );
          console.log("getAllReimbursements ----", result);
        })
        .catch((error) => {
          console.log("getAllReimbursements error", error);
        });
    }
  }

  getTAndA(viewList, yearTo){
    this.defaultYear = yearTo;
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "isShow"
      })
    );
    if (viewList) {
      this._RkeyFields = [
        "startDate",
        "endDate",
        "totaldrivingTime",
        "totalStayTime",
        "totalTime",
        "approvalDate"
      ];
      this._Rcolumn = [
        {
          id: 1,
          name: "Start Date",
          colName: "startDate"
        },
        {
          id: 2,
          name: "End Date",
          colName: "endDate"
        },
        {
          id: 3,
          name: "Drive Time",
          colName: "totaldrivingTime"
        },
        {
          id: 4,
          name: "Stay Time",
          colName: "totalStayTime"
        },
        {
          id: 5,
          name: "Total Time",
          colName: "totalTime"
        },
        {
          id: 6,
          name: "Approval Date",
          colName: "approvalDate"
        }
      ];

      this.keyFields = this._RkeyFields;
      this.column = this._Rcolumn;
    }
    if (this.keyFields !== undefined && this.column !== undefined) {
      TimeAttendance({
        conId: this.contactId,
        year: yearTo
      })
        .then((result) => {
          console.log("getTA ----", result);
          let resultTA= this.proxyToObject(result);
          this.accordionList = this.sortByDateDesc(resultTA, "startDate");
          this.listVisible = this.accordionList.length > 0 ? true : false;
          this.isDownloadAll = this.accordionList.length > 0 ? true : false;
          this.accordionListColumn = this.column;
          this.accordionKeyFields = this.keyFields;
          this.dynamicBinding(this.accordionList, this.accordionKeyFields);
          this.dispatchEvent(
            new CustomEvent("show", {
              detail: "isHide"
            })
          );
        })
        .catch((error) => {
          console.log("getTA error", error);
        });
    }
  }

  getTimeAndAttendance(viewList, yearTo) {
    if (viewList) {
      this.dispatchEvent(
        new CustomEvent("show", {
          detail: "isShow"
        })
      );
      this._RkeyFields = [
        "startDate",
        "endDate",
        "totaldrivingTime",
        "totalStayTime",
        "totalTime",
        "approvalDate"
      ];
      this._Rcolumn = [
        {
          id: 1,
          name: "Start Date",
          colName: "startDate"
        },
        {
          id: 2,
          name: "End Date",
          colName: "endDate"
        },
        {
          id: 3,
          name: "Drive Time",
          colName: "totaldrivingTime"
        },
        {
          id: 4,
          name: "Stay Time",
          colName: "totalStayTime"
        },
        {
          id: 5,
          name: "Total Time",
          colName: "totalTime"
        },
        {
          id: 6,
          name: "Approval Date",
          colName: "approvalDate"
        }
      ];

      this.keyFields = this._RkeyFields;
      this.column = this._Rcolumn;
    }
    if (this.keyFields !== undefined && this.column !== undefined) {
      TimeAttendance({
        conId: this.contactId,
        year: yearTo
      })
        .then((result) => {
          console.log("getTA ----", result);
          let resultTA= this.proxyToObject(result);
          this.accordionList = this.sortByDateDesc(resultTA, "startDate");
          this.listVisible = this.accordionList.length > 0 ? true : false;
          this.isDownloadAll = this.accordionList.length > 0 ? true : false;
          this.accordionListColumn = this.column;
          this.accordionKeyFields = this.keyFields;
          this.dynamicBinding(this.accordionList, this.accordionKeyFields);
         const accordionItem =
            this.template.querySelectorAll(".accordion-item");
          accordionItem.forEach((el) =>
            el.addEventListener("click", () => {
              if (el.classList.contains("active")) {
                if(this.showArrowIcon){
                  el.classList.remove("active");
                  this.hrClass = false;
                  this.isDownloadAll = false;
                  this.listVisible = false;
                }
              } else {
                accordionItem.forEach((el2) =>  {
                  if(this.showArrowIcon){
                    el2.classList.remove("active");
                    this.hrClass = false;
                    this.isDownloadAll = false;
                    this.listVisible = false;
                  }
                });
                el.classList.add("active");
                this.isDownloadAll = true;
                this.hrClass = true;
              }
            })
          );
          this.dispatchEvent(
            new CustomEvent("show", {
              detail: "isHide"
            })
          );
        })
        .catch((error) => {
          console.log("getTA error", error);
        });
    }
  }

  fetchReimbursement(event) {
      this.accordionList = [];
      let lastYear = event ? event.currentTarget.dataset.year : "";
      if(this.isTandA){
        this.getTAndA(
          this.contactInfo,
          lastYear
        );
      }else{
          if (!this.contactInfo.Biweek_Reimbursement__c) {
            this.getReimbursement(this.contactInfo, lastYear);
          } else {
            this.getBiweekReim(this.contactInfo, lastYear);
          }
      }
  }

  escapeSpecialChars(str){
    return str
    .replace(/\\'/g, "\'")
    .replace(/\\&#39;/g, "\'")
    .replace(/(&quot\;)/g,"\"");
}

  connectedCallback() {
    console.log("this.contactInfo.Biweek_Reimbursement__c", this.contactInfo.Biweek_Reimbursement__c, this.accordionData, JSON.stringify(this.accordionData))
    this.name = this.contactInfo;
    if(this.isTandA){
      if(this.accordionData){
        if(this.accordionData[0].yearName){
          this.getTimeAndAttendance(
            this.contactInfo,
            this.accordionData[0].yearName
          );
        }
      }
    }else{
      if (!this.contactInfo.Biweek_Reimbursement__c) {
        if(this.accordionData){
          if(this.accordionData[0].yearName){
            this.getReimbursementFromApex(
              this.contactInfo,
              this.accordionData[0].yearName
            );
          }
        }
      } else {
        this.isPayperiod = this.contactInfo.Biweek_Reimbursement__c;
        if(this.accordionData){
          if(this.accordionData[0].yearName){
            this.getBiweekReimbursement(
              this.contactInfo,
              this.accordionData[0].yearName
            );
          }
        }
      }
    }
  }

  compareArray(a, b) {
      var dateA = (a.startDate == null) ? '' : new Date(a.startDate.toLowerCase()),
          dateB = (b.startDate == null) ? '' : new Date(b.startDate.toLowerCase())
      if (dateA < dateB) {
          return -1;
      }
      if (dateA > dateB) {
          return 1;
      }
      return 0;
  }

  excelToExport(data, file, sheet){
    this.template.querySelector('c-export-excel').download(data, file, sheet);
  }

  downloadAllTrips(event){
    event.stopPropagation();
    if(this.isTandA){
      let exportDetailList = [];
      const downloadList = [...this.accordionList]; // does not mutuate original array
      downloadList.sort(this.compareArray);
      let lengthOfReimb = downloadList.length;
      let stDate = downloadList[0].startDate;
      let enDate = downloadList[lengthOfReimb - 1].endDate;
      getAllMileages({
        startdate: stDate,
        enddate: enDate,
        contactId: this.contactId
      }).then(result => {
        console.log(result);
        if (result != null) {
          if (result !== '') {
              let escapeChar = this.escapeSpecialChars(result[0]);
              let detailList = this.proxyToObject(escapeChar);
              if(detailList.length > 0){
                  let excelFileName = this.contactInfo.Name + '\'s Detail Report';
                  let excelSheetName = 'Detail Report';
                  exportDetailList.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Mi Rate", "Amount", "Drive Time", "Stay Time", "Total Time", "Notes", "Tags"]);
                  detailList.forEach(function (item) {
                    exportDetailList.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount, item.drivingtime, item.staytime, item.totaltime, item.notes, item.tag]);
                  });
                this.excelToExport(exportDetailList, excelFileName, excelSheetName)
              }else{
                toastEvents(this, 'No mileage')
              }
          }
          else {
            console.log("Error", result)
          }
      }
      }).catch(error=>{
        console.log("error", error)
      })
    }else{
      if(this.contactInfo.Biweek_Reimbursement__c){
        let exportReimDetailList = [];
        const downloadList = [...this.accordionList]; // does not mutuate original array
        downloadList.sort(this.compareArray);
        let lengthOfReimb = downloadList.length;
        let stDate = downloadList[0].startDate;
        let enDate = downloadList[lengthOfReimb - 1].endDate;
        getAllMileages({
          startdate: stDate,
          enddate: enDate,
          contactId: this.contactId
        }).then(result => {
          console.log(result);
          if (result != null) {
            if (result !== '') {
                let escapeChar = this.escapeSpecialChars(result[0]);
                let biDetailList = this.proxyToObject(escapeChar);
                if(biDetailList.length > 0){
                    let excelFileName = this.contactInfo.Name + '\'s Detail Report';
                    let excelSheetName = 'Detail Report';
                    exportReimDetailList.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Mi Rate", "Amount", "Fixed Amount", "Trip Type", "Drive Time", "Stay Time", "Total Time", "Notes", "Tags"]);
                    biDetailList.forEach(function (item) {
                        exportReimDetailList.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount, item.halfFixedAmount, item.tripActivity, item.drivingtime, item.staytime, item.totaltime, item.notes, item.tag]);
                    });
                  this.excelToExport(exportReimDetailList, excelFileName, excelSheetName)
                }else{
                  toastEvents(this, 'No mileage')
                }
            }
            else {
              console.log("Error", result)
            }
        }
        }).catch(error=>{
          console.log("error", error)
        })
      }else{
        let exportBiweekList = [];
        getMileagesData({
          // eslint-disable-next-line radix
          year: parseInt(this.defaultYear),
          contactId: this.contactId
        }).then(result => {
          console.log("result", result)
          if (result != null) {
            if (result !== '') {
                let biweekList = this.proxyToObject(result);
                if(biweekList.length > 0){
                  let fileName = this.contactInfo.Name + '\'s Detail Report';
                  let sheetName = 'Detail Report';
                  exportBiweekList.push(["Contact Email", "Month", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Mi Rate", "Amount", "Notes", "Tags"]);
                  biweekList.forEach(function (item) {
                    exportBiweekList.push([item.email, item.reimMonth, item.tracingStyle, item.dayOfWeek, item.tripDate, item.starttime, item.endtime, item.originName, item.destinationName, item.mileage, item.tripStatus, item.submitteddate, item.approvedDate, item.maintTyre, item.fuelVaraibleRate, item.varaibleRate, item.varaibleAmount, item.notes, item.tag]);
                  });
                  this.excelToExport(exportBiweekList, fileName, sheetName)
                }else{
                  toastEvents(this, 'No mileage')
                }
            }
            else {
              console.log("Error", result)
            }
        }
        }).catch(error=>{
          console.log("error", error)
        })
      }
    }
  }

  getTrips(event) {
    if (!this.contactInfo.Biweek_Reimbursement__c) {
      let tripDetail = {
        boolean: this.contactInfo.Biweek_Reimbursement__c,
        month: event.detail,
        year: this.defaultYear
      }
      //console.log('from table---', event.detail, this.defaultYear, tripDetail)
      events(this, tripDetail)
    }else{
      let tripList = {
        boolean : this.contactInfo.Biweek_Reimbursement__c,
        trip: event.detail
      }
      console.log('from table---', JSON.stringify(event.detail), this.contactInfo.Biweek_Reimbursement__c)
      events(this, tripList)
    }
  }

  dateTime(date){
    var yd, ydd,ymm, yy, hh, min ,sec;
    yd = date
    ydd = yd.getDate();
    ymm = yd.getMonth() + 1;
    yy = yd.getFullYear();
    hh = yd.getHours();
    min = yd.getMinutes();
    sec = yd.getSeconds();
    ydd = (ydd < 10) ? ('0' + ydd) : ydd;
    ymm = (ymm < 10) ? ('0' + ymm) : ymm;
    return  ymm.toString() + ydd.toString() + yy.toString() + hh.toString() + min.toString() + sec.toString();
  }

  timeConversion(number) {
    var time;
    var hours = Math.floor(number / 60);
    var min = number % 60;
    hours = hours < 10 ? "0" + hours : hours;
    min = min < 10 ? "0" + min : min;
    time = hours + ':' + min;
    //var time = (hours < 12) ? (hours-12 + ':' + min +' PM') : (hours + ':' + min +' AM');
    return time;
  }

  downloadTrips(event){
    console.log(event.detail)
    let _biweekId, _month, message, stDate, enDate;
    let element = this.filter(this.accordionList, event.detail);
    if(this.isTandA){
        stDate = element.startDate;
        enDate = element.endDate;
        getMileagesBasedTandAtt({
          startdate: stDate,
          enddate: enDate,
          contactId: this.contactId
        }).then(result=>{
          if (result !== '') {
            let escapeChar = this.escapeSpecialChars(result);
            let detailedList = JSON.parse(escapeChar);
            console.log("getMileagesTA excel----", result);
            if(detailedList.length > 0){
              let excelTA = [];
              let excelFileName = this.contactInfo.Name + '\'s Time And Attendance Report ' + this.dateTime(new Date());
              let excelSheetName = 'T and A Report';
              excelTA.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Mi Rate", "Amount", "Drive Time", "Stay Time", "Total Time", "Notes", "Tags"])
              detailedList.forEach((item)=>{
                excelTA.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount, item.drivingtime, item.staytime, item.totaltime, item.notes, item.tag])
              })
              this.excelToExport(excelTA, excelFileName, excelSheetName);
            }else{
              toastEvents(this, 'No mileage')
            }
          }else{
            toastEvents(this, 'No mileage')
          }
        })
    }else{
      if(!this.contactInfo.Biweek_Reimbursement__c){
        _month = element.month;
        getMileages({
          clickedMonth: _month,
          year: this.defaultYear,
          contactId: this.contactId
        }).then(result=>{
          console.log("getMileages excel----", result);
          let escapeChar = this.escapeSpecialChars(result[0]);
          let mileageList = JSON.parse(escapeChar);
          console.log("mileageList excel----", result);
          if(mileageList.length > 0){
            let excelMileage = [];
            let excelFileName = this.contactInfo.Name + '\'s Mileage Report ' + this.dateTime(new Date());
            let excelSheetName = 'Mileage Report';
            excelMileage.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Mi Rate", "Amount", "Total Time", "Notes", "Tags"])
            mileageList.forEach((item)=>{
              excelMileage.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount, item.totaltime, item.notes, item.tag])
            })
            this.excelToExport(excelMileage, excelFileName, excelSheetName);
          }else{
            toastEvents(this, 'No mileage')
          }
          console.log("getMileages excel----", result);
        }).catch(error => {
          if (Array.isArray(error.body)) {
            message = error.body.map((e) => e.message).join(", ");
          } else if (typeof error.body.message === "string") {
            message = error.body.message;
          }

          console.log("Error getMileages", message)
        })
      }else{
        _biweekId = element.biweekId
        getBiweekMileages({
            biweekId: _biweekId
        }).then(result => {
          let escapeChar = this.escapeSpecialChars(result[0]);
          let biweekList = JSON.parse(escapeChar);
          if(biweekList.length > 0){
            let excelReimbursement = [];
            let excelFileName = this.contactInfo.Name + '\'s Mileage Report ' + this.dateTime(new Date());
            let excelSheetName = 'Mileage Report';
            excelReimbursement.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Mi Rate", "Amount", "Trip Type", "Drive Time", "Stay Time", "Total Time", "Notes", "Tags"])
            biweekList.forEach((item)=>{
              item.drivingtime = this.timeConversion(item.drivingtime);
              item.staytime = this.timeConversion(item.staytime);
              item.totaltime =this.timeConversion(item.totaltime);
              excelReimbursement.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount, item.tripActivity, item.drivingtime, item.staytime, item.totaltime, item.notes, item.tag])
            })
            this.excelToExport(excelReimbursement, excelFileName, excelSheetName);
          }else{
            toastEvents(this, 'No mileage')
          }

          console.log("getBiweekMileages excel----", result);
        }).catch(error => {
          if (Array.isArray(error.body)) {
            message = error.body.map((e) => e.message).join(", ");
          } else if (typeof error.body.message === "string") {
            message = error.body.message;
          }

          console.log("Error getBiweekMileages", message)
        })
      }
    }
    console.log("element----", JSON.stringify(element))
  }

  insideClick(event){
    event.stopPropagation();
  }

}