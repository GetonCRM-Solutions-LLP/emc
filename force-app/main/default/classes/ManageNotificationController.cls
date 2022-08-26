public without sharing class ManageNotificationController {
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
    public static Boolean isTestClass = false;
    public static Boolean checkTrueDialog {get; set;} 
    
    /** 
    * ********************************************************
    Developer Name : Dhanraj Khatri
    * sendMessageToMultipleContacts - Method for Sending Message to multiple contacts
    *Parameters:
        trueDialogContactIdList : JSON of List Of TrueCaller Contact Id
        message : message
    Note : 1.ActionId will be same for all the message that will send in bulk.
    * ********************************************************
    */
    
    @RemoteAction
    public static String sendMessageToMultipleContacts(String trueDialogContactIdList,String message){   
        System.debug('**in  sendMessageToMultipleContacts**');
        System.debug('**trueDialogContactIdList**'+trueDialogContactIdList);
        System.debug('**message**'+message);

        List<String> trueDialogContactIdListArray = (List<String>)System.JSON.deserialize(trueDialogContactIdList, List<String>.class);
        String result;
        try {
            HttpResponse response = new HttpResponse();
           
            String requestBody = TrueDiaolgSendMessageWrapper.generateBulkSendMessageReqBody(trueDialogContactIdListArray,message);
            response = TrueDialogAPICallout.executeCallout('POST','action-pushCampaign',requestBody,null);   
            
            List<Message__c> lstMessage = new List<Message__c>();
           
            Database.SaveResult[] saveResultList ;
           
            if (response.getStatusCode() < 300) {               
                TrueDiaolgSendMessageWrapper trueDialogWrapper = TrueDiaolgSendMessageWrapper.parse(response.getBody());                
                for(Contact con : [Select Id,TrueDialog_Contact_Id__c FROM Contact 
                                    WHERE TrueDialog_Contact_Id__c IN: trueDialogContactIdListArray]){

                    Message__c messageRecord = new Message__c();
                    messageRecord.Contacts__c = con.Id;
                    messageRecord.Action_Id__c = trueDialogWrapper.id;
                    messageRecord.Message__c = message;
                    lstMessage.add(messageRecord);
                }
                saveResultList = Database.insert(lstMessage, false);
            } else {  
                String trueDialogError = response.getBody() + ',' + response.getStatusCode() + ': ' + response.getStatus() + '\n';
                result = 'failed';
                System.debug(trueDialogError);     
            }
            
            for(Integer i=0;i<saveResultList.size();i++){
            	if (saveResultList[i].isSuccess()) {
                    System.debug('Successfully inserted message. Message ID: ' + saveResultList[0].getId());
                    result = 'success';
                }else {                 
                    result = 'failed';
                    break;
                }
            }     
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        }       
        return result;            
    }    

    @RemoteAction
    public static String sendImageToMultipleContacts(String trueDialogContactIdList,String attachmentBody, String attachmentName,String message){   
      
        List<String> trueDialogContactIdListArray = (List<String>)System.JSON.deserialize(trueDialogContactIdList, List<String>.class);
        String result;
        Database.SaveResult[] saveResultList ;

        String boundary='webkit1234567';

        String header = '--' + boundary + '\r\n' +
                            + 'Content-Type: image/jpg\r\n'+
                            + 'Content-Disposition: form-data; name=\"media\"; filename=\"' + attachmentName +'\"';
                        

        String headerEncoded = EncodingUtil.base64Encode(Blob.valueOf(header + '\r\n\r\n'));

        String footer = '--' + boundary + '--';

        while(headerEncoded.endsWith('='))
        {
            header += ' ';
            headerEncoded = EncodingUtil.base64Encode(Blob.valueOf(header+'\r\n\r\n'));
        }

        String bodyEncoded = EncodingUtil.base64Encode(EncodingUtil.base64Decode(attachmentBody));

        Blob bodyBlob = null;

        String last4Bytes = bodyEncoded.substring(bodyEncoded.length()-4,bodyEncoded.length());
        
        System.debug('----->last4Bytes: '  + last4Bytes );

        if(last4Bytes.endsWith('==')) {
            last4Bytes = last4Bytes.substring(0,2) + '0K';
            bodyEncoded = bodyEncoded.substring(0,bodyEncoded.length()-4) + last4Bytes;
            // We have appended the \r\n to the Blob, so leave footer as it is.
            String footerEncoded = EncodingUtil.base64Encode(Blob.valueOf(footer));
            bodyBlob = EncodingUtil.base64Decode(headerEncoded + bodyEncoded + footerEncoded);
        } else if(last4Bytes.endsWith('=')) {
            last4Bytes = last4Bytes.substring(0,3) + 'N';
            bodyEncoded = bodyEncoded.substring(0,bodyEncoded.length()-4) + last4Bytes;
            // We have appended the CR e.g. \r, still need to prepend the line feed to the footer
            footer = '\n' + footer;
            String footerEncoded = EncodingUtil.base64Encode(Blob.valueOf(footer));
            bodyBlob = EncodingUtil.base64Decode(headerEncoded+bodyEncoded+footerEncoded);            
        } else{
            // Prepend the CR LF to the footer
            footer = '\r\n' + footer;
            String footerEncoded = EncodingUtil.base64Encode(Blob.valueOf(footer));
            bodyBlob = EncodingUtil.base64Decode(headerEncoded + bodyEncoded + footerEncoded);
        }

        System.debug('---> Body: ' + bodyBlob);

        HttpRequest req = new HttpRequest();
        
        TrueDialog_Keys__c tdKeys =TrueDialog_Keys__c.getValues('TrueDialogKeys');
        String username = tdKeys.Client_Id__c;//'1ab59fe33353401b8fd8da05716caaf5'
        String password = tdKeys.Client_Secret__c;  //   Jx8$z9*T/rY5
        String baseURL = tdKeys.Base_URL__c;   // https://api.truedialog.com/api/v2.1/account/
        String accountId = tdKeys.Account_Id__c;


        Blob headerValue = Blob.valueOf(username + ':' + password);
        String authorizationHeader = 'BASIC ' +EncodingUtil.base64Encode(headerValue);

        String endpoint = baseURL+accountId+'/image';
        req.setEndpoint(endPoint);
        req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        req.setMethod('POST');
        req.setBodyAsBlob(bodyBlob);
        req.setHeader('Content-Length', String.valueof(req.getBodyAsBlob().size()));
        req.setHeader('Authorization', authorizationHeader);
        req.setTimeout(60000);

        Http http = new Http();
        HTTPResponse res = http.send(req);

        System.debug(res);
        System.debug('--' +res.getBody());
    
        List<Object> lstObject = (List<Object>)JSON.deserializeUntyped(res.getBody());

        Map<String,Object> resultMap = (Map<String,Object>)lstObject[0];
        System.debug(resultMap.get('id'));
        String mediaId = String.valueOf(resultMap.get('id'));  
        String reqBody ='{"message":"'+message+'","channels": ['+tdKeys.Channel_Id__c+'],"targets": ['+ trueDialogContactIdList +'],"MediaId":"'+mediaId+'","execute": true}';
        SYstem.debug('****reqBody:'+reqBody);

      
        endpoint = baseURL+accountId+'/action-pushcampaign';
        req.setEndpoint(endPoint);
        req.setHeader('Content-Type', 'application/json');
        req.setMethod('POST');
        req.setBody('{"message":"'+message+'","channels": ['+tdKeys.Channel_Id__c+'],"targets": '+ trueDialogContactIdList +',"MediaId":"'+mediaId+'","execute": true}');
        
        res = http.send(req);

        System.debug(res);
        System.debug('--' +res.getBody());    
        if(res.getStatusCode() < 300) {

            List<Message__c> lstMessage = new List<Message__c>();
            for(Contact con : [Select Id,TrueDialog_Contact_Id__c FROM Contact 
                                WHERE TrueDialog_Contact_Id__c IN: trueDialogContactIdListArray]){
    
                        Message__c messageRecord = new Message__c();
                        messageRecord.Contacts__c = con.Id;
                        messageRecord.Message__c = message;
                        lstMessage.add(messageRecord);
            }
            saveResultList = Database.insert(lstMessage, false);

            ContentVersion cv = new ContentVersion();
            cv.Title = attachmentName;
            cv.PathOnClient = attachmentName;
            cv.VersionData = EncodingUtil.base64Decode(attachmentBody);
            cv.IsMajorVersion = true;
            Insert cv;	

            System.debug('Content Version'+cv);
            
         
          
            Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;  

            List<ContentDocumentLink> cdlList = New List<ContentDocumentLink>();
            for(Message__c messageRecord : lstMessage){
                ContentDocumentLink cdl = New ContentDocumentLink();
                cdl.LinkedEntityId = messageRecord.Id;
                cdl.ContentDocumentId = conDocId;
                cdl.shareType = 'V';
                cdlList.add(cdl) ;
            }

            List<Folder> mmsFolder = [SELECT Id,name FROM Folder where name ='MMS Image' Limit 1];
        
            System.debug('**Size***'+mmsFolder.size());
            System.debug('***mmsFolder***'+mmsFolder);
            
            Document myDocument = new Document();
        
            if(mmsFolder.size()>0){
                
                myDocument.FolderId = mmsFolder[0].Id;
                myDocument.Body = cv.versionData;
                myDocument.Name = attachmentName;
                myDocument.ispublic = true;
                insert myDocument;
            }

            System.debug('***MyDocument**'+myDocument);
        
            String imageURL = 'https://mburse--partialdev--c.documentforce.com/servlet/servlet.ImageServer?id='+myDocument.id+'&oid=00D8H0000008fkf';  
        
            for(Message__c messageRecord : lstMessage){
                messageRecord.Media_Link__c = imageURL;
            }

            update lstMessage;    

            result='success';
        }else{
            result = 'failed';
        }  

        return result;
           
    }    

        /** 
    * ********************************************************
    *  Developer Name-Dhanraj Khatri
        getUnreadMessageCount - Return all the contact with its unread Message count
    * ********************************************************
    */

    @RemoteAction 
    public static String getUnreadMessageCount(){      
        List<Contact> lstContact = new List<Contact>();       
        try{
            lstContact = [Select id,Name,Unread_Message_Count__c 
                            FROM Contact ];
           
        }catch(Exception e){
            System.debug('The following exception has occurred: ' + e.getMessage());
        }
        return JSON.serialize(lstContact);
    }  


      /** 
    * ********************************************************
    *  Developer Name-Dhanraj Khatri
        UpdateUnreadMessageStatus - update all message of contact with false
    * ********************************************************
    */

    @RemoteAction 
    public static String UpdateUnreadMessageStatus(String contactId){
       
        String result;
      
        try{
            List<Message__c> lstMessage = [Select id, Contacts__c, 
                                            Unread__c,Contacts__r.Time_Zone__c
                                            FROM Message__c 
                                            WHERE Contacts__c =: contactId ];

            for(Message__c message : lstMessage){
                message.Unread__c = false ;
            }

            Database.SaveResult[] saveResultList = Database.update(lstMessage);

            for(Integer i=0; i < saveResultList.size(); i++) {
                if (saveResultList[i].isSuccess()) {
                    System.debug('Successfully update message record.');
                    result = 'success';
                }
                else {                 
                    result = 'failed';
                    break;
                }
            }
        }catch(Exception e){
            System.debug('The following exception has occurred: ' + e.getMessage());
        }

        return result;
    }  

    
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
           Account objAccount = [SELECT id,True_Dialog__c from Account where id =: accId];
           checkTrueDialog = objAccount.True_Dialog__c != null ? objAccount.True_Dialog__c : false;
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
        
        if(conList.size() > 0 && (conList[0].Role__c == StaticValues.ROLE_ADMIN || conList[0].Role__c == StaticValues.roleAdminDriver) && isTestClass==false){
            for(Contact con : [SELECT id,FirstName, LastName, Insurance__c, Expiration_Date__c,
                                    Notification_Message__c ,External_Email__c,Triplog_UserID__c,TrueDialog_Contact_Id__c,
                                    Insurance_Attachment_Id__c, Notification_Date__c,Unread_Message_Count__c,Contact_Picture__c,
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
                                    conWrap.fullname = conWrap.name +' '+conWrap.lastname;
                                    conWrap.insurance = con.Insurance__c ;
                                    conWrap.role  = con.Role__c;
                                    conWrap.isEditable = false;
                                    conWrap.massEmail = false;
                                    conWrap.massText = false; /*Added by Megha*/
                                    conWrap.contactEmail = con.External_Email__c;
                                    if(con.Expiration_Date__c != null){
                                        conWrap.expirationDate = con.Expiration_Date__c;
                                    }
                                    conWrap.notiMessage = con.Notification_Message__c;
                                    conWrap.insuranceId = con.Insurance_Attachment_Id__c;
                                    conWrap.notificationDate = con.Notification_Date__c;
                                    conWrap.unReadMessageCount = String.valueOf(con.Unread_Message_Count__c) ;
                                    conWrap.contactPicture= con.Contact_Picture__c;
                                    conWrap.trueDialogId = con.TrueDialog_Contact_Id__c;
                                    conWrap.massNotiText = false;
                                    conWrapList.add(conWrap);
                }
            } 
            else 
            {
                for(Contact con : [SELECT id,FirstName, LastName, Insurance__c, Expiration_Date__c,
                                    Notification_Message__c ,External_Email__c,Triplog_UserID__c,TrueDialog_Contact_Id__c,
                                    Insurance_Attachment_Id__c, Notification_Date__c,Unread_Message_Count__c,
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
                                    conWrap.massText = false; /*Added by Megha*/
                                    conWrap.contactEmail = con.External_Email__c;
                                    if(con.Expiration_Date__c != null){
                                        conWrap.expirationDate = con.Expiration_Date__c;
                                    }
                                    conWrap.notiMessage = con.Notification_Message__c;
                                    conWrap.insuranceId = con.Insurance_Attachment_Id__c;
                                    conWrap.notificationDate = con.Notification_Date__c;
                                    conWrap.unReadMessageCount = String.valueOf(con.Unread_Message_Count__c) ;
                                    conWrap.trueDialogId = con.TrueDialog_Contact_Id__c;
                                    conWrap.massNotiText = false;
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
                if(conwrap.name != null){
                    htmlbody = htmlbody.replace('{!Contact.Name}',conwrap.name);
                }
                if(conList[0].name != null){
                    htmlbody = htmlbody.replace('{!AdminName}',conList[0].name);
                }                                
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
                    if(conwrap.name != null){
                        htmlbody = htmlbody.replace('{!Contact.Name}',conwrap.name);
                    }
                    if(conList[0].name != null){
                        htmlbody = htmlbody.replace('{!AdminName}',conList[0].name);
                    }                    
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
    public static String UploadMileage(string mileage,string  accId,String adminId,String startdate,String enddate) { 
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
        map<string, Id> biweekIdMap = new map<string, Id>();
        map<string, Decimal> empIdvsMPGMap = new map<string, Decimal>();
        map<string, Decimal> empIdvsMaintireMap = new map<string, Decimal>();
        map<string, Decimal> empIdvsFuelPriceMap = new map<string, Decimal>();
        List<Employee_Mileage__c> empNotSendMilList = new List<Employee_Mileage__c>();
        for(Employee_Reimbursement__c reimList : [SELECT id,name,Contact_Id__r.External_Email__c,Month__c,MPG__c,Maintenance_and_Tires__c, Contact_Id__r.Employee_ID__c
                                                  FROM Employee_Reimbursement__c 
                                                  WHERE Contact_Id__r.Employee_ID__c IN: employeeIdList 
                                                  AND Month__C IN: monthList
                                                  AND Contact_Id__r.AccountId =: accId]) {
                                                    if(reimList.Contact_Id__r.Employee_ID__c != null) {
                                                        reimIdMap.put(reimList.Contact_Id__r.Employee_ID__c +':'+reimList.Month__c, reimList.Id);
                                                        empIdvsEmailMap.put(reimList.Contact_Id__r.Employee_ID__c +':'+reimList.Month__c, reimList.Contact_Id__r.External_Email__c);  
                                                    }
        }                         
        for(Bi_Weekly_Reimbursement__c bireim : [SELECT id,name,Contact__r.name,Contact__r.Employee_ID__c,
                                                        Fuel_Price__c,MPG__c,Maintenance_and_Tires__c
                                                    FROM Bi_Weekly_Reimbursement__c 
                                                    WHERE Start_Date__c=: Date.valueOf(startdate) 
                                                    AND End_Date__c =:Date.valueOf(enddate)
                                                    AND Contact__r.Employee_ID__c IN: employeeIdList
                                                    AND Contact__r.AccountId =: accId ]){
                                                        biweekIdMap.put(bireim.Contact__r.Employee_ID__c, bireim.id);
                                                        if(bireim.Maintenance_and_Tires__c != 0){
                                                            empIdvsMaintireMap.put(bireim.Contact__r.Employee_ID__c,bireim.Maintenance_and_Tires__c);     
                                                        } else {
                                                            empIdvsMaintireMap.put(bireim.Contact__r.Employee_ID__c,0);      
                                                        }
                                                        if(bireim.MPG__c != null){
                                                            empIdvsMPGMap.put(bireim.Contact__r.Employee_ID__c,bireim.MPG__c); 
                                                        } else {
                                                            empIdvsMPGMap.put(bireim.Contact__r.Employee_ID__c,0);  
                                                        }
                                                        if(bireim.MPG__c != null){
                                                            empIdvsFuelPriceMap.put(bireim.Contact__r.Employee_ID__c,bireim.Fuel_Price__c); 
                                                        } else {
                                                            empIdvsFuelPriceMap.put(bireim.Contact__r.Employee_ID__c,0);  
                                                        }
        }
        daylight_saving_time_config__c DSTzconfig = daylight_saving_time_config__c.getValues(String.valueOf(System.today().year()));
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
                    Date tripdatecreate = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2]));
                   // if(tripdatecreate >= DSTzconfig.Start_Date__c && tripdatecreate <= DSTzconfig.End_Date__c){
                   //     mil.Trip_Date__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2])).adddays(1);                    
                   //     mil.ConvertedStartTime__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2])).adddays(2);  
                   // } else {
                        mil.Trip_Date__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2]));                    
                        mil.ConvertedStartTime__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2])).adddays(1);  
                    //}
                    
                       //mil.Trip_Date__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2]));                    
                        //mil.ConvertedStartTime__c = date.valueof(Date.parse(tripDateSplit[0]+'/'+tripDateSplit[1] +'/'+tripDateSplit[2]));                 
                    system.debug('mil.Trip_Date__'+ mil.Trip_Date__c);
                    system.debug('mil.ConvertedStartTime__c '+ mil.ConvertedStartTime__c );
                }
                mil.Trip_Origin__c = objJson.Trip_Origin;
                mil.Trip_Destination__c = objJson.Trip_Destination;
                mil.Trip_Status__c = objJson.Trip_Status;
                if(objJson.Trip_Status == 'Approved' || objJson.Trip_Status == 'Rejected') {
                    if(objJson.Approved_Date != null && objJson.Approved_Date.contains('/') ){
                        list<String> approvedDateSplit = objJson.Approved_Date.split('/'); 
                        Date createApproval = date.valueof(Date.parse(approvedDateSplit[0]+'/'+approvedDateSplit[1] +'/'+approvedDateSplit[2]));
                        /*if(createApproval >= DSTzconfig.Start_Date__c && createApproval <= DSTzconfig.End_Date__c){
                           mil.Approved_Date__c = date.valueof(Date.parse(approvedDateSplit[0]+'/'+approvedDateSplit[1] +'/'+approvedDateSplit[2])).adddays(1);
                        } else {
                            mil.Approved_Date__c = date.valueof(Date.parse(approvedDateSplit[0]+'/'+approvedDateSplit[1] +'/'+approvedDateSplit[2]));
                        }*/
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
                if(empIdvsMPGMap.containsKey(string.valueOf(objJson.EmployeeId))) {
                    mil.MPG__c = empIdvsMPGMap.get(string.valueOf(objJson.EmployeeId));
                }
                if(empIdvsMaintireMap.containsKey(string.valueOf(objJson.EmployeeId))) {
                    mil.Maintenance_and_Tires__c = empIdvsMaintireMap.get(string.valueOf(objJson.EmployeeId));
                }
                if(empIdvsFuelPriceMap.containsKey(string.valueOf(objJson.EmployeeId))) {
                    mil.Fuel_price__c = empIdvsFuelPriceMap.get(string.valueOf(objJson.EmployeeId));
                }
                if(reimIdMap.containsKey(mapKey) && biweekIdMap.containsKey(string.valueOf(objJson.EmployeeId))) {
                    mil.EmployeeReimbursement__c = string.valueOf(reimIdMap.get(mapKey));
                    mil.Bi_Weekly_Reimbursement__c = string.valueOf(biweekIdMap.get(string.valueOf(objJson.EmployeeId)));
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
    @RemoteAction
    public static String UploadLOA(string LOAData,string  accId,String startdate,String enddate) { 
        System.debug('UploadLOA=='+LOAData);
        map<string, Id> biweekIdMap = new map<string, Id>();
        map<string, Id> contactIdMap = new map<string, Id>();
        map<string, Date> empDeactivationMap = new map<string, Date>();
        map<string, Date> conDeactivationMap = new map<string, Date>();
        List<Contact> contactList = new List<Contact>();
        for(Bi_Weekly_Reimbursement__c bireim : [SELECT id,name,Contact__r.name,
                                                        Contact__r.Employee_ID__c,Contact__c,
                                                        Contact_Id_Deactivated_Date__c
                                                    FROM Bi_Weekly_Reimbursement__c 
                                                    WHERE Start_Date__c=: Date.valueOf(startdate) 
                                                    AND End_Date__c =: Date.valueOf(enddate)
                                                    AND Contact__r.AccountId =: accId ]){
                                                        biweekIdMap.put(bireim.Contact__r.Employee_ID__c, bireim.id);
                                                        contactIdMap.put(bireim.Contact__r.Employee_ID__c, bireim.Contact__c);
                                                        if(bireim.Contact_Id_Deactivated_Date__c != null ){
                                                            empDeactivationMap.put(bireim.Contact__r.Employee_ID__c, bireim.Contact_Id_Deactivated_Date__c);
                                                        }                                                        
                                            }
                                          
            List<LOAWrapper> loaWrapList = new List<LOAWrapper>();
            if(LOAData != null) {
                loaWrapList = (List<LOAWrapper>)Json.deserialize(LOAData,List<LOAWrapper>.class);
                List<Bi_Weekly_Reimbursement__c> biweekList = new List<Bi_Weekly_Reimbursement__c>();
                for(LOAWrapper loaWrap : loaWrapList){ 
                    if(biweekIdMap.containsKey(loaWrap.employeeId)){
                        Bi_Weekly_Reimbursement__c objBiWeek = new Bi_Weekly_Reimbursement__c();
                        objBiWeek.id = biweekIdMap.get(loaWrap.employeeId);
                        objBiWeek.LOA_Start_Date__c = (loaWrap.loaStart != null ? Date.parse(loaWrap.loaStart) : null);
                        objBiWeek.LOA_End_Date__c = (loaWrap.loaEnd != null ? Date.parse(loaWrap.loaEnd) : null);                      
                        if(loaWrap.proratedAmount != null && loaWrap.proratedAmount != ''){
                            objBiWeek.Fixed_Amount__c = (Decimal.valueOf(loaWrap.proratedAmount)*26)/12;
                        }               
                        if(loaWrap.conDeactivation != null && Date.parse(loaWrap.conDeactivation) != empDeactivationMap.get(loaWrap.employeeId)){
                            conDeactivationMap.put(contactIdMap.get(loaWrap.employeeId), Date.parse(loaWrap.conDeactivation));
                        }        
                        biweekList.add(objBiWeek);
                    }
                }
                daylight_saving_time_config__c DSTzconfig = daylight_saving_time_config__c.getValues(String.valueOf(System.today().year()));
                if(conDeactivationMap.size() > 0){
                    for(String mapkey : conDeactivationMap.keySet()){
                        list<String> tripDateSplit = new list<String>();
                        Contact contactObj = new Contact();
                        contactObj.Id = mapkey;
                        if(conDeactivationMap.get(mapkey) >=  DSTzconfig.Start_Date__c && conDeactivationMap.get(mapkey) <= DSTzconfig.End_Date__c){
                            contactObj.Deactivated_Date__c = conDeactivationMap.get(mapkey).adddays(2);
                        } else {
                            contactObj.Deactivated_Date__c = conDeactivationMap.get(mapkey).adddays(1);
                        }                           
                        contactList.add(contactObj);
                    }
                }
                
                if(biweekList.size() > 0){
                    try {
                        update biweekList;
                    } catch(Exception e ){
                        system.debug('e'+e);
                    }                
                }
                if(contactList.size() > 0){
                    try {
                        update contactList;
                    } catch(Exception e ){
                        system.debug('e'+e);
                    }  
                }
            }
            
        return 'Success';
    }
    @RemoteAction
    public static String DeleteTrips(string  conId) {
        List<Employee_Mileage__c> mileageList = new List<Employee_Mileage__c>();
        for(Employee_Mileage__c objMil : [SELECT id,CreatedBy.ContactId,CreatedDate 
                                            FROM Employee_Mileage__c 
                                            WHERE CreatedBy.ContactId =: conId]){
            if(objMil.CreatedDate.date() == System.today()){
                mileageList.add(objMil);
            }
        } 
        if(mileageList.size() > 0){
            delete mileageList;
        }          
        return 'sucess';
    }
    
    @RemoteAction
    public static String TrueDialogContact (String accountId,String adminId) {
    system.debug('accountId=='+accountId);
    system.debug('adminId=='+adminId);
        string conWrapper = NewEmployeeData(accountId,adminId );
         system.debug('conWrapper =='+conWrapper );
        List<ContactWrapper> conWrapUpdateList = new List<ContactWrapper>();
        List<ContactWrapper> conWrapList = new List<ContactWrapper>();
        conWrapList = (List<ContactWrapper>)Json.deserialize(conWrapper,List<ContactWrapper>.class);
        system.debug('cconWrapList =='+conWrapList );
        for(ContactWrapper conwrap : conWrapList ){
            if(conwrap.trueDialogId != null){
                system.debug('conwrap.trueDialogId=='+conwrap.trueDialogId);
                conWrapUpdateList.add(conwrap);
            }
        }
        String wrapjson = JSON.serialize(conWrapUpdateList);
        return wrapjson;
    }
    @RemoteAction
    public static void sendInsuranceEmail (String Id,String Name,String email){
        BiWeeklyWrapperUtils.sendInsuranceEmail(Id, Name, email);
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
        public string unReadMessageCount { get; set; }
        public Boolean isEditable { get; set; }
        public Boolean massEmail { get; set; }
        public Boolean massText { get; set; } /*Added by Megha*/
        public date expirationDate { get; set; }
        public date notificationDate { get; set; }
        public string contactPicture { get; set; }
        public string trueDialogId{ get; set; }
        public Boolean massNotiText { get; set; }
    }
    public class LOAWrapper {
        public string employeeId { get; set; }
        public string proratedAmount{ get; set; }
        public string name { get; set; }
        public string loaStart { get; set; }
        public string loaEnd { get; set; }
        public string conDeactivation { get; set; }
    }

    public class TrueDialogApiException extends Exception {}
}