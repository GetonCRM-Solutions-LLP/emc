@isTest
public class TriplogStateUpdateBatchTest {
    @isTest static void myUnitTest() {
        TrueDialog_Keys__c trueDialogCustom = TestDataFactory.createTrueDialog(true);
        TriggerConfig__c customEmailSetting = TestDataFactory.triggerConfigCustomSetting(true);
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
            acc.Pay_Period_Start_Date__c = System.today().addDays(-100);
            acc.Pay_Period_Days__c = 6;
            update acc;
          conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleType.Name, 'test.email', 1);
          userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
      }
        Test.StartTest();
            TriplogStateUpdateBatch batchobj = new TriplogStateUpdateBatch();         
            Database.executeBatch(batchobj,1);
        Test.StopTest();
    }
}