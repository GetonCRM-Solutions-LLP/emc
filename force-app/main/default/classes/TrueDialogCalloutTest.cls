/****************************************************************************************************
 * Create By : Dhanraj Khatri
 * Create Date : 06/07//2022
 * Description :  Test Class for Coverage Of All Related API Classes
               
 * Modification Log:
 *  -------------------------------------------------------------------------------------------------
 *  * Developer                         Date                   Description
 *  *------------------------------------------------------------------------------------------------
 *  *   -                                -                         -
*****************************************************************************************************/

@isTest
public class TrueDialogCalloutTest {

        /** 
    * ********************************************************
    * test method for Sending Message API callout
    * ********************************************************
    */
    
    
    @isTest
    public static void testSendMessageAPICallout(){
      
       TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
       
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();

        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'demo',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
            userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
        }
        
        Message__c message = new Message__c();
        message.Message__c = 'test contact id';
        message.Contacts__c= conList[0].id;
        insert message;

        List<Id> idList = new List<Id>();
        idList.add(conList[0].id);
            
        Test.setMock(HttpCalloutMock.class, new TrueDialogMockCallout());   
        Test.startTest();
        TrueDialogSendMessageAPI.getAllMessageByContact(conList[0].id);
        TrueDialogSendMessageAPI.sendMessageToContact(conList[0].id,'Hello');
        TrueDialogSendMessageAPI.getContactPicture(conList[0].id);
        Test.stopTest();
    
    }

       /** 
    * ********************************************************
    * test method for PUT Contact API callout
    * ********************************************************
    */
    @isTest
    public static void testContactPutAPICallout(){
        
        Test.setMock(HttpCalloutMock.class, new TrueDialogMockCallout());   
        Test.startTest();
       	TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
        
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
       
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();

        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'demo',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
            userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
        }

        Set<Id> lstId = new Set<Id>();
        lstId.add(conList[0].id);
        
		TrueDialogContactAPI trueDialogContactAPI = new TrueDialogContactAPI(lstId);
        Database.executeBatch(trueDialogContactAPI, 1);
        Test.stopTest();
    }


       /** 
    * ********************************************************
    * test method for POST Contact API callout
    * ********************************************************
    */
    @isTest
    public static void testContactPostAPICallout(){
        
        Test.setMock(HttpCalloutMock.class, new TrueDialogMockCallout());   
        Test.startTest();	
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
        
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);

        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();

        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'demo',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            conList = TestDataFactory.createDriverContact(true, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
            userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
        }
        Set<Id> lstId = new Set<Id>();
        lstId.add(conList[0].id);
        Test.stopTest();
    }
}