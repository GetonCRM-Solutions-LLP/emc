@isTest
public class NewdriverdashboardController_Test {
    public static testMethod void Method1() {
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        insert customEmailSetting;
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2021';
        insert veh;
        
        Account acc = new Account();  
        acc.Name = 'test account';
        acc.Vehicle_Types__c = veh.name;
        acc.Triplog_API__c = '123456789';
        Acc.Triplog_Status__c = 'U';
        acc.Start_Graph_Month__c = 'Jan';
        insert Acc;
        
        Contact con = new Contact();  
        con.AccountId = acc.Id;
        con.FirstName = 'Test';
        con.LastName = 'Contact';
        con.External_Email__c = 'minkesh.patel1478@gmail.com';
        con.Deactivated_Date__c = Null;
        con.Meeting_Minimum__c = true;
        con.Current_Level__c = system.today();
        con.Expiration_Date__c = system.today()+5;
        //con.Vehicle_Age__c = true;
        con.Role__c = 'Driver';
        con.Insurance_Attachment_Id__c = Null;
        con.Vehicle_Type__c = '2021 Full-Size Sedan';
        //con.Vehicle_Value_Check__c = false;
        con.MailingCity = 'Brainerd';
        con.MailingState = 'GA';
        
        insert con;
        
        
        Gas_Prices__c gasPrice = new Gas_Prices__c();
        gasPrice.Fuel_Price__c = 2.09;
        gasPrice.State__c = con.MailingState;
        gasPrice.City__c = con.MailingCity ;
        gasPrice.Month_Year__c = system.today()-30; 
        insert gasPrice;
        
        Employee_Reimbursement__c emp = new Employee_Reimbursement__c();
        emp.Name = 'Test Reim';
        emp.Contact_Id__c = con.Id;
        emp.Month__c = '06-2021';
        emp.Fuel_Price__c = 2.68;
        emp.MPG__c = 14.20;
        Insert emp;
            
        
        
        Test.startTest();
        Test.setCurrentPage(Page.Newdriverdashboard);
        ApexPages.CurrentPage().getParameters().put('id', con.Id);
        
        NewdriverdashboardController testAccPlan = new NewdriverdashboardController();
        
        
        test.stopTest();
    }
    
}