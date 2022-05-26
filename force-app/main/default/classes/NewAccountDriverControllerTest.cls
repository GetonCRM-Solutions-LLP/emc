@istest
public class NewAccountDriverControllerTest {
    @isTest
    public static void newAccountDriverControllerTestMethod() {
        NewDashboardMessage__c newMsgCustomSetting = TestDataFactory.newMsgCustomSetting(True);TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(true, 3);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(True, 'ConfirmTripTimeERMIController');
        SendEmail__c sendEmailSetting = TestDataFactory.sendEmailCustomSetting(True, 'Send Email For Compliance');
        Account accData;
        List<Contact> conList;
        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;

        System.runAs(admin) {

            accData = TestDataFactory.createAccount(False, 'Test Account', False);
            accData.Bodily_Injury__c = '100,000/300,000';
            accData.Property_Damage__c = 50000;
            accData.Collision__c = 1000;
            accData.Comprehensive__c = 1000;
            Insert accData;
            
            conList = TestDataFactory.createDriverContact(False, accData.Id, 'Driver', vehicleType.Name, 'Paras.Patel', 1);
            conList[0].IsCreatedFromCommunity__c = false;
            Insert conList[0];
            TestDataFactory.createUser(true, profileObj.Id, conList[0].Id );
            system.assertEquals(1, conList.size(), true);
        }

        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList = TestDataFactory.createBiweeklyReim(true, conList, system.today().adddays(-15), system.today().addDays(-2), 1, irsRateObj.id);
        system.debug('biWeeklyReimList== ' + biWeeklyReimList);
        Attachment attach = TestDataFactory.createAttachment(true, conList[0].id);
        List<Attachment> attachments = [select id, name from Attachment where parent.id =: conList[0].id];
        List<NewAccountDriverController.ContactWrapper> conWrapList = new List<NewAccountDriverController.ContactWrapper>();
        NewAccountDriverController.ContactWrapper conWrap = new NewAccountDriverController.ContactWrapper();
        conWrap.contactId = string.valueOf(conList[0].Id);
        conWrap.contactName = conList[0].Name;
            conWrap.insuranceId = attach.Id;
            conWrap.contactEmail = conList[0].External_Email__c;
            conWrap.cellPhone = string.valueOf(conList[0].Phone);
            conWrap.accountStatus = 'New Account';
            conWrap.insuranceStatus = 'Uploaded';
            conWrap.driverPacketStatus = 'Uploaded';            
            conWrap.meetingVideoLink = 'www.gmeet.com';
            conWrap.scheduleLink = 'www.gmeetSchedule.com';
            conWrap.bodilyInjury = '100,000/300,000';
            conWrap.unInsuranceMotorist = '1000';
            conWrap.propertyDamage = 50000;
            conWrap.comprehensive = 1000;
            conWrap.collision = 1000;
            conWrap.umbrella = 1000;
            conWrap.mlogApp = true;
            conWrap.checkDriverMeeting = true;
            conWrap.checkActivationDate = true;
            conWrap.daysBetweenActivation = 30;
            conWrapList.add(conWrap);
        Test.startTest();
        NewAccountDriverController.getContactDetail(string.valueOf(conList[0].Id));
        NewAccountDriverController.getDriverDetailsClone(string.valueOf(conList[0].Id));
        NewAccountDriverController.updateContactDetail(JSON.serialize(conWrapList),false);
        NewAccountDriverController.loginRedirection(string.valueOf(conList[0].Id));
        NewAccountDriverController.sendInsuranceEmail(string.valueOf(conList[0].Id),'Test', 'test.account@gmail.com' );
        NewAccountDriverController.sendEmailToDriver( JSON.serialize(conWrapList) , 'Test', string.valueOf(conList[0].Id));
        NewAccountDriverController.sendSignatureRequestForDriver('Paras.dhanani@getoncrm.com', 'Test');
        NewAccountDriverController.getCustomSettings();
        NewAccountDriverController.getCustomSettingsForMessage();
        //NewAccountDriverController.readFromFileInchunk(attach.Body, attach.Name, attach.Id, conList[0], accData.Id, attachments[0].Id);   
        Test.stopTest();

    }
}