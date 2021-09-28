@isTest
public Class MappingGasPriceTriggerTest{

    public static testmethod void test1(){
    
        TriggerConfig__c customSetting =  new TriggerConfig__c();
        customSetting.Name = 'Defaulttrigger';
        customSetting.MappingGasPriceTrigger__c = true;
        customSetting.MappingGasStayTime__c = true;
        customSetting.ContactTriggersendEmailForNewContact__c = true;
        customSetting.ContactTriCommunityReimCreate__c = true;
        customSetting.Mileage_Lockdate__c = true;
        customSetting.MappingMileage__c = true;
        customSetting.MapTriAppReje__c = true;
        insert customSetting;
        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Mileage Rate';
        veh.Year__c = '2019';
        insert veh;
        
        List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();
        
        SendEmail__c customSetting1 =  new SendEmail__c();
        customSetting1.Name = 'Send Email For Compliance';
        customSetting1.Send_email_from_code__c= true;
        insert customSetting1;
        
        daylight_saving_time_config__c customSetting2 =  new daylight_saving_time_config__c();
        customSetting2.Name = '2021';
        customSetting2.Start_Date__c = System.today();
        customSetting2.End_Date__c = System.today() + 60;
        insert customSetting2;
        
        Account acc = new Account();
        acc.Name = 'PL Marketing';
        acc.Triplog_API__c = 'asasadfdfsdfsdasaddf';
        insert acc;
        
        Contact con = new Contact();
        con.LastName = 'TestContact';
        con.AccountId = acc.Id;
        con.External_Email__c = 'test@email.com';
        con.Fixed_Amount__c = 371.28;
        con.MailingCity = 'Abilene';
        con.MailingState = 'TX';
        con.Time_Zone__c = 'US/Mountain' ;
        con.Driving_States__c = 'TX';
        con.Vehicle_Type__c = '2019 Mileage Rate';
        //con.Time_Zone__c = 'America/Chicago';
        con.Monthly_Mileage_Limit__c = 100.00;
        insert con;
        
    
        Gas_Prices__c gprice = new Gas_Prices__c();
        gprice.City__c = 'Abilene';
        gprice.Fuel_Price__c = 65;
        gprice.State__c = 'TX';
        gprice.Month_Year__c = date.today().adddays(-1);
        insert gprice;
        
        Employee_Reimbursement__c er5 = new Employee_Reimbursement__c();
        er5.Contact_Id__c = con.Id;
        er5.Name = 'Reimbersment Test';
        er5.Month__c = '10-2017';
        er5.Status__c = 'Pending';
        er5.Fuel_Price__c = 10.00;
        insert er5;

        Employee_Mileage__c emp = new Employee_Mileage__c();
        emp.EmployeeReimbursement__c = er5.id;
        emp.Contact_Email_Id__c = con.External_Email__c;
        emp.Name = 'EMP-Test Mileage Record';
        emp.Trip_Status__c = StaticValues.noApprovedYet;
        emp.Mileage__c = 10.00;
        emp.Fuel_price__c = 10.00;
        emp.TimeZone__c = 'US/Mountain' ;
        emp.StartTime__c = system.now();
        emp.EndTime__c =  system.now();
        emp.Trip_Date__c = date.today().adddays(-1);
        insert emp;
        
        Employee_Reimbursement__c er1 = new Employee_Reimbursement__c();
        er1.Contact_Id__c = con.Id;
        er1.Name = 'Reimbersment Test';
        er1.Month__c = '08-2017';
        er1.Status__c = 'Pending';
        er1.Mileage_Lock_Date__c = system.today()-1;
        insert er1;
        
         Employee_Reimbursement__c er = new Employee_Reimbursement__c();
        er.Contact_Id__c = con.Id;
        er.Name = 'Reimbersment Test';
        er.Month__c = '09-2017';
        er.Status__c = 'Pending';
        er.Fuel_Price__c = 10.00;
        insert er;
        
        Employee_Mileage__c emp1 = new Employee_Mileage__c();
        emp1.EmployeeReimbursement__c = er1.id;
        emp1.Contact_Email_Id__c = con.External_Email__c;
        emp1.Name = 'EMP-Test Mileage Record';
        emp1.Trip_Status__c = 'Approved';
        emp1.Approved_Date__c = system.today();
        emp1.Mileage__c = 10.00;
        emp1.TimeZone__c = 'US/Mountain' ;
        emp1.StartTime__c = system.now();
        emp1.EndTime__c =  system.now();
        emp1.Trip_Date__c =date.today().adddays(-1);
        insert emp1;
        
        emp1.Trip_Status__c = 'Rejected';
        update emp1;
        emp1.Trip_Status__c = 'Approved';
        update emp1;
        
        Employee_Mileage__c emp2 = new Employee_Mileage__c();
        emp2.EmployeeReimbursement__c = er1.id;
        emp2.Contact_Email_Id__c = con.External_Email__c;
        emp2.Name = 'EMP-Test Mileage Record';
        emp2.Trip_Status__c = 'Approved';
        emp2.Approved_Date__c = system.today();
        emp2.Mileage__c = 10.00;
        emp2.TimeZone__c = 'US/Mountain' ;
        emp2.StartTime__c = system.now();
        emp2.EndTime__c =  system.now();
        emp2.Trip_Date__c =date.today().adddays(-1);
        insert emp2;
        
        emp2.Mileage__c = 10.00;
        update emp2;
        emp1.StartTime__c = emp1.StartTime__c.addSeconds(4);
        emp1.Trip_Status__c = 'Rejected';
        update emp1;
        Map<ID,Employee_Mileage__c> milMap = new Map<ID,Employee_Mileage__c>();
        milMap.put(emp1.id,emp1);
        List<Employee_Mileage__c> mileageNew = new List<Employee_Mileage__c> ();
        mileageNew.add(emp1);
        MappingGasPriceTriggerHelper.TrackHistory(milMap,mileageNew);
        MappingGasPriceTriggerHelper.updateMileagesLockDate(mileageNew);
        MappingGasPriceTriggerHelper.updateMileages(mileageNew);
    }
}