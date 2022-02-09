Global class CreateBiweeklyReim Implements Database.Batchable<sObject> ,  database.stateful {
    
    Public date myDate;
    Public  date dateStr;
    Public string tempYear;
    Public string accId;
    List<IRS_Mileage_Rate__c> objIRSRate;
    
    global CreateBiweeklyReim(){
        myDate = system.today();
        accId = System.Label.PLMarketing;
        system.debug('accId=='+ accId);
        tempYear = String.valueOf(date.today().Year());
        objIRSRate = [SELECT id,year__c,IRS_Rate__c FROM IRS_Mileage_Rate__c Where year__c =: tempYear Limit 1];
    }
    
    Global List<Contact> start(Database.BatchableContext bc)	{
        Date myDate = system.today();
        system.debug('myDate'+myDate);
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
        for(contact conListobj : conList){
            days = (conListobj.account.Pay_Period_Days__c != null ? conListobj.account.Pay_Period_Days__c : null);
        }
        /*
        List<String> dateRange = new List<String>();
        for(integer i=0; i<=100; i++ ) {
        string[] splitsdate = startDate.split('-');
        string splitStartDate = splitsdate[1]+'/'+splitsdate[2]+'/'+splitsdate[0];
        String enddate = String.valueof(date.valueof(startDate).addDays(Integer.valueof(days)));
        string[] splitdate = enddate.split('-');
        string splitEndDate = splitdate[1]+'/'+splitdate[2]+'/'+splitdate[0];
        if(date.valueof(enddate) < date.today()){
        dateRange.add(splitStartDate+' to '+ splitEndDate);
        }
        startDate = String.valueof(date.valueof(enddate).addDays(1));
        }
        
        String endDate
        /* List<String> dateRange = new List<String>();
         * do {
        string[] splitsdate = startDate.split('-');
        string splitStartDate = splitsdate[1]+'/'+splitsdate[2]+'/'+splitsdate[0];
        enddate = String.valueof(date.valueof(startDate).addDays(Integer.valueof(days)));
        string[] splitdate = enddate.split('-');
        string splitEndDate = splitdate[1]+'/'+splitdate[2]+'/'+splitdate[0];
        if(date.valueof(enddate) < date.today()){
        dateRange.add(splitStartDate+' to '+ splitEndDate);
        } 
        startDate = String.valueof(date.valueof(enddate).addDays(1));
        } while(enddate <= string.valueOf(System.today()));
        
        system.debug('dateRange=='+ dateRange);
        string[] dateRangeSplit = (dateRange.get(dateRange.size()-1)).split('to');
        string addday = string.valueof(date.parse(dateRangeSplit[1]).adddays(1));
        string[] splitnewStartDate = addday.split('-');
        string finalstartdate = splitnewStartDate[1] + '/' + splitnewStartDate[2] + '/' + splitnewStartDate[0];  
        string newEndDate =  String.valueof(date.parse(finalstartdate).addDays(Integer.valueof(days)));
        string[] splinewEndDate = newEndDate.split('-');
        string finalEnddate = splinewEndDate[1] + '/' + splinewEndDate[2] + '/' + splinewEndDate[0];  
        system.debug('finalstartdate=='+ finalstartdate);
        system.debug('finalEnddate=='+ finalEnddate);
        system.debug('pay period='+finalstartdate + ' to ' + finalEnddate);
        */  
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
        try {
            if(!accMap.isEmpty() && !Test.isRunningTest()) {
                insert accmap.values();
            }
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        }
    } 
    Global void finish(Database.BatchableContext BC){
    } 
}