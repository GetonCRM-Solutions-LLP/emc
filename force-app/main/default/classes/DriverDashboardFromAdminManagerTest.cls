@isTest
public class DriverDashboardFromAdminManagerTest {
    public static testmethod void driverDashboardFromAdminManagertestMethod() {
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
                
        Test.setCurrentPage(Page.driverdashboardfromadminmanager);
        String adminid = ApexPages.currentPage().getParameters().put('adminid',obj_admin_contact.Id);
        String conId = ApexPages.currentPage().getParameters().put('id',obj_driver_contact[0].Id);
        String accId = ApexPages.currentPage().getParameters().put('accid',obj_acc.Id);        
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
        
        Bi_Weekly_Reimbursement__c br = new Bi_Weekly_Reimbursement__c();
            br.Name = system.today()-13 + ' to ' + system.today() ; 
            br.Contact__c = obj_driver_contact[0].Id;
            br.Start_Date__c = system.today()-13;
            br.End_Date__c = system.today() ;
            br.MPG__c = obj_driver_contact[0].MPG__c;
            br.Maintenance_and_Tires__c = obj_driver_contact[0].Maintenance_and_Tires__c;
            br.Fixed_Amount__c = obj_driver_contact[0].Fixed_Amount__c;
            br.Status__c = 'Pending';
            br.Fuel_Price__c = 0;
        Insert br;
            Test.startTest();
        System.runAs(user_1) {
            DriverDashboardFromAdminManager obj_DriverDashboardFromAdminManager = new DriverDashboardFromAdminManager();
            DriverDashboardFromAdminManager.getAccountid();
            DriverDashboardFromAdminManager.getAdminid();
            DriverDashboardFromAdminManager.getDriverid();
            DriverDashboardFromAdminManager.getRedirected();
            //DriverDashboardFromAdminManager.getLast2Years();
            DriverDashboardFromAdminManager.getAllReimbursements('2019',obj_driver_contact[0].Id,obj_acc.Id);
            DriverDashboardFromAdminManager.getReimbursementsList();
            DriverDashboardFromAdminManager.getReimbursementsListClone(obj_driver_contact[0].Id);
            DriverDashboardFromAdminManager.getCompliance(obj_driver_contact[0].Id);
            DriverDashboardFromAdminManager.getPacketandMeeting(obj_driver_contact[0].Id);
            DriverDashboardFromAdminManager.getMileages('April','2019',obj_driver_contact[0].id);
            DriverDashboardFromAdminManager.getMileages('March','2019',obj_driver_contact[0].id);
            DriverDashboardFromAdminManager.getMileages('February','2019',obj_driver_contact[0].id);
            DriverDashboardFromAdminManager.TimeAttendance(obj_driver_contact[0].id,'2021');
            DriverDashboardFromAdminManager.approveReimbursements('2019',obj_driver_contact[0].Id,obj_acc.Id,JSON.serialize(obj_list));
            DriverDashboardFromAdminManager.postExpenseReimbursement(obj_acc.Id,'04-2020','abc@gmail.com','222');
            DriverDashboardFromAdminManager.UpdateReimbursementStatus(obj_driver_contact[0].Id);
            DriverDashboardFromAdminManager.getMileagesBasedTandAtt(string.valueof(system.today()), string.valueof(system.today()+1), obj_driver_contact[0].Id);
            DriverDashboardFromAdminManager.TimeAttendance(obj_driver_contact[0].Id,'2021');
            //DriverDashboardFromAdminManager.TripCallout(obj_driver_contact[0].Id, '09', '2021', 3.12,0.09, Json.serialize(obj_Employee_Reimbursement_List).Id, 16.50, 'Approved');
            DriverDashboardFromAdminManager.biweeklyMileage(String.valueof(obj_driver_contact[0].Id), 2021);
            //DriverDashboardFromAdminManager.getBiweekMileages('2021-11-12','2021-12-30',obj_driver_contact[0].id);
            DriverDashboardFromAdminManager.getBiweekMileages(string.valueOf(br));
            //DriverDashboardFromAdminManager.ApproveBiweekMileages('2021-11-12','2021-12-30',obj_driver_contact[0].id);
            DriverDashboardFromAdminManager.ApproveBiweekMileages(string.valueOf(br));
            
            //DriverDashboardFromAdminManager.biweeklyMileage(obj_driver_contact.Id[0],'2021');          
         }
        Test.stopTest();
           // DriverDashboardFromAdminManager.approveMileages(JSON.serialize(obj_EmployeeMileages_list1),'April',obj_driver_contact[0].id);
    }
}