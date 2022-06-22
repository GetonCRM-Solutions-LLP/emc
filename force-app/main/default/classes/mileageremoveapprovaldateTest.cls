@isTest
public class mileageremoveapprovaldateTest {
    @isTest
    public static void TestMethod1(){
        TriggerConfig__c cusmsetting = TestDataFactory.triggerConfigCustomSetting(True);
        SendEmail__c  SendEmailcusmsetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(true, 3);
        IRS_Mileage_Rate__c createIRSRate = TestDataFactory.createIRSRate(true, 0);
        
        Account acc;
        Account acc2;
        List<Contact> con ;
        
        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        
        System.runAs(admin) {
            acc = TestDataFactory.createAccount(True, 'Test Account', true);
            con = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleType.Name, 'Paras.Patel', 2); 
            userObj = TestDataFactory.createUser(True, profileObj.Id, con[0].Id);
        }
        List<Employee_Reimbursement__c> er = TestDataFactory.createPendingReimbursement(true, con, 1, createIRSRate.Id);
        List<Bi_Weekly_Reimbursement__c> br = TestDataFactory.createBiweeklyReim (true, con, System.today().addDays(-26),System.today().addDays(-13), 1, createIRSRate.Id);
        List<Employee_Mileage__c> emp1 = TestDataFactory.getEmpMileage (True, 1, er, br);
        
        test.startTest();
        MileageTriggerHandler.MileageRemoveApprovalDateHandler(emp1);
        MileageTriggerHandler.updateWorkingDays(emp1);
        delete emp1;
        test.stopTest();
    }

}