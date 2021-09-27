@isTest
public class UpdateInsuranceDataController_Test {
    public Static testMethod void Method1(){
            
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
            veh.Year__c = '2019';
            insert veh;
            
            Account acc = new Account();  
            acc.Name = 'test account';
            acc.Vehicle_Types__c = veh.name;
            acc.Triplog_API__c = '123456789';
            Acc.Triplog_Status__c = 'U';
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
            con.Vehicle_Type__c = '2019 Full-Size Sedan';
            //con.Vehicle_Value_Check__c = false;
            insert con;
            
            Test.startTest();
           
            ApexPages.CurrentPage().getParameters().put('ID', acc.Id);
            UpdateInsuranceDataController testAccPlan = new UpdateInsuranceDataController();
            
            list<UpdateInsuranceDataController.ContactWrapper> conWrap = new list<UpdateInsuranceDataController.ContactWrapper>();
           UpdateInsuranceDataController.ContactWrapper wrap = new UpdateInsuranceDataController.ContactWrapper();
            wrap.contactId = con.Id;
            wrap.currentLeval = con.Current_Level__c;
            wrap.expirationDate = String.valueOf(con.Expiration_Date__c);
            wrap.insurance = con.Insurance__c;
            wrap.isEditable = false;
            wrap.meetingMinimum = con.Meeting_Minimum__c;
            wrap.name = con.Name;
            //wrap.vehicleAge = con.Vehicle_Age__c;
            //wrap.vehicleValue = con.Vehicle_Value_Check__c;
            conWrap.add(wrap);
            UpdateInsuranceDataController.editInlineNewEmployee(Json.serialize(conWrap));
            Test.StopTest();
        }
}