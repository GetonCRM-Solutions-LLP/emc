trigger mileageremoveapprovaldate on Employee_Mileage__c (before insert , before update, after insert, after delete) {
    
    if(Trigger.isbefore){
        if(Trigger.isInsert || Trigger.isUpdate){
            TriggerConfig__c customSetting = TriggerConfig__c.getInstance('Defaulttrigger');
            if(customSetting.mileageremoveapprovaldate__c == true){
                MileageTriggerHandler.MileageRemoveApprovalDateHandler(Trigger.new);
            }
        }
    }
    // EMC - 339
    if(Trigger.isInsert && Trigger.isAfter) {
        
        TriggerConfig__c trigConfig = TriggerConfig__c.getInstance('Defaulttrigger');
        if(trigConfig.updateWorkingDays__c == true) {
            MileageTriggerHandler.updateWorkingDays(Trigger.new);
        }
    }
    if(Trigger.isafter && Trigger.isdelete) {
        TriggerConfig__c trigConfig = TriggerConfig__c.getInstance('Defaulttrigger');
        if(trigConfig.updateWorkingDays__c == true && Trigger.old != null) {
            MileageTriggerHandler.updateWorkingDays(Trigger.old); 
        }
    }
}