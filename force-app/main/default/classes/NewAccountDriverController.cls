/**
 * @Author: GetonCRM Solutions LLP
 * @Description: This class is use for checking driver was confirm or error biweekly reimbursement for ERMI account.Based on checkbox value we will redirect on paege.
 * @Modification logs
 * ========================================================================================================================
 * @Date: 07 April 2022 | Sanket Goswami
 * @description: EMC-284
 */
public with sharing class NewAccountDriverController {
    /*This method is used to get the data of current contact and his account details*/
    public static string videoCustom {get;set;}
    public NewAccountDriverController() {
       NewDashboardVideoLink__c videoCustomSetting = NewDashboardVideoLink__c.getOrgDefaults();
       videoCustom = json.serialize(videoCustomSetting );
    }
    @AuraEnabled
    public static string getContactDetail(String contactId){
        List<ContactWrapper> contactWrapList = new List<ContactWrapper >();
        date currentDate = system.today();
        try{
                for(Contact contactobj : [SELECT Id,Name,Insurance_Attachment_Id__c,
                                                External_Email__c,
                                                Account.Account_Status__c,
                                                Cell_Phone__c,
                                                MobilePhone,
                                                Insurance_Declaration_Status__c,
                                                Driver_Packet_Status__c,
                                                App__c,
                                                Document_Sent_Date__c,
                                                Activation_Date__c,
                                                Hello_Sign_Status__c,                                                 
                                                Schedule_Driver_Meeting__c,
                                                Account.Goto_Driver_Meeting__c,
                                                Account.Schedule_Goto_Meeting__c,
                                                Account.Bodily_Injury__c, 
                                                Account.Uninsured_Motorist__c, 
                                                Account.Property_Damage__c, 
                                                Account.Comprehensive__c, 
                                                Account.Collision__c,
                                                Account.Umbrella_Coverage__c,
                                                Account.MburseDashboardRedirect__c 
                                            FROM Contact  
                                            WHERE Id =: contactId
                                            WITH SECURITY_ENFORCED]){
                                                ContactWrapper contactWrapper = new ContactWrapper();                                        
                                                contactWrapper.contactId =  contactobj.Id;
                                                contactWrapper.contactEmail =  contactobj.External_Email__c;
                                                contactWrapper.contactName = contactobj.Name;
                                                contactWrapper.insuranceId = contactobj.Insurance_Attachment_Id__c != null ? contactobj.Insurance_Attachment_Id__c : null;
                                                contactWrapper.cellPhone =  contactobj.Cell_Phone__c != null ? contactobj.Cell_Phone__c : null;
                                                contactWrapper.mobilePhone =  contactobj.MobilePhone != null ? contactobj.MobilePhone : null;
                                                contactWrapper.accountStatus =  contactobj.Account.Account_Status__c != null ? contactobj.Account.Account_Status__c : 'New Account';
                                                contactWrapper.insuranceStatus =  contactobj.Insurance_Declaration_Status__c != null ? contactobj.Insurance_Declaration_Status__c : null;
                                                contactWrapper.driverPacketStatus =  contactobj.Driver_Packet_Status__c != null ? contactobj.Driver_Packet_Status__c : null;
                                                contactWrapper.meetingVideoLink =  contactobj.Account.Goto_Driver_Meeting__c != null ? contactobj.Account.Goto_Driver_Meeting__c : null;
                                                contactWrapper.scheduleLink =  contactobj.Account.Schedule_Goto_Meeting__c != null ? contactobj.Account.Schedule_Goto_Meeting__c : null;
                                                contactWrapper.bodilyInjury =  contactobj.Account.Bodily_Injury__c != null ? contactobj.Account.Bodily_Injury__c : null;
                                                contactWrapper.unInsuranceMotorist =  contactobj.Account.Uninsured_Motorist__c != null ? contactobj.Account.Uninsured_Motorist__c : null;
                                                contactWrapper.propertyDamage =  contactobj.Account.Property_Damage__c != null ? contactobj.Account.Property_Damage__c : null;
                                                contactWrapper.comprehensive =  contactobj.Account.Comprehensive__c != null ? contactobj.Account.Comprehensive__c : null;
                                                contactWrapper.collision =  contactobj.Account.Collision__c != null ? contactobj.Account.Collision__c : null;
                                                contactWrapper.umbrella =  contactobj.Account.Umbrella_Coverage__c != null ? contactobj.Account.Umbrella_Coverage__c : null;
                                                contactWrapper.helloSignDriverSign =  contactobj.Hello_Sign_Status__c != null ? contactobj.Hello_Sign_Status__c : null;                                                
                                                contactWrapper.mlogApp =  contactobj.App__c != null ? true : false;
                                                contactWrapper.checkDriverMeeting =  contactobj.Schedule_Driver_Meeting__c != null ? contactobj.Schedule_Driver_Meeting__c : false;
                                                contactWrapper.mburseDashboard =  contactobj.Account.MburseDashboardRedirect__c != null ? contactobj.Account.MburseDashboardRedirect__c : false;                                                
                                                date activationDate = contactobj.Activation_Date__c != null ? contactobj.Activation_Date__c : null;
                                                contactWrapper.addedActivationDate  = activationDate != null ? activationDate.addDays(30) : null ;
                                                contactWrapper.documentDate = contactobj.Document_Sent_Date__c != null ? contactobj.Document_Sent_Date__c : null;
                                                //contactWrapper.daysBetweenActivation = activationDate != null ? currentDate.daysBetween(activationDate) : null;
                                                contactWrapper.daysBetweenActivation = activationDate != null ? activationDate.daysBetween(currentDate) : null;
                                                if(contactWrapper.daysBetweenActivation != null && contactWrapper.daysBetweenActivation <= 30){
                                                    contactWrapper.checkActivationDate = true;
                                                } else if(contactWrapper.daysBetweenActivation > 30 &&  contactWrapper.helloSignDriverSign != null && contactWrapper.helloSignDriverSign == 'signed'){
                                                    contactWrapper.checkActivationDate = true;
                                                } else {
                                                    contactWrapper.checkActivationDate = false;
                                                }
                                             
                                                contactWrapList.add(contactWrapper);
                                                system.debug('inside contactWrapper'+contactWrapList);
                                            }
        } catch(System.QueryException qe) {
            System.debug(qe.getMessage());
        }
        return JSON.serialize(contactWrapList);       
    }
    /*This method is used to save current contact data */
    @AuraEnabled
    public static string updateContactDetail(String contactData,Boolean driverPacket){
        List<Contact> contactList = new List<Contact> ();
        try {
            if(contactData != null){
                List<ContactWrapper> contactWrapUpdateList = new List<ContactWrapper>();
                contactWrapUpdateList = (List<ContactWrapper>)Json.deserialize(contactData,List<ContactWrapper>.class);
                for(ContactWrapper conWrap : contactWrapUpdateList){
                    Contact conObj = new Contact();
                    conObj.Id = Id.valueOf(conWrap.contactId);
                    conObj.Cell_Phone__c = conWrap.cellPhone != null ? conWrap.cellPhone : null ;
                    conObj.Insurance_Declaration_Status__c = conWrap.insuranceStatus != null ? conWrap.insuranceStatus : null ;
                    if(conObj.Insurance_Declaration_Status__c == 'Skip' && (driverPacket != true)){
                        sendEmailToDriver(contactData,conWrap.contactName,conWrap.contactId);
                    }
                    conObj.Driver_Packet_Status__c = conWrap.driverPacketStatus != null ? conWrap.driverPacketStatus : null ;
                    //conObj.mlog_App__c = conWrap.mlogApp != null ? conWrap.mlogApp : false ;                    
                    conObj.Schedule_Driver_Meeting__c = conWrap.checkDriverMeeting != null ? conWrap.checkDriverMeeting : false ;
                    contactList.add(conObj);
                }
            }
            if(contactList.size() > 0 && Schema.sObjectType.Contact.isUpdateable()){
                update contactList;
            }
        } catch (Exception ex){
            System.debug(ex.getMessage());
        }
        
        return 'Success';
    }
    /*This method is used to send a email to driver when driver skip insurance upload functionality. */
    @TestVisible 
    private static void sendEmailToDriver (String contactData,String driverName,String contactId) {
        OrgWideEmailAddress[] owea = [SELECT Id,Address from OrgWideEmailAddress where Address = 'driverservices@mburse.com'];
        List<Messaging.SingleEmailMessage> emailist = new List<Messaging.SingleEmailMessage>();
        List<String> toAddress = new List<String>();
        EmailTemplate templateId;
        String newemailBody;
        try {
            if(contactId != null){
                templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Skip_Insurance_Upload' Limit 1];
            } else {
                templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Driver_Packet_Sign' Limit 1];
            }          
        } catch(System.QueryException qe) {
            System.debug(qe.getMessage());
        }
        
        newemailBody = templateId.HtmlValue;
        if(contactData != null && contactId != null){
                List<ContactWrapper> contactWrapUpdateList = new List<ContactWrapper>();
                contactWrapUpdateList = (List<ContactWrapper>)Json.deserialize(contactData,List<ContactWrapper>.class);
                for(ContactWrapper conWrap : contactWrapUpdateList){
                    toAddress.add(conWrap.contactEmail);
                    newemailBody = newemailBody.replace('{!bodily}', String.valueOf(conWrap.bodilyInjury));
                    newemailBody = newemailBody.replace('{!uninsuredMotorist}', String.valueOf(conWrap.unInsuranceMotorist));
                    newemailBody = newemailBody.replace('{!property}', (conWrap.propertyDamage).format());
                    newemailBody = newemailBody.replace('{!collisionDeduct}', (conWrap.collision).format());
                    newemailBody = newemailBody.replace('{!compreDeduct}', (conWrap.comprehensive).format());
                }
        } else {
            toAddress.add(contactData);
        }
        newemailBody = newemailBody.replace('{!Driver.Name}', driverName);        
        newemailBody = newemailBody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        messaging.singleEmailMessage email;
        email = Utils.CreateEmail(templateId.Subject,newemailBody,toAddress,null,null,null);    
        emailist.add(email);
        SendEmail__c  sendEmailObj = SendEmail__c.getValues('ConfirmTripTimeERMIController');
        if(emailist.size() > 0 && !Test.isRunningTest() && sendEmailObj.Send_email_from_code__c == true){
            Messaging.SendEmailResult [] result = Messaging.sendEmail(emailist, false);
        }        
    }
    /*This method is used to display data on page */
    @AuraEnabled
    public static String getDriverDetailsClone(String contactId) {            
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id, Name, MailingPostalCode, MailingState, MailingCity,Driver_Type__c, 
                                        Fixed_Amount__c, compliancestatus__c, Car_Image__c, Account.Name, Account.Logo_Document_Id__c, 
                                        Vehicle_Type__c,Insurance_Attachment_Id__c, Account.Triplog_API__c, Email,
                                        Maintenance__c,Tires__c, Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                        Depreciation__c, Total_Monthly_Costs__c, Business_Use__c,Fixed_Cost_Adjustment__c,
                                        Monthly_Reimbursement__c,Biweek_Reimbursement__c,Time_Attandance__c,
                                        Account.Bi_Weekly_Pay_Period__c
                                    FROM Contact 
                                    WHERE id =: contactId];
        return JSON.serialize(driverDataList ).unescapeHtml4();
    }
    /*This method is used to send notification email to driver and it's admin*/
    @AuraEnabled
    public static void sendInsuranceEmail (String id,String name,String email){
        BiWeeklyWrapperUtils.sendInsuranceEmail(id, name, email);
    }
    @AuraEnabled
    public static String readFromFileInchunk(String attachmentBody, String attachmentName, String attachmentId,String contactId,String accountId,String contactattachementid) {
        return  WrapperUtils.readFromFileInchunk(attachmentBody,attachmentName,attachmentId,contactId,accountId,contactattachementid);   
    }
    /* This method is use to get custom setting value for display videos on mburse dashboard page */
    @AuraEnabled(cacheable=true) 
    public static NewDashboardVideoLink__c getCustomSettings(){
        return NewDashboardVideoLink__c.getOrgDefaults();
    }
    /* This method is use to get custom setting value for display messages on mburse dashboard page */
    @AuraEnabled(cacheable=true) 
    public static NewDashboardMessage__c getCustomSettingsForMessage(){
        return NewDashboardMessage__c.getOrgDefaults();
    }
    /*This method is use for Hello sign integration.It will send driver packet to Driver */
    @AuraEnabled(cacheable = true) 
    public static string sendSignatureRequestForDriver(String userEmail,String contactName){
        //sendEmailToDriver(userEmail,contactName,null);
        Set<String> newUserEmailSet = new Set<String>();
        newUserEmailSet.add(userEmail);
        HelloSignIntegrationHandler.sendSignatureRequestForDriver(newUserEmailSet);
        return 'success';
    }
    @AuraEnabled(cacheable = true) 
    public static string sendWelcomeEmail(String accountID,String empEmail){
        String response = RosterController.putHTTP(accountID,empEmail) ;
        return response;
    }
    /*This method is use to redirect contact on particular dashboard page. */
    @AuraEnabled
    public static String loginRedirection(String contactId){
        Contact  contactObj = new Contact ();
        List<Bi_Weekly_Reimbursement__c> biWeekList = new List<Bi_Weekly_Reimbursement__c>();
        contactObj = [SELECT id,
                            Role__c,
                            showTeamRecord__c, 
                            AccountId, 
                            Insurance_Attachment_Id__c, 
                            Driver_Type__c, 
                            Driver_Packet_Status__c, 
                            Insurance_Declaration_Status__c  
                        FROM Contact
                        WHERE Id =: contactId];
        if(contactObj.Accountid == System.label.ERMI_Account){
            biWeekList = [SELECT id,name,Start_Date__c,
                                        End_Date__c,Confirm_Hours__c,
                                        Error_Hours__c,Count_Error_Check__c 
                                    FROM Bi_Weekly_Reimbursement__c 
                                    WHERE Contact__c =: contactId
                                    AND Start_Date__c != null 
                                    AND End_Date__c <= TODAY 
                                    Order By End_Date__c desc limit 1];
        }
       
        if(contactObj != null ){
            String pageRef;
            if(contactObj.Role__c == StaticValues.ROLE_DRIVER) {
                //AI-000414
                if(biWeekList.size() > 0){
                    if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3){
                        pageRef = '/app/driverDashboardWeekly?accid='+contactObj.Accountid+'&id='+contactId;
                    } else if((biWeekList[0].Confirm_Hours__c == true || (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)) ){
                        pageRef = '/app/driverDashboardClone?accid='+contactObj.Accountid+'&id='+contactId;
                    } /* else if(contactObj.Insurance_Attachment_Id__c == null){
                        pageRef = '/app/uploadInsurance?accid='+contactObj.Accountid+'&id='+contactid; 
                    } */
                } else {
                    /*if(contactObj.Insurance_Attachment_Id__c != null ){
                        pageRef = '/app/driverDashboardClone?accid='+contactObj.Accountid+'&id='+contactId;
                    } else {
                        pageRef = '/app/driverDashboardInsuranceClone?accid='+contactObj.Accountid+'&id='+contactId; }
                        pageRef = '/app/uploadInsurance?accid='+contactObj.Accountid+'&id='+contactid;  */                           
                        pageRef = '/app/driverDashboardClone?accid='+contactObj.Accountid+'&id='+contactId;
                }
                return pageRef;
            } else if(contactObj.Role__c == StaticValues.ROLE_DRIVERMANAGER ) {
                if(biWeekList.size() > 0 ){
                    if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3 ){
                        pageRef = '/app/driverDashboardWeekly?accid='+contactObj.Accountid+'&id='+contactId+'&showteam='+String.valueOf(contactObj.showTeamRecord__c)+'&role=managerdriver';
                    } else if(biWeekList[0].Confirm_Hours__c == true ||  (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)){
                        pageRef = '/app/drivermanagerdashboard?accid='+contactObj.Accountid+'&id='+contactId+'&showteam='+String.valueOf(contactObj.showTeamRecord__c);
                    }
                } else {
                    pageRef = '/app/drivermanagerdashboard?accid='+contactObj.Accountid+'&id='+contactId+'&showteam='+String.valueOf(contactObj.showTeamRecord__c);
                }                
                return pageRef;
            } else if(contactObj.Role__c == StaticValues.roleAdminDriver  ) {
                if(biWeekList.size() > 0 ){
                    if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3 ){
                        pageRef = '/app/driverDashboardWeekly?accid='+contactObj.Accountid+'&id='+contactId+'&showteam='+String.valueOf(contactObj.showTeamRecord__c)+'&admindriver=true';
                    } else if(biWeekList[0].Confirm_Hours__c == true ||  (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)){
                        pageRef = '/app/admindriverdashboard?accid='+contactObj.Accountid+'&id='+contactId+'&showteam='+String.valueOf(contactObj.showTeamRecord__c)+'&admindriver=true';
                    }
                } else {
                    pageRef = '/app/admindriverdashboard?accid='+contactObj.Accountid+'&id='+contactId+'&showteam='+String.valueOf(contactObj.showTeamRecord__c)+'&admindriver=true';
                } 
                return pageRef;
            }  
        }
        return 'success';
    }
    public class ContactWrapper {
        public string contactId { get; set; }
        public string contactName {get; set;}
        public string insuranceId {get; set;}
        public string contactEmail {get; set;}
        public string cellPhone { get; set; }
        public string mobilePhone { get; set; }
        public string accountStatus { get; set; }        
        public string insuranceStatus { get; set; }
        public string driverPacketStatus {get; set;}
        public string meetingVideoLink {get; set;}
        public string scheduleLink {get; set;}
        public string bodilyInjury {get; set;}
        public string unInsuranceMotorist {get; set;}
        public Decimal propertyDamage {get; set;}
        public Decimal comprehensive {get; set;}
        public Decimal collision {get; set;}
        public Decimal umbrella {get; set;}
        public Boolean mlogApp {get; set;}
        public Boolean checkDriverMeeting {get; set;}
        public Boolean checkActivationDate {get; set;}
        public Boolean mburseDashboard {get; set;}
        public Boolean planPreview {get; set;}
        public integer daysBetweenActivation {get; set;}
        public string helloSignDriverSign{get; set;}
        public Date documentDate {get; set;}
        public Date addedActivationDate {get; set;}
    }
}