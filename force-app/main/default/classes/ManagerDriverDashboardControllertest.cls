@isTest
public class ManagerDriverDashboardControllertest {
    public static testmethod void ManagerDriverDashboardControllerTestMethod() {
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
        System.runAs(admin) {
            obj_acc= new Account( Name = 'PL Marketing');
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

        Test.setCurrentPage(Page.managerdriverdashboard);
        String conId = ApexPages.currentPage().getParameters().put('id',obj_driver_contact[0].Id);
        String accId = ApexPages.currentPage().getParameters().put('accid',obj_acc.Id);
        String manid = ApexPages.currentPage().getParameters().put('manid',obj_driver_contact[0].Manager__c);
        ManagerDriverDashboardController mddc = new ManagerDriverDashboardController();
        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List = RecordUtilityClass.getDriverEmployee_Reimbursement(obj_driver_contact[0].id);
        List<EmployeeReimbursements> obj_list =  RecordUtilityClass.getEmployeeReimbursements(obj_Employee_Reimbursement_List);
        List<Employee_Mileage__c> obj_list_mileages =  RecordUtilityClass.getMileagesList();
        List<EmployeeMileages> obj_EmployeeMileages_list1=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list=RecordUtilityClass.getallEmployeeMileages(obj_list_mileages);
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
       // ManagerDriverDashboardController.approveMileages(JSON.serialize(obj_EmployeeMileages_list1),'April',obj_driver_contact.id);
        //ManagerDriverDashboardController.approveMileages();
        //ManagerDriverDashboardController.approveReimbursements();
        //ManagerDriverDashboardController.approveReimbursements(String.valueOf(Date.today().year()),obj_driver_contact.Id,obj_acc.Id,obj_driver_contact.Manager__c,JSON.serialize(empReimWrapList));
        //ManagerDriverDashboardController.approveReimbursements('2018',obj_driver_contact.Id,obj_acc.Id,obj_driver_contact.Manager__c,JSON.serialize(empReimWrapList));
        DateTime dt = DateTime.now();
        String monthName = dt.format('MMMMMMM');
        Test.startTest();
        System.runAs(user_1) {
        //ManagerDriverDashboardController.approveMileages(JSON.serialize(empMileageList),String.valueOf(Date.today().year()),obj_driver_contact.Id);
        ManagerDriverDashboardController.getRedirected();
        ManagerDriverDashboardController.getLast2Years();
        ManagerDriverDashboardController.approveReimbursements('2019',obj_driver_contact[0].Id,obj_acc.Id,JSON.serialize(obj_list));
        ManagerDriverDashboardController.getReimbursementsList();
        ManagerDriverDashboardController.getDriverDetails();
        ManagerDriverDashboardController.getAllReimbursements('2019',obj_driver_contact[0].Id,obj_acc.Id);
        ManagerDriverDashboardController.getReimbursementsListClone(obj_driver_contact[0].Id);
        ManagerDriverDashboardController.getPacketandMeeting(obj_driver_contact[0].Id);
        ManagerDriverDashboardController.getCompliance(obj_driver_contact[0].Id);
        ManagerDriverDashboardController.getMileages(monthName,'2019',obj_driver_contact[0].Id);
        ManagerDriverDashboardController.TimeAttendance(obj_driver_contact[0].Id,'2021');
        ManagerDriverDashboardController.getMileagesBasedTandAtt(String.valueOf(System.today()),String.valueOf(System.today()+1),string.valueOf(obj_driver_contact[0].Id));
        ManagerDriverDashboardController.biweeklyMileage(string.valueOf(obj_driver_contact[0].Id),2021);
        ManagerDriverDashboardController.getBiweekMileages(String.valueOf(System.today()),String.valueOf(System.today()+1),string.valueOf(obj_driver_contact[0].Id));
        ManagerDriverDashboardController.ApproveBiweekMileages(String.valueOf(System.today()),String.valueOf(System.today()+1),string.valueOf(obj_driver_contact[0].Id));
        ManagerDriverDashboardController.UpdateReimbursementStatus(obj_Employee_Reimbursement_List[0].Id);
        }
        Test.stopTest();
    }
}