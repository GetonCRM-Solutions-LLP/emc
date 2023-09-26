public without sharing class MappingGasPriceTriggerHelper{

    public static void updateConvertedDates(List<Employee_Mileage__c> mileagesList){
        String strTime;
        String endTime;
        Map<String,String> timeZoneMap = new Map<String,String>();
        set<Id> reimIds = new Set<Id>();
        daylight_saving_time_config__c DSTzconfig = daylight_saving_time_config__c.getValues(String.valueOf(System.today().year()));
        
        for(Employee_Mileage__c currentMileage : mileagesList)
        {
            reimIds.add(currentMileage.EmployeeReimbursement__c);
            
            /*if(currentMileage.EmployeeReimbursement__c != null && !timeZoneMap.containsKey(currentMileage.EmployeeReimbursement__c))
            {
                timeZoneMap.put(currentMileage.EmployeeReimbursement__c,currentMileage.EmployeeReimbursement__r.Contact_Id__r.Time_Zone__c);
            }*/
            if(currentMileage.Stay_Time__c != 0 && (currentMileage.Tag__c == 'Admin' || currentMileage.Tag__c == 'admin')){
                currentMileage.Stay_Time__c = 0;
            }
            
            if(currentMileage.Stay_Time__c != 0 && currentMileage.Origin_Name__c != null && currentMileage.Destination_Name__c != null && ((currentMileage.Origin_Name__c).toUppercase() == 'HOME' && (currentMileage.Destination_Name__c).toUppercase() == 'HOME' )){
                currentMileage.Stay_Time__c = 0;
            }
        }
        for(Employee_Reimbursement__c currentReimbursement : [Select id,Contact_Id__r.Time_Zone__c from Employee_Reimbursement__c where id IN: reimIds])
        {
           if(!timeZoneMap.containsKey(currentReimbursement.id))
            {
                timeZoneMap.put(currentReimbursement.id,currentReimbursement.Contact_Id__r.Time_Zone__c);
            } 
        }
        
        for(Employee_Mileage__c currentMileage : mileagesList) {
            if(timeZoneMap.containsKey(currentMileage.EmployeeReimbursement__c)) {
                currentMileage.TimeZone__c = timeZoneMap.get(currentMileage.EmployeeReimbursement__c);
                if(currentMileage.StartTime__c != null) 
                {
                    
                    currentMileage.ConvertedStartTime__c = ConvertDateTimeGMT(currentMileage.StartTime__c, currentMileage.TimeZone__c).addHours(HoursToAdjust(currentMileage.StartTime__c, DSTzconfig, currentMileage.TimeZone__c));
                    system.debug('ConvertedStartTime__c' +  currentMileage.ConvertedStartTime__c);
                    currentMileage.Trip_Date__c = currentMileage.ConvertedStartTime__c.date();
                     system.debug('Tripdate' +  currentMileage.Trip_Date__c);
                    currentMileage.Day_Of_Week__c = currentMileage.ConvertedStartTime__c.format('EEEE');
                    strTime = getConvertTime(currentMileage.ConvertedStartTime__c);
                }
                
                if(currentMileage.EndTime__c != null ) {
                    currentMileage.ConvertedEndTime__c = ConvertDateTimeGMT(currentMileage.EndTime__c, currentMileage.TimeZone__c).addHours(HoursToAdjust(currentMileage.EndTime__c, DSTzconfig, currentMileage.TimeZone__c));
                    System.debug('currentMileage.ConvertedEndTime__c: '+currentMileage.ConvertedEndTime__c);
                    endTime= getConvertTime(currentMileage.ConvertedEndTime__c);
                    System.debug('endTime: '+endTime);
                }
                if(strTime != null && endTime != null){
                    currentMileage.Time_In_High_Risk__c = checkTimeVal(strTime,endTime);
                }                
            }
        } 
    }
    
    public static string getConvertTime(Datetime dt){
        String str;
        System.debug('dt.time(): '+dt.time());
        DateTime convertTime = dt;
        str = convertTime.format('h:mm a','America/Panama');
        System.debug('STR: '+str );
        return str;
    }
    
    public static Boolean checkTimeVal(String strTime, String endTime){
        String startTimeStr;
        String endTimeStr;
        list<String> timeRange = new list<String>{'10 PM','11 PM','12 PM','1 AM','2 AM'};
        
        list<String> lstStrTime = strTime.split('[: ]');
        list<String> lstendTime = endTime.split('[: ]');
        System.debug('lstStrTime : '+lstStrTime);
        System.debug('lstendTime : '+lstendTime );
        
        startTimeStr= lstStrTime [0]+' '+lstStrTime [2] ;
        endTimeStr= lstendTime[0]+' '+lstendTime[2] ;
        
        System.debug('lststartTimeStr : '+startTimeStr);
        System.debug('lstendTimeStr : '+endTimeStr);
        
        if(timeRange.contains(startTimeStr) && timeRange.contains(endTimeStr)){
            System.debug('true');
            return true;
        } else{
            System.debug('false');
            return false;
        }
    }

    public static void updateBiweekReimId(List<Employee_Mileage__c> mileagesList){
        System.debug('***updateBiweekReimId***');
        set<Id> reimIds = new Set<Id>();
        Map<String,String> reimContactID = new Map<String,String>();
        Map<String,Date> reimAccPayDates = new Map<String,Date>();
        Map<String,Integer> reimAccPayDays = new Map<String,Integer>();
        for(Employee_Mileage__c currentMileage : mileagesList) {
            reimIds.add(currentMileage.EmployeeReimbursement__c);
        }
        for(Employee_Reimbursement__c currentReimbursement : [SELECT id, Contact_Id__c,Contact_Id__r.Account.Pay_Period_Start_Date__c,Contact_Id__r.Account.Pay_Period_Days__c FROM Employee_Reimbursement__c WHERE id IN: reimIds])
        {   
            if(!reimContactID.containsKey(currentReimbursement.id)) {
                reimContactID.put(currentReimbursement.id,currentReimbursement.Contact_Id__c);
                reimAccPayDates.put(currentReimbursement.id, currentReimbursement.Contact_Id__r.Account.Pay_Period_Start_Date__c);
                reimAccPayDays.put(currentReimbursement.id,Integer.valueOf(currentReimbursement.Contact_Id__r.Account.Pay_Period_Days__c));
            } 
        }
        for(Employee_Mileage__c currentMileage : mileagesList)
        {
            currentMileage.Bi_Weekly_Reimbursement__c = getBiweekReimId(reimContactID.get(currentMileage.EmployeeReimbursement__c), reimAccPayDates.get(currentMileage.EmployeeReimbursement__c), reimAccPayDays.get(currentMileage.EmployeeReimbursement__c), currentMileage.Trip_Date__c);
        }
    }
    public static string getBiweekReimId (String contactId,Date payStartdate,Integer paydays,Date tripdate){
        System.debug('***getBiweekReimId***');
        String biWeekId;
        Date endDate;
        List<Date> dtList = new list<Date>();
        do {
            endDate = payStartdate.addDays(paydays);
            if(payStartdate <= tripdate && tripdate <= endDate) {
                dtList.add(payStartdate);
                dtList.add(endDate);
            }
            payStartdate = endDate.addDays(1);
        } while(endDate <= System.today());
        System.debug('***dtList***'+dtList);
        if(dtList.size() > 0){
            for(Bi_Weekly_Reimbursement__c biWeekObj: [SELECT id,Start_Date__c, End_Date__c,Contact__c 
                                                    FROM Bi_Weekly_Reimbursement__c 
                                                    WHERE Contact__c =: contactId 
                                                        AND Start_Date__c =: date.valueof(dtList[0])
                                                        AND End_Date__c =: date.valueof(dtList[1])] ) {
                                                            System.debug('***inside for  ***');
                                                            biWeekId = biWeekObj.Id;
            }
        }
        System.debug('***biWeekId***'+biWeekId);
        return biWeekId;
    }
    static Integer getPacificOffset(Integer year, Integer month, Integer day, String timezonestr)
    {
        return TimeZone.getTimeZone(timezonestr)
            .getOffset(Datetime.newInstanceGmt(year, month, day)) /
            (1000 * 60 * 60);
    }

    static DateTime ConvertDateTimeGMT(DateTime dTime, String timeZoneStr)
    {
        String strConvertedDate = dTime.format('MM/dd/yyyy HH:mm:ss', timeZoneStr);
        List<String> dtList = new List<String>( strConvertedDate.split(' ') );
        
        return Datetime.newInstanceGMT(Integer.valueOf(dtList[0].split('/')[2]),Integer.valueOf(dtList[0].split('/')[0]),Integer.valueOf(dtList[0].split('/')[1]),Integer.valueOf(dtList[1].split(':')[0]),Integer.valueOf(dtList[1].split(':')[1]),Integer.valueOf(dtList[1].split(':')[2]));
    }

    static Integer HoursToAdjust(DateTime dateToCompare, daylight_saving_time_config__c DSTconfig, String timeZoneStr) {
        if(Label.Daylight_Saving_TimeZone.Contains(timeZoneStr) && DSTconfig.Start_Date__c < dateToCompare && DSTconfig.End_Date__c > dateToCompare) {
            return 1;
        }
        return 0;
    }

    public static void TrackHistory(Map<ID,Employee_Mileage__c> mileageOld,List<Employee_Mileage__c> mileageNew){

        /*list<AuditTrail__c> newAuditTrialCreate=new list<AuditTrail__c>();
        for(Employee_Mileage__c objMil : mileageNew) {
            if(objMil.id == mileageOld.get(objMil.id).id) {
                if(objMil.Trip_Status__c != mileageOld.get(objMil.id).Trip_Status__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c='Trip Status',Timestamp__c=Datetime.now(),Modifiedby__c=UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c=String.Valueof(objMil.Trip_Status__c),OldValue__c=String.Valueof(mileageOld.get(objMil.id).Trip_Status__c),Employee_Mileage__c = objMil.id));
                if(objMil.Approved_Date__c != mileageOld.get(objMil.Id).Approved_Date__c)
                    newAuditTrialCreate.add(new AuditTrail__c(Field__c='Approval Date',Timestamp__c=Datetime.now(),Modifiedby__c=UserInfo.getFirstName()+' '+UserInfo.getLastName(),NewValue__c=String.valueOf(objMil.Approved_Date__c),OldValue__c=String.valueOf(mileageOld.get(objMil.id).Approved_Date__c),Employee_Mileage__c=objMil.id));
            }
            if(newAuditTrialCreate.Size() > 0)
            upsert newAuditTrialCreate; 
        }*/
        Map<ID,Employee_Mileage__c> oldMileageMap = new Map<ID,Employee_Mileage__c>();
        //Map<ID,Employee_Mileage__c> newMileageMap = new Map<ID,Employee_Mileage__c>();
        list<Employee_Mileage__c> oldMilList= new list<Employee_Mileage__c>();
        //list<Employee_Mileage__c> newMilList = new list<Employee_Mileage__c>();
        
        for(Employee_Mileage__c objMil : mileageNew) {
            if(objMil.id == mileageOld.get(objMil.id).id) {
                if((objMil.Trip_Status__c != mileageOld.get(objMil.id).Trip_Status__c) || (objMil.Approved_Date__c != mileageOld.get(objMil.Id).Approved_Date__c)) {
                    oldMilList.add(mileageOld.get(objMil.id));
                    //newMilList.add(objMil);
                    //UpdateTrackHistory objbatch = new UpdateTrackHistory(mileageOld,mileageNew);
                    //Database.executeBatch(objbatch,200);
                }
            }
        }
        if(oldMilList.size() > 0 ){
            oldMileageMap.putall(oldMilList);
            //newMileageMap.putall(newMilList);
            UpdateTrackHistory objbatch = new UpdateTrackHistory(oldMileageMap,mileageNew);
            Database.executeBatch(objbatch,100);
        }
    }

    public static void updateMileagesLockDate(List<Employee_Mileage__c> mileagesList){
        Set<Id> reimIds = new Set<Id>();
        for(Employee_Mileage__c empMil : mileagesList){
            reimIds.add(empMil.EmployeeReimbursement__c);
        }
        system.debug('reimIds.size()='+reimIds.size());
        Map<Id,Employee_Reimbursement__c> reimMap = new Map<Id,Employee_Reimbursement__c>();
        set<id> conIds = new set<id>();
      
        for(Employee_Reimbursement__c reimObj : [SELECT id,Name,Mileage_Lock_Date__c,Month__c,Contact_Id__c,Contact_Id__r.Name 
                                            FROM Employee_Reimbursement__c 
                                            WHERE Mileage_Lock_Date__c != null 
                                                AND Mileage_Lock_Date__c <=: date.today() 
                                                AND ID IN: reimIds
                                            ]){
            reimMap.put(reimObj.Id,reimObj);
            conIds.add(reimObj.Contact_Id__c);
        }
        Map<string,Id> erNameMap = new Map<string,Id>();
        for(Employee_Reimbursement__c er : [SELECT id,Name,Mileage_Lock_Date__c,Month__c,Contact_Id__c,Contact_Id__r.Name FROM Employee_Reimbursement__c where Contact_Id__c IN:conIds]){
            erNameMap.put(er.Name,er.id);
        }
        list<Employee_Mileage__c> emToUpdate = new list<Employee_Mileage__c>();
        for(Employee_Mileage__c empMil : mileagesList){
            if(empMil.Trip_Status__c == 'Approved' || empMil.Trip_Status__c == 'Rejected'){
                system.debug('empMil='+empMil);
                if(reimMap.containsKey(empMil.EmployeeReimbursement__c)){
                    system.debug('reimMap.containsKey(empMil.EmployeeReimbursement__c)=');
                    string contactName = reimMap.get(empMil.EmployeeReimbursement__c).Contact_Id__r.Name;
                    integer month = integer.valueof((reimMap.get(empMil.EmployeeReimbursement__c).Month__c).split('-')[0])+1;
                    integer year = integer.valueof((reimMap.get(empMil.EmployeeReimbursement__c).Month__c).split('-')[1]);
                    integer nextYear = integer.valueof((reimMap.get(empMil.EmployeeReimbursement__c).Month__c).split('-')[1])+1;
                    
                    if(month<10 ) {
                        contactName = reimMap.get(empMil.EmployeeReimbursement__c).Contact_Id__r.Name+':0'+month+'-'+year;
                        system.debug('month==1-9=='+contactName);
                    } else if( integer.valueof((reimMap.get(empMil.EmployeeReimbursement__c).Month__c).split('-')[0]) == 12){
                        system.debug('Inserted');
                        contactName = reimMap.get(empMil.EmployeeReimbursement__c).Contact_Id__r.Name+':01'+'-'+nextYear;
                        system.debug('contactNamefor12m== '+ contactName);
                    } else {
                        contactName = reimMap.get(empMil.EmployeeReimbursement__c).Contact_Id__r.Name+':'+month+'-'+year;
                        system.debug('else part contactName='+contactName);
                    }
                    
                    System.debug('erNameMap: '+erNameMap);
                    if(erNameMap.containsKey(contactName)) {
                        System.debug('inside Map: '+StaticValues.isCalledFromReimTri);
                        Employee_Mileage__c em = new Employee_Mileage__c();
                        em.id = empMil.id;
                        em.EmployeeReimbursement__c = erNameMap.get(contactName);
                        if(StaticValues.isCalledFromReimTri == true){
                            emToUpdate.add(em);
                            System.debug('emToUpdate: '+emToUpdate);
                        }
                    }   
                }   
            }
        }
        if(!emToUpdate.isEmpty()){
            System.debug('emToUpdate2: '+emToUpdate);
            update emToUpdate;
        }
    }

    /*
    EMC - 1431  
    This method is used to update biweekly reimbursement for approved and rejected mileages 
        while update mileage and Mileage lockdate field is not null and date is less than or equal to today
    */
    public static void updateMilLockDateBWReim(List<Employee_Mileage__c> mileagesList){
        Set<Id> biWeekReimIds = new Set<Id>();
        string contactStartDate;
        Map<Id,Bi_Weekly_Reimbursement__c> reimMap = new Map<Id,Bi_Weekly_Reimbursement__c>();
        set<id> conIds = new set<id>();
        Map<string,Id> erNameMap = new Map<string,Id>();
        
        for(Employee_Mileage__c empMil : mileagesList){
            biWeekReimIds.add(empMil.Bi_Weekly_Reimbursement__c);
        }
        for(Bi_Weekly_Reimbursement__c reimObj : [SELECT id,Name,Mileage_Lock_Date__c,Contact__c,Contact__r.Name,Start_Date__c, End_Date__c 
                                                  FROM Bi_Weekly_Reimbursement__c 
                                                  WHERE Mileage_Lock_Date__c != null
                                                  AND Contact__r.Biweek_Reimbursement__c  = true 
                                                  AND Mileage_Lock_Date__c <=: date.today() 
                                                  AND ID IN: biWeekReimIds
                                                 ]){
                                                     reimMap.put(reimObj.Id,reimObj);
                                                     conIds.add(reimObj.Contact__c);
                                                 }
        if(!conIds.isEmpty()){
            List<Employee_Mileage__c> milList = new List<Employee_Mileage__c>();
            for(Bi_Weekly_Reimbursement__c er : [SELECT id,Name,Mileage_Lock_Date__c,Contact__c,Contact__r.Name,Start_Date__c 
                                                 FROM Bi_Weekly_Reimbursement__c 
                                                 WHERE Contact__c IN:conIds]){
                                                     erNameMap.put(er.Contact__r.Name + '-' + string.valueof(er.Start_Date__c),er.id);
                                                 }
            list<Employee_Mileage__c> emToUpdate = new list<Employee_Mileage__c>();
            for(Employee_Mileage__c empMil : [SELECT id,Trip_Date__c,Trip_Status__c,Bi_Weekly_Reimbursement__c 
                                              FROM Employee_Mileage__c 
                                              WHERE Bi_Weekly_Reimbursement__c =: biWeekReimIds]){
                                                  if(empMil.Trip_Status__c == 'Approved' || empMil.Trip_Status__c == 'Rejected'){
                                                      if(reimMap.containsKey(empMil.Bi_Weekly_Reimbursement__c)){
                                                          contactStartDate = reimMap.get(empMil.Bi_Weekly_Reimbursement__c).Contact__r.Name + '-' + string.valueOf(reimMap.get(empMil.Bi_Weekly_Reimbursement__c).End_Date__c.addDays(1));
                                                          
                                                          if(erNameMap.containsKey(contactStartDate)){
                                                              Employee_Mileage__c em = new Employee_Mileage__c();
                                                              em.id = empMil.id;
                                                              em.Bi_Weekly_Reimbursement__c = erNameMap.get(contactStartDate);
                                                              if(StaticValues.isCalledFromBiWeekReimTri == true){
                                                                  emToUpdate.add(em);
                                                              }
                                                          }
                                                          
                                                      }
                                                  }
                                              }
            
            if(!emToUpdate.isEmpty()){
                update emToUpdate;
            }
        }
    }

    //This method is used for deduction of 30 miles from first and last trip of the day on PL marketing account.
    public static void updateMileages(List<Employee_Mileage__c> mileagesList){
        set<Id> reimbursementIdsSet = new set<Id>();
        List<datetime> tripList = new List<datetime>();
        map<id,Employee_Mileage__c> milmap = new map<id,Employee_Mileage__c>();
        List<datetime> tripListPLStart = new List<datetime>();
        List<datetime> tripListPLEnd = new List<datetime>();
        List<Employee_Mileage__c> mileageList = new List<Employee_Mileage__c>();
        for(Employee_Mileage__c empmilege : mileagesList) {
            reimbursementIdsSet.add(empmilege.EmployeeReimbursement__c); 
        }
        if(!reimbursementIdsSet.isEmpty() && StaticValues.isFirTime ){
            StaticValues.isFirTime = false; 
            for(AggregateResult objReim : [select MIN(ConvertedStartTime__c) from Employee_Mileage__c where EmployeeReimbursement__c =: reimbursementIdsSet  group by Trip_Date__c ]){
                tripListPLStart.add((Datetime)objReim.get('expr0'));
            }
            for(AggregateResult objReim : [select Max(ConvertedEndTime__c) from Employee_Mileage__c where EmployeeReimbursement__c =: reimbursementIdsSet  group by Trip_Date__c ]){
                tripListPLEnd.add((Datetime)objReim.get('expr0'));
            }
            for(Employee_Mileage__c objMil : [SELECT id,ConvertedStartTime__c,Stay_Time__c,Mileage__c,EMP_Mileage__c 
                                                FROM Employee_Mileage__c 
                                                WHERE (ConvertedStartTime__c In : tripListPLStart 
                                                    OR ConvertedEndTime__c In : tripListPLEnd ) 
                                                    AND EmployeeReimbursement__c In : reimbursementIdsSet 
                                                    AND EmployeeReimbursement__r.Contact_Id__r.Account.Name = 'PL Marketing']){
                system.debug('=='+objMil.ConvertedStartTime__c);
                if(objMil.EMP_Mileage__c > 30) {
                                objMil.Mileage__c = objMil.EMP_Mileage__c - 30;
                } else {
                        objMil.Mileage__c = 0;
                }
                mileageList.add(objMil);
            } 
            milmap.putall(mileageList);
            if(milmap.size()>0){
                update milmap.values();
            }
        }
    }
    /*Public Static void updateCanadianMileage(Set<String> milIdList, Map<ID, Employee_Mileage__c> milOldMap){
        List<Employee_Mileage__c> milListUpdate = new List <Employee_Mileage__c>();
        for(Employee_Mileage__c mil : [SELECT id,EmployeeReimbursement__r.Contact_Id__r.Map_Country__c,EMP_Mileage__c,Activity__c,Map_Country__c  
                                            FROM Employee_Mileage__c 
                                       			WHERE Id =: milIdList 
                                      				AND Trip_Status__c = 'Not Approved Yet' ]){
                                                if(mil.Activity__c == 'Business'){
                                                    if(milOldMap.get(mil.id).Map_Country__c != 'CANADA' && mil.Map_Country__c == 'CANADA'){
                                                        mil.EMP_Mileage__c = mil.EMP_Mileage__c * 1.609;
                                                        milListUpdate.add(mil);
                                                    }
                                                }
        }
        if(!milListUpdate.isEmpty()){
            upsert milListUpdate;
        }
    }*/
    Public Static void updateCanadianMileage( Set<String> milIdList){
        system.debug('milIdList=='+ milIdList );
        List<Employee_Mileage__c> milListUpdate = new List <Employee_Mileage__c>();
        for(Employee_Mileage__c mil : [SELECT id,EmployeeReimbursement__r.Contact_Id__r.Map_Country__c,EMP_Mileage__c,Activity__c,Trip_Status__c  
        FROM Employee_Mileage__c 
               WHERE Id =: milIdList 
                  AND Trip_Status__c = 'Not Approved Yet' 
                  AND Activity__c = 'Business'
                  AND EmployeeReimbursement__r.Contact_Id__r.Map_Country__c = 'CANADA']){
                    mil.EMP_Mileage__c = mil.EMP_Mileage__c * 1.609;
                    milListUpdate.add(mil);  
        }
        system.debug('milListUpdate=='+ milListUpdate );
        if(!milListUpdate.isEmpty()){
            update milListUpdate;
        }
    }
}