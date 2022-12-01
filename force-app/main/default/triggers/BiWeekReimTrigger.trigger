trigger BiWeekReimTrigger  on Bi_Weekly_Reimbursement__c (after update, after insert,before insert, before update) {
    if(Trigger.isAfter && Trigger.isUpdate && (checkRecursive.runOnce())) {
        BiWeekEmployeeReimbTriggerHandler.mileagefieldupdate(Trigger.New, Trigger.oldMap, Trigger.newMap);
    }
    if(Trigger.isBefore) {
        if(Trigger.isInsert || Trigger.isUpdate){
            TriggerConfig__c customSetting = TriggerConfig__c.getInstance('Defaulttrigger');
            if((customSetting !=null) && customSetting.BiWeeklyReimbursementTrigger__c == true)
            {
                BiWeekEmployeeReimbTriggerHandler.updateCountErrorHoursField(Trigger.New);
            }     
        }
    }
}