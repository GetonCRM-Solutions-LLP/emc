trigger BiWeekReimTrigger  on Bi_Weekly_Reimbursement__c (after update, after insert,before insert) {
    if(Trigger.isUpdate && (checkRecursive.runOnce() || Test.isRunningTest())) {
        BiWeekEmployeeReimbTriggerHandler.mileagefieldupdate(Trigger.New, Trigger.oldMap, Trigger.newMap);
    }
}