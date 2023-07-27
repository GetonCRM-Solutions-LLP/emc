trigger BiWeekReimTrigger  on Bi_Weekly_Reimbursement__c (after update, after insert,before insert, before update) {
    TriggerConfig__c customSetting = TriggerConfig__c.getInstance('Defaulttrigger');
    if(Trigger.isAfter && Trigger.isUpdate && (checkRecursive.runOnce())) {
        BiWeekEmployeeReimbTriggerHandler.mileagefieldupdate(Trigger.New, Trigger.oldMap, Trigger.newMap);
        BiWeekEmployeeReimbTriggerHandler.updateConfirmFields(Trigger.New, Trigger.oldMap, Trigger.newMap);
        
    }
    if(Trigger.isBefore) {
        if(Trigger.isInsert || Trigger.isUpdate){
            
            if((customSetting !=null) && customSetting.BiWeeklyReimbursementTrigger__c == true)
            {
                BiWeekEmployeeReimbTriggerHandler.updateCountErrorHoursField(Trigger.New);
            }     
        }
        if(Trigger.isInsert || Trigger.isUpdate){
            if(customSetting.Mileage_Lock_date_on_Reimbursement__c == true) {
                // BiWeekEmployeeReimbTriggerHandler.checkStartAndEndDate(Trigger.New);
            }
        }
    }
}