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
}