// AuditTrailCreate and SendEmailWhenContactInserted
trigger ContactTrigger on Contact (after Update, after insert, before insert, before update) {
    public string name;
    public string accountId;
        if(Trigger.isUpdate && Trigger.isAfter && checkRecursive.runOnce()) {
            Map<String,String> managerNames = new Map<String,String>();
            set<String> contactOldIdList = new set<String>();
            Map<String,String> contactInfo = new Map<String,String>();
            Map<String,String> accountInfo = new Map<String,String>();
            for(Contact currentContact : Trigger.New) {
                if(currentContact.Manager__c!=Trigger.oldMap.get(currentContact.id).Manager__c) {
                    name = currentContact.FirstName + ' '+ currentContact.FirstName;
                    accountId = currentContact.AccountId;
                    contactOldIdList.add(currentContact.Manager__c);
                    contactOldIdList.add(Trigger.oldMap.get(currentContact.id).Manager__c);
                }
                
                if(currentContact.Phone != Trigger.oldMap.get(currentContact.id).Phone && String.isNotBlank(currentContact.Triplog_UserID__c)) {
                    contactInfo.put(currentContact.Triplog_UserID__c, currentContact.Phone);
                }
            }   
            for(Contact currentContact : [SELECT id,Triplog_UserID__c,Account.Triplog_API__c FROM Contact WHERE Triplog_UserID__c =: contactInfo.keySet() AND Account.isUsingTriplog__c = true]) {
                accountInfo.put(currentContact.Triplog_UserID__c,currentContact.Account.Triplog_API__c);
            }

            if(contactOldIdList.size() > 0 ) {
                for(Contact currentContact : [SELECT id,name FROM Contact WHERE ID IN:contactOldIdList]) {
                    managerNames.put(currentContact.id,currentContact.name);
                }
            }        
            ContactTriggerHelper.TrackHistory(Trigger.oldMap,Trigger.new,managerNames);
            if(contactInfo.size() > 0 && accountInfo.size()>0){
                ContactTriggerHelper.putHTTPUpdateUserPhoneTriplog(contactInfo,accountInfo);
            }
            ContactTriggerHelper.updateComplianceStatus(Trigger.New, Trigger.oldMap);
            ContactTriggerHelper.createReimRecord(Trigger.New, Trigger.oldMap);

            
          /* EMC - 333
             This is used when driver is insert automatically driver packet is added in file section of that driver
     		 from his Account's file section.
		   */ 
            if(Trigger.isAfter){
                if(Trigger.isInsert || Trigger.isUpdate){
                    TriggerConfig__c customSettingForFile = TriggerConfig__c.getInstance('Defaulttrigger');
                    if(customSettingForFile.insertDriverAggrementFile__c == true){
                    ContactTriggerHelper.insertDriverAggrementFile(Trigger.newmap);
                    }
                }
            }
        }
        
        if(Trigger.isInsert && trigger.isAfter) {
            //helper class for single email but bulk messages
            TriggerConfig__c customSetting = TriggerConfig__c.getInstance('Defaulttrigger');
            if(customSetting.ContactTriggersendEmailForNewContact__c){
                ContactTriggerHelper.sendEmailForNewContact(Trigger.new);
            }
            ContactTriggerHelper.CommunityUserCreate(Trigger.new);
            if(customSetting.ContactTriCommunityReimCreate__c == true){
                ContactTriggerHelper.CommunityReimCreate(Trigger.new);
            }
          /* EMC - 333
             This is used when driver is insert automatically driver packet is added in file section of that driver
     		 from his Account's file section.
		   */
            if(Trigger.isAfter){
                if(Trigger.isInsert || Trigger.isUpdate){
                    TriggerConfig__c customSettingForFile = TriggerConfig__c.getInstance('Defaulttrigger');
                    if(customSettingForFile.insertDriverAggrementFile__c == true){
                    ContactTriggerHelper.insertDriverAggrementFile(Trigger.newmap);
                    }
                }
            } 
        }
        
        if(Trigger.isBefore && checkRecursive.runSecondFlag()) {
            ContactTriggerHelper.populatestaticValue(Trigger.New);
        }
        
        if(Trigger.isInsert && Trigger.isBefore) {
            for(Contact currentContact : Trigger.new) {   
                    if(currentContact.Role__c == 'Admin' || currentContact.Role__c == 'Manager'){
                        currentContact.Meeting__c = '';
                        currentContact.Packet__c = '';
                    }
                    name = currentContact.FirstName + ' '+ currentContact.FirstName;
                    accountId = currentContact.AccountId;
                    if(currentContact.External_Email__c != null) {
                        name = currentContact.FirstName + ' '+ currentContact.FirstName;
                        accountId = currentContact.AccountId;
                        currentContact.Email = currentContact.External_Email__c.toLowerCase();
                    }
                }
            ContactTriggerHelper.CheckVehicalYearAndModel(Trigger.new);
        } else if(Trigger.isBefore && Trigger.isUpdate) {
            List<Contact> updateContactList = new List<Contact>();
            for(Contact currentContact : Trigger.New) {
                name = currentContact.FirstName + ' '+ currentContact.FirstName;
                accountId = currentContact.AccountId;
                if(currentContact.Role__c == 'Driver' || currentContact.Role__c == 'Driver/Manager' || currentContact.Role__c == StaticValues.roleAdminDriver) {
                    if((String.isNotBlank(Trigger.oldMap.get(currentContact.id).Vehicle_Type__c) && String.isNotBlank(currentContact.Vehicle_Type__c) && (currentContact.Vehicle_Type__c!=Trigger.oldMap.get(currentContact.id).Vehicle_Type__c))) {
                        updateContactList.add(currentContact);
                        system.debug('insert into 2ns if');
                    }  else if(String.isBlank(currentContact.Vehicle_Type__c)) {
                        currentContact.addError('Please Enter Valid Standard Vehicle Make Model and Year');
                    } else {
                        updateContactList.add(currentContact);
                    }
                    name = currentContact.FirstName + ' '+ currentContact.FirstName;
                    accountId = currentContact.AccountId;
                }            
            }
            if(updateContactList.size()>0 && !Test.isRunningTest()) {
                ContactTriggerHelper.CheckVehicalYearAndModel(updateContactList);
            }
            updateContactList = new List<Contact>();
            for(Contact currentContact : Trigger.New) {
                name = currentContact.FirstName + ' '+ currentContact.FirstName;
                accountId = currentContact.AccountId;
                if(currentContact.External_Email__c!=Trigger.oldMap.get(currentContact.id).External_Email__c) {
                    name = currentContact.FirstName + ' '+ currentContact.FirstName;
                    accountId = currentContact.AccountId;
                    currentContact.Email = currentContact.External_Email__c.toLowerCase();
                }
                /*if(currentContact.MailingState!=Trigger.oldMap.get(currentContact.id).MailingState || currentContact.Driving_States__c!=Trigger.oldMap.get(currentContact.id).Driving_States__c)
                {
                    updateContactList.add(currentContact);
                }*/
            }
        }
}