@isTest
public with sharing class LoginRedirection_Test {

    public static testmethod void utilMethod1()
    {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
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
                con.Deactivated_Date__c = Null;
                con.Deactivated_Date__c = Null;
                con.Insurance_Attachment_Id__c = Null;
                con.Vehicle_Type__c = '2019 Full-Size Sedan';  
                con.Role__c = 'Driver';
                
                conList.add(con);
                
            }
            insert conList;
            
            con1.FirstName = 'Priyanka';
            con1.LastName = 'Gajera';
            con1.AccountId = account_1.Id;
            //con1.Account.name = 'PL Marketing';
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            //con1.account.Name = account_1.Name;
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = Null;
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
    
        List<User> u = [Select id from User WHERE Profile.name='Customer Community Login User - Manager' and IsActive = true limit 1];
        Test.startTest();
        System.runAs(u[0]) {
          
            Contact obj = [select id from contact limit 1];
            ApexPages.currentPage().getParameters().put('id',obj.Id);
            LoginRedirection obj_LoginRedirection = new LoginRedirection();
            obj_LoginRedirection.redirectOnPage();
              
          }
    Test.stopTest();
    }
    public static testmethod void utilMethod2()
    {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
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
                con.Deactivated_Date__c = Null;
                con.Deactivated_Date__c = Null;
                con.Insurance_Attachment_Id__c = Null;
                con.Vehicle_Type__c = '2019 Full-Size Sedan';  
                con.Role__c = 'Driver';
                
                conList.add(con);
                
            }
            insert conList;
            
            con1.FirstName = 'Priyanka';
            con1.LastName = 'Gajera';
            con1.AccountId = account_1.Id;
            //con1.Account.name = 'PL Marketing';
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            //con1.account.Name = account_1.Name;
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = Null;
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
       /* Account obj_account = new Account();
        obj_account.name='Test';
        obj_account.Pay_Period_Days__c = 13;
        obj_account.Pay_Period_Start_Date__c = system.today().adddays(-130);
        insert obj_account;

        Contact obj_contact = new Contact();
        obj_contact.Vehicle_Type__c = '2019 Full-Size Sedan';
        obj_contact.firstname='test';
        obj_contact.lastname='testlastname2';
        obj_contact.email = 'testlastname2@gmail.com';
        obj_contact.External_Email__c = 'testlastname2@gmail.com';
        obj_contact.Role__c ='Admin';
        obj_contact.Accountid=obj_account.id;        
        obj_contact.isCommunityUser__c = true;
        obj_contact.Driver_Type__c = 'Driver - Full Time';
        obj_contact.IsCreatedFromCommunity__c = true;
        insert obj_contact;
*/
         Test.startTest();
       List<User> u = [Select id from User WHERE Profile.name='Customer Community Login User - Super Manager' and IsActive = true limit 1];    
        System.runAs(u[0]) {      
            Contact obj = [select id from contact limit 1];
            ApexPages.currentPage().getParameters().put('id',obj.Id);
            LoginRedirection obj_LoginRedirection = new LoginRedirection();
            obj_LoginRedirection.redirectOnPage();              
          }
    Test.stopTest();
    }
    public static testmethod void utilMethod3()
    {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
        Test.startTest();
        
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
                con.Deactivated_Date__c = Null;
                con.Deactivated_Date__c = Null;
                con.Insurance_Attachment_Id__c = Null;
                con.Vehicle_Type__c = '2019 Full-Size Sedan';  
                con.Role__c = 'Driver';
                
                conList.add(con);
                
            }
            insert conList;
            
            con1.FirstName = 'Priyanka';
            con1.LastName = 'Gajera';
            con1.AccountId = account_1.Id;
            //con1.Account.name = 'PL Marketing';
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            //con1.account.Name = account_1.Name;
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = Null;
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
       /* Account obj_account = new Account();
        obj_account.name='Test';
        obj_account.Pay_Period_Days__c = 13;
        obj_account.Pay_Period_Start_Date__c = system.today().adddays(-130);
        insert obj_account;

        Contact obj_contact = new Contact();
        obj_contact.Vehicle_Type__c = '2019 Full-Size Sedan';
        obj_contact.firstname='test';
        obj_contact.lastname='testlastname2';
        obj_contact.email = 'testlastname2@gmail.com';
        obj_contact.External_Email__c = 'testlastname2@gmail.com';
        obj_contact.Role__c ='Driver/Manager';
        obj_contact.Accountid=obj_account.id;  
        obj_contact.Driver_Type__c = 'Driver - Full Time';      
        obj_contact.isCommunityUser__c = true;
        obj_contact.Fixed_Amount__c = 100;
        obj_contact.IsCreatedFromCommunity__c = true;
        insert obj_contact;
        */
        List<User> u = [Select id from User WHERE Profile.name='Customer Community Login User - Manager/Driver' and IsActive = true limit 1];
        System.runAs(u[0]) {            
            Contact obj = [select id from contact limit 1];
            ApexPages.currentPage().getParameters().put('id',obj.Id);
            LoginRedirection obj_LoginRedirection = new LoginRedirection();
            obj_LoginRedirection.redirectOnPage();              
          }
    Test.stopTest();
    }
    public static testmethod void utilMethod4()
    {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
        Test.startTest();
       /* Account obj_account = new Account();
        obj_account.name='Test';
        obj_account.Pay_Period_Days__c = 13;
        obj_account.Pay_Period_Start_Date__c = system.today().adddays(-130);
        insert obj_account;

        Contact obj_contact = new Contact();
        obj_contact.Vehicle_Type__c = '2019 Full-Size Sedan';
        obj_contact.firstname='test';
        obj_contact.lastname='testlastname2';
        obj_contact.email = 'testlastname2@gmail.com';
        obj_contact.External_Email__c = 'testlastname2@gmail.com';
        obj_contact.Role__c ='Driver';
        obj_contact.Accountid=obj_account.id;    
        obj_contact.Driver_Type__c = 'Driver - Full Time';    
        obj_contact.isCommunityUser__c = true;
        obj_contact.Fixed_Amount__c = 100;
        obj_contact.MPG__c = 100;
        obj_contact.IsCreatedFromCommunity__c = true;
        insert obj_contact;
        */
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
                con.Deactivated_Date__c = Null;
                con.Deactivated_Date__c = Null;
                con.Insurance_Attachment_Id__c = Null;
                con.Vehicle_Type__c = '2019 Full-Size Sedan';  
                con.Role__c = 'Driver';
                
                conList.add(con);
                
            }
            insert conList;
            
            con1.FirstName = 'Priyanka';
            con1.LastName = 'Gajera';
            con1.AccountId = account_1.Id;
            //con1.Account.name = 'PL Marketing';
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            //con1.account.Name = account_1.Name;
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = Null;
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
        
        List<User> u = [Select id from User where profile.name='Customer Community Login User - Driver' and IsActive = true limit 1];
        
        System.runAs(u[0]) {            
            Contact obj = [select id from contact limit 1];
            ApexPages.currentPage().getParameters().put('id',con1.Id);
            LoginRedirection obj_LoginRedirection = new LoginRedirection();
            obj_LoginRedirection.redirectOnPage();              
          }
    Test.stopTest();
    }
    public static testmethod void utilMethod5()
    {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
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
                con.Deactivated_Date__c = Null;
                con.Deactivated_Date__c = Null;
                con.Insurance_Attachment_Id__c = Null;
                con.Vehicle_Type__c = '2019 Full-Size Sedan';  
                con.Role__c = 'Driver';
                
                conList.add(con);
                
            }
            insert conList;
            
            con1.FirstName = 'Priyanka';
            con1.LastName = 'Gajera';
            con1.AccountId = account_1.Id;
            //con1.Account.name = 'PL Marketing';
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            //con1.account.Name = account_1.Name;
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = Null;
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
         Test.startTest();
       List<User> u = [Select id from User WHERE Profile.name='Customer Community Login User - Super Manager/Driver' and IsActive = true limit 1];    
        System.runAs(u[0]) {      
            Contact obj = [select id from contact limit 1];
            ApexPages.currentPage().getParameters().put('id',obj.Id);
            LoginRedirection obj_LoginRedirection = new LoginRedirection();
            obj_LoginRedirection.redirectOnPage();              
          }
    Test.stopTest();
    }
    
    static testMethod void fakeTest(){
     LoginRedirection.fakeMethod();
     
  }  
}