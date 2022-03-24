@isTest
public class GetTripCalloutTest {
    public static testMethod Void GetTripCalloutForMileageTestMethod() {
        
        String fuelPrice, mpg, mat, priMin, priMax;
        
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        insert customSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Mileage Rate';
        veh.Year__c = '2019';
        insert veh;
            
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        SendEmailToMe__c  objSendEmailToMe = new SendEmailToMe__c();
        objSendEmailToMe.Name = 'GetTripCallOutApprovePutCall';
        objSendEmailToMe.Send_email_to_me__c = true;
        insert objSendEmailToMe;
        
        IRS_Mileage_Rate__c irs = new IRS_Mileage_Rate__c();
         irs.year__c = String.valueof(system.today().year());
         irs.IRS_Rate__c = 0.85;
         insert irs;

        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        Account account;
        Contact currentContact;
        System.runAs(admin) {
            account = new Account();
            account.Name = 'Test Account';
            account.Triplog_API__c = '123456789';
            account.Triplog_Status__c = 'U';
            account.Pay_Period_Days__c = 13;
            account.Pay_Period_Start_Date__c = system.today().adddays(-10);
            insert account;
            
            Contact contact_1 = new Contact(AccountId = account.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            currentContact = new Contact();
            currentContact.Lastname = 'Test Contact';
            currentContact.AccountId = account.Id;
            currentContact.External_Email__c = 'test@test.com';
            currentContact.Triplog_Status__c = 'U';
            currentContact.Vehicle_Type__c  = '2019 Mileage Rate';  
            currentContact.Role__c = 'Driver';  
            insert currentContact;
            
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
        er.Contact_Id__c = currentContact.Id;
        er.Month__c = '4-2017';
        er.Name = contact.lastname+':'+er.month__c;
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 1;
        er.MPG__c = 10;
        er.Maintenance_and_Tires__c = 24;
        er.Fuel_Price__c = 1;
        er.MPG__c = 10.10;
        er.Maintenance_and_Tires__c = 10;
        er.Fixed_Amount__c = 10.10;
        er.Triplog_POST_Response__c = '123';
        er.Triplog_Status__c = 'U';
        insert er;


        Employee_Reimbursement__c er1 = new Employee_Reimbursement__c();
        er1.Contact_Id__c = currentContact.Id;
        er1.Month__c = null;
        er1.Name = contact.lastname+':'+er1.month__c;
        er1.Status__c = 'Approved';
        er1.Approved_Date__c = system.today();
        er1.Fuel_Price__c = null;
        er1.MPG__c = null;
        er1.Maintenance_and_Tires__c = null;
        er1.Fuel_Price__c = null;
        er1.MPG__c = null;
        er1.Maintenance_and_Tires__c = null;
        er1.Fixed_Amount__c = null;
        er1.Triplog_POST_Response__c = null;
        er1.Triplog_Status__c = null;
        insert er1;
        
        Bi_Weekly_Reimbursement__c bob = new Bi_Weekly_Reimbursement__c();
        bob.name = '9/19/2021 to 10/2/2021';
        bob.Contact__c = currentContact.id;
        insert bob;
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.Contact_Email_Id__c = 'test@test.gmail.com';
        emp.Name = 'Test Mileage Record';
        emp.EmployeeReimbursement__c = er.id;
        emp.Bi_Weekly_Reimbursement__c = bob.id;
        insert emp;

        Employee_Mileage__c emp1 = new Employee_Mileage__c();
        emp1.Contact_Email_Id__c = 'test@test.gmail.com';
        emp1.Name = 'Test1 Mileage Record';
        emp1.EmployeeReimbursement__c = er.id;
        emp1.Bi_Weekly_Reimbursement__c = bob.id;
        emp1.Trip_Status__c = 'Approved';
        insert emp1;

        Employee_Mileage__c emp2 = new Employee_Mileage__c();
        emp2.Contact_Email_Id__c = 'test@test.gmail.com';
        emp2.Name = 'Test2 Mileage Record';
        emp2.EmployeeReimbursement__c = er.id;
        emp2.Bi_Weekly_Reimbursement__c = bob.id;
        emp2.StartTime__c = null;
        insert emp2;

        Employee_Mileage__c emp3 = new Employee_Mileage__c();
        emp3.Contact_Email_Id__c = 'test@test.gmail.com';
        emp3.Name = 'Test3 Mileage Record';
        emp3.EmployeeReimbursement__c = er.id;
        emp3.Bi_Weekly_Reimbursement__c = bob.id;
        emp3.EndTime__c = null;
        insert emp3;
        
        priMin = '2016-12-01';
        priMax = '2017-12-01';
        fuelPrice = '1.0';       
        mpg = String.valueof(er.MPG__c);
        mat = '1.0';
        
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new GetTripCalloutMock());
        GetTripCallout.GetTripCalloutForMileage(er.id, currentContact.External_Email__c,currentContact.id, priMin, priMax, fuelPrice, mpg, mat, account.Triplog_API__c, er.Triplog_Status__c,true,false,'');
        
        String body = 'test';
        String apiToken = 'test';
        String finalstr = 'test';       
        Test.stopTest();
    }
    public static testMethod Void GetTripCalloutForMileageTestMethod2() {

        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        insert customSetting;
            
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Mileage Rate';
        veh.Year__c = '2019';
        insert veh;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        IRS_Mileage_Rate__c irs = new IRS_Mileage_Rate__c();
         irs.year__c = String.valueof(system.today().year());
         irs.IRS_Rate__c = 0.85;
         insert irs;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        Account account;
        Contact currentContact;
        System.runAs(admin) {
            account = new Account();
            account.Name = 'Test Account';
            account.Triplog_API__c = '123456789';
            account.Triplog_Status__c = 'U';
            account.Pay_Period_Days__c = 13;
            account.Pay_Period_Start_Date__c = system.today().adddays(-10);
            insert account;
            
            Contact contact_1 = new Contact(AccountId = account.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            currentContact = new Contact();
            currentContact.Lastname = 'Test Contact';
            currentContact.AccountId = account.Id;
            currentContact.External_Email__c = 'test@test.com';
            currentContact.Triplog_Status__c = 'U';
            currentContact.Vehicle_Type__c  = '2019 Mileage Rate';  
            currentContact.Role__c = 'Driver';  
            insert currentContact;
            
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
        er.Contact_Id__c = currentContact.Id;
        er.Month__c = '4-2017';
        er.Name = contact.lastname+':'+er.month__c;
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 1;
        er.MPG__c = 10;
        er.Maintenance_and_Tires__c = 24;
        er.Fuel_Price__c = 1;
        er.MPG__c = 10.10;
        er.Maintenance_and_Tires__c = 10;
        er.Fixed_Amount__c = 10.10;
        er.Triplog_POST_Response__c = '123';
        er.Triplog_Status__c = 'U';
        insert er;

        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new GetTripCalloutMock());
        String apiToken = 'test';
        Set<Integer> tripSet = new Set<Integer>();
        tripSet.add(1242);
        //GetTripCallout.trip_IDs = tripSet;
        GetTripCallout.putHTTP(apiToken,currentContact.Id,er.Id,tripSet );
        
        Test.stopTest();



    }
}