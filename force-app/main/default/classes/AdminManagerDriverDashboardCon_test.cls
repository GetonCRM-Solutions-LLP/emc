@isTest
public class AdminManagerDriverDashboardCon_test {
    public static testmethod void AdminManagerDriverDashboardTestMethod() {
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
        //RecordUtilityClass.createRecordsAdminManagerDriverDashboardCon();
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        Contact obj_admin_contact;
        Account obj_acc;
        List<Contact> obj_Manager_list;
        List<Contact> obj_driver_contact;
        System.runAs(admin) {
            obj_acc= new Account( Name = 'PL Marketing');
            obj_acc.Bi_Weekly_Pay_Period__c = true;
            obj_acc.Pay_Period_Days__c = 13;
            obj_acc.Pay_Period_Start_Date__c = system.today().adddays(-130);
            insert obj_acc;
           
            obj_admin_contact = RecordUtilityClass.buildAdminContact(obj_acc);
            insert obj_admin_contact;   
            
            obj_Manager_list = RecordUtilityClass.buildManagerContact(obj_acc,obj_admin_contact);
            insert obj_Manager_list;
    
            obj_driver_contact = RecordUtilityClass.buildDriverContact(obj_acc,obj_Manager_list[0]);
            insert obj_driver_contact ;
            
            Contact contact_2 = new Contact(AccountId = obj_acc.Id, LastName = 'xgeek',External_Email__c='abc@gmail.com');
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
        
        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List = RecordUtilityClass.getEmployee_Reimbursementandmileages(obj_driver_contact[0].id);
        List<EmployeeReimbursementDetailsAdmin> obj_EmployeeReimbursementDetailsAdmin_List = RecordUtilityClass.getListofEmployeeReimbursementDetailsAdmin(obj_Employee_Reimbursement_List);
        List<Employee_Mileage__c> obj_list_mileages =  RecordUtilityClass.getMileagesList();
       
        Test.setCurrentPage(Page.adminmanagerdriverdashboard);
        String accId = ApexPages.currentPage().getParameters().put('accid',obj_acc.Id);
        String conId = ApexPages.currentPage().getParameters().put('id',obj_driver_contact[0].Id);
        String adminid = ApexPages.currentPage().getParameters().put('adminid',obj_admin_contact.Id);
        String manid = ApexPages.currentPage().getParameters().put('manid',obj_driver_contact[0].Manager__c);
        //AdminManagerDriverDashboardController.getUnapprovedMileages(JSON.serialize(obj_list_mileages),obj_driver_contact[0].id);
        List<EmployeeMileages> obj_EmployeeMileages_list1=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list=RecordUtilityClass.getallEmployeeMileages(obj_list_mileages);
        if(obj_EmployeeMileages_list != null && obj_EmployeeMileages_list.size() > 0 ) {
            Integer i=0;
            for(EmployeeMileages obj:obj_EmployeeMileages_list) {
                if(i==0) {
                    i++;
                    obj.isSelected=true; 
                } else {
                    i--;
                    obj.isChecked = true;
                }
                obj_EmployeeMileages_list1.add(obj);
            }
        }
        Test.startTest();
        System.runAs(user_1) {
            AdminManagerDriverDashboardController mddc = new AdminManagerDriverDashboardController();
            AdminManagerDriverDashboardController.getAdminid();
            AdminManagerDriverDashboardController.getRedirected();
            AdminManagerDriverDashboardController.getLast2Years();
            AdminManagerDriverDashboardController.getReimbursementsList();
            AdminManagerDriverDashboardController.getDriverDetails();
            AdminManagerDriverDashboardController.getCompliance(obj_driver_contact[0].id);
            AdminManagerDriverDashboardController.getPacketandMeeting(obj_driver_contact[0].id);
            AdminManagerDriverDashboardController.getReimbursementsListClone(obj_driver_contact[0].id);
            AdminManagerDriverDashboardController.getMileages('April','2019',obj_driver_contact[0].id);
            AdminManagerDriverDashboardController.getAllReimbursements('2019',obj_driver_contact[0].id,obj_acc.id);
            //AdminManagerDriverDashboardController.approveReimbursements(String.valueOf(Date.today().year()),obj_driver_contact.Id,obj_acc.Id,obj_driver_contact.Manager__c,JSON.serialize(empReimWrapList));
            //AdminManagerDriverDashboardController.approveReimbursements('2019',obj_driver_contact.Id,obj_acc.Id,obj_driver_contact.Manager__c,JSON.serialize(empReimWrapList));
            AdminManagerDriverDashboardController.getDriverGasPrice('New York','New York');
            DateTime dt = DateTime.now();
            String monthName = dt.format('MMMMMMM');
            AdminManagerDriverDashboardController.approveMileages(null,null,null,obj_driver_contact[0].Name,obj_driver_contact[0].Email);
            AdminManagerDriverDashboardController.TimeAttendance(obj_driver_contact[0].id,'2021');
            //AdminManagerDriverDashboardController.getMileages(monthName,obj_driver_contact.Id,obj_acc.Id,obj_driver_contact.Manager__c);
            AdminManagerDriverDashboardController.biweeklyMileage(obj_driver_contact[0].id,2021);
            AdminManagerDriverDashboardController.getBiweekMileages('2021-11-12','2021-12-30',obj_driver_contact[0].id);
        }
        Test.stopTest();
    }
}