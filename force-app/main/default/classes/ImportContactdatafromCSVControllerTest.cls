@isTest
public class ImportContactdatafromCSVControllerTest {
    @isTest 
    public static void test() {
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting1 = TestDataFactory.sendEmailCustomSetting(true,'Send Email For Compliance');
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();
        List<Contact> adminConList = new List<Contact>();
        
        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'Test',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
            adminConList = TestDataFactory.createDriverContact(true, acc.Id, 'Admin', vehicleObj.Name, 'test1.email', 1);
            userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
        }

        Attachment attach = TestDataFactory.createAttachment(true, conList[0].id);
        List<Attachment> attachments = [select id, name from Attachment where parent.id =: conList[0].id];
        //String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Vehicle URL \n';
        String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Compliance Mileage,Vehicle URL\nManager,paras ,dhanani,paras.test123@gmail.com,6879056890,Surat,GJ,395006,ENV,Inspector/Consultant,Minkesh,Patel,mink.patel@kiwiqa.com,3231,142,0,4207,7580,451.01,6,451.01,Attended,Sent,9/30/2021,1/1/2022,25.5,0.0597,0.0461,0.1058,2022 Ford F-150,5000,https://f.hubspotusercontent40.net/hubfs/2511299/2022-Chevy-Silverado.jpeg \n'; 
        System.debug('strOriginal==' + strOriginal);
        final Blob dataDocuments ;
        string accId;
        Test.startTest();
        
       ImportContactdatafromCSVController i = new ImportContactdatafromCSVController(strOriginal,  acc.Id, adminConList[0].id);
       Database.executeBatch(I);
       dataDocuments = Blob.valueOf('strOriginal');
        accId = acc.Id;
       Date cvtDate = ImportContactdatafromCSVController.convertDateFormat('20/12/2022');
       Date cvtDate1 = ImportContactdatafromCSVController.convertDateFormat('20-12-2022');
        Test.stopTest();
   }

   @isTest 
   public static void test1() {
    TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
    SendEmail__c sendEmailCustomSetting1 = TestDataFactory.sendEmailCustomSetting(true,'Send Email For Compliance');
    TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
    Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
    IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
    
    Account acc = new Account();     
    List<Contact> conList = new List<Contact>();
    List<Contact> adminConList = new List<Contact>();
    
    UserRole userRole = TestDataFactory.getUserRole();
    Profile profileObj = TestDataFactory.getUserProfile();
    User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
    User userObj;
    System.runAs(admin) {
        Account accountObj = TestDataFactory.createAccount(true,'Test',true);
        Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
        acc = TestDataFactory.createAccount(false,'Test',true);
        acc.True_Dialog__c = true;
        Insert acc;
        conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
        adminConList = TestDataFactory.createDriverContact(true, acc.Id, 'Admin', vehicleObj.Name, 'test1.email', 1);
        userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
    }

    Attachment attach = TestDataFactory.createAttachment(true, conList[0].id);
    List<Attachment> attachments = [select id, name from Attachment where parent.id =: conList[0].id];
    //String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Vehicle URL \n';
    //String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Compliance Mileage,Vehicle URL\nManager,paras ,dhanani,paras.dhanani@getoncrm.com,1234,Surat,GJ,395006,ENV,Inspector/Consultant,Minkesh,Patel,mink.patel@getoncrm.com,abcd,142,0,4207,7580,451.01,6,451.01,Attended,Sent,9-30-2021,1/1/2022,25.5,0.0597,0.0461,0.1058,2022 Ford F-150,5000,https://f.hubspotusercontent40.net/hubfs/2511299/2022-Chevy-Silverado.jpeg \n'; 
    String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Compliance Mileage,Vehicle URL\nManager,paras ,Dhanani ,paras.test123@gmail.com,6879056890,Surat,GJ,395006,ENV,Inspector/Consultant,Minkesh,Patel,mink.patel@kiwiqa.com,3231,142,0,4207,7580,451.01,6,451.01,Attended,Sent,9-30-2021,1/1/2022,25.5,0.0597,0.0461,0.1058,2022 Ford F-150,5000,https://f.hubspotusercontent40.net/hubfs/2511299/2022-Chevy-Silverado.jpeg \n'; 
    System.debug('strOriginal==' + strOriginal);
    final Blob dataDocuments ;
    string accId;
    Test.startTest();
    
   ImportContactdatafromCSVController i = new ImportContactdatafromCSVController(strOriginal,  acc.Id, adminConList[0].id);
   Database.executeBatch(I);
   dataDocuments = Blob.valueOf('strOriginal');
    accId = acc.Id;
    Test.stopTest();
}
    
 @isTest 
   public static void test2() {
    TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
    SendEmail__c sendEmailCustomSetting1 = TestDataFactory.sendEmailCustomSetting(true,'Send Email For Compliance');
    TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
    Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
    IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
    
    Account acc = new Account();     
    List<Contact> conList = new List<Contact>();
    List<Contact> adminConList = new List<Contact>();
    
    UserRole userRole = TestDataFactory.getUserRole();
    Profile profileObj = TestDataFactory.getUserProfile();
    User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
    User userObj;
    System.runAs(admin) {
        Account accountObj = TestDataFactory.createAccount(true,'Test',true);
        Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
        acc = TestDataFactory.createAccount(false,'Test',true);
        acc.True_Dialog__c = true;
        Insert acc;
        conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
        adminConList = TestDataFactory.createDriverContact(true, acc.Id, 'Admin', vehicleObj.Name, 'test1.email', 1);
        userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
    }

    Attachment attach = TestDataFactory.createAttachment(true, conList[0].id);
    List<Attachment> attachments = [select id, name from Attachment where parent.id =: conList[0].id];
    //String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Vehicle URL \n';
    //String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Compliance Mileage,Vehicle URL\nManager,paras ,dhanani,paras.dhanani@getoncrm.com,1234,Surat,GJ,395006,ENV,Inspector/Consultant,Minkesh,Patel,mink.patel@getoncrm.com,abcd,142,0,4207,7580,451.01,6,451.01,Attended,Sent,9-30-2021,1/1/2022,25.5,0.0597,0.0461,0.1058,2022 Ford F-150,5000,https://f.hubspotusercontent40.net/hubfs/2511299/2022-Chevy-Silverado.jpeg \n'; 
    String strOriginal ='Role,First Name,Last Name,Email Address,Cell Phone,City,State,Zip Code,Department,Job Title,Managers First Name,Managers Last Name,Managers Email,Insurance Rate,License and Registration,Personal Property Tax,Depreciation,Annual Fixed Cost,Fixed Amount,FCA,Total Fixed Amount,Meeting ,Packet ,Date Added,Activation Date,MPG,Maint,Tires ,Maint/Tires,Standard Vehicle,Compliance Mileage,Vehicle URL\nManager,paras ,dhanani ,paras.test123@gmail.com,,Surat,GJ,395006,ENV,Inspector/Consultant,Minkesh,Patel,mink.patel@kiwiqa.com,3231,142,0,4207,7580,451.01,6,451.01,Attended,Sent,9-30-2021,1/1/2022,25.5,0.0597,0.0461,0.1058,2022 Ford F-150,5000,https://f.hubspotusercontent40.net/hubfs/2511299/2022-Chevy-Silverado.jpeg \n'; 
    System.debug('strOriginal==' + strOriginal);
    final Blob dataDocuments ;
    string accId;
    Test.startTest();
    
   ImportContactdatafromCSVController i = new ImportContactdatafromCSVController(strOriginal,  acc.Id, adminConList[0].id);
   Database.executeBatch(I);
   dataDocuments = Blob.valueOf('strOriginal');
    accId = acc.Id;
    Test.stopTest();
}
    
}