import { LightningElement, api, track } from 'lwc';
import getDriverDetails  from '@salesforce/apex/DriverDashboardLWCController.getDriverDetailsClone';
import getAllReimbursements from "@salesforce/apex/DriverDashboardLWCController.getAllReimbursements";
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
export default class NotificationUser extends LightningElement {
    @api contactId;
    @api accountId;
    @api hideView = false;
    circle = resourceImage + '/mburse/assets/mBurse-Icons/Ellipse.png';
    cross = resourceImage + '/mburse/assets/mBurse-Icons/notify-cancel.png';
    error = resourceImage + '/mburse/assets/mBurse-Icons/Error-notify.png';
    headerText = '';
    view = false;
    isFalse = false;
    isNotify = false;
    viewAllNotification = false;
    mileageList;
    @track notifyList;
    @track notificationList;
    notification = [{
        "message": "Hey Tony, please start tabeling your locations.",
        "date": "Jul 23, 2022 at 09:15 AM"
        },
        {
            "message": "Please name your locations to make it easier to approve mileage - Bob (admin)",
            "date": "Jul 23, 2022 at 09:15 AM"
        }
    ]

    
    proxyToObject(e) {
        return JSON.parse(e)
    }

   showAll(){
        this.viewAllNotification = true;
        if(this.viewAllNotification)
            this.template.querySelector('c-user-profile-modal').show();
        //this.template.querySelector('.notify-container').classList.remove('overflow');
    }

    showLess(){
        this.viewLess = false;
        this.view = true;
        this.template.querySelector('.notify-container').classList.add('overflow');
    }
    
    handleClose(event) {
        var eId = event.target.dataset.id;
        this.notifyList.splice(this.notifyList.findIndex(a => a.id === eId) , 1)
        this.template.querySelector(`.notify-text[data-id="${eId}"]`).classList.add('slds-hide');
        this.isNotify = (this.notifyList.length > 0) ? true : false;
    }

    driverNotification(message, date, insuranceDt) {
        //  if (this.isInformation) {
              var notification = [], currentDate, deadline, mileageMsg,pastDate,fourthOfMonth,monthName,insuranceMsg, insuranceMsg1, dateOpt;
              currentDate = new Date(); /** "2021-07-31" */
              deadline = 5;
              /** Custom Notification **/
              if (message != null) {
                  notification.push({
                        value: message,
                        dt: date
                      }
                    );
              }
              /** Driver Notification - 5 days before the mileage Monthly and bi-weekly notifications for upcoming mileage sync  **/
             
              fourthOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 4);
              if (currentDate > fourthOfMonth) {
                  fourthOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 4);
                  pastDate = new Date(fourthOfMonth);
                  pastDate.setDate(pastDate.getDate() - deadline);
                  monthName = fourthOfMonth.toLocaleString('default', {
                      month: 'long'
                  });
              } else {
                  pastDate = new Date(fourthOfMonth);
                  pastDate.setDate(pastDate.getDate() - deadline);
                  monthName = currentDate.toLocaleString('default', {
                      month: 'long'
                  });
                  // console.log(pastDate, fourthOfMonth);
              }
  
              if (currentDate >= pastDate && currentDate < fourthOfMonth) {
                  mileageMsg = "Mileage will be automatically synced " + monthName + " 3 at 11:59 PM PST.";
                  notification.push({
                        value: mileageMsg,
                        dt: new Date()
                  });
              }
  
              /** Driver Notification - Insurance deadline 5 days before the insurance request dates (Jan 1 and June 30) to support the email that is sent to drivers.  **/
              
              dateOpt = {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
              };
              let cDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('fr-CA', dateOpt);
              let  firstMonth = new Date(currentDate.getFullYear(), 0, 1);
              let sixthMonth = new Date(currentDate.getFullYear(), 6, 0);
              let first = new Date(firstMonth.getFullYear(), 0, 1).toLocaleDateString('fr-CA', dateOpt);
              if (cDate > first) {
                  firstMonth = new Date(currentDate.getFullYear() + 1, 0, 1);
              }
              let insurancePastDate = new Date(firstMonth);
              insurancePastDate.setDate(insurancePastDate.getDate() - deadline);
              let insuranceEndDate = new Date(sixthMonth);
              insuranceEndDate.setDate(insuranceEndDate.getDate() - deadline);
              if (currentDate >= insurancePastDate && currentDate < firstMonth) {
                  insuranceMsg = "Happy Holidays – Don’t forget to upload your insurance dec page next week.";
                  notification.push({
                    value: insuranceMsg,
                    dt: new Date()
                });
              }
              if (currentDate >= insuranceEndDate && currentDate < sixthMonth) {
                  insuranceMsg1 = "You have to upload your most recent insurance declaration page(s) in 5 days.";
                  notification.push({
                    value: insuranceMsg1,
                    dt: new Date()
                });
              }
  
              /** Driver Notification - 35 days after the first request for insurance (January 31 and July 31) to support a new email that will be sent to all drivers that have not uploaded their insurance.  **/
              let emailMsg;
              let lastDayOfSeventh = new Date(currentDate.getFullYear(), 7, 0).toLocaleDateString('fr-CA', dateOpt);;
              let lastDay = new Date(currentDate.getFullYear(), 1, 0).toLocaleDateString('fr-CA', dateOpt);;
              if (cDate === lastDayOfSeventh || cDate === lastDay) {
                  emailMsg = "In 5 days, you could forfeit your fixed amount unless you upload your insurance declaration page(s).";
                  notification.push({
                    value: emailMsg,
                    dt: new Date()
                });
              }
              // console.log(notification);
  
              /** Trigger-based notifications */
              let day = currentDate.getDate();
              let approvalMsg;
              let flaggedMsg;
              let pendingMsg;
              let insuranceUpload;
              let pastDay;
              let nameOfMonth;
              let fourth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 4).toLocaleDateString('fr-CA', dateOpt);
              if (cDate >= fourth) {
                  pastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
                  nameOfMonth = pastDay.toLocaleString('default', {
                      month: 'long'
                  });
              } else {
                  pastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
                  nameOfMonth = pastDay.toLocaleString('default', {
                      month: 'long'
                  });
              }
              let mileageObject;
              this.mileageList.forEach((m) => {
                  if (nameOfMonth === m.month) {
                      mileageObject = m;
                  }
              })
              // console.log(mileageObject);
              if (mileageObject !== undefined) {
                  /** Trigger-based notifications - Display mileage approval (total for the month) – should disappear after the lock date or by the 18th of the month */
                  if (mileageObject.totalApprove !== undefined) {
                      if (mileageObject.lockdate === null && day < 18) {
                          approvalMsg = "For " + nameOfMonth + " you had " + mileageObject.totalApprove + " approved miles";
                          notification.push({
                            value: approvalMsg,
                            dt: new Date()
                        });
                      }
                  }
  
                  /** Trigger-based notifications - When mileage is flagged for the month (total for the month) until the 18th of the month or the lock date */
                  if (mileageObject.totalRejected !== undefined) {
                      if ((mileageObject.lockdate != null)) {
                          flaggedMsg = "For " + nameOfMonth + " you had " + mileageObject.totalRejected + " flagged miles";
                          notification.push({
                            value: emailMsg,
                            dt: new Date()
                        });
                      } else {
                          if (day <= 18) {
                              flaggedMsg = "For " + nameOfMonth + " you had " + mileageObject.totalRejected + " flagged miles";
                              notification.push({
                                value: flaggedMsg,
                                dt: new Date()
                            });
                          }
                      }
                  }
  
  
                  /** Trigger-based notifications - Display the total of unapproved mileage (mileage that was unapproved after the 18th or the lock date). This number should be displayed until the 3rd of the next month.*/
                  if (mileageObject.totalPending !== undefined) {
                      if ((mileageObject.lockdate != null)) {
                          pendingMsg = "For " + nameOfMonth + " you had " + mileageObject.totalPending + " miles that were not yet approved";
                          notification.push({
                            value: emailMsg,
                            dt: new Date()
                        });
                      } else {
                          if (day >= 18) {
                              pendingMsg = "For " + nameOfMonth + " you had " + mileageObject.totalPending + " miles that were not yet approved";
                              notification.push({
                                value: pendingMsg,
                                dt: new Date()
                            });
                          }
                      }
                  }
  
  
              }
  
              /** Trigger-based notifications - 4.	Thank you for uploading your insurance – immediately after uploading an insurance */
  
              let isDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('fr-CA');
              let insuranceDate = insuranceDt;
              if (insuranceDate != null) {
                  if (isDate === insuranceDate) {
                      insuranceUpload = "Thank you for uploading your insurance, our team will evaluate your insurance by the end of the month"
                      notification.push({
                        value: insuranceUpload,
                        dt: new Date()
                    });
                  }
              }
  
              let messageList = [];
              for (let index = 0; index < notification.length; index++) {
                  const element = {}
                  element.Id = index;
                  element.message = notification[index].value;
                  element.date = notification[index].dt;
                  messageList.push(element);
              }

              this.notifyList = messageList;
              this.notificationList = this.notifyList.slice(0,2);
              console.log("notifications--", this.notifyList, JSON.stringify(this.notifyList), this.notifyList.length)
              this.isNotify = (this.notifyList.length > 0) ? true : false;
         // }
    }

    connectedCallback(){
        var currentDay = new Date(), currentYear = '', selectedYear='';
        this.headerText = 'Notifications';
        this.view = (this.notification.length > 1) ? true : false;
        if(currentDay.getMonth() === 0){
            currentYear = currentDay.getFullYear() - 1;
            selectedYear = currentYear.toString();
        }else{
            currentYear = currentDay.getFullYear();
            selectedYear = currentYear.toString();
        }
        console.log("contactId", this.contactId)
        console.log("accountId", this.accountId)
        getAllReimbursements({
          year: selectedYear,
          contactId: this.contactId,
          accountId: this.accountId
        })
          .then((result) => {
            let reimbursementList = this.proxyToObject(result[0]);
            this.mileageList = reimbursementList;
            getDriverDetails({
                contactId:this.contactId
            }).then((data) => {
                if (data) {
                    console.log("Driver details")
                    let contactList = this.proxyToObject(data);
                    this.driverNotification(contactList[0].Notification_Message__c, contactList[0].Notification_Date__c, contactList[0].Insurance_Upload_Date__c);
                }
            }).catch((error) => {
                    console.log("getDriverDetails error", error.message)
            })
          })
          .catch((error) => {
            console.log("getAllReimbursements error", error);
          });

    }
}