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
        
        daylight_saving_time_config__c customSetting2 =  new daylight_saving_time_config__c();
        customSetting2.Name = '2022';
        customSetting2.Start_Date__c = System.today();
        customSetting2.End_Date__c = System.today() + 60;
        insert customSetting2;
        
        List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();
        Contact con2 = new Contact();    
        Contact con1 = new Contact();    
          Contact con3 = new Contact();        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        System.runAs(admin) {
          Account account_1 = new Account( Name = 'Community'  );
           account_1.Bi_Weekly_Pay_Period__c = true;
            account_1.Pay_Period_Days__c = 13;
            account_1.Pay_Period_Start_Date__c = system.today().adddays(-130);
          insert account_1;
          
          Contact contact_1 = new Contact(AccountId = account_1.Id, LastName = 'xgeek',External_Email__c='abc@gmail.com');
          insert contact_1;
           acc.Name = 'Test Account';
            acc.Triplog_API__c = '123456789';
            Acc.Triplog_Status__c = 'U';
             acc.Bi_Weekly_Pay_Period__c = true;
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-130);
            insert Acc;
            
            for(Integer i; i<=10; i++){
            
        Contact con = new Contact();        
        con.FirstName = 'Priyanka';
        con.LastName = 'Gajera';
        con.Employee_ID__c = '123456';
        con.AccountId = acc.Id;
        con.External_Email__c = 'minkfesh.patel1478'+ i + '@gmail.com';
        con.Deactivated_Date__c = Null;
        con.Insurance_Attachment_Id__c = Null;
        con.Vehicle_Type__c = '2019 Ford Escape';  
        con.Role__c = 'Driver';
           
            conList.add(con);
        }
        insert conList;
        
            
        con2.FirstName = 'Priyanka';
        con2.LastName = 'Gajera';
        con2.AccountId = acc.Id;
        con2.External_Email__c = 'minkegsh.patel1478@gmail.com';
        con2.Deactivated_Date__c = Null;
        con2.Role__c = 'Admin';
        con2.Insurance_Attachment_Id__c = Null;
        con2.Employee_ID__c = '123456';
        insert con2;
        
        con3.FirstName = 'Priyanka';
        con3.LastName = 'Gajera';
        con3.AccountId = acc.Id;
        con3.Manager__c = con2.id;
        con3.External_Email__c = 'minkegsh.patxxel1478@gmail.com';
        con3.Deactivated_Date__c = Null;
        con3.Role__c = 'Manager';
        con3.Insurance_Attachment_Id__c = Null;
        insert con3;
        
        
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
        
      user_1 = new User( 
        Email = 'yourusername@gmail.com',
        ProfileId = profile_1.Id, 
        UserName = 'yourusername@gmail.com', 
        Alias = 'Test',
        TimeZoneSidKey = 'America/New_York',
        EmailEncodingKey = 'ISO-8859-1',
        LocaleSidKey = 'en_US', 
        LanguageLocaleKey = 'en_US',
        ContactId = contact_1.Id,
        PortalRole = 'Manager',
        FirstName = 'Firstname',
        LastName = 'Lastname'
      );
      insert user_1;
    }
        Employee_Reimbursement__c reim = new Employee_Reimbursement__c();
        reim.Approved_Date__c = system.today();
        reim.Contact_Id__c = con2.id;
        reim.Name = 'Atindnra sinh:09-2021';
        reim.Month__c = '09-2021';
        reim.MPG__c = 12.50;
        reim.Maintenance_and_Tires__c = 0.123;
        reim.Fuel_Price__c = 1.9;
        insert reim;
        
        Bi_Weekly_Reimbursement__c br = new Bi_Weekly_Reimbursement__c();
        br.Name = system.today()-13 + ' to ' + system.today() ; 
        br.Contact__c = con2.Id;
        br.Start_Date__c = date.valueof('2021-06-30');
        br.End_Date__c = date.valueof('2021-08-31');
        br.MPG__c = con1.MPG__c;
        br.Maintenance_and_Tires__c = con1.Maintenance_and_Tires__c;
        br.Fixed_Amount__c = con1.Fixed_Amount__c;
        br.Status__c = 'Pending';
        br.Fuel_Price__c = 0;
        Insert br;
        
        Attachment attach=new Attachment(); 
        attach.Name='Unit Test Attachment'; 
        Blob bodyBlob=Blob.valueOf('Unit Test Attachment Body'); 
        attach.body=bodyBlob; 
        attach.parentId=con1.id;
        insert attach;
    
        String json = '[{\"name\":\"The White House\",\"address\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\",\"activity\":\"Business\",\"userId\":\"20000649\"},{\"name\":\"The White House\",\"address\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\",\"latitude\":38.683885,\"longitude\":-8.6109719,\"activity\":\"Business\",\"userId\":\"20000649\"}]';
        String json2 = '[{\"name\":\"The White House\",\"Trip_Date\":\"08/31/2021\",\"Trip_Origin\":\"6810 Chimney Hill Rd, Crestwood, KY  40014\",\"Trip_Destination\":\"1610 Deer Run Dr, Burlington, KY 41005\",\"Trip_Status\":\"rejected\",\"Approved_Date\":\"09/30/2021\",\"Actual_Mileage\":\"33\",\"Activity\":\"Business\",\"Contact_Email\":\"jayshah3796@gmail.com\",\"EmployeeId\":\"223344\"},{\"name\":\"The White House\",\"Trip_Date\":\"08/30/2021\",\"Trip_Origin\":\"6810 Chimney Hill Rd, Crestwood, KY  40014\",\"Trip_Destination\":\"1610 Deer Run Dr, Burlington, KY 41005\",\"Trip_Status\":\"Approved\",\"Approved_Date\":\"09/30/2021\",\"Actual_Mileage\":\"22\",\"Activity\":\"Business\",\"Contact_Email\":\"jayshah3796@gmail.com\",\"EmployeeId\":\"223344\"},{\"name\":\"The White House\",\"Trip_Date\":\"08/30/2021\",\"Trip_Origin\":\"6810 Chimney Hill Rd, Crestwood, KY  40014\",\"Trip_Destination\":\"1610 Deer Run Dr, Burlington, KY 41005\",\"Approved_Date\":\"09/30/2021\",\"Actual_Mileage\":\"26\",\"Activity\":\"Business\",\"Contact_Email\":\"jayshah3796@gmail.com\",\"EmployeeId\":\"223344\"}]';
        String json1 = '[{\"contactId\":\" '+con1.id + ' \",\"name\":\"Business\",\"notiMessage\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\"}]';
        String json3 = '[{\"triploguserid\":\"20000339\",\"role\":\"Driver/Admin\",\"notiMessage\":\"Test123gdd\",\"notificationDate\":\"2021-06-30\",\"name\":\"Jaytik\",\"massEmail\":false,\"lastname\":\"Luhar\",\"isEditable\":false,\"insuranceId\":\"00P6s0000077Rj9EAE\",\"insurance\":null,\"fullname\":\"Jaytik Luhar\",\"expirationDate\":null}]';        
        String json4 = '[{"employeeId":"123456","proratedAmount":"100","name":"Divya ","loaEnd":"01/10/2022","loaStart":"01/04/2022"},{"employeeId":"2345","proratedAmount":"200","name":"priyankaben patelben","loaEnd":"01/10/2022","loaStart":"01/05/2022"},{"employeeId":"154641","proratedAmount":"300","name":"Harshad ","loaEnd":"01/10/2022","loaStart":"01/06/2022"},{"employeeId":"123789","proratedAmount":"400.25","name":"Atindnra ","loaEnd":"01/10/2022","loaStart":"01/07/2022"}]';
        Test.startTest();
        System.runAs(user_1) {

        ManageNotificationController mc = new ManageNotificationController();
        ManageNotificationController.NewEmployeeData(Acc.Id,con2.id);
        ManageNotificationController.NewEmployeeData(Acc.Id,con3.id);
        ManageNotificationController.UploadLocation(json,Acc.Id);
        ManageNotificationController.UploadMileage(json2,Acc.Id,con2.Id,'2021-06-30','2021-08-31');
        
       ManageNotificationController.sendAllInsuranceEmail(json2, con2.id);
       ManageNotificationController.UploadLocation(json ,Acc.Id);
       ManageNotificationController.getdriverInsurance(attach.id);
       ManageNotificationController.editInlineNewEmployee(json3 ,con2.id);
        ManageNotificationController.UploadLOA(json4,Acc.Id,'2021-06-30','2021-08-31');
       }
    }
}