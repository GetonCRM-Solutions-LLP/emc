import { LightningElement, api } from "lwc";
import resourceImage from "@salesforce/resourceUrl/mBurseCss";
import getPlanParameter from "@salesforce/apex/DriverDashboardLWCController.getPlanParameter";
import getCompliance from "@salesforce/apex/DriverDashboardLWCController.getCompliance";
export default class UserPlanInfo extends LightningElement {
  driverPacketSentIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/1.png";
  driverSignedIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/2.png";
  adminSignedIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/3.png";
  packetCompletedIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/4.png";
  meetingAttendedIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/7.png";
  requestedIcon = resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/5.png";
  uploadedIcon = resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/6.png";
  downloadIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/download.png";
    btnIcon = resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/download_white.png";
  notUploadedIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/no-added-dock.png";

  driverPacket = true;
  driverMeeting = false;
  driverInsurance = false;
  driverCompliance = false;
  driverReimbursement = false;
  lengthS = false;
  packetStatus;
  meetingStatus;
  messageOfCompliance;
  complianceData;
  detailReport;
  reimbursements;
  maxAllow;
  taxLiablity;
  urlToInsurance;
  urlToPacket;
  driverPacketId;
  contentVersionUrl;
  isPacketDownload = false;

  @api contactId;
  @api insuranceAttachmentId;
  @api insuranceRate;
  @api license;
  @api taxes;
  @api depreciation;
  @api monthlyCost;
  @api businessUse;
  @api totalMonthlyAmount;
  @api fixedcostadjustment;
  @api totalMonthlyFixedCost;
  @api variablefuelprice;
  @api maintenance;
  @api tires;
  @api miles;
  @api businessPercent;
  @api packetStatus1;
  @api packetStatus2 ;
  @api packetStatus3 ;
  @api packetStatus4 ;
  @api meetingStatus1 ;
  @api meetingStatus2;
  @api meetingStatus3;
  
  proxyToObject(e) {
    return JSON.parse(e);
  }

  driverPacketView() {
    this.driverPacket = true;
    this.driverMeeting = false;
    this.driverInsurance = false;
    this.driverCompliance = false;
    this.driverReimbursement = false;
  }

  driverMeetingView() {
    this.driverPacket = false;
    this.driverMeeting = true;
    this.driverInsurance = false;
    this.driverCompliance = false;
    this.driverReimbursement = false;
  }

  driverInsuranceView() {
    this.driverPacket = false;
    this.driverMeeting = false;
    this.driverInsurance = true;
    this.driverCompliance = false;
    this.driverReimbursement = false;
  }

  driverComplianceView() {
    this.driverPacket = false;
    this.driverMeeting = false;
    this.driverInsurance = false;
    this.driverCompliance = true;
    this.driverReimbursement = false;
  }

  driverReimbursementView() {
    this.driverPacket = false;
    this.driverMeeting = false;
    this.driverInsurance = false;
    this.driverCompliance = false;
    this.driverReimbursement = true;
  }

  driverMVRView() {
    this.driverPacket = false;
    this.driverMeeting = false;
    this.driverInsurance = false;
    this.driverCompliance = false;
    this.driverReimbursement = false;
  }

  renderedCallback() {
    const tabItem = this.template.querySelectorAll(".slds-tabs_default__item");

    tabItem.forEach((el) =>
      el.addEventListener("click", () => {
        console.log("----", el);
        if (el.classList.contains("slds-is-active")) {
          //el.classList.remove("slds-is-active");
        } else {
          console.log("---- inside else");
          tabItem.forEach((el2) => el2.classList.remove("slds-is-active"));
          el.classList.add("slds-is-active");
        }
      })
    );
  }

  getCompliancedata(data){
    data.forEach( element => {
        let number = element.quarterno;
        element.ordinal = (isNaN(number) || number < 1) ? '' : (number % 100 === 11 || number % 100 === 12) ? 'th' : (number % 10 === 1) ? 'st' 
         : (number % 10 === 2) ? 'nd' : (number % 10 === 3) ? 'rd' : 'th';
    })
    return data;
  }
  
  excelToExport(data, file, sheet){
    this.template.querySelector('c-export-excel').download(data, file, sheet);
  }

  taxLiabilityDetailReport(){
    let name, excelFileName, excelSheetName
    let excelReport = [];
    name = this.detailReport[0].drivername;
    excelFileName = name +  ' Annual Tax Liability Detail Report';
    excelSheetName = 'Detail Report';
    excelReport.push([ "Employee Id", "Driver Name", "Email", "Year", "Month", "Approved Mileage", "Mileage Rate", "IRS Max Allowable", "Total Reimbursement", "Imputed Income"])
    this.detailReport.forEach(item => {
      excelReport.push([item.employeeid, item.drivername, item.emailid, item.year,  item.month, item.approvedmileages, "$" + item.variableRate, "$" + item.totalreim, "$" + item.iRSallowable, "$" + item.imputedincome])
    })

    this.excelToExport(excelReport, excelFileName, excelSheetName);
  }

  taxLiabilitySummaryReport(){
    let name, excelFileName, excelSheetName
    let excelReport = [];
    name = this.summaryR[0].drivername;
    excelFileName = name +  ' Annual Tax Liability Summary Report';
    excelSheetName = 'Summary Report';
    excelReport.push(["Employee Id", "Driver Name", "Email", "Total Reimbursement", "IRS allowable", "Imputed Income"])
    this.summaryR.forEach(item => {
      excelReport.push([item.employeeid, item.drivername, item.emailid,  "$" + this.reimbursements, "$" + this.maxAllow, "$" + item.imputedincome])
    })

    this.excelToExport(excelReport, excelFileName, excelSheetName);
  }

  connectedCallback() {
    console.log("attachmentInsurance", this.insuranceAttachmentId);
        // eslint-disable-next-line no-restricted-globals
        let origin = location.origin;
        this.urlToInsurance = origin + '/app/servlet/servlet.FileDownload?file=' + this.insuranceAttachmentId
        getPlanParameter({
        contactId: this.contactId
        })
        .then((data) => {
            if(data){
                let planParameter = JSON.parse(data)
                this.driverPacketId = planParameter.driverPacketId;
                this.contentVersionUrl = planParameter.obj_content_version;
                this.isPacketDownload = (this.contentVersionUrl === null) ? false : true;
                this.urlToPacket = (this.contentVersionUrl !== null) ? this.contentVersionUrl : origin + '/app/servlet/servlet.FileDownload?file=' + this.driverPacketId;
            }
            console.log("getPlanParameter", data);
        })
        .catch((error) => {
            console.log("getPlanParameter error", error);
        });

        getCompliance({
        contactId: this.contactId
        })
        .then((data) => {
            this.messageOfCompliance = this.proxyToObject(data[1]);
            this.complianceData = this.getCompliancedata(this.proxyToObject(data[2]));
            this.detailReport = this.proxyToObject(data[3]);
            this.summaryR = this.proxyToObject(data[4]);
            this.lengthS = this.summaryR.length > 0 ? true : false;
            this.reimbursements = this.proxyToObject(data[5]);
            this.maxAllow = this.proxyToObject(data[6]);
            this.taxLiablity = this.proxyToObject(data[7]);
            console.log("getCompliance", data, this.complianceData[0].quarterno, this.complianceData[0].ordinal);
        })
        .catch((error) => {
            console.log("getCompliance error", error);
        });

       
    }
}
