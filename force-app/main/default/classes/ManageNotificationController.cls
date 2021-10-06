public with sharing class ManageNotificationController {
    public static String accId;
    public static String adminId;
    public static String query;
    public static String role {get;set;}
    public static String managerrole {get;set;}
    public static String manrole {get;set;}
    public static String contactDataAsString {get; set;}
    public static String logoDocument_id {get;set;}
    public string conWrapper {get; set;}
    public ManageNotificationController() {
        accId = ApexPages.currentPage().getParameters().get('accId');
        adminId = ApexPages.currentPage().getParameters().get('id');
        String manager;
         if (ApexPages.currentPage().getParameters().containsKey('managerid') && String.isNotBlank(ApexPages.currentPage().getParameters().get('managerid'))) {
            manager = ApexPages.currentPage().getParameters().get('managerid');
         }
         if (ApexPages.currentPage().getParameters().containsKey('manid') && String.isNotBlank(ApexPages.currentPage().getParameters().get('manid'))) {
            manager = ApexPages.currentPage().getParameters().get('manid');
         }
        if(manager != null){
            List<Contact> conList = [SELECT id,name,Role__c 
                                    FROM Contact 
                                    WHERE id =: manager ];
                        managerrole = conList[0].Role__c ;                 
        }
        if(accId != null){
           conWrapper = NewEmployeeData(accId,adminId );
        }
    }
    @RemoteAction
    public static string NewEmployeeData(String accountId,String adminId)
    {
        List<Contact> conList = [SELECT id,name,Role__c 
                                    FROM Contact 
                                    WHERE id =: adminId];
                  role = conList[0].Role__c ;                  
        List<ContactWrapper> conWrapList = new List<ContactWrapper>();
        if(conList.size() > 0 && (conList[0].Role__c == StaticValues.ROLE_ADMIN || conList[0].Role__c == StaticValues.roleAdminDriver)){
            for(Contact con : [SELECT id,FirstName, LastName, Insurance__c, Expiration_Date__c,
                                    Notification_Message__c ,External_Email__c,Triplog_UserID__c,
                                    Insurance_Attachment_Id__c, Notification_Date__c,
                                    Role__c
                                FROM Contact 
                                WHERE AccountId =: accountId
                                      AND Role__c != 'Admin'
                                      AND Deactivated_Date__c = null 
                                      Order By FirstName]) {
                                    ContactWrapper conWrap = new ContactWrapper();
                                    conWrap.contactId = con.Id;
                                    conWrap.triploguserid = String.valueof(con.Triplog_UserID__c);
                                    conWrap.name = con.FirstName;
                                    conWrap.lastname = con.LastName;
                                    conWrap.fullname = conWrap.name+' '+conWrap.lastname;
                                    conWrap.insurance = con.Insurance__c ;
                                    conWrap.role  = con.Role__c;
                                    conWrap.isEditable = false;
                                    conWrap.massEmail = false;
                                    conWrap.contactEmail = con.External_Email__c;
                                    if(con.Expiration_Date__c != null){
                                        conWrap.expirationDate = con.Expiration_Date__c;
                                    }
                                    conWrap.notiMessage = con.Notification_Message__c;
                                    conWrap.insuranceId = con.Insurance_Attachment_Id__c;
                                    conWrap.notificationDate = con.Notification_Date__c;
                                    conWrapList.add(conWrap);
                }
            } else {
                for(Contact con : [SELECT id,FirstName, LastName, Insurance__c, Expiration_Date__c,
                                    Notification_Message__c ,External_Email__c,Triplog_UserID__c,
                                    Insurance_Attachment_Id__c, Notification_Date__c,
                                    Role__c
                                FROM Contact 
                                WHERE AccountId =: accountId
                                      AND Role__c != 'Admin'
                                      AND Deactivated_Date__c = null 
                                      AND ((Manager__c =: AdminId) 
                                        OR (Manager__r.Manager__c =: AdminId) 
                                        OR (Manager__r.Manager__r.Manager__c =: AdminId) 
                                        OR (Manager__r.Manager__r.Manager__r.Manager__c =: AdminId) 
                                        )
                                      Order By FirstName]) {
                                    ContactWrapper conWrap = new ContactWrapper();
                                    conWrap.contactId = con.Id;
                                    conWrap.triploguserid = String.valueof(con.Triplog_UserID__c);
                                    conWrap.name = con.FirstName;
                                    conWrap.lastname = con.LastName;
                                    conWrap.fullname = conWrap.name+' '+conWrap.lastname;
                                    conWrap.insurance = con.Insurance__c ;
                                    conWrap.role  = con.Role__c;
                                    conWrap.isEditable = false;
                                    conWrap.massEmail = false;
                                    conWrap.contactEmail = con.External_Email__c;
                                    if(con.Expiration_Date__c != null){
                                        conWrap.expirationDate = con.Expiration_Date__c;
                                    }
                                    conWrap.notiMessage = con.Notification_Message__c;
                                    conWrap.insuranceId = con.Insurance_Attachment_Id__c;
                                    conWrap.notificationDate = con.Notification_Date__c;
                                    conWrapList.add(conWrap);
                }
            }
            String wrapjson = JSON.serialize(conWrapList);
            return wrapjson;
    }
    @RemoteAction
    public static string editInlineNewEmployee(String listofemployee,String adminId) {
        System.debug('listofemployee='+listofemployee);
        List<Contact> conList = [SELECT id,name 
                                    FROM Contact 
                                    WHERE id =: adminId];
        List<Messaging.MassEmailMessage> mails = new List<Messaging.MassEmailMessage>();
        OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address =:'driverservices@mburse.com'];
        List<EmailTemplate> temp = new List<EmailTemplate>([SELECT id, Subject, body, HTMLValue FROM EmailTemplate 
                                                                WHERE DeveloperName = 'New_Notification_For_Driver']);
       
        Messaging.SingleEmailMessage mail;
        List<Messaging.SingleEmailMessage> mail_list = new List<Messaging.SingleEmailMessage>();
        List<Contact> updateEmployeeList = new List<Contact>();
        if(listofemployee!=null)
        {
            List<ContactWrapper> conWrapUpdateList = new List<ContactWrapper>();
            conWrapUpdateList = (List<ContactWrapper>)Json.deserialize(listofemployee,List<ContactWrapper>.class);
            for(ContactWrapper conwrap : conWrapUpdateList){
                Contact currentContact = new Contact();
                 System.debug('conwrap ()'+conwrap );
                currentContact.Id = conwrap.contactId;
                currentContact.Notification_Message__c = conwrap.notiMessage;
                currentContact.Notification_Date__c = system.today();
                updateEmployeeList.add(currentContact);
                List<String> sendingTo = new List<String>();
                string htmlbody = '';
                mail = new Messaging.SingleEmailMessage();
                if (owea.size() > 0) {
                        mail.setOrgWideEmailAddressId(owea.get(0).Id);
                    }
                sendingTo.add(conwrap.contactEmail);
                mail.setToAddresses(sendingTo);
                mail.setSubject(temp[0].Subject);
                htmlbody = temp[0].HTMLValue;
                htmlbody = htmlbody.replace('{!Contact.Name}',conwrap.name);
                htmlbody = htmlbody.replace('{!AdminName}',conList[0].name);
                htmlbody = htmlbody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
                mail.setPlainTextBody(htmlbody);
                List<String> bccaddress = new list<String>();
                bccaddress.add('driverservices@mburse.com');
                mail.setBccAddresses(bccaddress);
                mail.setHtmlBody(htmlbody);
                mail_list.add(mail);
            }
        }
        if(!updateEmployeeList.isEmpty() && !Test.isRunningTest()){
            update updateEmployeeList;
        }
        
        SendEmail__c  sendEmailObj = SendEmail__c.getValues('SendMileageReminderforDelta');
        if((sendEmailObj!=null) && sendEmailObj.Send_email_from_code__c==true && mail_list.size()>0 && !Test.isRunningTest())
        {
            Messaging.sendEmail(mail_list);  
        } 
        return 'Success';
    }

    @RemoteAction
    public static string sendAllInsuranceEmail(String listofemployee,String adminId) {
        
        List<Contact> conList = [SELECT id,name 
                                    FROM Contact 
                                    WHERE id =:adminId];
                                    System.debug('conList'+conList);
        EmailTemplate templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Insurance_Declaration_Noti' Limit 1];
        OrgWideEmailAddress[] owea = [SELECT Id,Address from OrgWideEmailAddress where Address = 'driverservices@mburse.com'];
        Messaging.SingleEmailMessage mail;
        List<Messaging.SingleEmailMessage> mail_list = new List<Messaging.SingleEmailMessage>();
        if(listofemployee!=null)
        {
            List<ContactWrapper> conWrapUpdateList = new List<ContactWrapper>();
            conWrapUpdateList = (List<ContactWrapper>)Json.deserialize(listofemployee,List<ContactWrapper>.class);
            for(ContactWrapper conwrap : conWrapUpdateList){ 
                if(conwrap.massEmail = true){
                    List<String> sendingTo = new List<String>();
                    string htmlbody = '';
                    mail = new Messaging.SingleEmailMessage();
                    if (owea.size() > 0) {
                            mail.setOrgWideEmailAddressId(owea.get(0).Id);
                        }
                    sendingTo.add(conwrap.contactEmail);
                    mail.setToAddresses(sendingTo);
                    mail.setSubject(templateId.Subject);
                    htmlbody = templateId.HTMLValue;
                    htmlbody = htmlbody.replace('{!Contact.Name}',conwrap.name);
                    htmlbody = htmlbody.replace('{!AdminName}',conList[0].name);
                    mail.setPlainTextBody(htmlbody);
                    List<String> bccaddress = new list<String>();
                    bccaddress.add('driverservices@mburse.com');
                    mail.setBccAddresses(bccaddress);
                    mail.setHtmlBody(htmlbody);
                    mail_list.add(mail);
                }
            }
        }
        SendEmail__c  sendEmailObj = SendEmail__c.getValues('SendMileageReminderforDelta');
        if((sendEmailObj!=null) && sendEmailObj.Send_email_from_code__c==true && mail_list.size()>0 && !Test.isRunningTest())
        {
            Messaging.sendEmail(mail_list);  
        } 
        return 'Success';
    }
    @RemoteAction
    public static String readFromFileInchunk(String attachmentBody, String attachmentName, String attachmentId,String did,String accid,String contactattachementid)
    {
        return  WrapperUtils.readFromFileInchunk(attachmentBody,attachmentName,attachmentId,did,accid,contactattachementid);   
    }

    @RemoteAction
    public static String getdriverInsurance(string attachmentid) {        
        query = 'select id,Body,Name from Attachment where id= \''+attachmentid+'\'';      
        return String.escapeSingleQuotes(JSON.serialize((List<Attachment>)ExecuteQueryUtil.getRecordListFromsObject(query)));
    }
    
    @RemoteAction
    public static String UploadLocation(string location,string  accId) {   
        String MLOGACCOUNT = System.Label.Triplog_New_URL;   
        
        String body, apiToken;
        List<Account> accountList = [SELECT id,Triplog_API__c  
                                        FROM Account 
                                            WHERE Triplog_API__c != null 
                                            AND Id =: accId];
        apiToken = accountList[0].Triplog_API__c;
        String baseURL = !MLOGACCOUNT.Contains(apiToken) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL; 
        baseURL = (baseURL + '/api/locations');
        system.debug('baseURL'+baseURL);
        
        List<JSONLocation> LocationJson = JSONLocation.parse(location);
        for(JSONLocation obj : LocationJson ){
           system.debug(obj);
           body = JSON.serialize(obj);
           system.debug('=='+body );
             try {
                if(!Test.isRunningTest()) {
                    HttpResponse res = ApiCalloutUtility.executeCallout(apiToken,'POST',baseURL,'',body);
                    system.debug('res'+res);
                }
            } catch(System.CalloutException er) { }
        }
           
        return null;
    }

    public class ContactWrapper {
        public string contactId { get; set; }
        public string triploguserid{ get; set; }
        public string name { get; set; }
        public string lastname { get; set; }
        public string role { get; set; }
        public string fullname { get; set; }
        public string insurance { get; set; }
        public string contactEmail { get; set; }
        public string notiMessage { get; set; }
        public string insuranceId { get; set; }
        public Boolean isEditable { get; set; }
        public Boolean massEmail { get; set; }
        public date expirationDate { get; set; }
        public date notificationDate { get; set; }
    }
}