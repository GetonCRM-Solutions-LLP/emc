@isTest
public with sharing class EmployeeReimbursementTriggerHandlerTest {
    
    public static testMethod Void testSecondMethod() {
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.Mileage_Lockdate__c = true;
        
        insert customSetting;
        
        SendEmail__c customSetting2 =  new SendEmail__c();
        customSetting2.Name = 'Send Email For Compliance';
        customSetting2.Send_email_from_code__c= true;
        insert customSetting2;

        SendEmail__c customSetting3 =  new SendEmail__c();
        customSetting3.Name = 'EmployeeReimbursementTrigger';
        customSetting3.Send_email_from_code__c= true;
        insert customSetting3;

        SendEmailToMe__c customSetMail = new SendEmailToMe__c();
        customSetMail.Name = 'EmployeeReimbursementTriggerHandler';
        customSetMail.Send_email_to_me__c = true;
        insert customSetMail;

        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Mileage Rate';
        veh.Year__c = '2019';
        insert veh;
		
        Account acc = new Account(); 
        Account acc2 = new Account();
        Account acc3 = new Account();
        Contact con = new Contact();
        Contact con2 = new Contact();
        Contact con3 = new Contact();
        Contact con4 = new Contact();
        Contact con5 = new Contact();
        Contact con6 = new Contact();
        
         UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        System.runAs(admin) {
       
        
        
        
         //acc = RecordUtilityClass.buildAccount();
            acc.Name = 'Test Account';
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-13);
        insert acc;
      // acc2 = RecordUtilityClass.buildAccount();
       acc2.Name = 'Rayner';
       acc.Pay_Period_Days__c = 13;
       acc.Pay_Period_Start_Date__c = system.today().adddays(-13);
        insert acc2;
        
       //acc3 = RecordUtilityClass.buildAccount(); 
        acc3.Name = 'CATCO';
        acc.Pay_Period_Days__c = 13;
        acc.Pay_Period_Start_Date__c = system.today().adddays(-13);
        insert acc3;
            
        //Contact con = new Contact();
        con.FirstName = 'FirstCont';
        con.LastName = 'TestContact';
        con.AccountId = acc.Id;
        con.External_Email__c = 'test@email.com';
        con.Fixed_Amount__c = 371.28;
        con.MailingCity = 'Fremont';
        con.MailingState = 'CA';
        con.Vehicle_Type__c = '2019 Mileage Rate';
        con.Monthly_Mileage_Limit__c = 100.00;
        insert con;
        //Contact con2 = new Contact();
        con2.FirstName = 'SecondCont';
        con2.LastName = 'TestContact2';
        con2.AccountId = acc2.Id;
        con2.External_Email__c = 'test2@email.com';
        con2.Fixed_Amount__c = 370.28;
        con2.MailingCity = 'Fremont';
        con2.MailingState = 'CA';
        con2.Monthly_Mileage_Limit__c = 101.00;
        insert con2;
        //Contact con3 = new Contact();
        con3.FirstName = 'ThirdCont';
        con3.LastName = 'TestContact3';
        con3.AccountId = acc2.Id;
        con3.External_Email__c = 'test3@email.com';
        con3.Fixed_Amount__c = 370.28;
        con3.MailingCity = 'Fremont';
        con3.MailingState = 'CA';
        con3.Monthly_Mileage_Limit__c = 101.00;
        con3.Manager__c = con2.Id;
        insert con3;
        //Contact con4 = new Contact();
        con4.FirstName = 'FourthCont';
        con4.LastName = 'TestContact4';
        con4.AccountId = acc3.Id;
        con4.External_Email__c = 'test4@email.com';
        con4.Fixed_Amount__c = 370.28;
        con4.MailingCity = 'Fremont';
        con4.MailingState = 'CA';
        con4.Role__c = 'Admin';
        con4.Monthly_Mileage_Limit__c = 101.00;
        insert con4;
        //Contact con5 = new Contact();
        con5.FirstName = 'FifthCont';
        con5.LastName = 'TestContact5';
        con5.AccountId = acc3.Id;
        con5.External_Email__c = 'test5@email.com';
        con5.Fixed_Amount__c = 370.28;
        con5.MailingCity = 'Fremont';
        con5.MailingState = 'CA';
        con5.Monthly_Mileage_Limit__c = 101.00;
        con5.Manager__c = con4.Id;
        con5.Role__c = 'Driver/Manager';
        con5.Vehicle_Type__c = '2019 Mileage Rate';
        insert con5;
        //Contact con6 = new Contact();
        con6.FirstName = 'SixthCont';
        con6.LastName = 'TestContact6';
        con6.AccountId = acc3.Id;
        con6.External_Email__c = 'test6@email.com';
        con6.Fixed_Amount__c = 370.28;
        con6.MailingCity = 'Fremont';
        con6.MailingState = 'CA';
        con6.Monthly_Mileage_Limit__c = 101.00;
        con6.Manager__c = con5.Id;
        con6.Vehicle_Type__c = '2019 Mileage Rate';
        con6.Role__c = 'Driver';
        insert con6;
            
            user_1 = new User( 
                Email = 'yourusername@gmail.com',
                ProfileId = profile_1.Id, 
                UserName = 'yourusername@gmail.com', 
                Alias = 'Test',
                TimeZoneSidKey = 'America/New_York',
                EmailEncodingKey = 'ISO-8859-1',
                LocaleSidKey = 'en_US', 
                LanguageLocaleKey = 'en_US',
                ContactId = con.Id,
                PortalRole = 'Manager',
                FirstName = 'Firstname',
                LastName = 'Lastname'
            );
            insert user_1;
        }
        Test.startTest();
        //List<Employee_Reimbursement__c> empList = new List<Employee_Reimbursement__c>();
        Map<id,Employee_Reimbursement__c> oldmap = new Map<id,Employee_Reimbursement__c>();
        Map<id,Employee_Reimbursement__c> newmap = new Map<id,Employee_Reimbursement__c>();
        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = 'Reimbersment Test';
        er.Month__c = '09-2017';
        er.Status__c = 'Approved';
        er.Approved_Date__c = system.today()-4;
        insert er;
        oldmap.put(er.id, er);
        Employee_Reimbursement__c er2 = new Employee_Reimbursement__c();
        er2.Contact_Id__c = con3.Id;
        er2.Name = 'Reimbersment Test2';
        er2.Month__c = '09-2020';
        er2.Status__c = 'Pending';
        insert er2;
        //oldmap.put(er2.id, er2);
        Employee_Reimbursement__c er3 = new Employee_Reimbursement__c();
        er3.Contact_Id__c = con3.Id;
        er3.Name = 'Reimbersment Test3';
        er3.Month__c = '11-2020';
        er3.Status__c = 'Pending';
        insert er3;
        //oldmap.put(er3.id, er3);
        Employee_Reimbursement__c er5 = new Employee_Reimbursement__c();
        er5.Contact_Id__c = con5.Id;
        er5.Name = 'Reimbersment Test5';
        er5.Month__c = '09-2020';
        er5.Status__c = 'Pending';
        insert er5;
        //oldmap.put(er5.id, er5);
        Employee_Reimbursement__c er6 = new Employee_Reimbursement__c();
        er6.Contact_Id__c = con5.Id;
        er6.Name = 'Reimbersment Test6';
        er6.Month__c = '11-2020';
        er6.Status__c = 'Pending';
        insert er6;
       // oldmap.put(er6.id, er6);
        Employee_Reimbursement__c er7 = new Employee_Reimbursement__c();
        er7.Contact_Id__c = con6.Id;
        er7.Name = 'Reimbersment Test7';
        er7.Month__c = '09-2020';
        er7.Status__c = 'Pending';
        insert er7;
       // oldmap.put(er7.id, er7);
        Employee_Reimbursement__c er8 = new Employee_Reimbursement__c();
        er8.Contact_Id__c = con6.Id;
        er8.Name = 'Reimbersment Test8';
        er8.Month__c = '11-2020';
        er8.Status__c = 'Pending';
        insert er8;
       // oldmap.put(er8.id, er8);
        List<Employee_Reimbursement__c> empReimList = new List<Employee_Reimbursement__c>();
        er.Status__c = 'Approved';
        er.Approved_Date__c = system.today();
        er3.Status__c = 'Approved';
        er3.Approved_Date__c = system.today();
        empReimList.add(er3);
        er2.Status__c = 'Approved';
        er2.Approved_Date__c = system.today();
        empReimList.add(er2);
        er5.Status__c = 'Approved';
        er5.Approved_Date__c = system.today();
        empReimList.add(er5);
        er6.Status__c = 'Approved';
        er6.Approved_Date__c = system.today();
        empReimList.add(er6);
        er7.Status__c = 'Approved';
        er7.Approved_Date__c = system.today();
        empReimList.add(er7);
        er8.Status__c = 'Approved';
        er8.Approved_Date__c = system.today();
        empReimList.add(er8);
        update empReimList;
        newmap.put(er.id, er);
        newmap.put(er2.id, er2);
        newmap.put(er3.id, er);
        newmap.put(er5.id, er5);
        newmap.put(er6.id, er6);
        newmap.put(er7.id, er7);
        newmap.put(er8.id, er8);

        Bi_Weekly_Reimbursement__c br = new Bi_Weekly_Reimbursement__c();
            br.Name = system.today()-13 + ' to ' + system.today() ; 
            br.Contact__c = con.Id;
            br.Start_Date__c = system.today()-13;
            br.End_Date__c = system.today() ;
            br.MPG__c = con.MPG__c;
            br.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
            br.Fixed_Amount__c = con.Fixed_Amount__c;
            br.Status__c = 'Pending';
            //br.Fuel_Price__c =  gasprice.Fuel_Price__c;
        	 br.Count_Error_Check__c = 0;
        Insert br;

        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Rejected__c = true;
        emp.Mileage__c = 150.00;
        emp.Bi_Weekly_Reimbursement__c = br.ID;
        insert emp;

        Employee_Mileage__c emp1 = new Employee_Mileage__c();
        emp1.EmployeeReimbursement__c = er.id;
        emp1.Contact_Email_Id__c = con.External_Email__c;
        emp1.Name = 'Test Mileage Record';
        emp1.Trip_Status__c = 'Approved';
        emp1.Approved_Date__c = system.today();
        emp1.Mileage__c = 150.00;
        emp1.Bi_Weekly_Reimbursement__c = br.Id;
       
        insert emp1;
        //er.Status__c = 'Approved';
        //er.Approved_Date__c = system.today();
        //update er;
        EmployeeReimbursementTriggerHandler.mileagefieldupdate(empReimList, oldmap, newmap);
        Test.stopTest();
    }
}