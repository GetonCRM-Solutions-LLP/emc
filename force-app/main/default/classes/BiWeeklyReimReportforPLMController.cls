public class BiWeeklyReimReportforPLMController {
    public List<ReibursementWrapper> BiweeklyWrapperList{get;set;}
    public String xlsHeader{
        get{
            String strHeader = '';
            strHeader += '<?xml version="1.0" encoding="UTF-8"?>';
            strHeader += '<?mso-application progid="Excel.Sheet"?>';
            return strHeader;
        }
    }
    public BiWeeklyReimReportforPLMController(){
        BiWeeklyReimbursement();
    }
     public void BiWeeklyReimbursement(){
         //String startDate = '2021-07-28';
         //String endDate = '2021-08-11';
        String startDate = ApexPages.currentPage().getParameters().get('startDate');
        String endDate = ApexPages.currentPage().getParameters().get('endDate');
        String[] month = endDate.split('-');
        String monthValue = month[1]+ '-' +month[0];
         System.debug('monthValue==' +monthValue);
        BiweeklyWrapperList = new List<ReibursementWrapper>();
        Map<Id, Decimal> idVsVariableMap = new Map<Id, Decimal>();
        Map<Id, Decimal> idVsHalfFixedAmountMap = new Map<Id, Decimal>();
        Map<Id, Decimal> idVsHalfReimMap = new Map<Id, Decimal>();
        Map<Id, Decimal> DivisionMap = new Map<Id,decimal>();
        for(AggregateResult ar : [SELECT EmployeeReimbursement__r.Contact_Id__c rid, SUM(Variable__c) rtotal 
                                FROM Employee_Mileage__c 
                                WHERE EmployeeReimbursement__r.Contact_Id__r.AccountId =: System.Label.PLMarketing
                                        AND EmployeeReimbursement__r.Contact_Id__r.Deactivated_Date__c = null
                                        AND Trip_Status__c = 'Approved'
                                        AND Trip_Date__c >= : Date.valueOf(startDate)
                                        AND Trip_Date__c <= : Date.valueOf(endDate) group by EmployeeReimbursement__r.Contact_Id__c]) {
                                            idVsVariableMap.put((Id)ar.get('rid'), (Decimal) ar.get('rtotal')); 
        }
        System.debug('idVsVariableMap=='+ idVsVariableMap);
        for(Employee_Reimbursement__c reimHalfFixedAmount : [SELECT id,Fixed_Amount__c,Half_Fixed_Amount__c,Contact_Id__c,Contact_Id__r.Division__c 
                                        FROM  Employee_Reimbursement__c
                                        WHERE 
                                            Contact_Id__r.AccountId =: System.Label.PLMarketing
                                            AND Month__c =: monthValue]){ 
                                        
                                        DivisionMap.put(reimHalfFixedAmount.Contact_Id__c, reimHalfFixedAmount.Contact_Id__r.Division__c );                                                                                                                               
                                        idVsHalfFixedAmountMap.put(reimHalfFixedAmount.Contact_Id__c, reimHalfFixedAmount.Half_Fixed_Amount__c); 
                                        if(idVsVariableMap.containsKey(reimHalfFixedAmount.Contact_Id__c)){
                                            idVsHalfReimMap.put(reimHalfFixedAmount.Contact_Id__c, idVsVariableMap.get(reimHalfFixedAmount.Contact_Id__c) + reimHalfFixedAmount.Half_Fixed_Amount__c); 
                                        } else {
                                            idVsHalfReimMap.put(reimHalfFixedAmount.Contact_Id__c, 0 + reimHalfFixedAmount.Half_Fixed_Amount__c); 
                                        }                                                              
                                        
                                       } 
                                       System.debug('idVsHalfFixedAmountMap=='+ idVsHalfFixedAmountMap);
         System.debug('DivisionMap=='+ DivisionMap);
            System.debug('idVsHalfReimMap=='+ idVsHalfReimMap);
         for(Contact currentContact : [SELECT id,Employee_ID__c,Name,
                                                External_Email__c,Division__c,
                                                Fixed_Amount__c,Deactivated_Date__c
                                       FROM Contact 
                                       WHERE (Deactivated_Date__c = null or Deactivated_Date__c = THIS_MONTH)
                                       And (Role__c !='Manager' AND Role__c != 'Admin')
                                       AND AccountId =: System.Label.PLMarketing]){
            ReibursementWrapper objWrapper = new ReibursementWrapper();
            objWrapper.ReibursementMonth = monthValue;
            objWrapper.Name = currentContact.Name;
            objWrapper.EmployeeId = currentContact.Employee_ID__c;
            objWrapper.Email = currentContact.External_Email__c;
            if(idVsVariableMap.containsKey(currentContact.Id)){
                objWrapper.BiWeeklyVariableAmount = (idVsVariableMap.get(currentContact.Id)).setScale(2);
            } else {
                objWrapper.BiWeeklyVariableAmount = 0;
            }
            if(idVsHalfFixedAmountMap.containsKey(currentContact.Id)){
                objWrapper.BiWeeklyFixedAmount = (idVsHalfFixedAmountMap.get(currentContact.Id)).setScale(2);
            } else {
                objWrapper.BiWeeklyFixedAmount = 0;
            }
            if(idVsHalfReimMap.containsKey(currentContact.Id)){
                objWrapper.BiWeeklyTotalReim = (idVsHalfReimMap.get(currentContact.Id)).setScale(2);
            } else {
                objWrapper.BiWeeklyTotalReim = 0;
            }
            
            objWrapper.Division = String.valueOf(currentContact.Division__c);
            if(currentContact.Deactivated_Date__c != null && Date.valueOf(startDate) < date.valueOf(currentContact.Deactivated_Date__c)){
                BiweeklyWrapperList.add(objWrapper); 
            } else if(currentContact.Deactivated_Date__c == null){
                BiweeklyWrapperList.add(objWrapper);
            }
            
        }
         system.debug('timeWrapperList=='+BiweeklyWrapperList);
     }
    public class ReibursementWrapper{
        public string ReibursementMonth { get; set; }
        public string Name { get; set; }
        public string EmployeeId { get; set; }
        public string Email { get; set; }
        public Decimal BiWeeklyFixedAmount { get; set; }
        public Decimal BiWeeklyVariableAmount { get; set; }
        public Decimal BiWeeklyTotalReim { get; set; }
        public String Division {get; set;} 
        public ReibursementWrapper(){
        }
    }
}