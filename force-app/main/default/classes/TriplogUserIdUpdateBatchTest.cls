@isTest
public class TriplogUserIdUpdateBatchTest {
       @isTest static void myUnitTest() {
        
        //Insert Custom setting data
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c customSetting2 = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        TrueDialog_Keys__c trueDialogCustom = TestDataFactory.createTrueDialog(true);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        insert vehicleType;
        
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();

        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        System.runAs(admin) {
            acc = TestDataFactory.createAccount(true,'Delta',true);
            conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleType.Name, 'test.email', 1);
            userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
        }
        
        Map<String,Contact> contactMap = new Map<String,Contact>();
        for(Contact currentContact : [Select id,Name,FirstName,Triplog_UserID__c,External_Email__c,Deactivated_Date__c From Contact Where Account.id =: acc.Id])
        {
            contactMap.put(currentContact.External_Email__c.toLowerCase(),currentContact);
        }
        
        Test.StartTest();
        Test.setMock(HttpCalloutMock.class, new TriplogUserIdUpdateBatchTestMock());
        TriplogUserIdUpdateBatch batchobj = new TriplogUserIdUpdateBatch(acc.Id,acc.Triplog_API__c,contactMap);
        TriplogUserIdUpdateBatch.getTripIds(acc.Triplog_API__c);  
        batchobj.responseOfAPICall = TriplogUserIdUpdateBatch.getTripIds(acc.Triplog_API__c);  
         
        Database.executeBatch(batchobj,10);
        Test.StopTest();
   }
}