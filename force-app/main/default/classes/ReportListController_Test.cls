@isTest
public class ReportListController_Test {
    public static testmethod void ReportListControllerTestMethod() {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        customEmailSetting.ContactTriBiReimCreate__c  = true;
        insert customEmailSetting;
        
        SendEmail__c customSetting =  new SendEmail__c();
        customSetting.Name = 'Send Email For Compliance';
        customSetting.Send_email_from_code__c= true;
        insert customSetting;
        
        List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c =  'Mileage Rate';
        veh.Year__c = '2019';
        insert veh;
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        Contact obj_admin_contact;
        Account obj_acc;
        List<Contact> obj_Manager_list;
        List<Contact> obj_driver_contact;
        Contact contact_2;
        System.runAs(admin) {
            obj_acc= new Account( Name = 'Frampton Construction');
            obj_acc.Bi_Weekly_Pay_Period__c = true;
            obj_acc.Pay_Period_Days__c = 13;
            obj_acc.Pay_Period_Start_Date__c = system.today().adddays(-130);
            obj_acc.Triplog_API__c = '28beeea973f34daf89050a9b6a3b1a71';
            insert obj_acc;
           
            obj_admin_contact = RecordUtilityClass.buildAdminContact(obj_acc);
            insert obj_admin_contact;   
            
            obj_Manager_list = RecordUtilityClass.buildManagerContact(obj_acc,obj_admin_contact);
            insert obj_Manager_list;
    
            obj_driver_contact = RecordUtilityClass.buildDriverContact(obj_acc,obj_Manager_list[0]);
            insert obj_driver_contact ;
            
            contact_2 = new Contact(AccountId = obj_acc.Id, LastName = 'xgeek',External_Email__c='abc@gmail.com');
            insert contact_2 ;
            
            user_1 = new User( 
                Email = 'yourusername@gmail.com',
                ProfileId = profile_1.Id, 
                UserName = 'yourusername@gmail.com', 
                Alias = 'Test',
                TimeZoneSidKey = 'America/New_York',
                EmailEncodingKey = 'ISO-8859-1',
                LocaleSidKey = 'en_US', 
                LanguageLocaleKey = 'en_US',
                ContactId = contact_2.Id,
                PortalRole = 'Manager',
                FirstName = 'Firstname',
                LastName = 'Lastname'
            );
            insert user_1;
        }

        Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = obj_driver_contact[0].Id;
        er.Name = 'Reimbersment Test';
        er.Month__c = '06-2020';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00;
        insert er;

        Custom_Report__c currentReport = new Custom_Report__c();
        currentReport.Name = 'Variable Reimbursement Report';
        currentReport.Sort_By__c = 'asc';
        currentReport.Report_For__c = 'Frank Saverino Accessibility';
        currentReport.Report_Category__c = 'Reimbursement Reports  ';
        currentReport.Report_Type__c = 'Reimbursements Between 2 Dates For Month Range';
        currentReport.Use_Manager_List__c = true;
        currentReport.Report_Header__c = 'Month,Employee ID,Name,E-mail,Monthly Approved Variable Amount';
        currentReport.Report_Soql__c = 'select Month__c,Contact_Id_Employee_ID__c,Contact_Id_Name__c,Contact_Id_External_Email__c,Monthly_Approved_Variable_Amount__c from Employee_Reimbursement__c where Contact_Id_Deactivated_Date__c =null';
        currentReport.Numeric_Fields__c = 'Monthly_Approved_Variable_Amount__c';
        currentReport.Date_Time_Fields__c = 'Contact_Id_Name__c';
        currentReport.Date_Fields__c = 'Contact_Id_External_Email__c';
        insert currentReport ; 
               
        Report_Accessibility__c repAcc = new Report_Accessibility__c();
        repAcc.Custom_Report__c = currentReport.Id;
        repAcc.User__c = user_1.Id;
        insert repAcc;
        
        Custom_Report__c currentReport2 = new Custom_Report__c();
        currentReport2.Name = 'Variable Reimbursement Report';
        currentReport2.Sort_By__c = 'asc';
        currentReport2.Report_For__c = 'Frank Saverino Accessibility';
        currentReport2.Report_Category__c = 'Reimbursement Reports  ';
        currentReport2.Report_Type__c = 'Reimbursements Between 2 Dates For Month Range';
        currentReport2.Use_Manager_List__c = true;
        currentReport2.Report_Header__c = 'Month,Employee ID,Name,E-mail,Monthly Approved Variable Amount';
        currentReport2.Report_Soql__c = 'select Month__c,Contact_Id_Employee_ID__c,Contact_Id_Name__c,Contact_Id_External_Email__c,Monthly_Approved_Variable_Amount__c from Employee_Reimbursement__c where Contact_Id_Deactivated_Date__c =null';
        currentReport2.Numeric_Fields__c = 'Monthly_Approved_Variable_Amount__c';
        currentReport2.Date_Time_Fields__c = 'Contact_Id_Name__c';
        currentReport2.Date_Fields__c = 'Contact_Id_External_Email__c';
        insert currentReport2 ; 
        Report_Accessibility__c repAcc1 = new Report_Accessibility__c();
        repAcc1.Custom_Report__c = currentReport2.Id;
        repAcc1.User__c = user_1.Id;
        insert repAcc1;
        
       Test.startTest();
        System.runAs(user_1) {
            Test.setCurrentPage(Page.reportlist);
            String accId = ApexPages.currentPage().getParameters().put('accid',obj_acc.Id);
            String conid = ApexPages.currentPage().getParameters().put('id',contact_2.Id);
            ReportListController mddc = new ReportListController();
            ReportListController.getAccountid();
            ReportListController.getContactid();
            ReportListController.getRedirected();
            ReportListController.getAllReports();
            ReportListController.getRole();
            ReportListController.reimbursementListModal(er.Id);
            ReportListController.contactListModal(obj_acc.Id);
            String startDate = '2020-01-01';
            String endDate = '2020-03-22';
            ReportListController.postTimeSheetImportAPI(startDate,endDate,obj_driver_contact[0].id);
            ReportListController.postVariablePaymentAPI(startDate,obj_driver_contact[0].id);
            ReportListController.updateLockDate(obj_acc.Id,obj_driver_contact[0].id);
            ReportListController.postFixedAmountAPI(startDate,obj_driver_contact[0].id);
            ReportListController.postHalfFPFullDriverAPI(startDate,endDate,obj_driver_contact[0].id);
            ReportListController.CheckStatus(1234567654,'NetchexDeleteCallout');
            ReportListController.UpdateMileageLockDate(startDate,endDate);
            //ReportListController.DeleteNetchexCallout(startDate,endDate);
            ReportListController.ChangeTripStatus(string.valueof('obj_acc.Id'));
            ReportListController.DeleteNetchexCallout(startDate,endDate);
            ReportListController.reimbursementWrapper wrapperList = new ReportListController.reimbursementWrapper();
            wrapperList.reimbId = obj_driver_contact[0].id;
            wrapperList.name = 'test';
         }
        Test.stopTest();
    }
}