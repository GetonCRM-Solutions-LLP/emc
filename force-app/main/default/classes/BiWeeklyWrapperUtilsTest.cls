@istest
public class BiWeeklyWrapperUtilsTest {
    
    public static testmethod void testMethod1() {
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.Mileage_Lockdate__c = false;        
        insert customSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        //ContactTriCommunityReimCreate__c comreim = new ContactTriCommunityReimCreate__c();
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        
        Account acc = new Account();
       
        Contact con = new Contact();
        System.runAs(admin) {
            acc.Name = 'Test Account';
            //acc.Pay_Period_Start_Date__c = system.today();
            acc.Bi_Weekly_Pay_Period__c = true;
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-30);
            acc.Last_Reimbursement_Created__c = '12-2021';
            insert acc;
           
            Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = acc.Id;
            con.Activation_Date__c = system.today();
            con.Deactivated_Date__c = system.today();
            con.External_Email__c = 'test@email.com';
            con.Fixed_Amount__c = 371.28;
            con.MailingCity = 'Abilene';
            con.MailingState = 'TX';
            con.Time_Zone__c = 'US/Mountain' ;
            con.Driving_States__c = 'TX';
            con.Fixed_Amount__c = 322.00;
            con.Maintenance_and_Tires__c = 1.2;
            con.MPG__c= 10.00;
            con.Monthly_Mileage_Limit__c = 100.00;
            con.Deactivated_Date__c = null;
            insert con;
            
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
        
        IRS_Mileage_Rate__c objIRSRate = new IRS_Mileage_Rate__c();
        objIRSRate.year__c = '2021';
        objIRSRate.IRS_Rate__c= 12.0;
        insert objIRSRate;
        
        Bi_Weekly_Reimbursement__c biReim = new Bi_Weekly_Reimbursement__c();
        bireim.Approved_Date__c = system.today().addDays(-1);
        bireim.Status__c = 'Pending';
        bireim.Name = '11/21/2021 to 12/04/2021';
        bireim.Start_Date__c = Date.parse('10/03/2021');
        bireim.End_Date__c = Date.parse('10/16/2021');
        bireim.Contact__c = con.id;
        insert bireim;

        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = '11/21/2021 to 12/04/2021';
        er.Month__c = '03-2021';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00; 
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        insert er;
       
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.Bi_Weekly_Reimbursement__c = bireim.Id;
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.TimeZone__c = 'US/Mountain' ;
        emp.StartTime__c = system.now();
        emp.EndTime__c =  system.now();
        emp.Trip_Date__c = date.today().adddays(-1);
        emp.Approved_Date__c = null;
        insert emp;

        BiWeeklyWrapperUtils.getPayPeriodDates(string.valueOf(acc.Id));
        BiWeeklyWrapperUtils.checkBiweekAccount(string.valueOf(acc.Id));
        BiWeeklyWrapperUtils.getLastMonthReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),true,'Driver/Admin');
        BiWeeklyWrapperUtils.getEmployeeReimbursementDetails(bireim);
        BiWeeklyWrapperUtils.getUnapprovedReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id), true,'Driver/Admin');
        //BiWeeklyWrapperUtils.getUnapprovedMileages(string.valueOf(er));
        BiWeeklyWrapperUtils.getMileagesOfReimbursement(emp);
        BiWeeklyWrapperUtils.getBiweekReimId(con.Id, system.today());  
    }
    
    public static testmethod void testMethod2() {
        
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.Mileage_Lockdate__c = false;        
        insert customSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;

        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        
        Account acc = new Account();
        Contact con = new Contact();
        System.runAs(admin) {
            acc.Name = 'Test Account';
            //acc.Pay_Period_Start_Date__c = system.today();
            acc.Bi_Weekly_Pay_Period__c = true;
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-30);
            acc.Last_Reimbursement_Created__c = '12-2021';
            insert acc;
           
            Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = acc.Id;
            con.Activation_Date__c = system.today();
            con.Deactivated_Date__c = system.today();
            con.External_Email__c = 'test@email.com';
            con.Fixed_Amount__c = 371.28;
            con.MailingCity = 'Abilene';
            con.MailingState = 'TX';
            con.Time_Zone__c = 'US/Mountain' ;
            con.Driving_States__c = 'TX';
            con.Fixed_Amount__c = 322.00;
            con.Maintenance_and_Tires__c = 1.2;
            con.MPG__c= 10.00;
            con.Monthly_Mileage_Limit__c = 100.00;
            con.Deactivated_Date__c = null;
            insert con;
            
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
        
        IRS_Mileage_Rate__c objIRSRate = new IRS_Mileage_Rate__c();
        objIRSRate.year__c = '2021';
        objIRSRate.IRS_Rate__c= 12.0;
        insert objIRSRate;
        
        Bi_Weekly_Reimbursement__c biReim = new Bi_Weekly_Reimbursement__c();
        bireim.Approved_Date__c = null;
        bireim.Status__c = 'Pending';
        bireim.Name = '11/21/2021 to 12/04/2021';
        bireim.Start_Date__c = Date.parse('10/03/2021');
        bireim.End_Date__c = Date.parse('10/16/2021');
        bireim.Contact__c = con.id;
        insert bireim;

        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = '11/21/2021 to 12/04/2021';
        er.Month__c = '03-2021';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00; 
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        insert er;
	List<Employee_Reimbursement__c>   emlist = new List<Employee_Reimbursement__c>();
        emlist.add(er);
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.Bi_Weekly_Reimbursement__c = bireim.Id;
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.TimeZone__c = 'US/Mountain' ;
        emp.StartTime__c = system.now();
        emp.EndTime__c =  system.now();
        emp.Trip_Date__c = date.today().adddays(-1);
        emp.Approved_Date__c = null;
        insert emp;
       
       // BiWeeklyWrapperUtils.getPayPeriodDates(string.valueOf(acc.Id));
        //BiWeeklyWrapperUtils.checkBiweekAccount(string.valueOf(acc.Id));
        BiWeeklyWrapperUtils.getLastMonthReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),false,'Driver/Admin');
        //BiWeeklyWrapperUtils.getEmployeeReimbursementDetails(bireim);
        BiWeeklyWrapperUtils.getUnapprovedReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),false ,'Driver/Admin');
        //BiWeeklyWrapperUtils.getUnapprovedMileages(string.valueOf(er));
       // BiWeeklyWrapperUtils.getMileagesOfReimbursement(emp);
      //  BiWeeklyWrapperUtils.getBiweekReimId(con.Id, system.today());
       // BiWeeklyWrapperUtils.getUnapprovedMileages(JSON.serialize(emlist));
        
        //List<EmployeeReimbursements> emwrpList = new List<EmployeeReimbursements>();
        //emwrpList.add(WrapperUtils.getEmployeeReimbursements(er));
        //BiWeeklyWrapperUtils.getUnapprovedMileages(String.valueof(JSON.serialize(emwrpList)));
        
    }
 public static testmethod void testMethod3() {
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.Mileage_Lockdate__c = false;        
        insert customSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        //ContactTriCommunityReimCreate__c comreim = new ContactTriCommunityReimCreate__c();
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        
        Account acc = new Account();
       
        Contact con = new Contact();
        System.runAs(admin) {
            acc.Name = 'Test Account';
            //acc.Pay_Period_Start_Date__c = system.today();
            acc.Bi_Weekly_Pay_Period__c = true;
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-30);
            acc.Last_Reimbursement_Created__c = '12-2021';
            insert acc;
           
            Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = acc.Id;
            con.Activation_Date__c = system.today();
            con.Deactivated_Date__c = system.today();
            con.External_Email__c = 'test@email.com';
            con.Fixed_Amount__c = 371.28;
            con.MailingCity = 'Abilene';
            con.MailingState = 'TX';
            con.Time_Zone__c = 'US/Mountain' ;
            con.Driving_States__c = 'TX';
            con.Fixed_Amount__c = 322.00;
            con.Maintenance_and_Tires__c = 1.2;
            con.MPG__c= 10.00;
            con.Monthly_Mileage_Limit__c = 100.00;
            con.Deactivated_Date__c = null;
            insert con;
            
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
        
        IRS_Mileage_Rate__c objIRSRate = new IRS_Mileage_Rate__c();
        objIRSRate.year__c = '2021';
        objIRSRate.IRS_Rate__c= 12.0;
        insert objIRSRate;
        
        Bi_Weekly_Reimbursement__c biReim = new Bi_Weekly_Reimbursement__c();
        bireim.Approved_Date__c = system.today().addDays(-1);
        bireim.Status__c = 'Pending';
        bireim.Name = '11/21/2021 to 12/04/2021';
        bireim.Start_Date__c = Date.parse('10/03/2021');
        bireim.End_Date__c = Date.parse('10/16/2021');
        bireim.Contact__c = con.id;
        insert bireim;

        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = '11/21/2021 to 12/04/2021';
        er.Month__c = '03-2021';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00; 
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        insert er;
       
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.Bi_Weekly_Reimbursement__c = bireim.Id;
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.TimeZone__c = 'US/Mountain' ;
        emp.StartTime__c = system.now();
        emp.EndTime__c =  system.now();
        emp.Trip_Date__c = date.today().adddays(-1);
        emp.Approved_Date__c = null;
        insert emp;

       // BiWeeklyWrapperUtils.getPayPeriodDates(string.valueOf(acc.Id));
        //BiWeeklyWrapperUtils.checkBiweekAccount(string.valueOf(acc.Id));
        BiWeeklyWrapperUtils.getLastMonthReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),true,'Driver/Manager');
        //BiWeeklyWrapperUtils.getEmployeeReimbursementDetails(bireim);
        BiWeeklyWrapperUtils.getUnapprovedReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),true ,'Driver/Manager');
        //BiWeeklyWrapperUtils.getUnapprovedMileages(string.valueOf(er));
       // BiWeeklyWrapperUtils.getMileagesOfReimbursement(emp);
      //  BiWeeklyWrapperUtils.getBiweekReimId(con.Id, system.today());
        
    }
    
     public static testmethod void testMethod4() {
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.Mileage_Lockdate__c = false;        
        insert customSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        //ContactTriCommunityReimCreate__c comreim = new ContactTriCommunityReimCreate__c();
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        
        Account acc = new Account();
       
        Contact con = new Contact();
        System.runAs(admin) {
            acc.Name = 'Test Account';
            //acc.Pay_Period_Start_Date__c = system.today();
            acc.Bi_Weekly_Pay_Period__c = true;
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-30);
            acc.Last_Reimbursement_Created__c = '12-2021';
            insert acc;
           
            Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = acc.Id;
            con.Activation_Date__c = system.today();
            con.Deactivated_Date__c = system.today();
            con.External_Email__c = 'test@email.com';
            con.Fixed_Amount__c = 371.28;
            con.MailingCity = 'Abilene';
            con.MailingState = 'TX';
            con.Time_Zone__c = 'US/Mountain' ;
            con.Driving_States__c = 'TX';
            con.Fixed_Amount__c = 322.00;
            con.Maintenance_and_Tires__c = 1.2;
            con.MPG__c= 10.00;
            con.Monthly_Mileage_Limit__c = 100.00;
            con.Deactivated_Date__c = null;
            insert con;
            
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
        
        IRS_Mileage_Rate__c objIRSRate = new IRS_Mileage_Rate__c();
        objIRSRate.year__c = '2021';
        objIRSRate.IRS_Rate__c= 12.0;
        insert objIRSRate;
        
        Bi_Weekly_Reimbursement__c biReim = new Bi_Weekly_Reimbursement__c();
        bireim.Approved_Date__c = system.today().addDays(-1);
        bireim.Status__c = 'Pending';
        bireim.Name = '11/21/2021 to 12/04/2021';
        bireim.Start_Date__c = Date.parse('10/03/2021');
        bireim.End_Date__c = Date.parse('10/16/2021');
        bireim.Contact__c = con.id;
        insert bireim;

        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = '11/21/2021 to 12/04/2021';
        er.Month__c = '03-2021';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00; 
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        insert er;
       
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.Bi_Weekly_Reimbursement__c = bireim.Id;
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.TimeZone__c = 'US/Mountain' ;
        emp.StartTime__c = system.now();
        emp.EndTime__c =  system.now();
        emp.Trip_Date__c = date.today().adddays(-1);
        emp.Approved_Date__c = null;
        insert emp;

       // BiWeeklyWrapperUtils.getPayPeriodDates(string.valueOf(acc.Id));
        //BiWeeklyWrapperUtils.checkBiweekAccount(string.valueOf(acc.Id));
        BiWeeklyWrapperUtils.getLastMonthReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),false,'Driver/Manager');
        //BiWeeklyWrapperUtils.getEmployeeReimbursementDetails(bireim);
        BiWeeklyWrapperUtils.getUnapprovedReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),false ,'Driver/Manager');
        //BiWeeklyWrapperUtils.getUnapprovedMileages(string.valueOf(er));
       // BiWeeklyWrapperUtils.getMileagesOfReimbursement(emp);
      //  BiWeeklyWrapperUtils.getBiweekReimId(con.Id, system.today());
        
        

    }
    public static testmethod void testMethod5() {
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.Mileage_Lockdate__c = false;        
        insert customSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        
        
        //ContactTriCommunityReimCreate__c comreim = new ContactTriCommunityReimCreate__c();
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        
        Account acc = new Account();
       
        
        Contact con = new Contact();
        Contact con1 = new Contact();
        
        System.runAs(admin) {
            acc.Name = 'Test Account';
            //acc.Pay_Period_Start_Date__c = system.today();
            acc.Bi_Weekly_Pay_Period__c = true;
            acc.Pay_Period_Days__c = 13;
            acc.Pay_Period_Start_Date__c = system.today().adddays(-30);
            acc.Last_Reimbursement_Created__c = '12-2021';
            insert acc;
           
            Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            
            con1.LastName = 'new test';
            con1.Role__c = 'Manager';
            con1.Car_Image__c = veh.URL__c;
            con1.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con1.AccountId = acc.Id;
            con1.Activation_Date__c = system.today();
            con1.Deactivated_Date__c = system.today();
            con1.External_Email__c = 'test123@email.com';
            con1.Fixed_Amount__c = 371.28;
            con1.MailingCity = 'Abilene';
            con1.MailingState = 'TX';
            con1.Time_Zone__c = 'US/Mountain' ;
            con1.Driving_States__c = 'TX';
            con1.Fixed_Amount__c = 322.00;
            con1.Maintenance_and_Tires__c = 1.2;
            con1.MPG__c= 10.00;
            con1.Monthly_Mileage_Limit__c = 100.00;
            con1.Deactivated_Date__c = null;
            insert con1;
            
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Manager__c = con1.Id;
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = acc.Id;
            con.Activation_Date__c = system.today();
            con.Deactivated_Date__c = system.today();
            con.External_Email__c = 'test@email.com';
            con.Fixed_Amount__c = 371.28;
            con.MailingCity = 'Abilene';
            con.MailingState = 'TX';
            con.Time_Zone__c = 'US/Mountain' ;
            con.Driving_States__c = 'TX';
            con.Fixed_Amount__c = 322.00;
            con.Maintenance_and_Tires__c = 1.2;
            con.MPG__c= 10.00;
            con.Monthly_Mileage_Limit__c = 100.00;
            con.Deactivated_Date__c = null;
            insert con;
            
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
        
        IRS_Mileage_Rate__c objIRSRate = new IRS_Mileage_Rate__c();
        objIRSRate.year__c = '2021';
        objIRSRate.IRS_Rate__c= 12.0;
        insert objIRSRate;
        
        Bi_Weekly_Reimbursement__c biReim = new Bi_Weekly_Reimbursement__c();
        bireim.Approved_Date__c = null;
        bireim.Status__c = 'Pending';
        bireim.Name = '11/21/2021 to 12/04/2021';
        bireim.Start_Date__c = Date.parse('10/03/2021');
        bireim.End_Date__c = Date.parse('10/16/2021');
        bireim.Contact__c = con.id;
        insert bireim;
        
        Bi_Weekly_Reimbursement__c biReim1 = new Bi_Weekly_Reimbursement__c();
        bireim1.Approved_Date__c = null;
        bireim1.Status__c = 'Pending';
        bireim1.Name = '11/21/2021 to 12/04/2021';
        bireim1.Start_Date__c = Date.parse('10/03/2021');
        bireim1.End_Date__c = Date.parse('10/16/2021');
        bireim1.Contact__c = con1.id;
        insert bireim1;

        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = '11/21/2021 to 12/04/2021';
        er.Month__c = '03-2021';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00; 
        er.Fixed_Amount__c = con.Fixed_Amount__c;
        er.Status__c = 'Pending';
        er.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
        er.MPG__c = con.MPG__c;
        insert er;
       
        
        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.Bi_Weekly_Reimbursement__c = bireim.Id;
        emp.EmployeeReimbursement__c = er.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.TimeZone__c = 'US/Mountain' ;
        emp.StartTime__c = system.now();
        emp.EndTime__c =  system.now();
        emp.Trip_Date__c = date.today().adddays(-1);
        emp.Approved_Date__c = null;
        insert emp;

       // BiWeeklyWrapperUtils.getPayPeriodDates(string.valueOf(acc.Id));
        //BiWeeklyWrapperUtils.checkBiweekAccount(string.valueOf(acc.Id));
        BiWeeklyWrapperUtils.getLastMonthReimbursements(string.valueOf(con.Id), string.valueOf(acc.Id),false,'Driver/Manager');
        //BiWeeklyWrapperUtils.getEmployeeReimbursementDetails(bireim);
        BiWeeklyWrapperUtils.getUnapprovedReimbursements(string.valueOf(con1.Id), string.valueOf(acc.Id),false ,'Driver/Manager');
        //BiWeeklyWrapperUtils.getUnapprovedMileages(string.valueOf(er));
       // BiWeeklyWrapperUtils.getMileagesOfReimbursement(emp);
      //  BiWeeklyWrapperUtils.getBiweekReimId(con.Id, system.today());
        
    }
 
     
}