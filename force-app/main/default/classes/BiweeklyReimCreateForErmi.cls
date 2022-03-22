/*************************************************************************************
* Author :- GetOnCRM Solutions														 *	
* Created Date:- 02/02/2022														 	 *
* Description :- This Class is used to Create Weekly Reim for Ermi Account. 		 *										 
* ---------------------------------------------------------------------------------- *
* Updated By :- Paras Dhanani || updated on 03/02/2022								 *														     
**************************************************************************************/

Global class BiweeklyReimCreateForErmi Implements Database.Batchable<sObject> ,  database.stateful {
    
    Public date myDate;
    Public  date dateStr;
    Public string tempYear;
    Public string accId;
    List<IRS_Mileage_Rate__c> objIRSRate;
    
    global BiweeklyReimCreateForErmi(){
        myDate = system.today();
        accId = System.Label.ERMI_Account;
        tempYear = String.valueOf(date.today().Year());
        objIRSRate = [SELECT id,year__c,IRS_Rate__c FROM IRS_Mileage_Rate__c Where year__c =: tempYear Limit 1];
    }
    
    Global List<Contact> start(Database.BatchableContext bc)	{
        List<Contact> conList = new List<Contact>();
        if(!Test.isRunningTest()){
            conList = [SELECT Id,name,Role__c,Fixed_Amount__c, Maintenance_and_Tires__c, MPG__c,Account.Pay_Period_Start_Date__c, 
                       Account.Pay_Period_Days__c 
                       FROM contact 
                       where AccountId =: accId //AccountId = '0013r00002ZUkzU'  
                       AND Role__c != 'Admin' 
                       AND Role__c != 'Manager' 
                       AND Deactivated_Date__c = NULL 
                       AND Account.isUsingTriplog__c = true
                       AND Driver_Type__c != 'Driver - Salary'
                       AND Activation_Date__c <=: myDate];
        } else {
            conList = [SELECT Id,name,Role__c,Fixed_Amount__c, Maintenance_and_Tires__c, MPG__c,Account.Pay_Period_Start_Date__c, 
                       Account.Pay_Period_Days__c 
                       FROM contact 
                       WHERE Role__c != 'Admin' 
                       AND Role__c != 'Manager'];
        }
        system.debug('conList'+conList);
        return conList; 
    }
    
    Global void execute(Database.BatchableContext BC, list<contact> conList)	{
        Decimal days;
       /* for(account acc : [SELECT id,name,Pay_Period_Start_Date__c, Pay_Period_Days__c FROM Account WHERE Bi_Weekly_Pay_Period__c = true and id = : accId]){
            days = (acc.Pay_Period_Days__c != null ? acc.Pay_Period_Days__c : null);
        }
       */ 
        for(contact conListobj : conList){
            days = (conListobj.account.Pay_Period_Days__c != null ? conListobj.account.Pay_Period_Days__c : null);
        }
        string startdate = string.valueOf(system.today().adddays(1));
        string[] splitsdate = startDate.split('-');
        string splitStartDate = splitsdate[1]+'/'+splitsdate[2]+'/'+splitsdate[0];
        String enddate = String.valueof(date.valueof(startDate).addDays(Integer.valueof(days)));
        string[] splitdate = enddate.split('-');
        string splitEndDate = splitdate[1]+'/'+splitdate[2]+'/'+splitdate[0];
        
        List<Bi_Weekly_Reimbursement__c> biweeklyreimToInsert   = new List<Bi_Weekly_Reimbursement__c>();
        MAP<Id,Bi_Weekly_Reimbursement__c> accMap = new MAP<Id,Bi_Weekly_Reimbursement__c>();
        for(contact con :  (List<Contact>) conList) {
            Bi_Weekly_Reimbursement__c br = new Bi_Weekly_Reimbursement__c();
            br.Name = splitStartDate + ' to ' + splitEndDate ; 
            br.Contact__c = con.Id;
            br.Start_Date__c = date.parse(splitStartDate);
            br.End_Date__c = date.parse(splitEndDate);
            br.MPG__c = con.MPG__c;
            br.Maintenance_and_Tires__c = con.Maintenance_and_Tires__c;
            br.Fixed_Amount__c = con.Fixed_Amount__c;
            br.Status__c = 'Pending';
            br.Fuel_Price__c = 0;
            if(!objIRSRate.isEmpty()){
                br.IRS_Mileage_Rate__c = objIRSRate[0].ID;
            }
            biweeklyreimToInsert.add(br);
        }
        accMap.putall(biweeklyreimToInsert);
        if(!accMap.isEmpty() && !Test.isRunningTest()) {
            insert accmap.values();
        }
    } 
    Global void finish(Database.BatchableContext BC){}   
}