// AuditTrailCreate and SendEmailWhenContactInserted
trigger ContactTrigger on Contact (after Update, after insert, before insert, before update) {
    public string name;
    public string accountId;
    Public Static Set<String> conList = new Set<String>();
    Public Static Set<String> accList = new Set<String>();
    
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
        
        //357
        for(contact con : Trigger.New){
            if(con.Role__c != null && con.Role__c != 'Manager' && con.Role__c != 'Admin') {
                conList.add(con.Id);
                accList.add(con.AccountId);
            }
        }
        
        Set<String> tmpConIdSet = new Set<String>();
        for(contact con : Trigger.New){
            if(((con.Email != Trigger.oldMap.get(con.ID).Email) || 
                    (con.MobilePhone != Trigger.oldMap.get(con.ID).MobilePhone))
                    || (con.Deactivated_Date__c != Trigger.oldMap.get(con.ID).Deactivated_Date__c ) ){
                tmpConIdSet.add(con.Id);
            }
        }

        Map<Id,Contact> contactIdMap =  new Map<Id, Contact>([select id, MobilePhone,
        Email,Account.True_Dialog__c FROM Contact 
        WHERE id IN: tmpConIdSet AND Account.True_Dialog__c=true ]);

        Set<Id> contactIdSet=contactIdMap.keyset();
        if(contactIdSet.size() > 0){
            TrueDialogContactAPI tdContactApi = new TrueDialogContactAPI(contactIdSet);
            Database.executeBatch(tdContactApi,5);
        }
        If(conList.Size() > 0){
            ContactTriggerHelper.updatePlanParameter(conList, accList);
        }
    }
    
    if(Trigger.isAfter){
        if(Trigger.isInsert ){
            /******************** */  /**Dhanraj Khatri */          
            Set<String> tmpConIdSet = new Set<String>();
            for(contact con : Trigger.New){
                tmpConIdSet.add(con.Id);     
            }   

            Map<Id,Contact> contactIdMap =  new Map<Id, Contact>([select id, MobilePhone,
                                            Email,Account.True_Dialog__c FROM Contact 
                                            WHERE id IN: tmpConIdSet AND Account.True_Dialog__c=true ]);

            Set<Id> contactIdSet=contactIdMap.keyset();            
            TrueDialog_Keys__c tdKeys =TrueDialog_Keys__c.getValues('TrueDialogKeys');			
            if(contactIdSet.size()>0 && !tdKeys.Contact_Insert_From_File__c ){
               TrueDialogContactAPI tdContactApi = new TrueDialogContactAPI(contactIdSet);
               Database.executeBatch(tdContactApi,5);
            }            
            /*********************************** */
            /* EMC - 333
                This is used when driver is insert automatically driver packet is added in file section of that driver
                from his Account's file section.
                */ 
            TriggerConfig__c customSettingForFile = TriggerConfig__c.getInstance('Defaulttrigger');
            if(customSettingForFile.insertDriverAggrementFile__c == true){
                ContactTriggerHelper.insertDriverAggrementFile(Trigger.newmap);
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
        //357        
        for(contact con : Trigger.New){
            if(con.Role__c != null && con.Role__c != 'Manager' && con.Role__c != 'Admin') {
                conList.add(con.Id);
                accList.add(con.AccountId);
            }
        }
       
        If(conList.Size() > 0){
            ContactTriggerHelper.updatePlanParameter(conList, accList);
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
        if(updateContactList.size() > 0 && !Test.isRunningTest()) {
            ContactTriggerHelper.CheckVehicalYearAndModel(updateContactList);
        }
        updateContactList = new List<Contact>();
        for(Contact currentContact : Trigger.New) {
            name = currentContact.FirstName + ' '+ currentContact.FirstName;
            accountId = currentContact.AccountId;
            if(currentContact.External_Email__c != Trigger.oldMap.get(currentContact.id).External_Email__c) {
                name = currentContact.FirstName + ' '+ currentContact.FirstName;
                accountId = currentContact.AccountId;
                currentContact.Email = currentContact.External_Email__c.toLowerCase();
            }            
        }
    }
}