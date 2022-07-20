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
        
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        
        
      
        Account a = TestDataFactory.createAccount(true, 'demo', false);
        
        Contact c  = TestDataFactory.createCICDContact(false, a.id);
        
        c.email='test@gmail.com';
        c.MobilePhone='+13239638840';
        c.lastName='Veer';
        c.firstName='Sharma';
        c.External_Email__c='test@gmail.com';
        c.TrueDialog_Contact_Id__c='81071892';
        
        insert c;
        
        Message__c message = new Message__c();
        message.Message__c='test contact id';
        message.Contacts__c=c.id;
        insert message;

        List<Id> idList =new List<Id>();
        idList.add(c.id);
            
        Test.setMock(HttpCalloutMock.class, new TrueDialogMockCallout());   
        Test.startTest();

        TrueDialogSendMessageAPI.getAllMessageByContact(c.id);
        TrueDialogSendMessageAPI.sendMessageToContact(c.id,'Hello');
        TrueDialogSendMessageAPI.getContactPicture(c.id);

        
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
        
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        
        Account a = TestDataFactory.createAccount(true, 'demo', false);

        Contact c  = TestDataFactory.createCICDContact(false, a.id);  
        c.email='test@gmail.com';
        c.MobilePhone='+13239638840';
        c.lastName='Veer';
        c.firstName='Sharma';
        c.External_Email__c='test@gmail.com';
        c.TrueDialog_Contact_Id__c='81071892'; 
        insert c;
        
        Set<String> lstId = new Set<String>();
        lstId.add(c.id);
        
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
        
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
      
        Account a = TestDataFactory.createAccount(true, 'demo', false);
        
        Contact c  = TestDataFactory.createCICDContact(false, a.id);
        c.email='test@gmail.com';
        c.MobilePhone='+13239638840';
        c.lastName='Veer';
        c.firstName='Sharma';
        c.External_Email__c='test@gmail.com';
        insert c;
    	
        Set<String> lstId = new Set<String>();
        lstId.add(c.id);
          
		TrueDialogContactAPI trueDialogContactAPI = new TrueDialogContactAPI(lstId);
        Database.executeBatch(trueDialogContactAPI, 1);
        
        Test.stopTest();
       
    }

}