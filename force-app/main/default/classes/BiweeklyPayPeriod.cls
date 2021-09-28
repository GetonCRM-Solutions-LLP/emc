public with sharing class BiweeklyPayPeriod {
    public BiweeklyPayPeriod() {
        
        //getEmployeeMileages();
    }

    /*public static List<MileageWrap> getEmployeeMileages() {
        List<String> dateRange = new List<String>();
        List<String> startEnddate = new List<String>();
        List<MileageWrap> milWrapList = new List<MileageWrap>();
        MileageWrap obj;
        if(System.Label.PayPeriodDate!=null)
        {
            if(System.Label.PayPeriodDate.contains(','))
            {
                dateRange = System.Label.PayPeriodDate.split(',');
            }
            Integer i=0;    
            for(String s : dateRange)
            {
                String startdate;
                String enddate;
                s = s.trim();
                if(s.contains('to'))
                {
                    startEnddate = s.split('to');
                    startdate = startEnddate[0].trim();
                    enddate = startEnddate[1].trim();
                    String contactid = '0033r00003f3UaKAAU';
                    Date d1 = Date.today();
                    Date d2 = date.valueof(startdate);
                    if(d2 < d1){
                        obj = calculateReim(startdate,enddate,contactid);
                        milWrapList.add(obj);
                    }
                    
                }
                
            }
        }
        System.debug('milWrapList=='+milWrapList);
        return milWrapList;
    }*/

    /*public static MileageWrap calculateReim (String startdate,String enddate,String contactid){
        List<mileageWrap> milWrapList = new List<mileageWrap>();
        Map<Id, Decimal> mileageMap = new Map<Id, Decimal>();
        Map<Id, Decimal> fixedAmountMap = new Map<Id, Decimal>();
        //Map<Id, Decimal> totalVariAmountMap = new Map<Id, Decimal>();
        Decimal fuelprice ;
        Decimal fixed;
        Decimal totalVariableRate;
        Decimal monthlyVariableAmount;
        for(Employee_Mileage__c objMil : [SELECT EmployeeReimbursement__r.Contact_Id__c,
                                                    EmployeeReimbursement__r.Fixed_Amount__c, 
                                                    EmployeeReimbursement__r.Total_Variable_Rate__c,
                                                    EmployeeReimbursement__r.Fuel_Price__c,
                                                    Mileage__c
                                            FROM Employee_Mileage__c 
                                            WHERE   EmployeeReimbursement__r.Contact_Id__c =: contactid
                                                    AND Trip_Date__c >= : Date.valueOf(startDate)
                                                    AND Trip_Date__c <= : Date.valueOf(endDate)
                                                    //AND Trip_Status__c = 'Approved' 
                                                    //AND Approved_Date__c != null
                                          ]) {

            
            fuelprice = objMil.EmployeeReimbursement__r.Fuel_Price__c;
            
            fixed = objMil.EmployeeReimbursement__r.Fixed_Amount__c;
            totalVariableRate = objMil.EmployeeReimbursement__r.Total_Variable_Rate__c;

            if(mileageMap.size() > 0 && mileageMap.containsKey(objMil.EmployeeReimbursement__r.Contact_Id__c)){
                double mileage = mileageMap.get(objMil.EmployeeReimbursement__r.Contact_Id__c);
                mileage = mileage + objMil.Mileage__c ;
                mileageMap.put(objMil.EmployeeReimbursement__r.Contact_Id__c, mileage);
            } else {
                mileageMap.put(objMil.EmployeeReimbursement__r.Contact_Id__c, objMil.Mileage__c);
            }

        }
        
        MileageWrap milObj = new MileageWrap();
        milObj.dates = startdate +' to '+ enddate;
        if(fuelprice == null){
            fuelprice = 0;
        }
        milObj.fuel = fuelprice;
        System.debug('mileageMap=='+mileageMap);
        if(mileageMap.containsKey(contactid)){
            milObj.approvemileage = mileageMap.get(contactid);
           
        } else {
           
            milObj.approvemileage = 0;
        }
        if(totalVariableRate == null){
            totalVariableRate = 0;
        }
        milObj.totalvariable = totalVariableRate;
        milObj.fixedamount = fixed;
        monthlyVariableAmount = milObj.approvemileage * milObj.totalvariable;
        if(monthlyVariableAmount == null){
            monthlyVariableAmount = 0;
        }
        if(milObj.fixedamount == null){
            milObj.fixedamount = 0;
        }
        milObj.totalReim = monthlyVariableAmount + milObj.fixedamount;
        System.debug(milObj);
        return milObj;
    }*/

    public static List<TimeAttedanceWrap> getTimeAndAttendance(String contactid,String year) {
        List<String> dateRange = new List<String>();
        List<String> startEnddate = new List<String>();
        List<TimeAttedanceWrap> timeWrapList = new List<TimeAttedanceWrap>();
        TimeAttedanceWrap obj;
        String payPeriodDate;
        if(year == '2021' && System.Label.PayPeriodDate2021 != null) {
            payPeriodDate = System.Label.PayPeriodDate2021;
        } else if(year == '2022' && System.Label.PayPeriodDate2022 != null) {
            payPeriodDate = System.Label.PayPeriodDate2022;
        } else if(year == '2020' && System.Label.PayPeriodDate2020 != null) {
            payPeriodDate = System.Label.PayPeriodDate2020; 
        }
        if(payPeriodDate != null)
        {
            if(payPeriodDate.contains(','))
            {
                dateRange = payPeriodDate.split(',');
            }
            Integer i = 0;    
            for(String s : dateRange)
            {
                String startdate;
                String enddate;
                s = s.trim();
                if(s.contains('to'))
                {
                    startEnddate = s.split('to');
                    startdate = startEnddate[0].trim();
                    enddate = startEnddate[1].trim();
                    //String contactid = '0033r00003f3UaKAAU';
                    Date d1 = Date.today();
                    Date d2 = date.valueof(startdate);
                    if(d2 < d1){
                        obj = calculateTimeAtt(startdate,enddate,contactid);
                        timeWrapList.add(obj);
                    }
                }   
            }
        }
        System.debug('timeWrapList=='+timeWrapList);
        return timeWrapList;
    }
    public static TimeAttedanceWrap calculateTimeAtt (String startdates,String enddates,String contactid){
        Map<Id,Decimal> tripdateDrivingTimeMap = new Map<Id,Decimal>();
        Map<Id,Decimal> tripStayTimeMap = new Map<Id,Decimal>();
        Map<Id,Decimal> tripTotalTimeMap = new Map<Id,Decimal>();
        for(AggregateResult ar : [SELECT EmployeeReimbursement__r.Contact_Id__c cid, SUM(Driving_Time__c) rtotal, 
                                        SUM(Stay_Time__c) stay , SUM(Total_Time__c) ttime
                                    FROM Employee_Mileage__c 
                                    WHERE EmployeeReimbursement__r.Contact_Id__c =: contactid 
                                    AND Trip_Date__c >= : Date.valueOf(startdates)
                                    AND Trip_Date__c <= : Date.valueOf(enddates) group by EmployeeReimbursement__r.Contact_Id__c ]) {

                                        tripdateDrivingTimeMap.put((Id)ar.get('cid'),(Decimal)ar.get('rtotal'));
                                        tripStayTimeMap.put((Id)ar.get('cid'),(Decimal)ar.get('stay'));
                                        tripTotalTimeMap.put((Id)ar.get('cid'),(Decimal)ar.get('ttime'));
        }
        TimeAttedanceWrap objWrap = new TimeAttedanceWrap();
        objWrap.startDate = startdates;
        objWrap.endDate = enddates;
        objWrap.totaldrivingTime = Utils.ConvertMinuteToHours(Integer.valueOf(tripdateDrivingTimeMap.get(contactid)));
        objWrap.totalStayTime = Utils.ConvertMinuteToHours(Integer.valueOf(tripStayTimeMap.get(contactid)));
        objWrap.totalTime = Utils.ConvertMinuteToHours(Integer.valueOf(tripTotalTimeMap.get(contactid)));
        return objWrap;
    }
    //Total Variable Rate    * Total Approved   = Monthly Variable Amount
    //Monthly Variable Amount + Fixed Amount = Total Monthly Reimbursement
    /*public class MileageWrap {
        public string dates { get; set; }
        public decimal fuel { get; set; }
        public Decimal approvemileage { get; set; }
        public decimal totalvariable { get; set; }
        public decimal fixedamount { get; set; }
        public decimal totalReim { get; set; }
    }*/

    public class TimeAttedanceWrap {
        public string startDate { get; set; }
        public string endDate { get; set; }
        public String totaldrivingTime { get; set; }
        public String totalStayTime { get; set; }
        public String totalTime { get; set; }
    }
    
    public static List<BiweeklyWrap> getBiweeklyMileage(String contactid,Integer years) {
        List<String> newDateRange = new List<String>();
        List<String> startEnddate = new List<String>();
        List<BiweeklyWrap> timeWrapList = new List<BiweeklyWrap>();
        BiweeklyWrap obj;
        List <Contact> conList = [SELECT id,Deactivated_Date__c FROM Contact WHERE Id =: contactid];
        List<String> dateRange = new List<String>();
        String startDate = '2021-07-25';
        for(integer i=0; i<=dateRange.size(); i++ ){      
            if(years == date.valueof(startDate).year()){                
                String enddate = String.valueof(date.valueof(startDate).addDays(13));
                // if(date.valueof(startdate) < Date.today()) {
                //                 dateRange.add(startDate+' to '+ enddate);
                // }
                if(conList.size() > 0 && conList[0].Deactivated_Date__c != null && ((date.valueof(startdate) < date.valueOf(conList[0].Deactivated_Date__c))) ) {
                    dateRange.add(startDate+' to '+ enddate);
                    System.debug('dateRange1'+dateRange);
                } else if (conList.size() > 0 && conList[0].Deactivated_Date__c == null && (date.valueof(startdate) < Date.today()) ){
                    dateRange.add(startDate+' to '+ enddate);
                    System.debug('dateRange2'+dateRange);
                }
                startDate = String.valueof(date.valueof(enddate).addDays(1));   
            }
        }
    
        if(!dateRange.isEmpty())
        {
            Integer i = 0;    
            for(String s : dateRange)
            {
                String startdate2;
                String enddate2;
                if(s.contains('to'))
                {
                    startEnddate = s.split('to');
                    startdate2 = startEnddate[0];
                    enddate2 = startEnddate[1];
                    //String contactid = '0033r00003f3UaKAAU';
                    Date d1 = Date.today();
                    Date d2 = date.valueof(startdate2);
                    if(d2 < d1){
                        obj = calculateBiweekMil(startdate2,enddate2,contactid);
                        timeWrapList.add(obj);
                    }
                }   
            }
        }
        System.debug('timeWrapList=='+timeWrapList);
        return timeWrapList;
    }
    
    public static BiweeklyWrap calculateBiweekMil (String startdates,String enddates,String contactid){
        Map<Id,Decimal> mileageMap = new Map<Id,Decimal>();
        Map<Id,Decimal> variableMap = new Map<Id,Decimal>();
        Date startdate = date.valueof(startdates);
        Date enddate = date.valueof(enddates);
        String reimStartMonth,reimEndMonth;
        if(startdate.month() < 10 ) {
           reimStartMonth = '0'+String.valueOf(startdate.month())+'-'+startdate.year();
        }
        if(enddate.month() < 10 ) {
           reimEndMonth = '0'+String.valueOf(enddate.month())+'-'+enddate.year();
        }
        for(AggregateResult ar : [SELECT EmployeeReimbursement__r.Contact_Id__c cid,
                                     SUM(Variable__c) vtotal
                                    FROM Employee_Mileage__c 
                                    WHERE EmployeeReimbursement__r.Contact_Id__c =: contactid 
                                    AND Trip_Date__c >= : Date.valueOf(startdates)
                                    AND Trip_Date__c <= : Date.valueOf(enddates) 
                                    AND Trip_Status__c = 'Approved' 
                                    AND Approved_Date__c != null group by EmployeeReimbursement__r.Contact_Id__c ]) {
                                        variableMap.put((Id)ar.get('cid'),(Decimal)ar.get('vtotal'));                      
        }
        for(AggregateResult ar : [SELECT EmployeeReimbursement__r.Contact_Id__c cid, SUM(Mileage__c) rtotal
                                    FROM Employee_Mileage__c 
                                    WHERE EmployeeReimbursement__r.Contact_Id__c =: contactid 
                                    AND Trip_Date__c >= : Date.valueOf(startdates)
                                    AND Trip_Date__c <= : Date.valueOf(enddates)  
                                    group by EmployeeReimbursement__r.Contact_Id__c ]) {
                                        mileageMap.put((Id)ar.get('cid'),(Decimal)ar.get('rtotal'));                     
        }
        List<Employee_Reimbursement__c> reimList = new List<Employee_Reimbursement__c>();
        for(Employee_Reimbursement__c reim : [SELECT id,Half_Fixed_Amount__c,Total_Variable_Rate__c,Fuel_Price__c,
                                                    Total_Mileage__c 
                                                FROM Employee_Reimbursement__c 
                                                WHERE (Month__c =: reimStartMonth OR Month__c =: reimEndMonth)
                                                AND Contact_Id__c =: contactid ]){
            reimList.add(reim);
        }
        BiweeklyWrap objWrap = new BiweeklyWrap();
        objWrap.checkPendingTrip = false;
        for(Employee_Mileage__c mil : [SELECT id,Mileage_Lock_Date__c,Trip_Status__c
                                            FROM Employee_Mileage__c 
                                            WHERE Trip_Status__c = 'Not Approved Yet' 
                                                AND Approved_Date__c = null
                                                AND Trip_Date__c >= : Date.valueOf(startdates)
                                                AND Trip_Date__c <= : Date.valueOf(enddates)
                                                AND EmployeeReimbursement__r.Contact_Id__c =: contactid ]){
            if(mil.Mileage_Lock_Date__c == null){
                objWrap.checkPendingTrip = true;
            }                             
        }
        System.debug('mileageMap'+ mileageMap);
        objWrap.startDate = startdates.trim();
        objWrap.endDate = enddates.trim();
        if(reimList.size() > 0 ){
            objWrap.fuel = String.valueof(reimList[0].Fuel_Price__c);
            objWrap.fixedAmount = String.valueof(reimList[0].Half_Fixed_Amount__c);
            //objWrap.mileage = String.valueof(reimList[0].Total_Mileage__c );
            if(mileageMap.containskey(contactid)){
                objWrap.mileage = String.valueof(mileageMap.get(contactid));
            } else {
                objWrap.mileage = String.valueof(0);
            }
            System.debug(' objWrap.mileage'+ objWrap.mileage);
            if(variableMap.containskey(contactid)){
                objWrap.variable = String.valueof(variableMap.get(contactid));
            } else {
                objWrap.variable = String.valueof(0);
            }
            if(variableMap.containskey(contactid)){
                objWrap.totalReim = String.valueof(reimList[0].Half_Fixed_Amount__c + variableMap.get(contactid));
            } else {
                 objWrap.totalReim = String.valueof(reimList[0].Half_Fixed_Amount__c + 0);
            }
           
        }
        
        return objWrap;
    }
    
    public class BiweeklyWrap {
        public string startDate { get; set; }
        public string endDate { get; set; }
        public String fuel { get; set; }
        public String fixedAmount { get; set; }
        public String mileage { get; set; }
        public String variable { get; set; }
        public String totalReim { get; set; }
        public Boolean checkPendingTrip { get; set; }
    }

    public static List<String> getMileages1(date startdate,date enddate,String did)
    {
       
        //String month = WrapperUtils.getMonthno(clickedMonth);      
        //month = month +'-'+year;
        List<Employee_Mileage__c> employeeMileageList = [SELECT id,Name,Trip_Date__c,Trip_Origin__c,
                                                            Stay_Time__c,Trip_Destination__c,Mileage__c,
                                                            Variable__c,Trip_Status__c,Approved_Date__c,
                                                            EmployeeReimbursement__c,EmployeeReimbursement__r.month__c,
                                                            EmployeeReimbursement__r.Contact_Id__c,CreatedDate,
                                                            Rejected__c,EmployeeReimbursement__r.Total_Variable_Rate__c,
                                                            EmployeeReimbursement__r.Total_Pending__c,Origin_Name__c,
                                                            Tracing_Style__c,StartTime__c,EndTime__c,Day_Of_Week__c,
                                                            Destination_Name__c,EmployeeReimbursement__r.Contact_Id__r.External_Email__c,
                                                            EmployeeReimbursement__r.Monthly_Variable_Amount__c,
                                                            EmployeeReimbursement__r.Total_Monthly_Approved_Variable__c,
                                                            Maintenance_and_Tires__c,Fuel_price__c,Activity__c,
                                                            EmployeeReimbursement__r.Total_Mileage__c,
                                                            EmployeeReimbursement__r.Total_Rejected__c,Notes__c,
                                                            TimeZone__c,EmployeeReimbursement__r.Mileage_Lock_Date__c,
                                                            ConvertedStartTime__c,ConvertedEndTime__c,Driving_Time__c,
                                                            Total_Time__c,Tag__c,Mileage_Lock_Date__c 
                                                        FROM Employee_Mileage__c 
                                                        WHERE Trip_Date__c >=: startdate 
                                                            AND Trip_Date__c <=: enddate 
                                                            AND EmployeeReimbursement__r.Contact_Id__c =: did ] ;
        System.Debug(employeeMileageList);
        List<String> mileagesList = new List<String>();    
        double mileages=0;
        double variableamount=0;
        List<EmployeeMileages> reimbursementList = new List<EmployeeMileages>();
        for(Employee_Mileage__c currentMileage : employeeMileageList)
        {
            mileages = mileages + (currentMileage.Mileage__c != null ? currentMileage.Mileage__c : 0);
            variableamount = variableamount + (currentMileage.Variable__c != null ? currentMileage.Variable__c : 0);
            reimbursementList.add(WrapperUtils.getMileagesOfReimbursement(currentMileage));
        }
        mileagesList.add(JSON.serialize(reimbursementList));
        mileagesList.add(String.valueOf(mileages));
        mileagesList.add(String.valueOf(variableamount)); 
        system.Debug(mileagesList[0]);       
        if(mileagesList.size() > 0) 
        {
            return mileagesList;
        }
        else
        {
            return mileagesList;
        }
    }

    public static string ApproveTrips(date startdate,date enddate,String did){
        List<String> approvedIdList = new List<String>();
        List<Employee_Mileage__c> mileagesToApprove = new List<Employee_Mileage__c>();
        for(Employee_Mileage__c mileage :[SELECT id,Trip_Status__c,Trip_Date__c
                                            FROM Employee_Mileage__c 
                                            WHERE Trip_Date__c >=: startdate 
                                                AND Trip_Date__c <=: enddate 
                                                AND Trip_Status__c = 'Not Approved Yet'
                                                AND EmployeeReimbursement__r.Contact_Id__c =: did ]){
            approvedIdList.add(mileage.id);
        }
        if(approvedIdList.size() > 0 ){
            mileagesToApprove = WrapperUtils.UpdateMileages(approvedIdList,'Approved');
        }
        
        if(mileagesToApprove.size() > 0 ) {
            update mileagesToApprove;
        }
        return 'sucess';
    }
}