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
    public string milWrapper {get; set;}
    
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
    @RemoteAction
    public static String UploadMileage(string mileage,string  accId,String adminId) { 
        List<JSONMilList> MilJson = JSONMilList.parse(mileage);
        set<string> employeeIdList = new set<string>(); 
        set<string> monthList = new set<String>();
        for(JSONMilList objJson : MilJson ){
            if(objJson.EmployeeId != null){
                employeeIdList.add(string.valueOf(objJson.EmployeeId));
            }
            if(objJson.Trip_Date != null && objJson.Trip_Date.contains('/')){
                String ExtractedDate = objJson.Trip_Date;
                list<String> lstSplitDate = ExtractedDate.split('/');
                monthList.add(lstSplitDate[0]+'-'+ lstSplitDate[2]); 
            }
        }
        map<string, string> empIdvsEmailMap = new map<string, string>();
        map<string, Id> reimIdMap = new map<string, Id>();
        map<string, Decimal> empIdvsMPGMap = new map<string, Decimal>();
        map<string, Decimal> empIdvsMaintireMap = new map<string, Decimal>();
        List<Employee_Mileage__c> empNotSendMilList = new List<Employee_Mileage__c>();
        for(Employee_Reimbursement__c reimList : [SELECT id,name,Contact_Id__r.External_Email__c,Month__c,MPG__c,Maintenance_and_Tires__c, Contact_Id__r.Employee_ID__c
                                                  FROM Employee_Reimbursement__c 
                                                  WHERE Contact_Id__r.Employee_ID__c IN: employeeIdList 
                                                  AND Month__C IN: monthList]) {
                                                    if(reimList.Contact_Id__r.Employee_ID__c != null) {
                                                        reimIdMap.put(reimList.Contact_Id__r.Employee_ID__c +':'+reimList.Month__c, reimList.Id);
                                                        empIdvsEmailMap.put(reimList.Contact_Id__r.Employee_ID__c +':'+reimList.Month__c, reimList.Contact_Id__r.External_Email__c);
                                                        if(reimList.MPG__c != null){
                                                            empIdvsMPGMap.put(reimList.Contact_Id__r.Employee_ID__c+':'+reimList.Month__c,reimList.MPG__c); 
                                                        } else {
                                                            empIdvsMPGMap.put(reimList.Contact_Id__r.Employee_ID__c+':'+reimList.Month__c,0);  
                                                        }
                                                        if(reimList.Maintenance_and_Tires__c != 0){
                                                            empIdvsMaintireMap.put(reimList.Contact_Id__r.Employee_ID__c+':'+reimList.Month__c,reimList.Maintenance_and_Tires__c);     
                                                        } else {
                                                            empIdvsMaintireMap.put(reimList.Contact_Id__r.Employee_ID__c+':'+reimList.Month__c,0);      
                                                        }  
                                                    }
                                                  }
        List<Employee_Mileage__c> empMilList = new List<Employee_Mileage__c>();
        for(JSONMilList objJson : MilJson){ 
            if(objJson.Contact_Email != null ) {
                list<String> tripDateSplit = new list<String>();
                string mapKey;
                Employee_Mileage__c mil = new Employee_Mileage__c();
                if(objJson.Trip_Date != null && objJson.Trip_Date.contains('/')){
                    tripDateSplit = objJson.Trip_Date.split('/');
                  mapKey = objJson.EmployeeId+':'+tripDateSplit[0]+'-'+tripDateSplit[2];
                }
                if(tripDateSplit.size() > 0) {  
                    mil.Trip_Date__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2]));
                    mil.ConvertedStartTime__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2]));
                }
                mil.Trip_Origin__c = objJson.Trip_Origin;
                mil.Trip_Destination__c = objJson.Trip_Destination;
                mil.Trip_Status__c = objJson.Trip_Status;
                if(objJson.Trip_Status == 'Approved' || objJson.Trip_Status == 'Rejected') {
                    if(objJson.Approved_Date != null && objJson.Approved_Date.contains('/') ){
                        list<String> approvedDateSplit = objJson.Approved_Date.split('/'); 
                        mil.Approved_Date__c = date.valueof(Date.parse(approvedDateSplit[0]+'/'+approvedDateSplit[1] +'/'+approvedDateSplit[2]));
                    } else {
                        mil.Approved_Date__c = system.today();
                    }
                } else {
                    mil.Approved_Date__c = null;
                }
                mil.Day_Of_Week__c = objJson.Day_Of_Week;
                mil.Notes__c = objJson.Notes;
                mil.EMP_Mileage__c = objJson.Actual_Mileage;
                mil.Activity__c = objJson.Activity;
                mil.Tag__c = objJson.Tag;
                mil.Employee_ID__c = objJson.EmployeeId;
                if(empIdvsEmailMap.containsKey(mapKey)) {
                    mil.Contact_Email_Id__c = empIdvsEmailMap.get(mapKey);
                }
                if(empIdvsMPGMap.containsKey(mapKey)) {
                    mil.MPG__c = empIdvsMPGMap.get(mapKey);
                }
                if(empIdvsMaintireMap.containsKey(mapKey)) {
                    mil.Maintenance_and_Tires__c = empIdvsMaintireMap.get(mapKey);
                }
                if(reimIdMap.containsKey(mapKey)) {
                    mil.EmployeeReimbursement__c = string.valueOf(reimIdMap.get(mapKey));
                    empMilList.add(mil);
                } else {
                    empNotSendMilList.add(mil);
                }
            }
        }
        Database.SaveResult[] srList = Database.insert(empMilList, false);
        Map<Integer,String> errorMap = new Map<Integer,String>();
        Integer tripcount= 0;
        if(srList.size() > 0){
            for (Database.SaveResult sr : srList) {
                System.debug('sr' + sr);
                if (sr.isSuccess() == false) {
                    for(Database.Error objErr : sr.getErrors()) {
                        errorMap.put(tripcount, objErr.getMessage());
                    }
                }
                tripcount++;
            }
        }
        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
        if(errorMap.keySet().size() > 0 || empNotSendMilList.size() > 0){
            blob excel;
            if(errorMap.keySet().size() > 0){
                string header ='Trip_Date'+'\t'+'Trip_Origin'+'\t'+'Trip_Destination'+'\t'+ 'Trip_Status'+'\t'+'Approved_Date'+'\t'+'Day_Of_Week'+'\t'+'Notes'+'\t'+'Actual_Mileage'+'\t'+'Activity'+'\t'+'Contact_Email'+'\t'+'Tag'+'\t'+'EmployeeId'+'\t'+'Error Message'+' \n';
                String finalstr = header;
                for(Integer mapkey : errorMap.keySet()){
                    String Recordstring = empMilList.get(mapkey).Trip_Date__c+'\t'+empMilList.get(mapkey).Trip_Origin__c+'\t'+empMilList.get(mapkey).Trip_Destination__c+'\t'+empMilList.get(mapkey).Trip_Status__c+'\t'+empMilList.get(mapkey).Approved_Date__c+'\t'+empMilList.get(mapkey).Day_Of_Week__c+'\t'+empMilList.get(mapkey).Notes__c+'\t'+empMilList.get(mapkey).EMP_Mileage__c+'\t'+empMilList.get(mapkey).Activity__c+'\t'+empMilList.get(mapkey).Contact_Email_Id__c+'\t'+empMilList.get(mapkey).Tag__c+'\t'+empMilList.get(mapkey).Employee_ID__c+'\t'+errorMap.get(mapkey)+'    \n';
                    finalstr = finalstr + Recordstring;
                }
                attach.setFileName('Trips not inserted.xls');
                excel = blob.valueOf(finalstr);
                
            }
            attach.setBody(excel);
            List<Contact> conList = [SELECT id,FirstName,External_Email__c
                                    FROM Contact 
                                    WHERE id =:adminId];
            EmailTemplate templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Bi_weekly_Not_Inserted_Trips' Limit 1];
            OrgWideEmailAddress[] owea = [SELECT Id,Address from OrgWideEmailAddress where Address = 'driverservices@mburse.com'];
            List<String> toAddress = new List<String>();
            SendEmail__c  sendEmailObj = SendEmail__c.getValues('ManageNotificationController');
            List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
            String newemailBody = templateId.HtmlValue;
            Date todayDate = system.today();
            newemailBody = newemailBody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
            newemailBody = newemailBody.replace('{Contact.Name}', conList[0].FirstName);
            toAddress.add(conList[0].External_Email__c);
            //toAddress.add('Sanket.goswami@getoncrm.com');
            Messaging.EmailFileAttachment attach2 = new Messaging.EmailFileAttachment();
            attach2.setFileName('Wrong employee ID.xls');
            blob excel2;
            if(empNotSendMilList.size() > 0){
                string header1 ='Trip_Date'+'\t'+'Trip_Origin'+'\t'+'Trip_Destination'+'\t'+ 'Trip_Status'+'\t'+'Approved_Date'+'\t'+'Day_Of_Week'+'\t'+'Notes'+'\t'+'Actual_Mileage'+'\t'+'Activity'+'\t'+'Contact_Email'+'\t'+'Tag'+'\t'+'EmployeeId'+'\t'+'Error Message'+' \n';
                String finalstr1 = header1;
                for(Employee_Mileage__c objMil : empNotSendMilList){
                    String Recordstring = objMil.Trip_Date__c+'\t'+objMil.Trip_Origin__c+'\t'+objMil.Trip_Destination__c+'\t'+objMil.Trip_Status__c+'\t'+objMil.Approved_Date__c+'\t'+objMil.Day_Of_Week__c+'\t'+objMil.Notes__c+'\t'+objMil.EMP_Mileage__c+'\t'+objMil.Activity__c+'\t'+objMil.Contact_Email_Id__c+'\t'+objMil.Tag__c+'\t'+objMil.Employee_ID__c+'\t'+'Please check Employee Id,Trip date,Contact Email and Deactivation Date'+'    \n';
                    finalstr1 = finalstr1 + Recordstring;
                }
                excel2 = blob.valueOf(finalstr1);
            }
            attach2.setBody(excel2);
            messaging.singleEmailMessage email = Utils.CreateEmail('Not Inserted Trips From Communication Page',newemailBody,toAddress,null,null,null);
            if(attach.getBody()  != null && attach2.getBody() != null){
                email.setFileAttachments(new Messaging.EmailFileAttachment[]{attach,attach2});
            } else if(attach.getBody() != null){
                email.setFileAttachments(new Messaging.EmailFileAttachment[]{attach});
            } else if(attach2.getBody() != null){
                email.setFileAttachments(new Messaging.EmailFileAttachment[]{attach2});
            }
            email.setOrgWideEmailAddressId(owea.get(0).Id);
            emails.add(email);  
            if(!emails.isEmpty() && !Test.IsRunningTest() && sendEmailObj.Send_email_from_code__c == true) {                    
                Messaging.SendEmailResult [] result = Messaging.sendEmail(emails, false);
                System.debug('send email=========='+result);
            }
        }
        return 'Success';
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