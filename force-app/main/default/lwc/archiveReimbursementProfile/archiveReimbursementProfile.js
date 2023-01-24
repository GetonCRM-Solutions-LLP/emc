import { LightningElement, api } from 'lwc';
import getLast2Years  from '@salesforce/apex/DriverDashboardLWCController.getLast2Years';
import getDriverDetailsClone  from '@salesforce/apex/DriverDashboardLWCController.getDriverDetailsClone';
import {
    events, openEvents, toastEvents
} from 'c/utils';
export default class ArchiveReimbursementProfile extends LightningElement {
    @api contactId;
    @api accountId;
    @api trip;
    contact;
    lastYears;
    accordionList;
    hrBorder;
    lengthOfContact = false;
    timeAttendance = false;
    isIcon = true;
    proxyToObject(e) {
        return JSON.parse(e)
    }

    sortByDateDesc(data){
        (data).sort((a, b) => {
                 a = a ? a.toLowerCase() : '';
                 b = b ? b.toLowerCase() : '';
                 return a > b ? -1  : 1 ;
         });
         return data
     }

    dynamicBinding(data, tripType) {
        let dataBind = [];
        let count = 1;
        data.forEach(element => {
          let singleValue = {}
          singleValue.Id = count ++;
          singleValue.yearName = element;
          singleValue.accordionTitle = (tripType === 'timeAttendance') ? element + ' Reimbursement Data (T & A)' : element + ' Reimbursement Data';
          singleValue.classType = 'accordion-item';
          this.hrBorder = false;
        //   singleValue.accTextClass = 'paragraph accordion-none';
          dataBind.push(singleValue);
        });
         
        return dataBind
    }

    backToReimbursement(){
        events(this, '');
    }

    fromAccordion(event){
        openEvents(this, event.detail)
    }

    onToast(event){
        toastEvents(this, event.detail)
      }

      getSpinner(event){
        this.dispatchEvent(
            new CustomEvent("show", {
              detail: event.detail
            })
        )
      }

    connectedCallback(){
        console.log("trip", this.trip);
        this.timeAttendance = (this.trip === 'timeAttendance') ? true : false;
        getDriverDetailsClone({
            contactId: this.contactId
        }).then(data => {
          let contactList = this.proxyToObject(data);
          this.contact = contactList[0];
          console.log("Driver details reimbursement clone", data)
          getLast2Years({
                contactId: this.contactId
            }).then(result => {
                let yearList = this.proxyToObject(result);
                this.lastYears = this.sortByDateDesc(yearList)
                this.accordionList = this.dynamicBinding(this.lastYears, this.trip)
                this.lengthOfContact = (this.accordionList.length > 0) ? true : false;
                console.log("formatted", JSON.stringify(this.accordionList))
                console.log("getLast2Years", data, JSON.stringify(this.lastYears))
            })
            .catch((error)=>{
                    console.log("getLast2Years error", error)
            })
        })
        .catch((error)=>{
                console.log("getDriverDetails error", error)
        })
    }
}