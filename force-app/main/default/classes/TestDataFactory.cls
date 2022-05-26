@isTest
public with sharing class TestDataFactory {
    /** 
    * ********************************************************
    * This method is test data for create IRS_Mileage_Rate__c.
    * ********************************************************
    */
    public static IRS_Mileage_Rate__c createIRSRate(Boolean doInsert,Integer checkYear) {
        IRS_Mileage_Rate__c objIRSRate = new IRS_Mileage_Rate__c();
        objIRSRate.year__c = String.valueof(System.today().year() - checkYear);
        objIRSRate.IRS_Rate__c = 0.578;
        if(doInsert){
            insert objIRSRate;
        }
        return objIRSRate;
    }
    /** 
    * ********************************************************
    * This method is test data for send email custom setting.
    * ********************************************************
    */
    public static SendEmail__c sendEmailCustomSetting(Boolean doInsert,String name){
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = name;
        customSetting.Send_email_from_code__c = true;
        if(doInsert){
            insert customSetting;
        }
        return customSetting;
    }

    public static SendEmailonDeactivation__c sendEmailCustomSetting(Boolean doInsert,String name, String bccEmailId){
    SendEmailonDeactivation__c objSendEmail = new SendEmailonDeactivation__c();
        objSendEmail.Name = name; //YearToDateReimbursementStatement
        objSendEmail.BCCEmailaddresses__c = bccEmailId;
        objSendEmail.Send_to_Driver__c = true;
        
        if(doInsert){
            insert objSendEmail;
        }
        return objSendEmail;

    }
     /** 
    * ********************************************************
    * This method is test data for send email to me custom setting.
    * ********************************************************
    */
    public static SendEmailToMe__c sendEmailToMeCustomSetting(Boolean doInsert,String name){
        SendEmailToMe__c customSetting =  new SendEmailToMe__c();
        customSetting.Name = name;
        customSetting.Send_email_to_me__c = true;
        if(doInsert){
            insert customSetting;
        }
        return customSetting;
    }
    /** 
    * ********************************************************
    * This method is test data for trigger config custom setting.
    * ********************************************************
    */
    public static TriggerConfig__c triggerConfigCustomSetting(Boolean doInsert){
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.ContactTriBiReimCreate__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasPriceTriggerUpdateConvertedDat__c = true;
        customSetting.MappingMileage__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.MapTriAppReje__c = true;
        customSetting.Mileage_Lockdate__c = true;
        customSetting.mileageremoveapprovaldate__c   = true;
        customSetting.TrackHistory__c = true;
        customSetting.UserTrigger__c = true;
        if(doInsert){
            insert customSetting;
        }
        return customSetting;        
    }
    /** 
    * ********************************************************
    * This method is test data for NewDashboard Message custom setting.
    * ********************************************************
    */
    public static NewDashboardMessage__c newMsgCustomSetting(Boolean doInsert){
        NewDashboardMessage__c newMsg = new NewDashboardMessage__c();
        newMsg.Name = 'Message';
        newMsg.File_Loader__c = 'Please wait while your insurance is uploaded.';
        if(doInsert){
            insert newMsg;
        }
        return newMsg;
    }
    
    /** 
    * ********************************************************
    * This method is test data for Hello sign custom setting.
    * ********************************************************
    */
    public static Hello_Sign__c helloSignCustomSetting(Boolean doInsert){
        Hello_Sign__c customHello = new Hello_Sign__c();
        customHello.Name = 'Hello_Sign';
        customHello.Admin_Email__c = 'test@gmail.com';
        customHello.Admin_Name__c = 'Test';
        customHello.TestMode__c = true;
        if(doInsert){
            insert customHello;
        }
        return customHello;
    }


    /** 
    * ********************************************************
    * This method is create test data for Vehicle URL Mapping object
    * ********************************************************
    */
    public static Vehicle_URL_Mapping__c createVehicleData(Boolean doInsert,Integer checkYear) {   
        Vehicle_URL_Mapping__c vehicleObj = new Vehicle_URL_Mapping__c();
        vehicleObj.Name = String.valueof(System.today().year() - checkYear) + ' Mileage Rate';
        vehicleObj.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093359.jpg';
        vehicleObj.vehicle__c =  'Mileage Rate';
        vehicleObj.Year__c = String.valueof(System.today().year() - checkYear);
        if(doInsert){
            insert vehicleObj;
        }
        return vehicleObj;
    }
    /** 
    * ********************************************************
    * This method is create test data for Userrole
    * ********************************************************
    */
    public static UserRole getUserRole() {   
        UserRole userRole = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        return userRole;
    }
    /** 
    * ********************************************************
    * This method is create test data for Profile
    * ********************************************************
    */
    public static Profile getUserProfile() {   
        //Profile profileObj = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        Profile profileObj = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User - Driver' LIMIT 1];
        return profileObj;
    }
    /** 
    * ********************************************************
    * This method is create test data for Profile
    * ********************************************************
    */
    public static User getSystemAdminUser(Id userRole) {   
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId =: userRole LIMIT 1];
        return admin;
    }
    /** 
    * ********************************************************
    * This method is create test data for User record
    * ********************************************************
    */
    public static User createUser(Boolean doInsert,Id profileId,Id contactId) {   
        User userObj = new User( 
            Email = 'abc@gmail.com',
            ProfileId = profileId, 
            UserName = 'abc@gmail.com', 
            Alias = 'Test',
            TimeZoneSidKey = 'America/New_York',
            EmailEncodingKey = 'ISO-8859-1',
            LocaleSidKey = 'en_US', 
            LanguageLocaleKey = 'en_US',
            ContactId = contactId,
            PortalRole = 'Manager',
            FirstName = 'Firstname',
            LastName = 'Lastname'
        );
        if(doInsert){
            insert userObj;
        }
        return userObj;
    }
    /** 
    * ********************************************************
    * This method is test data for create Account.
    * ********************************************************
    */
    public static Account createAccount(Boolean doInsert,String accountName,Boolean checkByWeek) {
        Account accountObj = new Account( Name = accountName);
        accountObj.Bi_Weekly_Pay_Period__c = checkByWeek;
        accountObj.Pay_Period_Days__c = 13;
        accountObj.Pay_Period_Start_Date__c = system.today().adddays(-130);
        accountObj.Triplog_API__c = '123456789';
        accountObj.Triplog_Status__c = 'U';
        accountObj.isUsingTriplog__c = True;
        if(doInsert){
            insert accountObj;
        }
        return accountObj;
    }
    /** 
    * ********************************************************
    * This method is test data for create Contact.It is use for CICD deployment.
    * ********************************************************
    */
    public static Contact createCICDContact(Boolean doInsert,Id accountId) {
        Contact contactObj = new Contact(AccountId = accountId, LastName = 'xgeek',External_Email__c='abc@gmail.com');
        if(doInsert){
            insert contactObj;
        }
        return contactObj;
    }
    /** 
    * ********************************************************
    * This method is test data for create Driver Contact.
    * ********************************************************
    */
    public static List<Contact> createDriverContact(Boolean doInsert,Id accountId,String role, String vehicleName, String emailName, Integer nmbrRecord) {
        List<Contact> conList = new List<Contact>();
        for(Integer i = 1; i <= nmbrRecord; i++){                
            Contact con = new Contact();        
            con.FirstName = 'Priyanka';
            con.LastName = 'Gajera';
            con.Employee_ID__c = '123456';
            con.AccountId = accountId;
            con.External_Email__c = emailName + i + '@gmail.com';
            con.Phone = '1234566787';
            con.Driver_Type__c = 'Driver - Full Time';
            con.Deactivated_Date__c = null;
            con.Insurance_Attachment_Id__c = Null;
            con.Vehicle_Type__c = vehicleName;  
            con.Role__c = role;
            con.compliancestatus__c = 'Yes';
            con.isCommunityUser__c = false;
            con.IsCreatedFromCommunity__c = false;
            con.Triplog_UserID__c = '23rcdsf';
            con.ReimbursementStatementBatch__c = true;
            
            
            //con.compliancestatus__c = 'No – Vehicle Age';
            con.Manager__c = null;                
            conList.add(con);                
        }
        system.debug('conList==' + conList);
        if(doInsert){

            insert conList;
        }
        return conList;
    }
    /** 
    * ********************************************************
    * This method is test data for create Employee Reimbursement.
    * ********************************************************
    */
    public static List<Employee_Reimbursement__c> createPendingReimbursement(Boolean doInsert,List<Contact> contactList,Integer nmbrRecord,Id irsRate)
    {        
        list<Employee_Reimbursement__c> reimbursementList = new list<Employee_Reimbursement__c>();
        for(Contact currentContact : contactList) {
            for(Integer i = 0; i <= nmbrRecord; i++) {
                Employee_Reimbursement__c objReimbursement = new Employee_Reimbursement__c();
                objReimbursement.Name = currentContact.name+':'+getLastMonthValue(-i);               
                objReimbursement.Month__c = getLastMonthValue(-i);               
                objReimbursement.Contact_Id__c = currentContact.Id;
                objReimbursement.Status__c = 'Pending'; 
                objReimbursement.IRS_Mileage_Rate__c = irsRate;
                objReimbursement.Fixed_Amount__c  = 121;
                objReimbursement.Monthly_Fixed_Amount__c = 123;
                objReimbursement.Approved_Date__c = null;     
                objReimbursement.Number_of_Pay_Period__c = i;
                reimbursementList.add(objReimbursement);
            }
        }
        system.debug('reimbursementList204== ' + reimbursementList);
        if(doInsert){
            insert reimbursementList;
        }
        return reimbursementList;
    }
    /** 
    * ********************************************************
    * This method is use for creating string of reimbursement month.
    * Param value means if you pass 0 as a value then it return current month.
    * ********************************************************
    */
    public static String getLastMonthValue(Integer value) {
        String tempDate = date.today().addMonths(value).Month() + '-' + date.today().addMonths(value).Year();
        String lastMonth = tempDate.left(2);
        if(lastMonth.contains('-')) {
            lastMonth = '0' + tempDate;
        } else {
            lastMonth = tempDate;
        }
        return lastMonth;
    }
    /**
     * **********************************************************
     * This Method is used for creating bi weekly reimbursement
     * ********************************************************** 
     */

    public static List<Bi_Weekly_Reimbursement__c> createBiweeklyReim(Boolean doInsert,List<Contact> contactList,date startDate, date endDate, Integer nmbrRecord,Id irsRate){
        List<Bi_Weekly_Reimbursement__c> biweeklyreimList = new List<Bi_Weekly_Reimbursement__c>();
        for(Contact currentContact : contactList) {
            for(Integer i = 1; i <= nmbrRecord; i++) {
                Bi_Weekly_Reimbursement__c objbiweeklyReim = new Bi_Weekly_Reimbursement__c();
                objbiweeklyReim.Name = startDate + ' to ' + endDate;
                objbiweeklyReim.Start_Date__c =  startDate;
                objbiweeklyReim.End_Date__c = endDate;                           
                objbiweeklyReim.Contact__c = currentContact.Id;
                objbiweeklyReim.Status__c = 'Pending'; 
                objbiweeklyReim.IRS_Mileage_Rate__c = irsRate;
                objbiweeklyReim.Fixed_Amount__c  = 121;
                objbiweeklyReim.Approved_Date__c = null;     
                objbiweeklyReim.Number_of_Pay_Period__c = i;
                biweeklyreimList.add(objbiweeklyReim);
            }
        }
        if(doInsert){
            insert biweeklyreimList;
        }
        return biweeklyreimList;   
    }
    /**
     * **********************************************************
     * This Method is used for creating Employee Mileages
     * ********************************************************** 
     */
    public static List<Employee_Mileage__c> getEmpMileage(Boolean doInsert, Integer nmbrRecord,List<Employee_Reimbursement__c> reimList, List<Bi_Weekly_Reimbursement__c> biweeklyReimList){
        List<Employee_Mileage__c> empMilageList = new List<Employee_Mileage__c>();
        for(Integer i = 0; i <= nmbrRecord; i++) {
            Employee_Mileage__c empMileage = new Employee_Mileage__c();
            empMileage.Name = 'Test Mileage ' + i;
            empMileage.Contact_Email_Id__c = 'paras.dhanani@gmail.com';  
            empMileage.EmployeeReimbursement__c = reimList[i].id;
            empMileage.Bi_Weekly_Reimbursement__c = biweeklyReimList[i].id;
            empMileage.Activity__c =  'Business';
            empMileage.Mileage__c =  51.20;
            empMileage.Fuel_price__c =  3.21;
            empMileage.MPG__c =  24.30;
            empMileage.Origin_Name__c = 'Test Origin ' + i ;                           
            empMileage.Trip_Destination__c = 'Test Destination ' + i;
            empMileage.Trip_Status__c = StaticValues.noApprovedYet; 
            empMileage.Approved_Date__c = null;     
            empMilageList.add(empMileage);
        }
        if(doInsert){
            insert empMilageList;
        }
        return empMilageList; 
    }
     /**
     * **********************************************************
     * This Method is used for creating Attachment
     * ********************************************************** 
     */
    public static Attachment createAttachment(Boolean doInsert,String contactId) {
        Attachment attach = new Attachment();     
        attach.Name = 'Unit Test Attachment';
        Blob bodyBlob = Blob.valueOf('Unit Test Attachment Body');
        attach.body = bodyBlob;
        attach.parentId = contactId;
        if(doInsert){
            insert attach;
        }
        return attach;
    }
    /**
     * **********************************************************
     * This Method is used for creating an address List
     * ********************************************************** 
     */
    public static List<Address__c> createAddress(Boolean doInsert, Integer nmbrRecord){
        List<Address__c> addressList = new List<Address__c>();
        for(Integer i = 0; i <= nmbrRecord; i++) {
            Address__c addrs = new Address__c();
            addrs.State__c ='Alabama';
            addrs.City__c ='Abbeville';
            addrs.Abbreviation__c ='AL';
            addrs.ZIP_Code__c ='36310'; 
            addrs.Time_Zone__c = 'America/Anchorage';
            addressList.add(addrs);
        }
        if(doInsert){
            insert addressList;
        }
        return addressList;
    }
}