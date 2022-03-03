@isTest
public class UpdateReimbursementMonthBatchTest {
     @isTest static void testUpdateReimbursementMonth(){
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        insert customEmailSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        insert customSetting;
         
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
         
        Account acc = new Account();
            acc.Name = 'Acme Corporation';
            acc.Pay_Period_Start_Date__c = date.parse('2/3/2022');
            acc.Pay_Period_Days__c = 13;
            acc.isUsingTriplog__c=true;
            insert acc;
        Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'Patel',External_Email__c='abc@gmail.com');
        insert contact_1;
        Test.startTest();        
            UpdateReimbursementMonthBatch obj = new UpdateReimbursementMonthBatch ();
            database.executebatch(obj);
        Test.stopTest();
     }
}