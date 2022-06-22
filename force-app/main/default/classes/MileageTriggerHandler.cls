public class MileageTriggerHandler {
    
    public static void MileageRemoveApprovalDateHandler(List<Employee_Mileage__c> empMileageList) {
        List<Employee_Reimbursement__c> Reimbursementlist = new List<Employee_Reimbursement__c>();
        set<Id> reimbursementApprovalStatusSet = new set<Id>();
        for(Employee_Mileage__c empmilege : empMileageList) {
            if(empmilege.Trip_Status__c == 'Not Approved Yet'){
                reimbursementApprovalStatusSet.add(empmilege.EmployeeReimbursement__c);
                
            }
        }
        for(Employee_Reimbursement__c emp : [SELECT Id,
                                             Status__c,
                                             Approved_Date__c,
                                             Mileage_Lock_Date__c 
                                             FROM Employee_Reimbursement__c 
                                             WHERE Id IN:  reimbursementApprovalStatusSet
                                             AND (Status__c = 'Approved' OR Status__c = 'Rejected') ]){
                                                 if(emp.Mileage_Lock_Date__c == null){
                                                     emp.status__c = 'Pending';
                                                     emp.Approved_Date__c = null;
                                                     Reimbursementlist.add(emp);
                                                 }
                                                 
                                             }
        update Reimbursementlist;
    }
    /* EMC - 339
* Method is used to update Driver's Working hours field located on Employee reimbursement Object
* based on the number of unique trip date for the month. means if there are 20 trips of driver for the 
* month and 15 trips are unique trip date and 5 trips are in sme day trips at that time it is count 5 trips 
* as only one date and onther trips are count individual so the total working days are 15 + 1 = 16.   
*/   
    Public static void updateWorkingDays(List<Employee_Mileage__c> empMileageList) {
        Set<Id> reimIdList = new Set<Id>();
        List<Employee_Reimbursement__c> reimList = new List<Employee_Reimbursement__c>();
        Map<ID, Integer> mapEmpvsMil = new Map<ID, Integer>();
        for(Employee_Mileage__c objem: empMileageList){
            reimIdList.add(objem.EmployeeReimbursement__c);
        }
        for(AggregateResult Arobj: [SELECT EmployeeReimbursement__c,COUNT_DISTINCT(Trip_Date__c) myCount 
                                    FROM Employee_Mileage__c 
                                    WHERE EmployeeReimbursement__c in: reimIdList 
                                    AND Trip_Date__c = THIS_MONTH GROUP by EmployeeReimbursement__c]) {
                                        mapEmpvsMil.put((ID)Arobj.get('EmployeeReimbursement__c'), (Integer)Arobj.get('myCount'));
                                    }
        if(mapEmpvsMil != null && mapEmpvsMil.size() > 0) {
            for( Employee_Reimbursement__c objreim: [SELECT id,Working_Days__c 
                                                     FROM Employee_Reimbursement__c 
                                                     WHERE id in: reimIdList ]){
                                                         objreim.Working_Days__c = mapEmpvsMil.get(objreim.id);
                                                         reimList.add(objreim);
                                                     }
        } else {
            for( Employee_Reimbursement__c objreim: [SELECT id,Working_Days__c 
                                                     FROM Employee_Reimbursement__c 
                                                     WHERE id in: reimIdList ]){
                                                         objreim.Working_Days__c = 0;
                                                         reimList.add(objreim);
                                                     }
        }
        if(reimList != null && reimList.size() > 0) {
            Update reimList;
        }        
    }
}