@isTest
public class ContactTriggerHelperTest {
    @isTest
    static void sendEmailOnDriverCreateTest() {
        
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        UserRole uRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(uRole.Id);
        User userObj;
        
        Account acc;
        Set<String> accIdList = new Set<String>();
        Set<String> conIdList = new Set<String>();
        List<Contact> con2List;
        List<Contact> conList;
        List<Contact> con1List;
        List<Vehicle_Value__c> vehValue;
         
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'Test',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            acc.Pay_Period_Start_Date__c = System.today().addDays(-100);
            update acc;
            accIdList.add(acc.Id);           
            vehValue = TestDataFactory.createVehicleValue(true, acc.Id, vehicleType.Id);
            
            con1List = TestDataFactory.createDriverContact(false, acc.Id, 'Driver', vehicleType.Name, 'paras.patel',  1);
            con1List[0].compliancestatus__c = 'No – Vehicle Age';
            con1List[0].Deactivated_Date__c = system.today();
            con1List[0].Vehicle_Type__c = vehicleType.Name;
            con1List[0].Vehicle_Value__c = vehValue[0].Value__c;
            con1List[0].Activation_Date__c = system.today();
            Insert con1List[0];
            
            con1List[0].compliancestatus__c = 'Yes';
            con1List[0].Deactivated_Date__c =null;   
            con1List[0].Activation_Date__c = system.today().adddays(-20);        
            update con1List[0];
            
            conList = TestDataFactory.createDriverContact(false, acc.Id, 'Driver', vehicleType.Name, 'paras.dhanani',  1);
            conList[0].Deactivated_Date__c = system.today();
            conList[0].Vehicle_Value__c = vehValue[0].Value__c;
            conList[0].Vehicle_Type__c = vehicleType.Name;
            conList[0].Activation_Date__c = system.today().adddays(-9);   
            Insert conList[0];
            conIdList.add(conList[0].Id);
            
            conList[0].compliancestatus__c = 'No – Vehicle Age';
            update conList[0];
            
            system.assertEquals(1, conList.size(), true);
            userObj = TestDataFactory.createUser(True, profileObj.Id, contactObj.Id);
            
            ContentVersion contentVersion = new ContentVersion(
                Title          = 'Driver Agreement',
                PathOnClient   = 'Driver Agreement.docx',
                VersionData    = Blob.valueOf('Test Content'),
                FirstPublishLocationId = acc.Id,                
                IsMajorVersion = true);
            insert contentVersion;
            
            List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument WHERE Id =: acc.Id];
            if(!documents.isEmpty()){
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.LinkedEntityId = con1List[0].ID;
                cdl.ContentDocumentId = documents[0].Id;
                cdl.ShareType = 'I';
                cdl.Visibility = 'AllUsers';
                insert cdl;
            }
        }     
        Test.startTest();
        
        System.runAs(userObj) {
            Map<String,String> contactInfo = new Map<String,String>();
            Map<String,String> accountInfo = new Map<String,String>();
            contactInfo.put(con1List[0].Triplog_UserID__c, con1List[0].Phone);
            accountInfo.put(con1List[0].Triplog_UserID__c, acc.Triplog_API__c);
            ContactTriggerHelper.putHTTPEnableUserTriplog(con1List[0].Id);
            ContactTriggerHelper.putHTTPUpdateUserPhoneTriplog(contactInfo,accountInfo);
            List<Contact> newCon = new List<Contact>();
            newCon.add(con1List[0]);
            Map<ID, Contact> conOldMap = new Map<ID, Contact>();
            Map<ID, Contact> connewMap = new Map<ID, Contact>();
            conOldMap.put(con1List[0].Id,con1List[0]);
            connewMap.put(con1List[0].Id,con1List[0]);
            ContactTriggerHelper.createReimRecord(newCon ,conOldMap );
            ContactTriggerHelper.updateComplianceStatus(newCon,conOldMap);
            ContactTriggerHelper.TrackHistory(conOldMap,newCon ,accountInfo );
            ContactTriggerHelper.CreateUserFromCommunity (newCon[0], profileObj.ID);
            ContactTriggerHelper.insertDriverAggrementFile (connewMap);
            ContactTriggerHelper.updatePlanParameter(conIdList, accIdList);
        }
        Test.stopTest();
    }     
}