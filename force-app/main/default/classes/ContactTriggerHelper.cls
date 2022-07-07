public without sharing class ContactTriggerHelper {
    public static Boolean isRecursive = false;
    public static Boolean isFirstTime = true;
    Public static date fuelPriceDate;
    Public static string[] splitdate;
    Public static map<string, Decimal> monthStateCityVsFuelPriceMap = new map<string, Decimal>(); 
    Public static map<string, Decimal> monthStateCityVsFuelPricereimMap = new map<string, Decimal>(); 
    

    //Developer Name-Dhanraj Khatri 
    //Prevent Blank & Duplicate Mobile Number Value.
    //Prevent Duplicate Email Value
    public static void preventDuplicateMobileEmail(List<Contact> contactList){
       
        Set<String> setOfEMail =new Set<String> ();            //Initializing Set for Email
        Set<String> setMobilePhone= new set<String>();            //Initializing Set For Phone
        
        List<Contact> fetchList=[SELECT Email,MobilePhone FROM Contact];        //Query to retrive all contacts
        for(Contact con:fetchList){
            setOfEMail.add(con.Email);
            setMobilePhone.add(con.MobilePhone);
        }
        
        for(Contact contact : contactList)        //Traversing through trigger List 
        { 
            if(contact.MobilePhone == null){
                contact.MobilePhone.AddError(' Mobile Number can not be blank ');
            }else{
                if(setMobilePhone.contains(contact.MobilePhone)){
                    contact.MobilePhone.AddError(' Duplicate MobilePhone is not Allowed ');  
                }
            }
            if(contact.Email != null &&  setOfEMail.contains(contact.Email) )    //condition to check duplicate
            {
                contact.Email.AddError(' Duplicate Email is not Allowed ');        //Error Message on Email
                    //Error Messahe on Phone
            }   
    
        }
    }




    public static void checkVehicalYearAndModel(List<Contact> contactList){
        Map<String,String> urlMap = new Map<String,String>();
        set<String> vehicleNamesset = new set<String>();
        
        for(Contact conRec : contactList) {
            if(conRec.Vehicle_Type__c!=null) {
                vehicleNamesset.add(conRec.Vehicle_Type__c.replace(' ','').toUpperCase());
            }            
        }
        for(Vehicle_URL_Mapping__c u : [SELECT Id, Year__c, Vehicle__c, URL__c,Vehicle_Mapping__c FROM Vehicle_URL_Mapping__c WHERE Vehicle_Mapping__c IN: vehicleNamesset]){
            if((u.URL__c != null || u.URL__c != '') &&(!urlMap.containsKey(u.Vehicle_Mapping__c))){
                urlMap.put(u.Vehicle_Mapping__c,u.URL__c);
            }
        } 
        
        for(Contact conRec : contactList) {
            if(conRec.Role__c == StaticValues.ROLE_DRIVER || conRec.Role__c == StaticValues.ROLE_DRIVERMANAGER || conRec.Role__c == StaticValues.roleAdminDriver ) {
                if(conRec.Vehicle_Type__c != '') {
                    if(urlMap.containsKey(conRec.Vehicle_Type__c.replace(' ','').toUpperCase())) {
                        conRec.Car_Image__c = urlMap.get(conRec.Vehicle_Type__c.replace(' ','').toUpperCase());
                    } else {
                        conRec.addError('Please Enter Valid Standard Vehicle Make Model and Year');
                    }
                }
            }
        }
        
    }
    
    @Future(callout = true)
    public static void putHTTPUpdateUserPhoneTriplog(Map<String,String> tripIdWisePhone,Map<String,String> triplogidwiseAPIkey) {
        Http h;
        HttpRequest req;
        HttpResponse res;
        String mLOGACCOUNT = System.Label.Triplog_New_URL;
        for(String currentUserId : triplogidwiseAPIkey.keySet()) {
            String baseURL = !mLOGACCOUNT.Contains( triplogidwiseAPIkey.get(currentUserId) ) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
            if(tripIdWisePhone.containsKey(currentUserId) && tripIdWisePhone.get(currentUserId) != null) {
                JSONGenerator gen = JSON.createGenerator(true);
                gen.writeStartObject();
                gen.writeStringField('phone',tripIdWisePhone.get(currentUserId));
                gen.writeEndObject();
                h = new Http();
                req = new HttpRequest();
                req.setEndpoint( baseURL + '/api/users/' + currentUserId);
                req.setMethod('PUT');
                req.setTimeout(120000);
                req.setbody(gen.getAsString());
                req.setHeader('Content-Type', 'application/json');
                req.setHeader('Authorization', 'apikey '+ triplogidwiseAPIkey.get(currentUserId));
                if(!Test.isRunningTest()) {
                    res = h.send(req);            
                }
            }           
        }
    }
    
    public static void  CommunityUserCreate(List<Contact> contactList) {
        List<User> createUserList = new List<User>();
        list<Profile> profileList = [SELECT
                                     Id, 
                                     Name
                                     FROM
                                     Profile
                                     WHERE
                                     Name = 'Customer Community Login User - Driver' OR 
                                     Name = 'Customer Community Login User - Manager' OR 
                                     Name = 'Customer Community Login User - Super Manager' OR 
                                     Name = 'Customer Community Login User - Manager/Driver' OR 
                                     Name = 'Customer Community Login User - Super Manager/Driver'];
        
        Map<string,Id> profilemap = new Map<string,ID>();
        for(Profile profileObj : profileList){
            if(profileObj.Name == 'Customer Community Login User - Driver' ){
                profilemap.put('Driver',profileObj.id);
            } else if(profileObj.Name == 'Customer Community Login User - Manager'){
                profilemap.put('Manager',profileObj.id);
            } else if(profileObj.Name == 'Customer Community Login User - Manager/Driver'){
                profilemap.put('Driver/Manager',profileObj.id);
            } else if(profileObj.Name == 'Customer Community Login User - Super Manager/Driver'){
                profilemap.put(StaticValues.roleAdminDriver ,profileObj.id); 
            }  else if(profileObj.Name == 'Customer Community Login User - Super Manager'){
                profilemap.put('Admin',profileObj.id);
            }
        }
        for(Contact conObj : contactList) {
            if(conObj.IsCreatedFromCommunity__c == true && profilemap.containskey(conObj.Role__c))  {
                createUserList.add(CreateUserFromCommunity(conObj,profilemap.get(conObj.Role__c)));
            }
        }
        if(createUserList.size()>0) {
            insert createUserList;
        }            
    }
    
    public static User CreateUserFromCommunity(Contact contObj, Id profileId){
        User userObj = new User();
        userObj.FirstName = contObj.FirstName;
        userObj.LastName = contObj.LastName; 
        userObj.Email = contObj.External_Email__c; 
        userObj.EmailEncodingKey = 'UTF-8'; 
        userObj.LanguageLocaleKey = 'en_US'; 
        userObj.LocaleSidKey = 'en_US'; 
        userObj.TimeZoneSidKey = 'America/Los_Angeles'; 
        userObj.UserName = contObj.External_Email__c; 
        userObj.Profileid = profileId; 
        userObj.Alias = contObj.External_Email__c.left(8); 
        userObj.ContactId = contObj.id;
        return userObj;
    }
    
    public static void updateComplianceStatus(List<Contact> newCon, Map<ID, Contact> conOldMap) {
        List<String> emails = new List<String>();
        EmailTemplate emTmp = new EmailTemplate();
        Messaging.SingleEmailMessage mail;
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        // Define Email Template
        Map<String,EmailTemplate> nameWithTemplate = new Map<String,EmailTemplate>();
        for(EmailTemplate e : [SELECT Id, Name, developerName, Subject, body FROM EmailTemplate Limit 1]) {
            nameWithTemplate.put(e.developerName, e);
        }
        OrgWideEmailAddress[] owea;
        owea = [SELECT Id, address FROM OrgWideEmailAddress WHERE Address = 'driverservices@mburse.com'];
        
        for(Contact con : newCon) {
            if(con.Role__c == 'Driver' && (conOldMap.get(con.id).compliancestatus__c != con.compliancestatus__c)) {
                emails.add(con.External_Email__c);
                if(con.compliancestatus__c == 'Yes' && nameWithTemplate.containskey('Driver_Compliance_Status_Yes')) {
                    emTmp = nameWithTemplate.get('Driver_Compliance_Status_Yes');
                } else if(con.compliancestatus__c == 'No – Vehicle Age' && nameWithTemplate.containskey('Driver_Compliance_Status_No_Vehicle_Age')) {
                    emTmp = nameWithTemplate.get('Driver_Compliance_Status_No_Vehicle_Age');
                } else if(con.compliancestatus__c == 'No – Vehicle Value' && nameWithTemplate.containskey('Driver_Compliance_Status_No_Vehicle_Value')) {
                    emTmp = nameWithTemplate.get('Driver_Compliance_Status_No_Vehicle_Value');
                } else if(con.compliancestatus__c == 'No – Insurance not meeting minimum' && nameWithTemplate.containskey('Driver_Compliance_Status_No_Insurance_not_meeting_minimum')) {
                    emTmp = nameWithTemplate.get('Driver_Compliance_Status_No_Insurance_not_meeting_minimum');
                } else if(con.compliancestatus__c == 'Resubmit Insurance – you submitted an insurance card' && nameWithTemplate.containskey('Driver_Compliance_Status_Resubmit_Insurance')) {
                    emTmp = nameWithTemplate.get('Driver_Compliance_Status_Resubmit_Insurance');
                } else if(con.compliancestatus__c == 'Resubmit - Expired Insurance' && nameWithTemplate.containskey('Driver_Compliance_Status_Expired_Insurance')){
                    emTmp = nameWithTemplate.get('Driver_Compliance_Status_Expired_Insurance');
                } else{
                    emTmp = null;
                }
                if(!emails.isEmpty() && emTmp != null) {
                    mail = new Messaging.SingleEmailMessage();
                    mail.setToAddresses(emails);
                    mail.setSubject(emTmp.Subject);
                    mail.setPlainTextBody(emTmp.Body.replace('{!Contact.FirstName}', con.FirstName));
                    if(owea.size()>0) {
                        mail.setOrgWideEmailAddressId(owea.get(0).Id);
                    }
                    mail.setBccAddresses(new String[] {'minkeshp@askemc.com','sanket.goswami@getoncrm.com'});
                    mails.add(mail);                    
                }
            }
        }
        //Sending the Email
        SendEmail__c  objSendEmail = SendEmail__c.getValues('Send Email For Compliance');
        if(objSendEmail.Send_email_from_code__c==true) {
            Messaging.sendEmail(mails);
        }
        
    }
    
    //This method is used when deactivate date is removed and create a new reimbursement for that driver.
    public static void createReimRecord(List<Contact> newCon, Map<ID, Contact> conOldMap) { 
        List<Employee_Reimbursement__c> reimToInsert   = new List<Employee_Reimbursement__c>();
        List<Bi_Weekly_Reimbursement__c> bireimToInsert   = new List<Bi_Weekly_Reimbursement__c>();
        for(Contact con : newCon) {
            if(conOldMap.get(con.id).Deactivated_Date__c != null  && con.Deactivated_Date__c == null && (conOldMap.get(con.id).Deactivated_Date__c != con.Deactivated_Date__c) && con.Activation_Date__c <= System.today()){
                if(con.Role__c != 'Admin' && con.Role__c != 'Manager') {
                    TriggerConfig__c customSetting = TriggerConfig__c.getInstance('Defaulttrigger');
                    if(customSetting.ContactTriCommunityReimCreate__c == true) {
                        reimToInsert.add(CreateReimbursement(con));
                        if(customSetting.ContactTriBiReimCreate__c == true) {
                            bireimToInsert.add(CreateBiweekReimbursement(con));
                        }
                    }
                }
            }
            if(!reimToInsert.isEmpty()){
                try{
                    upsert reimToInsert;
                    if(!bireimToInsert.isEmpty()){
                        upsert bireimToInsert;
                    } 
                } catch (DMLException e) {
                    system.debug('DMLException='+e);
                }
                
                ContactTriggerHelper.putHTTPEnableUserTriplog(con.id);
                RosterController.resetPassword(con.id);
                putHTTP(con.AccountId,con.External_Email__c);
            }
        }
    }
    
    public static Employee_Reimbursement__c CreateReimbursement(Contact con){
        //EMC-283 Update Fuel Price based on the contact city and state as past month's fuel price from Gas price object. 
        String currentDate = String.valueOf(system.today());
        String[] splitDate = currentDate.split('-');
        
        if(integer.valueOf(splitDate[1]) == 01){
            fuelPriceDate = date.valueOf(string.valueOf(integer.valueOf(splitDate[0])-1) + '-12' + '-01' );   
        } else {
            fuelPriceDate = date.valueOf(splitDate[0] + '-' + string.valueOf(integer.valueOf(splitDate[1])-1) + '-01');
        } 
        
        for(Gas_Prices__c objGasPrice : [SELECT id,
                                         name,
                                         City__c,
                                         State__c, 
                                         Fuel_Price__c, 
                                         Month_Year__c,
                                         Month_State_City__c 
                                         FROM Gas_Prices__c 
                                         WHERE  Month_Year__c =: date.valueOf(fuelPriceDate)
                                         WITH SECURITY_ENFORCED ]) {
                                             monthStateCityVsFuelPricereimMap.put(objGasPrice.Month_State_City__c, objGasPrice.Fuel_Price__c); 
                                         }
        
        List<IRS_Mileage_Rate__c> objIRSRate = [SELECT id,year__c,IRS_Rate__c FROM IRS_Mileage_Rate__c Where year__c =: String.valueOf(System.today().year()) Limit 1];
        String lastMonth = Utils.fetchMonths(1, -1)[0];
        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        er.Contact_Id__c = con.id;
        er.Name = con.Name__c + ':' + lastMonth;
        er.Month__c = lastMonth;
        if(integer.valueOf(splitDate[1]) == 01){
            if (monthStateCityVsFuelPricereimMap.containsKey(con.MailingCity+ con.MailingState + '12' + string.valueOf(integer.valueOf(splitDate[0])-1)) ) {
                er.Fuel_Price__c = monthStateCityVsFuelPricereimMap.get(con.MailingCity+ con.MailingState + '12' + string.valueOf(integer.valueOf(splitDate[0])-1)) ;
            }   else {
                er.Fuel_Price__c = 0;
            }
        }   else {   
            if (monthStateCityVsFuelPricereimMap.containsKey(con.MailingCity + con.MailingState + string.valueOf(integer.valueOf(splitDate[1])-1) + splitDate[0]) ) {
                er.Fuel_Price__c = monthStateCityVsFuelPricereimMap.get(con.MailingCity + con.MailingState + string.valueOf(integer.valueOf(splitDate[1])-1) + splitDate[0]);
            }   else {
                er.Fuel_Price__c = 0;
            }
        }
        er.IRS_Mileage_Rate__c = objIRSRate.size() > 0 ? objIRSRate[0].ID : null;
        return er;
    }    
    public static void  communityReimCreate(List<Contact> contactList) {
        List<Employee_Reimbursement__c> reimToInsert   = new List<Employee_Reimbursement__c>();
        List<Bi_Weekly_Reimbursement__c> bireimToInsert   = new List<Bi_Weekly_Reimbursement__c>();
        TriggerConfig__c customSetting = TriggerConfig__c.getInstance('Defaulttrigger');
        for(Contact con : contactList){
            if(!System.isBatch()){
                putHTTP(con.AccountId,con.External_Email__c);
            }
            if(con.Role__c != 'Admin' && con.Role__c != 'Manager' && con.Deactivated_Date__c == null) {
                if(con != null && customSetting.ContactTriCommunityReimCreate__c == true) {
                    reimToInsert.add(CreateReimbursement(con));
                    if(customSetting.ContactTriBiReimCreate__c == true) {
                        bireimToInsert.add(CreateBiweekReimbursement(con)); 
                    }
                }               
            }
        }
        if(!reimToInsert.isEmpty()) {
            insert reimToInsert;            
        }
        if(!bireimToInsert.isEmpty()){
            insert bireimToInsert;
        }
    }
    //This method is used to create a Bi-Weekly reimbursment
    public static Bi_Weekly_Reimbursement__c CreateBiweekReimbursement(Contact con){        
        contact contest = [select id,account.Pay_Period_Days__c,account.Pay_Period_Start_Date__c from contact where id =: con.id];
        List<String> dtList = new list<String>();
        Date payStartDate = contest.Account.Pay_Period_Start_Date__c;
        Date endDate;
        do {
            endDate = payStartdate.addDays(Integer.valueof(contest.Account.Pay_Period_Days__c));
            if(payStartdate != null && payStartdate <= System.today() && System.today() <= endDate) {
                dtList.add(String.valueof(payStartdate));
                dtList.add(String.valueof(endDate));
            }
            payStartdate = endDate.addDays(1);
        } while(endDate <= System.today());
        string splitStartDate;
        string splitEndDate;
        if(dtList.size() > 0){
            string[] splitsdate = dtList[0].split('-');
            splitStartDate = splitsdate[1]+'/'+splitsdate[2]+'/'+splitsdate[0];
            splitdate = dtList[1].split('-');
            splitEndDate = splitdate[1]+'/'+splitdate[2]+'/'+splitdate[0];
            //EMC -283 use to update fuel price of biweekly reim based on the contact city and state of past month's fuel price from gas price object
            if(integer.valueOf(splitdate[1]) == 01){
                fuelPriceDate = date.valueOf(string.valueOf(integer.valueOf(splitdate[0])-1) + '-12' + '-01' );   
            } else {
                fuelPriceDate = date.valueOf(splitdate[0] + '-' + string.valueOf(integer.valueOf(splitdate[1])-1) + '-01');
            } 
            
            
            for(Gas_Prices__c objGasPrice : [SELECT id,
                                             name,
                                             City__c,
                                             State__c, 
                                             Fuel_Price__c, 
                                             Month_Year__c,
                                             Month_State_City__c 
                                             FROM Gas_Prices__c 
                                             WHERE  Month_Year__c =: date.valueOf(fuelPriceDate)]) {
                                                 
                                                 monthStateCityVsFuelPriceMap.put(objGasPrice.Month_State_City__c, objGasPrice.Fuel_Price__c); 
                                             }
        }
        Bi_Weekly_Reimbursement__c er = new Bi_Weekly_Reimbursement__c();
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        er.Contact__c = con.id;
        er.Name = splitStartDate+' to '+ splitEndDate;
        er.Count_Error_Check__c = 0;
        if(integer.valueOf(splitdate[1]) == 01){
            if (monthStateCityVsFuelPriceMap.containsKey(con.MailingCity+ con.MailingState + '12' + string.valueOf(integer.valueOf(splitdate[0])-1)) ) {
                er.Fuel_Price__c = monthStateCityVsFuelPriceMap.get(con.MailingCity+ con.MailingState + '12' + string.valueOf(integer.valueOf(splitdate[0])-1)) ;
            }   else {
                er.Fuel_Price__c = 0;
            }
        }   else {
            if (monthStateCityVsFuelPriceMap.containsKey(con.MailingCity+ con.MailingState + string.valueOf(integer.valueOf(splitdate[1])-1) + splitdate[0]) ) {
                er.Fuel_Price__c = monthStateCityVsFuelPriceMap.get(con.MailingCity+ con.MailingState + string.valueOf(integer.valueOf(splitdate[1])-1) + splitdate[0]);
            }   else {
                er.Fuel_Price__c = 0;
            }
        }
        er.Start_Date__c = Date.valueOf(dtList[0]);
        er.End_Date__c = Date.valueOf(dtList[1]);
        return er;
    }
    //This method is used send a welcome email from triplog or mlog to install a application.
    @future (callout=true)
    Public static void putHTTP(String accountID,String empEmail) {
        putHTTPCallout(AccountId, empEmail);
    }
    
    Public static void putHTTPCallout(String accountID,String empEmail) {
        List<Account> accountList = [SELECT id,Triplog_API__c,MburseDashboardRedirect__c  
                                     FROM Account 
                                     WHERE Id =: accountID];
         if(accountList.size() > 0 && accountList[0].MburseDashboardRedirect__c == false){
            String MLOGACCOUNT = System.Label.Triplog_New_URL;        
            String body, apiToken;
            
            if(accountList.size() > 0 ){
                apiToken = accountList[0].Triplog_API__c;
            }
            String jsonSubset;
            String baseURL;
            if(apiToken != null){
                baseURL = !mLOGACCOUNT.Contains(apiToken) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
            }
            String rosterURL = baseURL + StaticValues.WELCOME_SUFFIX;
            body = '{"emails":[';
            body = body + String.valueof(empEmail) +']}';
            TriplogPutCall__c objTriplog = TriplogPutCall__c.getValues('RosterControllerPutCall');
            HttpRequest putReq = new HttpRequest();
            Http putHTTP = new Http();
            HttpResponse putRes = new HttpResponse();
            
            putReq.setEndpoint(rosterURL);
            putReq.setMethod('PUT');                 
            putReq.setBody(body);
            putReq.setTimeout(120000);
            putReq.setHeader('Authorization', 'apikey ' + apiToken);
            putReq.setHeader('Content-Type', 'application/json');
            if(!Test.isRunningTest() && objTriplog.TriplogPut__c == true){
                if(objTriplog.TriplogPut__c == true){
                    putRes = putHTTP.send(putReq);
                    Map<String,Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(putRes.getBody());
                    jsonSubset = JSON.serialize(jsonMap.get('message'));
                }
            } 
         }
          
    }
    @Future(callout = true)
    public static void putHTTPEnableUserTriplog(String conId) {
        Http h;
        HttpRequest req;
        HttpResponse res;
        String mLOGACCOUNT = System.Label.Triplog_New_URL;
        for(Contact conObj : [SELECT id,Triplog_UserID__c, Account.Triplog_API__c  FROM Contact WHERE id =: conId]) {
            if(conObj.Triplog_UserID__c != null && conObj.Account.Triplog_API__c != null){
                String baseURL = !mLOGACCOUNT.Contains( conObj.Account.Triplog_API__c ) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
                JSONGenerator gen = JSON.createGenerator(true);
                gen.writeStartObject();
                gen.writeBooleanField('disabled',false);
                gen.writeEndObject();
                h = new Http();
                req = new HttpRequest();
                req.setEndpoint( baseURL + '/api/users/' + conObj.Triplog_UserID__c);
                req.setMethod('PUT');
                req.setTimeout(120000);
                req.setbody(gen.getAsString());
                req.setHeader('Content-Type', 'application/json');
                req.setHeader('Authorization', 'apikey '+ conObj.Account.Triplog_API__c);
                if(!Test.isRunningTest())
                {
                    res = h.send(req);            
                }
            }
        }
    }    
    
    //Send Email regarding New Drivers AI-000437
    public static void sendEmailForNewContact(List<Contact> contactList) {
        Map<Id,String> accountNameMap = new Map<Id,String>();
        for(Account objAccount : [SELECT ID,Name FROM account WHERE isUsingTriplog__c = true]){
            accountNameMap.put(objAccount.id,objAccount.Name);
        }
        
        EmailTemplate templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'New_Contact_Inform_Driver_Services' Limit 1];
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        OrgWideEmailAddress[] owea = [SELECT Id,Address from OrgWideEmailAddress where Address = 'driverservices@mburse.com'];
        for(Contact contObj : contactList){
            String newemailBody = templateId.HtmlValue;
            Messaging.SingleEmailMessage mail =  new Messaging.SingleEmailMessage();
            mail.setTargetObjectId(contObj.OwnerId);
            string[] toAddresses = new string[]{System.Label.DriverServicesEmail};
                mail.setToAddresses(toAddresses);
            mail.setReplyTo('mburse@driverservices.com');            
            if(accountNameMap.get(contObj.AccountId) != null){
                newemailBody = newemailBody.replace('{!Account.Name}',accountNameMap.get(contObj.AccountId));
            }
            IF(contObj.Role__c != null){
                newemailBody = newemailBody.replace('{!Role}',contObj.Role__c ); 
            }
            newemailBody = newemailBody.replace('{!date}',String.valueOf(System.today())); 
            newemailBody = newemailBody.replace('{!Email}',contObj.External_Email__c); 
            newemailBody = newemailBody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
            mail.setSubject(templateId.Subject);
            mail.setHtmlBody(newemailBody);
            mail.setOrgWideEmailAddressId(owea.get(0).Id);
            mail.setSaveAsActivity(false);
            mails.add(mail);
            
        }      
        if(!Test.isRunningTest()){  
            Messaging.sendEmail(mails);
        }
    }
    
    
    //Track History of Contact
    public static void TrackHistory(Map<ID,Contact> conOld,List<Contact> contactListNew,Map<String,String> managerNames){
        //Map for Manager Name
        //Audit Trial
        list<AuditTrail__c> newAuditTrialCreate=new list<AuditTrail__c>();
        for(Contact c:contactListNew){
            if(c.id == conOld.get(c.id).id){
                if(c.Fixed_Amount__c != conOld.get(c.id).Fixed_Amount__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Fixed Amount',Timestamp__c = Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = string.valueof(c.Fixed_Amount__c),OldValue__c = String.Valueof(conOld.get(c.id).Fixed_Amount__c),Contact__c=c.id));
                if(c.Maintenance_and_Tires__c != conOld.get(c.id).Maintenance_and_Tires__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Maintenance and Tires',Timestamp__c=Datetime.now(),Modifiedby__c=UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c=String.valueof(c.Maintenance_and_Tires__c),OldValue__c=string.valueof(conOld.get(c.id).Maintenance_and_Tires__c),Contact__c=c.id));
                if(c.Vehicle1Odometer__c != conOld.get(c.id).Vehicle1Odometer__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Vehicle 1 Odometer',Timestamp__c = Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = String.Valueof(c.Vehicle1Odometer__c),OldValue__c = String.Valueof(conOld.get(c.id).Vehicle1Odometer__c),Contact__c = c.id));
                if(c.Vehicle2Odometer__c != conOld.get(c.id).Vehicle2Odometer__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Vehicle 2 Odometer',Timestamp__c = Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = String.Valueof(c.Vehicle2Odometer__c),OldValue__c = String.Valueof(conOld.get(c.id).Vehicle2Odometer__c),Contact__c = c.id));
                if(c.MailingStreet != conOld.get(c.id).MailingStreet || c.MailingCity != conOld.get(c.id).MailingCity || c.MailingState != conOld.get(c.id).MailingState || c.MailingPostalCode != conOld.get(c.id).MailingPostalCode || c.MailingCountry != conOld.get(c.id).MailingCountry ){
                    string newval = (c.MailingStreet != null?c.MailingStreet:'') +' '+ (c.MailingCity != null?c.MailingCity:'') +' '+ (c.MailingState != null?c.MailingState:'') +' '+ (c.MailingPostalCode != null?c.MailingPostalCode:'') +' '+ (c.MailingCountry != null?c.MailingCountry:'');
                    string oldVal = (conOld.get(c.id).MailingStreet != null?conOld.get(c.id).MailingStreet:'') +' '+ (conOld.get(c.id).MailingCity != null?conOld.get(c.id).MailingCity:'') +' '+ (conOld.get(c.id).MailingState!=null?conOld.get(c.id).MailingState:'') +' '+ (conOld.get(c.id).MailingPostalCode!=null?conOld.get(c.id).MailingPostalCode:'') +' '+ (conOld.get(c.id).MailingCountry!=null?conOld.get(c.id).MailingCountry:'');
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c='Address',Timestamp__c = Datetime.now(),Modifiedby__c=UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c=newval,OldValue__c=oldVal,Contact__c=c.id));
                }
                if(c.MPG__c != conOld.get(c.id).MPG__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Miles per Gallon',Timestamp__c = Datetime.now(),Modifiedby__c=UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = String.Valueof(c.MPG__c),OldValue__c = String.Valueof(conOld.get(c.id).MPG__c),Contact__c = c.id));
                if(c.Manager__c != conOld.get(c.id).Manager__c) 
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Manager',Timestamp__c = Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = managerNames.get(c.Manager__c),OldValue__c = managerNames.get(conOld.get(c.id).Manager__c),Contact__c = c.id));
                if(c.compliancestatus__c != conOld.get(c.id).compliancestatus__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Compliance Status',Timestamp__c = Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = String.Valueof(c.compliancestatus__c),OldValue__c = String.Valueof(conOld.get(c.id).compliancestatus__c),Contact__c = c.id));
                if(c.Vehicle_Type__c != conOld.get(c.id).Vehicle_Type__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Standard Vehicle Make Model and Year',Timestamp__c = Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c=c.Vehicle_Type__c,OldValue__c = conOld.get(c.id).Vehicle_Type__c,Contact__c=c.id));
            }
            if(c.Deactivated_Date__c != conOld.get(c.Id).Deactivated_Date__c)
                newAuditTrialCreate.add(new AuditTrail__c(Field__c = 'Deactivation Date',Timestamp__c=Datetime.now(),Modifiedby__c = UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c = String.valueOf(c.Deactivated_Date__c),OldValue__c = String.valueOf(conOld.get(c.id).Deactivated_Date__c),Contact__c = c.id));
        }
        
        if(newAuditTrialCreate.Size()>0)
            upsert newAuditTrialCreate; 
    }
    
    //Populate Contact Fields
    public static void populatestaticValue(List<Contact> conList){
        Boolean isEMCUser = [select UserRole.name from User where Id=:userinfo.getUserId()].UserRole.Name == 'EMC' ? true : false;
        
        for(Contact c : conList) {
            if(!isEMCUser){
                c.Pay_Number__c = '3';
                c.Batch_ID_Fixed__c = 'M351';
                c.Adjust_Ded_Code_Fixed__c = 'MR';
                c.Batch_Variable_ID__c = 'M352';
                c.Adjust_Ded_Code_Variable__c = 'VR';
                c.Special_Action__c = 'W';  
            }  else {
                c.Pay_Number__c = String.IsBlank(c.Pay_Number__c) ? '3' : c.Pay_Number__c;
                c.Batch_ID_Fixed__c = String.IsBlank(c.Batch_ID_Fixed__c) ? 'M351' : c.Batch_ID_Fixed__c;
                c.Adjust_Ded_Code_Fixed__c = String.IsBlank(c.Adjust_Ded_Code_Fixed__c) ? 'MR' : c.Adjust_Ded_Code_Fixed__c;
                c.Batch_Variable_ID__c = String.IsBlank(c.Batch_Variable_ID__c) ? 'M352' : c.Batch_Variable_ID__c;
                c.Adjust_Ded_Code_Variable__c = String.IsBlank(c.Adjust_Ded_Code_Variable__c) ? 'VR' : c.Adjust_Ded_Code_Variable__c;
                c.Special_Action__c = String.IsBlank(c.Special_Action__c) ? 'W' : c.Special_Action__c;  
            } 
        }
    }
    
    /* EMC - 333
* This Method is used to when driver is insert automatically driver packet is added in file section 
* from his Account's file section.
*/
    Public Static void insertDriverAggrementFile(Map<Id, Contact> conNewMap) {
        
        Map<id, List<ID>> mapOfAccountIDvsCon  = new Map<ID, List<Id>>();
        List<ID> accIdList = new List<ID>();
        Map<ID, contact> mapConIdvsCon = new Map<ID, Contact>();
        set<Id> lstConId = new set<Id>();
        Map<Id, Id> mapConIdvsCdlId = new Map<Id, Id>();
        
        for(Contact objcon : [SELECT id,name,Account.isUsingTriplog__c,AccountID 
                              FROM Contact
                              WHERE (Role__c = 'Driver/Admin' or Role__c = 'Driver/Manager' or Role__c = 'Driver')
                              AND id in: conNewMap.keyset()]){
                                  accIdList.add(objcon.AccountID);
                                  mapConIdvsCon.put(objcon.Id, objcon);
                                  lstConId.add(objcon.Id);
                                  if(!mapOfAccountIDvsCon.containsKey(objCon.AccountID)){
                                      mapOfAccountIDvsCon.put(objCon.AccountID, new List<Id> { objCon.ID });
                                  }else{
                                      mapOfAccountIDvsCon.get(objCon.AccountID).add(objCon.ID);
                                  }   
                              }
        List<ContentDocumentLink> lstContentDocumentLink = new List<ContentDocumentLink>();
        if(accIdList != null && accIdList.size() > 0){
            for(ContentDocumentLink cdl : [SELECT ContentDocument.title,LinkedEntityId,ContentDocumentId 
                                           FROM ContentDocumentLink 
                                           WHERE LinkedEntityId IN :  lstConId
                                           AND ContentDocument.Title like '%Driver Agreement%'
                                           ORDER BY ContentDocument.CreatedDate]){
                                               mapConIdvsCdlId.put(cdl.LinkedEntityId, cdl.Id);
                                           }
            for(ContentDocumentLink cdl : [SELECT ContentDocument.title,LinkedEntityId,ContentDocumentId 
                                           FROM ContentDocumentLink 
                                           WHERE LinkedEntityId IN :  accIdList
                                           AND ContentDocument.Title like '%Driver Agreement%'
                                           ORDER BY ContentDocument.CreatedDate DESC LIMIT 1]) {
                                               
                                               if(mapOfAccountIDvsCon.containsKey(cdl.LinkedEntityId)){
                                                   for(ID obj: mapOfAccountIDvsCon.get(cdl.LinkedEntityId)){
                                                       if(!mapConIdvsCdlId.containsKey(obj)){
                                                           ContentDocumentLink objCDL = new ContentDocumentLink();
                                                           objCDL.ContentDocumentId = cdl.ContentDocumentId;
                                                           objCDL.LinkedEntityId = obj;
                                                           objCDL.ShareType = 'I'; 
                                                           objCDL.Visibility = 'AllUsers'; 
                                                           lstContentDocumentLink.add(objCDL);
                                                       }
                                                   }        
                                               }
                                           }
        }
        if(lstContentDocumentLink != null && lstContentDocumentLink.size() > 0){
            Insert lstContentDocumentLink;
        }
    }
    
    /* EMC - 357 
New Contact is created at that time we have to update plan parameter section's field 
(Insurance Plan,Plan Years,Vehicle Value and Business Use) value update automatically based on account's same fields .
*/
    public static void updatePlanParameter(Set<String> conIdList, Set<String> setaccountid) {
        Map<Id,String> mapIdvsInsplan = new Map<Id, String>();
        Map<Id,Decimal> mapIdvsPlanyear = new Map<Id, Decimal>();
        Map<Id,Decimal> mapIdvsBusinessUse = new Map<Id, Decimal>();
        Map<String,Decimal> mapVehicleValue = new Map<String, Decimal>();
        
        for (Vehicle_Value__c vehValue : [SELECT id,Account__c, Vehicle_URL_Mapping__r.Name,Value__c  
                                          FROM Vehicle_Value__c 
                                          WHERE Account__c IN :setaccountid]){
                                              mapVehicleValue.put(vehValue.Account__c + '-' + vehValue.Vehicle_URL_Mapping__r.Name.toUpperCase() , vehValue.Value__c);
                                              
                                          }
        for(Account acc : [SELECT id,name,Insurance_Plan__c, Plan_Years__c, Vehicle_Types__c, Business_Use__c 
                           FROM Account 
                           WHERE ID IN :setaccountid]){
                               mapIdvsInsplan.put(acc.ID, acc.Insurance_Plan__c);
                               mapIdvsPlanyear.put(acc.ID, acc.Plan_Years__c);
                               mapIdvsBusinessUse.put(acc.ID, acc.Business_Use__c);
                           }
        List<contact> updateConList = new List<Contact>();
        if(conIdList.size() > 0) {
            for(Contact con : [SELECT id,name,AccountId,Vehicle_Type__c,Insurance_Plan__c, Plan_Years__c,Business_Use__c,Role__c 
                               FROM contact 
                               WHERE Id IN :conIdList]) {
                                   if(mapIdvsInsplan.containsKey(con.AccountId)){
                                       con.Insurance_Plan__c = mapIdvsInsplan.get(con.AccountID);
                                       con.Plan_Years__c = mapIdvsPlanyear.get(con.AccountID);
                                       con.Business_Use__c = mapIdvsBusinessUse.get(con.AccountID);
                                   }
                                   if(mapVehicleValue.containsKey(con.AccountId + '-' + con.Vehicle_Type__c.toUpperCase())){
                                       con.Vehicle_Value__c = mapVehicleValue.get(con.AccountId + '-' + con.Vehicle_Type__c.toUpperCase());
                                   }    else {
                                        con.Vehicle_Value__c = null;
                                   }
                                   updateConList.add(con);
                               }   
        }
        if(updateConList.size() > 0){
            Update updateConList;
        }
    }
}