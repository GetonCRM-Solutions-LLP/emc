import { LightningElement, wire, api } from 'lwc';
import getDriverDetails  from '@salesforce/apex/DriverDashboardLWCController.getDriverDetails';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
export default class UserCompliance extends LightningElement {
    exclaimIcon = resourceImage + '/mburse/assets/mBurse-Icons/exclaim.png';
    maginifyIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/5.png';
    umbrellaIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/6.png';
    milesPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/7.png';
    calendarPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/8.png';
    carPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/9.png';
    insurancePlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/10.png';
    checkMark = resourceImage + '/mburse/assets/mBurse-Icons/check.png';
    crossMark = resourceImage + '/mburse/assets/mBurse-Icons/Cross.png';
    planInsurance = false;
    planMileage = false;
    planVehicleAge = false;
    planVehicleValue = false;
    planCompliance = false;
    planYear = '';
    complianceMileage = '';
    vehicleValue = '';
    insurancePlan = '';
    complianceStatus = '';
    annualMileage = '';
    annualReimbursement = '';
    @api contactId;

    
    proxyToObject(e) {
        return JSON.parse(e)
    }

    redirectToLiability(){
        const redirectEvent = new CustomEvent('redirect', {detail: 'Liability'});
        this.dispatchEvent(redirectEvent);
    }

    @wire(getDriverDetails, {
        contactId:'$contactId'
    })driverDetailInfo({data,error}) {
        if (data) {
            let contactList = this.proxyToObject(data);
            this.contactDetails = contactList;
            this.planInsurance = (this.contactDetails[0].Insurance__c !== undefined) ? (this.contactDetails[0].Insurance__c === 'Yes') ? true : false : false;
          //  this.planMileage =    (this.contactDetails[0].Mileage_Meet__c !== undefined) ? (this.contactDetails[0].Mileage_Meet__c === 'Yes') ? true : false : false;
            this.planVehicleAge =  (this.contactDetails[0].Vehicle_Age__c !== undefined) ?  (this.contactDetails[0].Vehicle_Age__c === 'Yes') ? true : false : false;
            this.planVehicleValue = (this.contactDetails[0].Vehicle_Value_Check__c !== undefined) ?   (this.contactDetails[0].Vehicle_Value_Check__c === 'Yes') ? true : false : false;
            this.planCompliance =  (this.contactDetails[0].compliancestatus__c !== undefined) ?  (this.contactDetails[0].compliancestatus__c === 'Yes') ? true : false : false;
            this.planYear = (contactList[0].Plan_Years__c !== undefined) ?  contactList[0].Plan_Years__c : 0;
            this.complianceMileage = (contactList[0].Compliance_Mileage__c !== undefined) ? contactList[0].Compliance_Mileage__c : 0;
            this.vehicleValue = (contactList[0].Vehicle_Value__c !== undefined) ? (contactList[0].Vehicle_Value__c) : 0;
            this.insurancePlan = (contactList[0].Insurance_Plan__c !== undefined) ? contactList[0].Insurance_Plan__c : '';
            this.complianceStatus = (contactList[0].compliancestatus__c !== undefined) ? contactList[0].compliancestatus__c : '';
            this.annualMileage = (contactList[0].Total_Approved_Mileages__c !== undefined) ? contactList[0].Total_Approved_Mileages__c : '0';
            this.annualReimbursement = (contactList[0].Total_reimbursment__c !== undefined) ? contactList[0].Total_reimbursment__c : '0';
            this.isValid = parseFloat(this.annualMileage) >= parseFloat(this.complianceMileage) ? true : false;
            this.planMileage =  (this.isValid) ? true : false;
            console.log("getDriverDetails data", data, contactList)
        }else if(error){
            console.log("getDriverDetails error", error)
        }
    }
}