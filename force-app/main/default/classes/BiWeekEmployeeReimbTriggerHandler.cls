public with sharing class BiWeekEmployeeReimbTriggerHandler {
    public BiWeekEmployeeReimbTriggerHandler() {
    }
    public static Void mileagefieldupdate(List<Bi_Weekly_Reimbursement__c> empReimbursList, Map<Id,Bi_Weekly_Reimbursement__c> empReimburseOld, Map<Id,Bi_Weekly_Reimbursement__c> empReimburseNew) {         
        List<Employee_Mileage__c> mileageUpdatelist = new List<Employee_Mileage__c>();
        Bi_Weekly_Reimbursement__c reimForMil = new Bi_Weekly_Reimbursement__c();
        for(Employee_Mileage__c empmilege : [SELECT id, name, Trip_Status__c, Rejected__c,
                                                    Bi_Weekly_Reimbursement__c,Bi_Weekly_Reimbursement__r.Status__c,
                                                    Approved_Date__c 
                                                FROM Employee_Mileage__c 
                                                WHERE Bi_Weekly_Reimbursement__c IN: empReimbursList
                                                AND Bi_Weekly_Reimbursement__r.Contact__r.Account.Bi_Weekly_Pay_Period__c = true]) {
              
            if(empmilege.Bi_Weekly_Reimbursement__r.Status__c == 'Approved'){
                //this static value is used for bypass from here when MappingGasPriceTrigger is called. this is while 'Mileage update after the lock date' is updated  
                StaticValues.isCalledFromReimTri = false;
                reimForMil = empReimburseNew.get(empmilege.Bi_Weekly_Reimbursement__c);
                if(empmilege.Approved_Date__c == null) {
                    empmilege.Approved_Date__c = reimForMil.Approved_Date__c;
                }
                if(empmilege.Trip_Status__c == StaticValues.noApprovedYet && (empmilege.Trip_Status__c != 'Rejected' || empmilege.Rejected__c == false) ) {
                    empmilege.Trip_Status__c = 'Approved';
                }
                if(empmilege.Rejected__c == true){
                    empmilege.Trip_Status__c = 'Rejected';
                }
                mileageUpdatelist.add(empmilege);
            }
        }
        if(!mileageUpdatelist.isEmpty()) {
            update mileageUpdatelist;    
        }     
    }

    /* This is used to update fields value of count error check as total time based on the Count error check field's value */
    Public Static Void updateCountErrorHoursField (List<Bi_Weekly_Reimbursement__c> biWeeklyReimList){
      //  List<Bi_Weekly_Reimbursement__c> biWeeklyReimforUpdateList = new List<Bi_Weekly_Reimbursement__c>();
        for (Bi_Weekly_Reimbursement__c reim : biWeeklyReimList){
            
                if(reim.Count_Error_Check__c == 0 || reim.Count_Error_Check__c == null) { 
                    reim.Actual_Hours__c = reim.Total_Time__c;
                    reim.Actual_Mileages__c = reim.Total_Mileage__c;
                }   else if(reim.Count_Error_Check__c == 1) {
                        reim.Sync_1_Hours__c = reim.Total_Time__c;
                        reim.Sync_1_Mileages__c= reim.Total_Mileage__c;
                }   else if(reim.Count_Error_Check__c == 2) { 
                        reim.Sync_2_Hours__c = reim.Total_Time__c;
                        reim.Sync_2_Mileages__c = reim.Total_Mileage__c;
                }   else if(reim.Count_Error_Check__c >= 3){
                       // reim.Sync_2_Hours__c = reim.Total_Time__c;
                }
              //  biWeeklyReimforUpdateList.add(reim);            
        }    
    }
}