@isTest
public with sharing class ChangeTripStatusByAdminTest {
    public static testmethod void method1() {
        TriplogPutCall__c sendemailme = new TriplogPutCall__c();
        sendemailme.name = 'ChangeTripStatusByAdmin';
        sendemailme.TriplogPut__c = true;
        insert sendemailme;
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        insert customEmailSetting;
        
        daylight_saving_time_config__c customSetting2 =  new daylight_saving_time_config__c();
        customSetting2.Name = '2021';
        customSetting2.Start_Date__c = System.today();
        customSetting2.End_Date__c = System.today() + 60;
        insert customSetting2;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Vehicle';
        veh.Year__c = '2019';
        insert veh;
        RecordUtilityClass.createRecordsAdminDashboardController();
            Test.setMock(HttpCalloutMock.class, new ChangeTripStatusinTripLogTestMock());
            Account currentAccount = RecordUtilityClass.getAccount(); // retriving the Accounts EmployeeMileagesForCalculation
            currentAccount.isUsingTriplog__c = true;
            update currentAccount;
            Contact currentAdmin = RecordUtilityClass.getAdminContact(); // Retriving the Admin with limit 1
            Contact cont = RecordUtilityClass.getDriverContact(); 
            cont.Time_Zone__c = 'America/Chicago';  
            cont.External_Email__c = 'testd@email.com';
            update cont;
            String lastMonth = Utils.fetchMonths(1, 0)[0]; 
            Employee_Reimbursement__c er = new Employee_Reimbursement__c();
            er.Contact_Id__c = cont.Id;
            er.Name = 'Reimbersment Test';
            er.Month__c = lastMonth;
            er.Status__c = 'Pending';
            er.Fuel_Price__c = 10.00;
            insert er;
        
            Employee_Mileage__c emp = new Employee_Mileage__c();
            emp.EmployeeReimbursement__c = er.id;
            emp.Name = 'Test Mileage Record';
            emp.Trip_Status__c = 'Not Approved Yet';
            emp.Mileage__c = 10.00;
            emp.Contact_Email_Id__c = cont.External_Email__c;
            emp.Fuel_price__c = 10.00;
            emp.Trip_Id__c = 1575622156;
            emp.StartTime__c = system.now();
            emp.EndTime__c =  system.now();
            emp.TimeZone__c = 'US/Mountain';
            emp.Trip_Date__c = date.today().adddays(-1);
            insert emp;
            
            Employee_Mileage__c emp1 = new Employee_Mileage__c();
            emp1.EmployeeReimbursement__c = er.id;
            emp1.Name = 'Test Mileage Record';
            emp1.Trip_Status__c = 'Rejected';
            emp1.Contact_Email_Id__c = cont.External_Email__c;
            emp1.Mileage__c = 10.00;
            emp1.Trip_Id__c = 15756156;
            emp1.Fuel_price__c = 10.00;
            emp1.StartTime__c = system.now();
            emp1.EndTime__c =  system.now();
            emp1.TimeZone__c = 'US/Mountain';
            emp1.Trip_Date__c = date.today().adddays(-1);
            insert emp1;
            
            Employee_Mileage__c emp2 = new Employee_Mileage__c();
            emp2.EmployeeReimbursement__c = er.id;
            emp2.Name = 'Test Mileage Record';
            emp2.Trip_Status__c = 'Approved';
            emp2.Contact_Email_Id__c = cont.External_Email__c;
            emp2.Trip_Id__c = 1575615;
            emp2.Mileage__c = 10.00;
            emp2.Fuel_price__c = 10.00;
            emp2.StartTime__c = system.now();
            emp2.EndTime__c =  system.now();
            emp2.TimeZone__c = 'US/Mountain';
            emp2.Trip_Date__c = date.today().adddays(-1);
            insert emp2;
            
            Test.startTest();
                Database.executeBatch(new ChangeTripStatusByAdmin(currentAccount.id,lastMonth));
            Test.stopTest();
    }
}