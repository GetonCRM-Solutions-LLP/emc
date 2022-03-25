@isTest
public class ConfirmTripTimeERMIControllerTest {
    public static testmethod void utilMethod1()
    {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        
        IRS_Mileage_Rate__c irs = new IRS_Mileage_Rate__c();
        irs.year__c = '2021';
        irs.IRS_Rate__c = 0.85;        
        insert irs;
        
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();
        Contact con1 = new Contact();    
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        System.runAs(admin) {
            // Contact obj = [select id from contact limit 1];      
            
            Account account_1 = new Account( Name = 'Test');
            account_1.Bi_Weekly_Pay_Period__c = true;
            account_1.Pay_Period_Days__c = 13;
            account_1.Pay_Period_Start_Date__c = system.today().adddays(-130);
            insert account_1;
            
            Contact contact_1 = new Contact(AccountId = account_1.Id, LastName = 'xgeek',External_Email__c='abc@gmail.com');
            insert contact_1;
            acc.Name = 'Test';
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
                con.AccountId = account_1.Id;
                // con.account.Name = account_1.Name;
                con.External_Email__c = 'minkfesh.patel1478'+ i + '@gmail.com';
                con.Driver_Type__c = 'Driver - Full Time';
                con.Deactivated_Date__c = system.today();
                con.Insurance_Attachment_Id__c = Null;
                con.Vehicle_Type__c = '2019 Full-Size Sedan';  
                con.Role__c = 'Driver';                
                conList.add(con);                
            }
            insert conList;
            
            con1.FirstName = 'Priyanka';
            con1.LastName = 'Gajera';
            con1.AccountId = acc.Id;
            //con1.Account.name = 'PL Marketing';
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            //con1.account.Name = account_1.Name;
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = null;
            con1.Role__c = 'Driver';
            con1.Insurance_Attachment_Id__c = Null;
            con1.Vehicle_Type__c = '2019 Full-Size Sedan';
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
                ContactId = con1.Id,
                PortalRole = 'Manager',
                FirstName = 'Firstname',
                LastName = 'Lastname'
            );
            insert user_1;
        }
        
        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = Con1.Id;
        er.month__c = '07-2021';
        er.Name = contact.lastname+':'+er.month__c;
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 1;  
        er.MPG__c = 10.00;
        er.Maintenance_and_Tires__c = 24;
        er.Fuel_Price__c = 1;
        er.MPG__c = 10;
        er.Maintenance_and_Tires__c = 10;
        er.Fixed_Amount__c = 10.10;
        er.Triplog_Status__c = 'U';
        er.IRS_Mileage_Rate__c = irs.Id;
        insert er;     
   
        Bi_Weekly_Reimbursement__c br = new Bi_Weekly_Reimbursement__c();
        br.Name = system.today()-13 + ' to ' + system.today() ; 
        br.Contact__c = con1.Id;
        br.Start_Date__c = system.today()-15;
        br.End_Date__c = system.today() -10;
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
        
        List<Attachment> attachments=[select id, name from Attachment where parent.id=:Con1.id];
        
        Test.startTest();
        System.runAs(user_1) {
        string ConId = con1.Id;
        //String json = '[{"biWeekId":"'+br.id+'","confirmCheck":true,"errorCheck":false}]';
        //String json = '[{\"biWeekId\":\" '+br.id + ' \","confirmCheck":true,"errorCheck":false}]';
        String json = '[{\"biWeekId\":\"'+br.id + '\",\"confirmCheck\":true,\"errorCheck\":false,\"countErrorCheck\":0,\"driverEmail\":\"meghac.mobio@gmail.com\",\"driverName\":\"Megha\",\"biWeekPayperiod\":\"03/09/2022 to 03/22/2022\",\"mileage\":0,\"driveTime\":\"0\",\"stayTime\":\"0\",\"totalTime\":\"0\"}]';
        //String json = null;
        apexpages.currentpage().getparameters().put('id' , ConId);
        ConfirmTripTimeERMIController controller = new ConfirmTripTimeERMIController();
        //ConfirmTripTimeERMIController.getDriverDetails();  
        ConfirmTripTimeERMIController.syncTripsForErmi (Con1.Id,'03/07/2022','03/12/2022'); 
        ConfirmTripTimeERMIController.UpdateBiWeekData(json );      
        }
        Test.stopTest();
    }
    
}