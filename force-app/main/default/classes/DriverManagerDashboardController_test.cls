@isTest
public class DriverManagerDashboardController_test {
    public static testmethod void DriverManagerDashboardControllerTestMethod() {
        
        RecordUtilityClass.sendEmailforCompliance();
        RecordUtilityClass.enableMappingGasPriceTrigger();
        RecordUtilityClass.vehicleUrlMapping();
        Account currentAccount = RecordUtilityClass.buildAccount();
        insert currentAccount;
       

        Contact currentAdmin = RecordUtilityClass.buildAdminContact(currentAccount);
        insert currentAdmin;

        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        
       // Account currentAccount = new Account();
        Contact con = new Contact();
       // contact currentAdmin = new contact();
        
        System.runAs(admin) {
           /* currentAccount.Name = 'Test Account';
            //currentAccount.Pay_Period_Start_Date__c = system.today();
            currentAccount.Bi_Weekly_Pay_Period__c = true;
            currentAccount.Pay_Period_Days__c = 13;
            currentAccount.Pay_Period_Start_Date__c = system.today().adddays(-130);
            currentAccount.Last_Reimbursement_Created__c = '12-2021';
            insert currentAccount;
           */
            Contact contact_1 = new Contact(AccountId = currentAccount.Id, LastName = 'xgeek',External_Email__c='newmail@gmail.com');
            insert contact_1;
            
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = currentAccount.Id;
            con.Activation_Date__c = system.today();
            con.Deactivated_Date__c = system.today().addDays(-2);
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
            
            /*
            currentAdmin.LastName = 'TestContact';
            currentAdmin.Role__c = 'Admin';
            currentAdmin.Car_Image__c = veh.URL__c;
            currentAdmin.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            currentAdmin.AccountId = currentAccount.Id;
            currentAdmin.Activation_Date__c = system.today();
            currentAdmin.Deactivated_Date__c = system.today().addDays(-2);
            currentAdmin.External_Email__c = 'test@email1.com';
            currentAdmin.Fixed_Amount__c = 371.28;
            currentAdmin.MailingCity = 'Abilene';
            currentAdmin.MailingState = 'TX';
            currentAdmin.Time_Zone__c = 'US/Mountain' ;
            currentAdmin.Driving_States__c = 'TX';
            currentAdmin.Fixed_Amount__c = 322.00;
            currentAdmin.Maintenance_and_Tires__c = 1.2;
            currentAdmin.MPG__c= 10.00;
            currentAdmin.Monthly_Mileage_Limit__c = 100.00;
            currentAdmin.Deactivated_Date__c = null;
            insert currentAdmin;
            */
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
        
        List<Contact> obj_Manager_list = RecordUtilityClass.buildManagerContact(currentAccount,currentAdmin);
        insert obj_Manager_list;
        List<Contact> obj_driverManager_list = RecordUtilityClass.buildDriverManagerContact(currentAccount,obj_Manager_list[0]);
        insert obj_driverManager_list;
        List<Contact> obj_Driver_list = RecordUtilityClass.buildDriverContact(currentAccount,obj_driverManager_list[0]);
        insert obj_Driver_list;

        list<Gas_Prices__c> gaslist = RecordUtilityClass.buildGasPrice();
        insert gaslist;

        list<Employee_Reimbursement__c> empReimbursementList = RecordUtilityClass.buildPendingEmployee_Reimbursement(obj_Driver_list);
        insert empReimbursementList;

        list<Bi_Weekly_Reimbursement__c> empBIweeReimbursementList1 = RecordUtilityClass.buildPendingBiReimbursement(obj_Driver_list);
        insert empBIweeReimbursementList1;

        List<Employee_Mileage__c> obj_Employee_Mileage_list = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(empReimbursementList, empBIweeReimbursementList1[0].id);
        insert obj_Employee_Mileage_list;

        list<Employee_Reimbursement__c> empReimbursementList1 = RecordUtilityClass.buildPendingEmployee_Reimbursement(obj_driverManager_list);
        insert empReimbursementList1;

        list<Bi_Weekly_Reimbursement__c> empBIReimbursementList1 = RecordUtilityClass.buildPendingBiReimbursement(obj_driverManager_list);
        insert empBIReimbursementList1;

        List<Employee_Mileage__c> obj_Employee_Mileage_list1 = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(empReimbursementList1,empBIReimbursementList1[0].id );
        insert obj_Employee_Mileage_list1;

        //file
        Document documentObj = new Document();
        documentObj.Body = Blob.valueOf('Some Document Text');
        documentObj.ContentType = 'application/vnd.ms-excel';
        documentObj.DeveloperName = 'Inserted_Contact_File_Test';
        documentObj.IsPublic = true;
        documentObj.Name = 'Inserted Contact File';
        documentObj.FolderId = [SELECT Id FROM folder WHERE Name = 'Shared Documents'].Id;
        insert documentObj;

        Test.startTest();
        Test.setCurrentPage(Page.drivermanagerdashboard);
        String conId = ApexPages.currentPage().getParameters().put('id',obj_driverManager_list[0].Id);
        String accId = ApexPages.currentPage().getParameters().put('accid',currentAccount.Id);
        DriverManagerDashboardController dmdc = new DriverManagerDashboardController();
        DriverManagerDashboardController.getAccountid();
        DriverManagerDashboardController.getContactid();
        DriverManagerDashboardController.getRedirected();
        DriverManagerDashboardController.getChartData();
        DriverManagerDashboardController.getAllDriversLastMonthReimbursements();       
       
        DriverManagerDashboardController.getAllDriversLastMonthUnapprovedReimbursementsclone();
        DriverManagerDashboardController.getAllDriversLastMonthUpdatedUnapprovedReimburseClone(obj_driverManager_list[0].Id,currentAccount.Id,'true');
        DriverManagerDashboardController.getAllDriversLastMonthUpdatedUnapprovedReimburseClone1(obj_driverManager_list[0].Id,currentAccount.Id,'true');
        DriverManagerDashboardController.getAllDriversLastMonthUpdatedReimbursements(obj_driverManager_list[0].Id,currentAccount.Id,'true');
        //DriverManagerDashboardController.getAllDriversLastMonthUpdatedUnapprovedReimburse(obj_driverManager_list[0].Id,currentAccount.Id);
        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List2 = RecordUtilityClass.getEmployee_Reimbursement(currentAccount.id);
        List<EmployeeReimbursementDetailsAdmin> selectedReimList = RecordUtilityClass.getListofEmployeeReimbursementDetailsAdmin(obj_Employee_Reimbursement_List2);

        Contact selectedDriver = RecordUtilityClass.getDriverContact();
        updateThresholdWrapper currentupdateThresholdWrapper = new updateThresholdWrapper();
        List<updateThresholdWrapper> updateThresholdWrapperList = new List<updateThresholdWrapper>();
        
        currentupdateThresholdWrapper.contactid = selectedDriver.id;
        currentupdateThresholdWrapper.threshold = '20';
        updateThresholdWrapperList.add(currentupdateThresholdWrapper);

        List<String> reimbursementIdList = new List<String>();
        reimbursementIdList.add(selectedReimList[0].id);
        
        AsyncApexJob batch = DriverManagerDashboardController.approveReimbursements(JSON.serialize(reimbursementIdList),obj_driverManager_list[0].Id,currentAccount.id,'true',JSON.serialize(updateThresholdWrapperList));
        List<Employee_Mileage__c> driverMileagesList =  RecordUtilityClass.getMileagesList();
        DriverManagerDashboardController.CheckBatchStatus(batch.id);
        DriverManagerDashboardController.UpdatedReimList(obj_driverManager_list[0].Id, currentAccount.Id, 'true');
        List<EmployeeMileages> obj_EmployeeMileages_list1=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list=RecordUtilityClass.getallEmployeeMileages(driverMileagesList);
        if(obj_EmployeeMileages_list!=null && obj_EmployeeMileages_list.size()>0)
        {
            Integer i=0;
            for(EmployeeMileages obj:obj_EmployeeMileages_list)
            {
                if(i==0)
                {
                    i++;
                    obj.isSelected=true;
    

                }
                else
                {
                    i--;
                    obj.isChecked = true;
                }
                obj_EmployeeMileages_list1.add(obj);
            }
        }
        DriverManagerDashboardController.approveMileagesClone(JSON.serialize(reimbursementIdList),obj_driverManager_list[0].Id,currentAccount.id,'true');

        String reimbursement = RecordUtilityClass.getUnapprovedReimbursements(currentAdmin.id,currentAccount.id,false,'Admin');    
        List<EmployeeMileagesForCalculation> employeereimbursementList = new List<EmployeeMileagesForCalculation>();
        employeereimbursementList = (List<EmployeeMileagesForCalculation>)JSON.deserialize(reimbursement,List<EmployeeMileagesForCalculation>.Class);
        //List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List = RecordUtilityClass.getEmployee_Reimbursement(obj_acc.id);
        //DriverManagerDashboardController.approveMileages(JSON.serialize(obj_EmployeeMileages_list1));
         DriverManagerDashboardController.getUnapprovedMileages(JSON.serialize(employeereimbursementList[0]),currentAccount.id);
       // List<String> result =DriverManagerDashboardController.approveMileagesClone(JSON.serialize(obj_EmployeeMileages_list),obj_driverManager_list[0].Id,currentAccount.Id,'true');
         //DriverManagerDashboardController.getUnapprovedMileages('',obj_driverManager_list[0].Id);
        /*DriverManagerDashboardController.getAllDriversLastMonthUpdatedReimbursements(conId,accId);
        DriverManagerDashboardController.getAllDriversLastMonthUpdatedUnapprovedReimburse(conId,accId);
        DriverManagerDashboardController.approveReimbursements(JSON.serialize(empList),conId,accId);
        DriverManagerDashboardController.readFromFile(String.valueof(documentObj.Body),conId,accId);*/
       DriverManagerDashboardController.totalmileages='';
       DriverManagerDashboardController.totalvariableamount='';
       DriverManagerDashboardController.setEmployeeName();
        DriverManagerDashboardController.showTeamRecord=true;
        DriverManagerDashboardController.insurancePage=true;
        PageReference pageRef = Page.DriverManagerDashboard; // Add your VF page Name here
  		pageRef.getParameters().put('showteam', 'showteam' );
        DriverManagerDashboardController.getAccountid();
        DriverManagerDashboardController.getContactid();
        DriverManagerDashboardController.getRedirected();
		 
        //test comment       
        Test.stopTest();
    }
   /* public static testmethod void DriverManagerDashboardControllerTestMethod1() {
        DriverManagerDashboardController.getAccountid();
        DriverManagerDashboardController.getContactid();
        DriverManagerDashboardController.getRedirected();
       // DriverManagerDashboardController.setEmployeeName();
    } */
    
}