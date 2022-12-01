@isTest
public with sharing class CreateReimbursementTest {
    public static testmethod void reimburMethod1() {
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        IRS_Mileage_Rate__c obj_IRS_Mileage_Rate_1 = TestDataFactory.createIRSRate(true,0);
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        Vehicle_URL_Mapping__c veh = TestDataFactory.createVehicleData(false, 3);
        veh.Name = '2019 Full-Size Sedan';
        veh.vehicle__c = 'Full-Size Sedan';
        Insert veh;
        
        UserRole uRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(uRole.Id);
        User userObj;
        
        Account acc;
        List<Contact> conList;
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'Test',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            acc.Triplog_API__c = 'fde76cdde14449bea46b321225ac8fd1';
            acc.Pay_Period_Start_Date__c = System.today().addDays(-100);
            acc.Pay_Period_Days__c = 13;
            update acc;
            
            conList = TestDataFactory.createDriverContact(false, acc.Id, 'Driver', veh.Name, 'paras.dhanani',  1);
            conList[0].Vehicle_Type__c = veh.Name;
            Insert conList[0];
            
            system.assertEquals(1, conList.size(), true);
            userObj = TestDataFactory.createUser(True, profileObj.Id, contactObj.Id);
        }    
       // List<Gas_Prices__c>  gasPriceList = TestDataFactory.createGasPrice(true, 'Denver', Date.today().adddays(-1), 0);
        String lastMonth = Utils.fetchMonths(1, -1)[0];
        
        List<Employee_Reimbursement__c> reimList = TestDataFactory.createPendingReimbursement(true ,conList,1, obj_IRS_Mileage_Rate_1.Id);
        
        Test.startTest();
        CreateReimbursement abc = new CreateReimbursement(); 
        Database.executeBatch(abc);
        Test.stopTest();
    }
}