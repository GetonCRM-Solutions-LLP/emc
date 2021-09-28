/**
 * @Author: GetonCRM Solutions LLP
 * @Description: This batch class is use for approve reimbursement from dashboard pages.
 * @Modification logs
 * ========================================================================================================================
 * @Date: 12 June 2021 | Sanket Goswami
 * @description: 
 */
global class ApproveReimBatch implements Database.Batchable<String> {
    public string reimbursements;
    public List<Employee_Reimbursement__c> reimbursementList;
    public ApproveReimBatch(String reim) {
        reimbursements = reim;
    }
    global Iterable<String> start(Database.BatchableContext bc) {
        List<String> employeeReimbursementList = new List<String>();
        reimbursementList = new List<Employee_Reimbursement__c>();
        if(reimbursements!=null && reimbursements!='')
        {
            employeeReimbursementList = (List<String>)Json.deserialize(reimbursements,List<String>.class);
            for(String currentReimbursement : employeeReimbursementList)
            {
                Employee_Reimbursement__c currentReim = new Employee_Reimbursement__c();
                currentReim.id= currentReimbursement;
                currentReim.Reimbursement_Approval__c = true;       
                reimbursementList.add(currentReim);
            }
        }
        if(!reimbursementList.isEmpty())
        {
            update reimbursementList;
        }
        return employeeReimbursementList;
    }
    global void execute(Database.BatchableContext bc, List<String> employeeReimbursementList){
        reimbursementList = new List<Employee_Reimbursement__c>();
        for(String currentReimbursement : employeeReimbursementList)
        {
            Employee_Reimbursement__c currentReim = new Employee_Reimbursement__c();
            currentReim.id= currentReimbursement;
            currentReim.Status__c = 'Approved';
            currentReim.Approved_Date__c = system.today();
            currentReim.Reimbursement_Approval__c = false;             
            reimbursementList.add(currentReim);
        }
        if(!reimbursementList.isEmpty())
        {
            update reimbursementList;
        }
    }
    global void finish(Database.BatchableContext bc){
        // execute any post-processing operations
    }    
}