/**
@author Natavar Ghodasara
@date 26th Feb 2019
@description DriverDashboardController is used to show/edit Employee details.
*/
public class DriverDashboardController 
{
    public static String query;
    public static String totalmileages{get;set;}
    public static String totalvariableamount{get;set;}
    public static String contactDataAsString {get; set;}
    public static String gaspriceforpreviosmonth {get; set;}
    public static String gasVariableRatePreviosMonth {get; set;}
    public String accInsuranceList {get; set;}
    public static String currentDriverDetails {get;set;}
    public List<Attachment> driverInsuranceAttachmentList {get;set;}
    public List<Attachment> driverPacketAttachmentList {get;set;}
    public List<Attachment>  obj_driver_driverMVR {get;set;}
    public Integer insuranceSize {get;set;}
    public Integer packetSize {get;set;}
    public Integer obj_driverpacket_attachMVRsize {get;set;}
    public static Boolean showlastyear {get;set;}
    public static String logoDocument_id {get;set;}
    public static decimal TotalMonthlyCosts {get; set;}
    public String obj_content_version {get;set;}
    public String biWeekData {get;set;}
    public static Boolean checkErrorERMI {get;set;}
    public static Boolean ConfirmTimeERMI {get;set;}
    /**
    @author Natavar Ghodasara
    @date 26th Feb 2019
    @description RosterController is Default Constructor.    
    */
    public DriverDashboardController() 
    {
        List<contact> currentDriverList = new List<contact>();
        obj_driver_driverMVR = new List<Attachment>();
        currentDriverDetails = getDriverDetails();
        if(currentDriverDetails!=null) {
            currentDriverList = (List<Contact>)JSON.deserialize(currentDriverDetails,List<Contact>.Class);
        }
        if(currentDriverList.size()>0) {
            gaspriceforpreviosmonth = WrapperUtils.getDriverGasPrice(currentDriverList[0].MailingState,currentDriverList[0].MailingCity);
            gasVariableRatePreviosMonth = WrapperUtils.getDriverFuelVariableRate(currentDriverList[0].Id);
        }
        driverInsuranceAttachmentList = new List<Attachment>();
        driverPacketAttachmentList = new List<Attachment>();
        if(currentDriverList!=null && currentDriverList[0]!=null && currentDriverList[0].Insurance_Attachment_Id__c!=null)
        {
            driverInsuranceAttachmentList = [select id,Body,Name from Attachment where id=:currentDriverList[0].Insurance_Attachment_Id__c limit 1];    
        }        
        insuranceSize = driverInsuranceAttachmentList.size();
        driverPacketAttachmentList = [select id,Body,Name from Attachment where ParentId=:ApexPages.currentPage().getParameters().get('id') and Name LIKE '%Driver_Packet%' limit 1];
        packetSize = driverPacketAttachmentList.size();

        obj_driver_driverMVR = [SELECT Id, Body, Name FROM Attachment WHERE ParentId=:ApexPages.currentPage().getParameters().get('id') and Name LIKE '%MVR%' limit 1];
        obj_driverpacket_attachMVRsize = obj_driver_driverMVR.size();

        accInsuranceList = '[]';
        //AI-000414
        if(getContactid()!=''&& getAccountid()!='')
        {
            List<Account> accInsurances = [SELECT id,Bodily_Injury__c, Uninsured_Motorist__c, Property_Damage__c, Comprehensive__c, Collision__c,Umbrella_Coverage__c FROM account WHERE Id =: getAccountid()];
           accInsuranceList = String.escapeSingleQuotes( JSON.serialize(accInsurances));
        }
        if(getAccountid() != '' && getContactid() != '' &&  getAccountid() == System.label.ERMI_Account){
            List<Bi_Weekly_Reimbursement__c> biWeekList = new List<Bi_Weekly_Reimbursement__c>();
                    biWeekList = [SELECT name,Start_Date__c,
                                        End_Date__c,Confirm_Hours__c,
                                        Error_Hours__c,Count_Error_Check__c 
                                    FROM Bi_Weekly_Reimbursement__c 
                                    WHERE Contact__c =: getContactid()
                                    AND Start_Date__c != null 
                                    AND End_Date__c <= TODAY 
                                    AND ( Contact__r.Driver_Type__c = 'Driver - Part Time' 
                                        OR Contact__r.Driver_Type__c = 'Driver - Full Time' )
                                    Order By End_Date__c desc limit 1];   
                                    if(biWeekList.size() > 0 ){
                                        checkErrorERMI =   biWeekList[0].Error_Hours__c;
                                        ConfirmTimeERMI =   biWeekList[0].Confirm_Hours__c; 
                                        biWeekData = Json.serialize(biWeekList) ; 
                                    }                                                             
        }  
        /*try{
            List<ContentDocumentLink> contentDocLink = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId  =: getContactid()];
            Set<Id> ids = new Set<Id>();
            for(ContentDocumentLink obj:  contentDocLink){
                ids.add(obj.ContentDocumentId);
            }
            ContentDistribution contentDist = [SELECT id,ContentDownloadUrl from ContentDistribution where ContentDocumentId in : ids and Name=: Constants.signedDocument order by createddate desc limit 1];
            obj_content_version = contentDist.ContentDownloadUrl;
            System.debug('obj_content_version-->'+obj_content_version);
        }catch(Exception e){System.debug('Exception:-->'+e.getmessage()+'--'+e.getLineNumber());}*/
    }
    public static String getAccountid()
    {
        if(ApexPages.currentPage().getParameters().containsKey('accid') && String.isNotBlank(ApexPages.currentPage().getParameters().get('accid')))
        {
           return ApexPages.currentPage().getParameters().get('accid');
        }
        else
        {
            return '';
        } 
    }
    public static String getContactid()
    {
        if(ApexPages.currentPage().getParameters().containsKey('id') && String.isNotBlank(ApexPages.currentPage().getParameters().get('id')))
        {
           return ApexPages.currentPage().getParameters().get('id');
        }
        else
        {
            return '';
        } 
    }
    public static PageReference getRedirected()
    {
        
        if(getContactid()!=''&& getAccountid()!='')
        {
            return null;
        }
        else
        {
            // redirect to error page
            return null;
        }
        
    }
    public static String getLast2Years()
    {
        //getpastYearReimbursement();
       return String.escapeSingleQuotes(WrapperUtils.getpastYearReimbursement(getContactid()));
    }
    // public static void getpastYearReimbursement(){
        
    //     if(WrapperUtils.getpastYearReimbursement(getContactid()) > 0)
    //     {
    //         showlastyear = true;
    //     }
    //     else
    //     {
    //         showlastyear = false;
    //     }   
    // }
    @RemoteAction
    public Static String getAllReimbursements(String year,String contactId,String accountId) 
    {       
        return String.escapeSingleQuotes(WrapperUtils.getAllReimbursements(year,contactId,accountId));
    }   
    public static String getReimbursementsList()
    {         
         return String.escapeSingleQuotes(WrapperUtils.getReimbursementsList(getContactid(),'Approved'));
    }
    public static String getDriverGasPrice(String MailingState,String MailingCity)
    {         
        return String.escapeSingleQuotes(WrapperUtils.getDriverGasPrice(MailingState,MailingCity));
    }
    public static String getDriverDetails()
    {
        return getDriverDetailsClone(getContactid());
    }
    @RemoteAction
    public static String getDriverDetailsClone(String contactid)
    {            
        /*List<contact> driverDataList = new List<contact>();

        for(Contact currentContact : [SELECT id,Name,MailingPostalCode,MailingState,MailingCity,
                                            Driver_Type__c,Fixed_Amount__c,compliancestatus__c,Car_Image__c,
                                            Accountid,Account.Name,Account.Logo_Document_Id__c,
                                            Vehicle_Type__c,Insurance_Attachment_Id__c,Maintenance__c,Tires__c,
                                            Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                            Depreciation__c, Total_Monthly_Costs__c, Business_Use__c 
                                        FROM Contact 
                                        WHERE id=:contactid])
        {
            contactDataAsString = String.escapeSingleQuotes(currentContact.Name);
            
            Account newAccount = new Account();
            newAccount.id = currentContact.Accountid;
            newAccount.Name = currentContact.Account.Name;
            newAccount.Logo_Document_Id__c = currentContact.Account.Logo_Document_Id__c;
            logoDocument_id = currentContact.Account.Logo_Document_Id__c;
            Contact newContact = new Contact();
            newContact.id = currentContact.id;
            newContact.MailingPostalCode = currentContact.MailingPostalCode;
            newContact.MailingState = currentContact.MailingState;
            newContact.MailingCity = currentContact.MailingCity;
            newContact.Fixed_Amount__c = currentContact.Fixed_Amount__c;
            newContact.compliancestatus__c = currentContact.compliancestatus__c;
            newContact.Car_Image__c = currentContact.Car_Image__c;
            newContact.Accountid = newAccount.id;
            newContact.Vehicle_Type__c = currentContact.Vehicle_Type__c;
            newContact.Insurance_Attachment_Id__c = currentContact.Insurance_Attachment_Id__c;
            newContact.Driver_Type__c = currentContact.Driver_Type__c;
            newContact.Maintenance__c = currentContact.Maintenance__c;
            newContact.Tires__c = currentContact.Tires__c;
            newContact.Insurance_Rate__c = currentContact.Insurance_Rate__c;
            newContact.License_Ragistration__c = currentContact.License_Ragistration__c;
            newContact.Taxes__c = currentContact.Taxes__c;
            newContact.Depreciation__c = currentContact.Depreciation__c;
            newContact.Business_Use__c = currentContact.Business_Use__c ;
            TotalMonthlyCosts = currentContact.Total_Monthly_Costs__c;
            driverDataList.add(newContact);
        }
                
        return JSON.serialize(driverDataList).unescapeHtml4();*/
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id, Name, MailingPostalCode, MailingState, MailingCity,Driver_Type__c, 
                                        Fixed_Amount__c, compliancestatus__c, Car_Image__c, Account.Name, Account.Logo_Document_Id__c, 
                                        Vehicle_Type__c,Insurance_Attachment_Id__c, Account.Triplog_API__c, Email,
                                        Maintenance__c,Tires__c, Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                        Depreciation__c, Total_Monthly_Costs__c, Business_Use__c,Fixed_Cost_Adjustment__c,
                                        Monthly_Reimbursement__c,Biweek_Reimbursement__c,Time_Attandance__c,
                                        Account.Bi_Weekly_Pay_Period__c
                                    FROM Contact 
                                    WHERE id =: contactid];
        return JSON.serialize(driverDataList ).unescapeHtml4();
    }
    @RemoteAction
    public static List<String> getMileages(String clickedMonth,String year,String contactId)
    {
        return WrapperUtils.getMileages1(clickedMonth,year,contactId);
       //return null;
    }    
   
    @RemoteAction
    public static String readFromFileInchunk(String attachmentBody, String attachmentName, String attachmentId,String contactId,String accountId,String contactattachementid)
    {
        return  WrapperUtils.readFromFileInchunk(attachmentBody,attachmentName,attachmentId,contactId,accountId,contactattachementid);   
    }
    @RemoteAction
    public static List<String> getCompliance(String contactId)
    {
        return WrapperUtils.getComplianceCalculation(contactId,String.valueOf(System.today().year()));
        
    }
    @RemoteAction
    public static List<String> getPacketandMeeting(String contactId)
    {
        return WrapperUtils.getPacketandMeetingDetails(contactId);
    }   


    @RemoteAction
    public static String getdriverInsurance(string attachmentid) {        
        query = 'select id,Body,Name from Attachment where id= \''+attachmentid+'\'';      
        return String.escapeSingleQuotes(JSON.serialize((List<Attachment>)ExecuteQueryUtil.getRecordListFromsObject(query)));
    }
    
    //AI-000587 
    @RemoteAction
    public static List<BiweeklyPayPeriod.TimeAttedanceWrap> TimeAttendance(String conId,String year){
        return BiweeklyPayPeriod.getTimeAndAttendance(conId,year);
    }

    @RemoteAction
    public static String getMileagesBasedTandAtt(String startdate,String enddate,String contactId)
    {
        return String.escapeSingleQuotes(WrapperUtils.getMileagesBasedTA(startdate,enddate,contactId));
    } 
    
    @RemoteAction
    public static List<BiweeklyPayPeriod.BiweeklyWrap> biweeklyMileage(String conId,Integer year){
        //return BiweeklyPayPeriod.getBiweeklyMileage(conId,year);
        return BiweeklyPayPeriod.getBiweeklyReimbursement(conId,year);
    }

    /*EMC-260 
    Author : Sanket Goswami
    Description : This method is used to get mileages with biweekly reimbursement data based on biweekly reimbursement selected by user*/
    @RemoteAction
    public static List<String> getBiweekMileages(String biweekId)
    {
        //return BiweeklyPayPeriod.getMileages1(date.valueof(startdate),date.valueof(enddate),contactId);
        return BiweeklyPayPeriod.getBiweekMileages1(biweekId);
       //return null;
    } 
    @RemoteAction
    public static List<String> getAllMileages(String startdate,String enddate,String contactId)
    {
        return BiweeklyPayPeriod.getAllBiweekMileages1(date.valueof(startdate),date.valueof(enddate),contactId);
    } 
    @RemoteAction
    public static void sendInsuranceEmail (String Id,String Name,String email){
        BiWeeklyWrapperUtils.sendInsuranceEmail(Id, Name, email);
    }
   /* @RemoteAction
    public static String syncTripsForErmi (String Id,String startdate,String enddate){
        //BiWeeklyWrapperUtils.sendInsuranceEmail(Id, Name, email);
        if( !Test.IsRunningTest()){
            //GetTripCalloutforCommute.GetTripCalloutForCommuteMileage(reim.id, reim.Contact_Id__r.External_Email__c, reim.Contact_Id__c, startDate, endDate, String.valueOf(reim.Fuel_Price__c), String.valueOf(reim.MPG__c), String.valueOf(reim.Maintenance_and_Tires__c), reim.Contact_Id__r.Account.Triplog_API__c, tripStatus ,putcall, activity,reim.Contact_Id__r.Account.Bi_Weekly_Pay_Period__c);
        }
        return 'sucess';
    }
    */
}