@isTest
public class ManageNotificationControllerTest {

    public static testmethod void testMethod1(){
        SendEmail__c  customEmailSetting =  new SendEmail__c ();
        customEmailSetting.Name = 'SendMileageReminderforDelta';
        customEmailSetting.Send_email_from_code__c= false;
        insert customEmailSetting;
        
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
        TriggerConfig__c customEmailSetting1 =  new TriggerConfig__c();
        customEmailSetting1.Name = 'Defaulttrigger';
        customEmailSetting1.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting1.ContactTriCommunityReimCreate__c = true;
        insert customEmailSetting1;
        
        SendEmailonDeactivation__c objCustom = new SendEmailonDeactivation__c();
        objCustom.Name = 'SendMileageReminderforDelta';        
        objCustom.BCCEmailaddresses__c = 'test@gmail.com';
        objCustom.Send_to_Driver__c = true;
        insert objCustom;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Ford Escape';
        veh.Year__c = '2019';
        insert veh;
        
        List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();
        
        Account acc = new Account();           
        acc.Name = 'Test Account';
        acc.Triplog_API__c = '123456789';
        Acc.Triplog_Status__c = 'U';
        insert Acc;
        
        List<Contact> conList = new List<Contact>();
        
        for(Integer i; i<=10; i++){
            
        Contact con = new Contact();        
        con.FirstName = 'Priyanka';
        con.LastName = 'Gajera';
        con.AccountId = acc.Id;
        con.External_Email__c = 'minkfesh.patel1478'+ i + '@gmail.com';
        con.Deactivated_Date__c = Null;
        con.Insurance_Attachment_Id__c = Null;
        con.Vehicle_Type__c = '2019 Ford Escape';  
        con.Role__c = 'Driver';
           
            conList.add(con);
        }
        
        insert conList;
        
        Contact con2 = new Contact();        
        con2.FirstName = 'Priyanka';
        con2.LastName = 'Gajera';
        con2.AccountId = acc.Id;
        con2.External_Email__c = 'minkegsh.patel1478@gmail.com';
        con2.Deactivated_Date__c = Null;
        con2.Role__c = 'Admin';
        con2.Insurance_Attachment_Id__c = Null;
        insert con2;
        
        Contact con3 = new Contact();        
        con3.FirstName = 'Priyanka';
        con3.LastName = 'Gajera';
        con3.AccountId = acc.Id;
        con3.Manager__c = con2.id;
        con3.External_Email__c = 'minkegsh.patxxel1478@gmail.com';
        con3.Deactivated_Date__c = Null;
        con3.Role__c = 'Manager';
        con3.Insurance_Attachment_Id__c = Null;
        insert con3;
        
        Contact con1 = new Contact();        
        con1.FirstName = 'Priyanka';
        con1.LastName = 'Gajera';
        con1.AccountId = acc.Id;
        con1.Manager__c = con2.id;
        con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
        con1.Deactivated_Date__c = Null;
        con1.Role__c = 'Driver';
        con1.Insurance_Attachment_Id__c = Null;
        con1.Vehicle_Type__c = '2019 Ford Escape';
        insert con1;

        Attachment attach=new Attachment(); 
        attach.Name='Unit Test Attachment'; 
        Blob bodyBlob=Blob.valueOf('Unit Test Attachment Body'); 
        attach.body=bodyBlob; 
        attach.parentId=con1.id;
        insert attach;
    
        String json = '[{\"name\":\"The White House\",\"address\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\",\"activity\":\"Business\",\"userId\":\"20000649\"},{\"name\":\"The White House\",\"address\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\",\"latitude\":38.683885,\"longitude\":-8.6109719,\"activity\":\"Business\",\"userId\":\"20000649\"}]';
        String json1 = '[{\"contactId\":\" '+con1.id + ' \",\"name\":\"Business\",\"notiMessage\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\"}]';
        String json3 = '[{\"triploguserid\":\"20000339\",\"role\":\"Driver/Admin\",\"notiMessage\":\"Test123gdd\",\"notificationDate\":\"2021-06-30\",\"name\":\"Jaytik\",\"massEmail\":false,\"lastname\":\"Luhar\",\"isEditable\":false,\"insuranceId\":\"00P6s0000077Rj9EAE\",\"insurance\":null,\"fullname\":\"Jaytik Luhar\",\"expirationDate\":null}]';        
        ManageNotificationController mc = new ManageNotificationController();
        ManageNotificationController.NewEmployeeData(Acc.Id,con2.id);
        ManageNotificationController.NewEmployeeData(Acc.Id,con3.id);
        ManageNotificationController.UploadLocation(json,Acc.Id);
        
       ManageNotificationController.sendAllInsuranceEmail(json1, con2.id);
       ManageNotificationController.UploadLocation(json ,Acc.Id);
       ManageNotificationController.getdriverInsurance(attach.id);
       ManageNotificationController.editInlineNewEmployee(json3 ,con2.id);
        
       
    }
}