@isTest
public class BiWeeklyReimReportforPLMControllerTest {
    public static testmethod void test1(){
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.ContactTriCommunityReimCreate__c  = false;
        insert customSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        daylight_saving_time_config__c customSetting2 =  new daylight_saving_time_config__c();
        customSetting2.Name = '2021';
        customSetting2.Start_Date__c = System.today();
        customSetting2.End_Date__c = System.today() + 7;
        insert customSetting2;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Mileage Rate';
        veh.Year__c = '2019';
        insert veh;
        
        IRS_Mileage_Rate__c irs = new IRS_Mileage_Rate__c();
        irs.year__c = '2021';
        irs.IRS_Rate__c = 0.85;        
        insert irs;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;

        Account acc ;
        Contact contact ;
        System.runAs(admin) {
            acc = new Account();  
            acc.Name = 'PL Marketing';
            acc.Vehicle_Types__c = veh.name;
            acc.Pay_Period_Start_Date__c = System.today().addDays(-100);
            acc.Triplog_API__c = '8e0ac6d1e82a439faaef1fdf0dc707b1';
            Acc.Triplog_Status__c = 'U';
            insert Acc;
            
            Contact contact_1 = new Contact(AccountId = Acc.Id, LastName = 'xgeek',External_Email__c= 'abc@gmail.com');
            insert contact_1;

            contact = new Contact();
            contact.lastname = 'Test Contact';
            //contact.AccountId = System.Label.PLMarketing;
            contact.AccountId = Acc.id;
            contact.Activation_Date__c = System.today().addDays(-90);
            contact.Vehicle_Type__c = '2019 Mileage Rate';
            contact.External_Email__c = 'minkesh.patel1478@gmail.com';
            contact.compliancestatus__c = 'Yes';
            contact.Deactivated_Date__c = null;
            contact.Time_Zone__c = 'America/Chicago';
            contact.MailingCity = 'Abilene';
            contact.MailingState = 'TX';
            contact.Driving_States__c = 'TX';
            contact.Role__c = 'Driver';
            contact.isCommunityUser__c = true;
            contact.Fixed_Amount__c = 201.12;
            insert contact;

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
        
        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = contact.Id;
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
        
        Employee_Reimbursement__c er1 = new Employee_Reimbursement__c();
        er1.Contact_Id__c = contact.Id;
        er1.month__c = '11-2021';
        er1.Name = contact.lastname+':'+er1.month__c;
        er1.Status__c = 'Pending';
        er1.Fuel_Price__c = 1;  
        er1.MPG__c = 10.00;
        er1.Maintenance_and_Tires__c = 24;
        er1.Fuel_Price__c = 1;
        er1.MPG__c = 10;
        er1.Maintenance_and_Tires__c = 10;
        er1.Fixed_Amount__c = 10.10;
        er1.Triplog_Status__c = 'U';
        er1.IRS_Mileage_Rate__c = irs.Id;
        insert er1;
        
        Bi_Weekly_Reimbursement__c  biReim = new Bi_Weekly_Reimbursement__c();
        biReim.Name = '10/17/2021 to 10/30/2021';
        biReim.Contact__c = contact.Id;
        insert biReim;
        
        Bi_Weekly_Reimbursement__c  biReim1 = new Bi_Weekly_Reimbursement__c();
        biReim1.Name = '11/14/2021 to 11/27/2021';
        biReim1.Contact__c = contact.Id;
        insert biReim1;
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = contact.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = 'Approved';
        emp.TimeZone__c = 'US/Mountain' ;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.Trip_Date__c = system.today()-100;
        emp.StartTime__c = system.now()-10;
        emp.EndTime__c =  system.now()-10;
        emp.Bi_Weekly_Reimbursement__c   = biReim.Id;
        insert emp;
        
        Employee_Mileage__c emp1 = new Employee_Mileage__c();
        emp1.EmployeeReimbursement__c = er1.id;
        emp1.Contact_Email_Id__c = contact.External_Email__c;
        emp1.Name = 'Test Mileage Record';
        emp1.Trip_Status__c = 'Approved';
        emp1.TimeZone__c = 'US/Mountain' ;
        emp1.Mileage__c = 10.00;
        emp1.Fuel_price__c = 10.00;
        emp1.Trip_Date__c = system.today()-120;
        emp1.StartTime__c = system.now()-10;
        emp1.EndTime__c =  system.now()-10;
        emp1.Bi_Weekly_Reimbursement__c = biReim1.Id;
        insert emp1;

        contact.Deactivated_Date__c = System.today().addDays(-15);
        update contact;

        Test.startTest();
        System.runAs(user_1) {
            string ConId = contact.Id;
            //String startDate = '2021-07-28';
            //String endDate = '2021-08-11';
            //String conId = ApexPages.currentPage().getParameters().put('id',contact.Id);
            String startDate = ApexPages.currentPage().getParameters().put('startDate','2021-10-02');
            String endDate = ApexPages.currentPage().getParameters().put('endDate','2021-11-27');
            System.debug('***Test-startDate***'+startDate+'***endDate***'+endDate);
            BiWeeklyReimReportforPLMController objClass = new BiWeeklyReimReportforPLMController();
        }
        Test.stopTest();
    }
    
}