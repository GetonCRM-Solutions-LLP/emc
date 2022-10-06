global class NewdriverdashboardController {
    global static Map<String,String> reimMap {get;set;}
    global static string contactObj {get;set;}
    global static string chartData {get;set;}
    global static string gasPrice {get;set;}
    global static string contactRole {get;set;}
    global static string unreimbursement {get;set;}
    global static Map<String,String> mileageMap {get;set;}
    global static List<String> reimList {get; set;}
    
    /**
    @author Natavar Ghodasara
    @date 26th Feb 2019
    @description RosterController is Default Constructor.    
    */
    global NewdriverdashboardController () {
        contactObj = getContactDetailsClone(getContactid());
        chartData = getChartData(getContactid());
        unreimbursement = String.escapeSingleQuotes(WrapperUtils.getReimbursementsList(getContactid(),'Approved'));
        List<Contact> conList = [SELECT id,Role__c,Driving_States__c FROM Contact WHERE id =: getContactid() ];
        if(conList.size() > 0){
            contactRole = Json.serialize(String.valueOf(conList[0].Role__c));
        }        
    }
    public static String getAccountid() {
        if(ApexPages.currentPage().getParameters().containsKey('accid') && String.isNotBlank(ApexPages.currentPage().getParameters().get('accid'))) {
           return ApexPages.currentPage().getParameters().get('accid');
        } else {
            return '';
        } 
    }
    public static String getContactid() {
        if(ApexPages.currentPage().getParameters().containsKey('id') && String.isNotBlank(ApexPages.currentPage().getParameters().get('id'))) {
           return ApexPages.currentPage().getParameters().get('id');
        } else {
            return '';
        } 
    }
    public static PageReference getRedirected() {        
        if(getContactid()!=''&& getAccountid()!='') {
            return null;
        } else {
            // redirect to error page
            return null;
        }        
    }

    global static String getReimbursementsList() {   
         return String.escapeSingleQuotes(WrapperUtils.getReimbursementsList(getContactid(),'Approved'));
    }
    
    @RemoteAction
    global static string getContactDetailsClone(String contactid) { 
        Map<Integer,String> monthNameMap=new Map<Integer, String>{01 =>'Jan', 02=>'Feb', 03=>'Mar', 04=>'Apr', 05=>'May',
                                                                    06=>'Jun', 07=>'Jul', 08=>'Aug', 09=>'Sep',10=>'Oct',
                                                                    11=>'Nov', 12=>'Dec'};
        reimMap = new Map<string,string>();
        mileageMap = new Map<string,string>();
        ContactDetails contactObj = new ContactDetails();
        String lastMonth = Utils.fetchMonths(1, 0)[0];
        boolean checkReim = false;
        String contactFixedAmount ;
        for(Employee_Reimbursement__c reim : [SELECT id,Total_Approved__c,Total_Monthly_Reimbursement__c,Variable_Rate__c,
                                                    Year__c,Contact_Id__r.MailingCity,Contact_Id__r.MailingState, 
                                                    Contact_Id__r.MailingPostalCode, Contact_Id__r.Fixed_Amount__c, 
                                                    Contact_Id__r.Driving_States__c, Contact_Id__r.Vehicle_Type__c,
                                                    Contact_Id__r.Car_Image__c, Contact_Id__r.Annual_Total_Approved_Mileage__c,
                                                    Contact_Id__r.Total_reimbursment__c,Contact_Id__r.Account.name,YearMonth__c,
                                                    Contact_Id__r.compliancestatus__c,Contact_Id__r.Account.Logo_Document_Id__c,
                                                    Contact_Id__r.Name,Contact_Id__r.Insurance_Attachment_Id__c,Month__c,Fixed_Amount__c,
                                                    Contact_Id__r.Driver_Type__c,Contact_Id__r.Plan_Years__c,Contact_Id__r.Insurance_Plan__c,
                                                    Contact_Id__r.Compliance_Mileage__c,Contact_Id__r.Vehicle_Value__c,Contact_Id__r.Biweek_Reimbursement__c,
                                                    Contact_Id__r.Insurance_Upload_Date__c,Contact_Id__r.Notification_Message__c,Contact_Id__r.Insurance__c,
                                                    Contact_Id__r.Vehicle_Age__c,Contact_Id__r.Vehicle_Value_Check__c,Contact_Id__r.Mileage_Meet__c
                                                FROM Employee_Reimbursement__c 
                                                 WHERE Contact_Id__c =: contactid
                                                 AND Year__c =: System.today().year()
                                                 order by YearMonth__c desc limit 2]){
             String m = reim.Month__c;
             List<String> monthList = m.split('-');
             reimMap.put(monthNameMap.get(Integer.valueof(monthList[0])), String.valueof(reim.Total_Monthly_Reimbursement__c+'-'+reim.Total_Monthly_Reimbursement__c));
             mileageMap.put(monthNameMap.get(Integer.valueof(monthList[0])), String.valueof(reim.Total_Approved__c+'-'+reim.Total_Approved__c));
             contactFixedAmount = String.valueof(reim.Contact_Id__r.Fixed_Amount__c);
             contactObj.accountName = reim.Contact_Id__r.Account.name;
             contactObj.accountLogo = reim.Contact_Id__r.Account.Logo_Document_Id__c != null ? reim.Contact_Id__r.Account.Logo_Document_Id__c : null;
             contactObj.contactName = reim.Contact_Id__r.Name;
             contactObj.zipCode = reim.Contact_Id__r.MailingPostalCode != null ? reim.Contact_Id__r.MailingPostalCode : null;
             contactObj.city = reim.Contact_Id__r.MailingCity != null ? reim.Contact_Id__r.MailingCity : null;
             contactObj.state = reim.Contact_Id__r.MailingState != null ? reim.Contact_Id__r.MailingState : null;
             contactObj.vehicalType = reim.Contact_Id__r.Vehicle_Type__c ;             
             contactObj.compliancestatus = reim.Contact_Id__r.compliancestatus__c ;
             contactObj.carImage = reim.Contact_Id__r.Car_Image__c ;
             contactObj.insuranceAttchId = reim.Contact_Id__r.Insurance_Attachment_Id__c ;
             contactObj.driverType = reim.Contact_Id__r.Driver_Type__c != null ? reim.Contact_Id__r.Driver_Type__c : null;
             contactObj.annualReim = String.valueof(reim.Contact_Id__r.Total_reimbursment__c) != null ? String.valueof(reim.Contact_Id__r.Total_reimbursment__c) : '0';
             contactObj.annualMileages = String.valueof(reim.Contact_Id__r.Annual_Total_Approved_Mileage__c) != null ? String.valueof(reim.Contact_Id__r.Annual_Total_Approved_Mileage__c) : '0';
             contactObj.planInsurance = String.valueof(reim.Contact_Id__r.Insurance_Plan__c) != null ? String.valueof(reim.Contact_Id__r.Insurance_Plan__c) : null;
             contactObj.complianceMileage = String.valueof(reim.Contact_Id__r.Compliance_Mileage__c) != null ? String.valueof((reim.Contact_Id__r.Compliance_Mileage__c).setScale(2)) : '0';
             contactObj.planYears = String.valueof(reim.Contact_Id__r.Plan_Years__c) != null ? String.valueof(reim.Contact_Id__r.Plan_Years__c) : '0';
             contactObj.vehicleValue = String.valueof(reim.Contact_Id__r.Vehicle_Value__c) != null ? String.valueof(reim.Contact_Id__r.Vehicle_Value__c) : '0';
             contactObj.insuranceDate = reim.Contact_Id__r.Insurance_Upload_Date__c != null ? reim.Contact_Id__r.Insurance_Upload_Date__c : null;
             contactObj.drivingState = reim.Contact_Id__r.Driving_States__c != null ? reim.Contact_Id__r.Driving_States__c : null;
             contactObj.notimessage = reim.Contact_Id__r.Notification_Message__c != null ? reim.Contact_Id__r.Notification_Message__c : null;
             contactObj.vehicleage = reim.Contact_Id__r.Vehicle_Age__c != null ? reim.Contact_Id__r.Vehicle_Age__c : null;
             contactObj.vehiclevaluecheck = reim.Contact_Id__r.Vehicle_Value_Check__c != null ? reim.Contact_Id__r.Vehicle_Value_Check__c : null;
             contactObj.mileagemeet = reim.Contact_Id__r.Mileage_Meet__c != null ? reim.Contact_Id__r.Mileage_Meet__c : null;
             contactObj.insurance = reim.Contact_Id__r.Insurance__c != null ? reim.Contact_Id__r.Insurance__c : null;
             contactObj.biWeekContact = reim.Contact_Id__r.Biweek_Reimbursement__c != null ? reim.Contact_Id__r.Biweek_Reimbursement__c : false;
             if(reim.Month__c != null && reim.Month__c == lastMonth){
                 contactObj.fixedAmount = String.valueof(reim.Fixed_Amount__c) != null ? String.valueof((reim.Fixed_Amount__c).setScale(2)) : null;
                 contactObj.variableRate = String.valueof(reim.Variable_Rate__c) != null ? String.valueof(reim.Variable_Rate__c) : null;
             } else if(checkReim == false){                 
                 contactObj.fixedAmount = String.valueof(reim.Fixed_Amount__c) != null ? String.valueof((reim.Fixed_Amount__c).setScale(2)) : null;
                 contactObj.variableRate = String.valueof(reim.Variable_Rate__c) != null ? String.valueof(reim.Variable_Rate__c) : null;
                 checkReim = true;
             }
             
        }
        if(contactObj.biWeekContact == true){
            for(Bi_Weekly_Reimbursement__c  biWeek : [SELECT id,Half_Fixed_Amount__c FROM Bi_Weekly_Reimbursement__c where End_Date__c != null and End_Date__c <= TODAY  and Contact__c  =: contactid order by End_Date__c desc limit 1]){
                contactObj.fixedAmount = String.valueof(biWeek.Half_Fixed_Amount__c );
            }
        }
        if(contactObj.fixedAmount == null){
            contactObj.fixedAmount = contactFixedAmount;
        }
        gasPrice = WrapperUtils.getDriverGasPrice(contactObj.state,contactObj.city);
        return JSON.serialize(contactObj).unescapeHtml4();      
    }

    @RemoteAction
    global Static String getAllReimbursements(String year,String did,String accid) {       
        return String.escapeSingleQuotes(WrapperUtils.getAllReimbursements(year,did,accid));
    }
    
    @RemoteAction
    global static String getChartData(String contactid) { 
        Map<Integer,String> monthNameMap = new Map<Integer, String>{01 =>'Jan', 02=>'Feb', 03=>'Mar', 04=>'Apr', 05=>'May',
                                                                    06=>'Jun', 07=>'Jul', 08=>'Aug', 09=>'Sep',10=>'Oct',
                                                                    11=>'Nov', 12=>'Dec'};
        List<ReibursementWrapper> wrapList = new List<ReibursementWrapper>();
        List<Contact> conList = [SELECT id,Account.Start_Graph_Month__c,Activation_Date__c FROM contact WHERE id =:contactid ];
        Integer startMonth;
        if(conList[0].Activation_Date__c != null && conList[0].Activation_Date__c.Year() == system.today().year()){
            startMonth = conList[0].Activation_Date__c != null ? conList[0].Activation_Date__c.month() : 1;
        } else {
            startMonth = 1;
        }
        String graphMonth;
        if(conList[0].Account.Start_Graph_Month__c != null){
                        graphMonth = conList[0].Account.Start_Graph_Month__c;
        }
        List<String> monthList = new List<String>();
        if(graphMonth != null && graphMonth == 'Jan'){
            for(integer i = 1;i <=12;i++){
                        monthList.add( ( i < 10 ? '0' : '' ) + i + '-' + system.today().year());
            }
        } else if(graphMonth != null && graphMonth == 'Dec'){
            Integer year = Date.today().year() - 1;
            monthList.add('12-'+year);
            for(integer i = 1;i <=11;i++){
                        monthList.add( ( i < 10 ? '0' : '' ) + i + '-' + system.today().year());
            }                        
        }
        Map<Integer,Decimal> milMap = new Map<Integer,Decimal>();
        Map<Integer,Decimal> reimMap = new Map<Integer,Decimal>();
        for(Employee_Reimbursement__c reim : [SELECT Id,Month__c,
                                                    Total_Approved_Pending_Mileage__c,
                                                    Total_Monthly_Reimbursement__c 
                                                FROM Employee_Reimbursement__c
                                                WHERE Contact_Id__c =: contactid ]) {
            String m = reim.Month__c;
            List<String> monthLis = m.split('-');
            milMap.put(Integer.valueOf(monthLis[0]), reim.Total_Approved_Pending_Mileage__c);
            reimMap.put(Integer.valueOf(monthLis[0]), reim.Total_Monthly_Reimbursement__c);
        }
        Decimal sumMileage = 0;
        Decimal sumReim = 0;
        Map<Integer, Decimal> averageReimMap = new Map<Integer, Decimal>();
        for(Integer i = startMonth ; i <= 12; i++ ){
            sumMileage += milMap.containskey(i) ? milMap.get(i) : 0;
            sumReim += reimMap.containskey(i) ? reimMap.get(i) : 0;
            ReibursementWrapper reimWrap = new ReibursementWrapper();
            reimWrap.month = monthNameMap.get(i);
            reimWrap.mileage = milMap.get(i);
            reimWrap.reimbursement = reimMap.get(i);
            reimWrap.averageMileage = ( sumMileage / i).setScale(2);
            reimWrap.averagereimbursement = ( sumReim / i).setScale(2);
            wrapList.add(reimWrap);
        }
        return JSON.serialize(wrapList);
    }
    public class ReibursementWrapper{
        public string month {get; set;}
        public Decimal mileage {get; set;}
        public Decimal averageMileage {get; set;}
        public Decimal reimbursement {get; set;}
        public Decimal averagereimbursement {get; set;}
    }
    
}