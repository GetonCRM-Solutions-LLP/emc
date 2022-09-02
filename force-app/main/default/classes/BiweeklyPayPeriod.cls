public with sharing class BiweeklyPayPeriod {
    public BiweeklyPayPeriod() { }

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
        TimeAttedanceWrap  objWrap;
        for(Bi_Weekly_Reimbursement__c biReim : [SELECT id,Start_Date__c, End_Date__c, 
                                                    Total_Drive_Time__c, Total_Stay_Time__c, Total_Time__c, Approved_Date__c 
                                                    FROM Bi_Weekly_Reimbursement__c
                                                    WHERE  Contact__c =: contactid
                                                        AND Start_Date__c >= : Date.valueOf(startdates)
                                                        AND End_Date__c <= : Date.valueOf(enddates)]){
                
                                                            objWrap = new TimeAttedanceWrap();
                objWrap.startDate = startdates;
                objWrap.endDate = enddates;
                objWrap.totaldrivingTime = Utils.ConvertMinuteToHours(Integer.valueOf(biReim.Total_Drive_Time__c));
                objWrap.totalStayTime = Utils.ConvertMinuteToHours(Integer.valueOf(biReim.Total_Stay_Time__c));
                objWrap.totalTime = Utils.ConvertMinuteToHours(Integer.valueOf(biReim.Total_Time__c));
                objWrap.approvalDate = string.valueOf(biReim.Approved_Date__c); 

        }
        /*for(AggregateResult ar : [SELECT EmployeeReimbursement__r.Contact_Id__c cid, SUM(Driving_Time__c) rtotal, 
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
        */
        return objWrap;
    }

    public class TimeAttedanceWrap {
        public string startDate { get; set; }
        public string endDate { get; set; }
        public String totaldrivingTime { get; set; }
        public String totalStayTime { get; set; }
        public String totalTime { get; set; }   
        public String approvalDate { get; set; }
    }
    
    public static List<BiweeklyWrap> getBiweeklyMileage(String contactid,Integer years) {
        system.debug('contactid=='+ contactid);
        system.debug('years=='+ years);
        List<String> startEnddate = new List<String>();
        List<BiweeklyWrap> timeWrapList = new List<BiweeklyWrap>();
        BiweeklyWrap obj;
        List<String> dateRange = new List<String>();
        dateRange = getPayPeriodDates (contactid,years);
        system.debug('dateRange=='+ dateRange);
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
        reimStartMonth = startdate.month() < 10 ?  '0'+String.valueOf(startdate.month())+'-'+startdate.year() : String.valueOf(startdate.month())+'-'+startdate.year();
        reimEndMonth = enddate.month() < 10 ? '0'+String.valueOf(enddate.month())+'-'+enddate.year() : String.valueOf(enddate.month())+'-'+enddate.year();
        for(AggregateResult ar : [SELECT EmployeeReimbursement__r.Contact_Id__c cid,
                                     SUM(Variable__c) vtotal,SUM(Mileage__c) rtotal
                                    FROM Employee_Mileage__c 
                                    WHERE EmployeeReimbursement__r.Contact_Id__c =: contactid 
                                    AND Trip_Date__c >= : Date.valueOf(startdates)
                                    AND Trip_Date__c <= : Date.valueOf(enddates) 
                                    AND Trip_Status__c = 'Approved' 
                                    AND Approved_Date__c != null group by EmployeeReimbursement__r.Contact_Id__c ]) {
                                        variableMap.put((Id)ar.get('cid'),(Decimal)ar.get('vtotal'));  
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
            objWrap.checkPendingTrip = mil.Mileage_Lock_Date__c == null ?  true : false;                          
        }
        objWrap.startDate = startdates.trim();
        objWrap.endDate = enddates.trim();
        if(reimList.size() > 0 ){
            objWrap.fuel = reimList[0].Fuel_Price__c != null ?  String.valueOf(reimList[0].Fuel_Price__c) : '0';
            objWrap.fixedAmount = reimList[0].Half_Fixed_Amount__c != null ?  String.valueOf(reimList[0].Half_Fixed_Amount__c) : '0';
            objWrap.mileage = mileageMap.containskey(contactid) ?  String.valueof(mileageMap.get(contactid)) : '0';
            objWrap.variable = variableMap.containskey(contactid) ?  String.valueof(variableMap.get(contactid)) : '0';
            objWrap.totalReim = variableMap.containskey(contactid) ?  String.valueof(reimList[0].Half_Fixed_Amount__c + variableMap.get(contactid)) : String.valueof(reimList[0].Half_Fixed_Amount__c + 0);           
        }        
        return objWrap;
    }
    
    public class BiweeklyWrap {
        public string biweekId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public String fuel { get; set; }
        public String fixedAmount { get; set; }
        public String mileage { get; set; }
        public String variable { get; set; }
        public String variableRate { get; set; }
        public String totalReim { get; set; }
        public Boolean checkPendingTrip { get; set; }
        public String totalApproved { get; set; }
        public String totalPending { get; set; }
    }
    public static List<BiweeklyWrap> getBiweeklyReimbursement(String contactid,Integer years) {
        List<BiweeklyWrap> timeWrapList = new List<BiweeklyWrap>();

        for(Bi_Weekly_Reimbursement__c biweekReim : [SELECT id,name,Start_Date__c, End_Date__c,Total_Approved__c,Total_Pending__c,
                                                        Fuel_Price__c, Half_Fixed_Amount__c,Status__c,Total_Variable_Rate__c,
                                                        Total_Mileage__c,Total_Monthly_Approved_Variable__c,
                                                        Total_Monthly_Reimbursement__c,Mileage_Lock_Date__c                                             
                                                    FROM Bi_Weekly_Reimbursement__c 
                                                    WHERE Contact__c =:contactid ]){
            if(biweekReim.Start_Date__c != null && biweekReim.Start_Date__c.year() == years){
                
                BiweeklyWrap objWrap = new BiweeklyWrap();
                objWrap.checkPendingTrip = false;
                objWrap.biweekId = biweekReim.id;
                objWrap.startDate = biweekReim.Start_Date__c != null ?  String.valueOf(biweekReim.Start_Date__c) : '';
                objWrap.endDate = biweekReim.End_Date__c != null ?  String.valueOf(biweekReim.End_Date__c) : '';
                objWrap.fuel = biweekReim.Fuel_Price__c != null ?  String.valueOf(biweekReim.Fuel_Price__c) : '0';
                objWrap.fixedAmount = biweekReim.Half_Fixed_Amount__c != null ?  String.valueOf(biweekReim.Half_Fixed_Amount__c) : '0';
                objWrap.variable = biweekReim.Total_Monthly_Approved_Variable__c != null ?  String.valueOf(biweekReim.Total_Monthly_Approved_Variable__c) : '0';
                objWrap.variableRate = biweekReim.Total_Variable_Rate__c != null ?  String.valueOf(biweekReim.Total_Variable_Rate__c) : '0';
                objWrap.totalReim = biweekReim.Total_Monthly_Reimbursement__c != null ?  String.valueOf(biweekReim.Total_Monthly_Reimbursement__c) : '0';
                objWrap.totalApproved = biweekReim.Total_Approved__c != null ?  String.valueOf(biweekReim.Total_Approved__c) : '0';
                objWrap.totalPending = biweekReim.Total_Pending__c != null ?  String.valueOf(biweekReim.Total_Pending__c) : '0';
                objWrap.mileage = biweekReim.Total_Mileage__c != null ?  String.valueOf(biweekReim.Total_Mileage__c) : '0';
                
                /*if(biweekReim.End_Date__c != null && biweekReim.Total_Mileage__c != null && biweekReim.End_Date__c.month() == System.today().month() && biweekReim.End_Date__c.year() == System.today().year()){
                    objWrap.mileage = String.valueOf(biweekReim.Total_Mileage__c );
                } else if(biweekReim.End_Date__c != null && biweekReim.End_Date__c.month() == System.today().month() && biweekReim.End_Date__c.year() == System.today().year()){
                     objWrap.mileage = '0';
                } else if(biweekReim.Total_Approved__c != null){
                    objWrap.mileage = String.valueOf(biweekReim.Total_Approved__c);
                } else {
                    objWrap.mileage = '0';
                }*/              
                objWrap.checkPendingTrip = biweekReim.Status__c == 'Pending' ?  true : false; 
                timeWrapList.add(objWrap);
            }
        }
        return timeWrapList;
    }
    /* This method is used to get Mileage and reimbursement data based on startdate and end date of trips and contact id.
    Author : Sanket Goswami */
    public static List<String> getMileages1(date startdate,date enddate,String contactId)
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
                                                            Total_Time__c,Tag__c,Mileage_Lock_Date__c,Variable_Rate__c 
                                                        FROM Employee_Mileage__c 
                                                        WHERE Trip_Date__c >=: startdate 
                                                            AND Trip_Date__c <=: enddate 
                                                            AND EmployeeReimbursement__r.Contact_Id__c =: contactId ] ;
        System.Debug(employeeMileageList);
        List<String> mileagesList = new List<String>();    
        double mileages=0;
        double variableamount=0;
        List<EmployeeMileages> reimbursementList = new List<EmployeeMileages>();
        for(Employee_Mileage__c currentMileage : employeeMileageList) {
            mileages = mileages + (currentMileage.Mileage__c != null ? currentMileage.Mileage__c : 0);
            variableamount = variableamount + (currentMileage.Variable__c != null ? currentMileage.Variable__c : 0);
            reimbursementList.add(WrapperUtils.getMileagesOfReimbursement(currentMileage));
        }
        mileagesList.add(JSON.serialize(reimbursementList));
        mileagesList.add(String.valueOf(mileages));
        mileagesList.add(String.valueOf(variableamount)); 
        system.Debug(mileagesList[0]);       
        if(mileagesList.size() > 0) {
            return mileagesList;
        } else {
            return mileagesList;
        }
    }
    /* This method is used to get Mileage and biweekly reimbursement data based on biweekly reimbursement Id.
    Author : Sanket Goswami */
    public static List<String> getBiweekMileages1(String biWeekId)
    {
        List<Employee_Mileage__c> employeeMileageList = [SELECT id,Name,Trip_Date__c,Trip_Origin__c,
                                                            Stay_Time__c,Trip_Destination__c,Mileage__c,
                                                            Variable__c,Trip_Status__c,Approved_Date__c,
                                                            Bi_Weekly_Reimbursement__c,Bi_Weekly_Reimbursement__r.month__c,
                                                            Bi_Weekly_Reimbursement__r.Contact__c,CreatedDate,
                                                            Rejected__c,Bi_Weekly_Reimbursement__r.Total_Variable_Rate__c,
                                                            Bi_Weekly_Reimbursement__r.Total_Pending__c,Origin_Name__c,
                                                            Tracing_Style__c,StartTime__c,EndTime__c,Day_Of_Week__c,
                                                            Destination_Name__c,Bi_Weekly_Reimbursement__r.Contact__r.External_Email__c,
                                                            Bi_Weekly_Reimbursement__r.Monthly_Variable_Amount__c,
                                                            Bi_Weekly_Reimbursement__r.Monthly_Approved_Variable_Amount__c,
                                                            Maintenance_and_Tires__c,Fuel_price__c,Activity__c,
                                                            Bi_Weekly_Reimbursement__r.Total_Mileage__c,
                                                            Bi_Weekly_Reimbursement__r.Half_Fixed_Amount__c,
                                                            Bi_Weekly_Reimbursement__r.Total_Rejected__c,Notes__c,
                                                            TimeZone__c,Bi_Weekly_Reimbursement__r.Mileage_Lock_Date__c,
                                                            ConvertedStartTime__c,ConvertedEndTime__c,Driving_Time__c,
                                                            Total_Time__c,Tag__c,Mileage_Lock_Date__c,EmployeeReimbursement__c 
                                                        FROM Employee_Mileage__c 
                                                        WHERE  Bi_Weekly_Reimbursement__c =: biWeekId] ;
        System.Debug(employeeMileageList);
        List<String> mileagesList = new List<String>();    
        double mileages = 0;
        double variableamount = 0;
        List<EmployeeMileages> reimbursementList = new List<EmployeeMileages>();
        for(Employee_Mileage__c currentMileage : employeeMileageList) {
            mileages = mileages + (currentMileage.Mileage__c != null ? currentMileage.Mileage__c : 0);
            variableamount = variableamount + (currentMileage.Variable__c != null ? currentMileage.Variable__c : 0);
            reimbursementList.add(BiWeeklyWrapperUtils.getMileagesOfReimbursement(currentMileage));
        }
        mileagesList.add(JSON.serialize(reimbursementList));
        mileagesList.add(String.valueOf(mileages));
        mileagesList.add(String.valueOf(variableamount)); 
        system.Debug(mileagesList[0]);       
        if(mileagesList.size() > 0) {
            return mileagesList;
        } else {
            return mileagesList;
        }
    }
    /* This method is used to get Mileage and reimbursement data based on startdate and end date of trips and contact id.
    Author : Sanket Goswami */
    public static List<String> getAllBiweekMileages1(date startdate,date enddate,String contactId)
    {
        List<Employee_Mileage__c> employeeMileageList = [SELECT id,Name,Trip_Date__c,Trip_Origin__c,
                                                            Stay_Time__c,Trip_Destination__c,Mileage__c,
                                                            Variable__c,Trip_Status__c,Approved_Date__c,
                                                            Bi_Weekly_Reimbursement__c,Bi_Weekly_Reimbursement__r.month__c,
                                                            Bi_Weekly_Reimbursement__r.Contact__c,CreatedDate,
                                                            Rejected__c,Bi_Weekly_Reimbursement__r.Total_Variable_Rate__c,
                                                            Bi_Weekly_Reimbursement__r.Total_Pending__c,Origin_Name__c,
                                                            Tracing_Style__c,StartTime__c,EndTime__c,Day_Of_Week__c,
                                                            Destination_Name__c,Bi_Weekly_Reimbursement__r.Contact__r.External_Email__c,
                                                            Bi_Weekly_Reimbursement__r.Monthly_Variable_Amount__c,
                                                            Bi_Weekly_Reimbursement__r.Monthly_Approved_Variable_Amount__c,
                                                            Maintenance_and_Tires__c,Fuel_price__c,Activity__c,
                                                            Bi_Weekly_Reimbursement__r.Total_Mileage__c,
                                                            Bi_Weekly_Reimbursement__r.Total_Rejected__c,Notes__c,
                                                            TimeZone__c,Bi_Weekly_Reimbursement__r.Mileage_Lock_Date__c,
                                                            ConvertedStartTime__c,ConvertedEndTime__c,Driving_Time__c,
                                                            Total_Time__c,Tag__c,Mileage_Lock_Date__c,EmployeeReimbursement__c,
                                                            Bi_Weekly_Reimbursement__r.Half_Fixed_Amount__c 
                                                        FROM Employee_Mileage__c 
                                                        WHERE Trip_Date__c >=: startdate 
                                                                AND Trip_Date__c <=: enddate 
                                                                AND Bi_Weekly_Reimbursement__r.Contact__c =: contactId] ;
        System.Debug(employeeMileageList);
        List<String> mileagesList = new List<String>();    
        double mileages = 0;
        double variableamount = 0;
        List<EmployeeMileages> reimbursementList = new List<EmployeeMileages>();
        for(Employee_Mileage__c currentMileage : employeeMileageList) {
            mileages = mileages + (currentMileage.Mileage__c != null ? currentMileage.Mileage__c : 0);
            variableamount = variableamount + (currentMileage.Variable__c != null ? currentMileage.Variable__c : 0);
            reimbursementList.add(BiWeeklyWrapperUtils.getMileagesOfReimbursement(currentMileage));
        }
        mileagesList.add(JSON.serialize(reimbursementList));
        mileagesList.add(String.valueOf(mileages));
        mileagesList.add(String.valueOf(variableamount)); 
        system.Debug(mileagesList[0]);       
        if(mileagesList.size() > 0) {
            return mileagesList;
        } else {
            return mileagesList;
        }
    }
    /* This method is used to approve biweekly reimbursement.
    Author : Sanket Goswami */
    public static string ApproveBiWeekTrips(String biWeekId){
        List<Bi_Weekly_Reimbursement__c> reimToApprove = new List<Bi_Weekly_Reimbursement__c>();
        for(Bi_Weekly_Reimbursement__c mileage : [SELECT id,Approved_Date__c,Status__c 
                                            FROM Bi_Weekly_Reimbursement__c 
                                            WHERE Id =: biWeekId]) {
                                                mileage.Status__c = 'Approved';
                                                mileage.Approved_Date__c = System.today();
            reimToApprove.add(mileage);
        }
        if(reimToApprove.size() > 0 ) {
            update reimToApprove;
        }
        return 'sucess';
    }
    /* This method is used to approve mileages.
    Author : Sanket Goswami */
    public static string ApproveTrips(date startdate,date enddate,String contactId){
        List<String> approvedIdList = new List<String>();
        List<Employee_Mileage__c> mileagesToApprove = new List<Employee_Mileage__c>();
        for(Employee_Mileage__c mileage :[SELECT id,Trip_Status__c,Trip_Date__c
                                            FROM Employee_Mileage__c 
                                            WHERE Trip_Date__c >=: startdate 
                                                AND Trip_Date__c <=: enddate 
                                                AND Trip_Status__c = 'Not Approved Yet'
                                                AND EmployeeReimbursement__r.Contact_Id__c =: contactId ]){
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
    
     public static List<String> getPayPeriodDates (String contactid,Integer years){
        List<String> dateRange = new List<String>();
        String startDate;
        date activationdate;
        List <Contact> conList = [SELECT id,Activation_Date__c,Deactivated_Date__c,Account.Pay_Period_Start_Date__c 
                                        FROM Contact 
                                        WHERE Id =: contactid ];
        if(conList[0].Account.Pay_Period_Start_Date__c != null && conList[0].Activation_Date__c != null){
            startDate = String.valueOf(conList[0].Account.Pay_Period_Start_Date__c);
            activationdate = date.valueOf(conList[0].Activation_Date__c);
        }
        
        for(integer i=0; i<=27; i++ ) {  
            if(years == date.valueof(startDate).year()) {            
                String enddate = String.valueof(date.valueof(startDate).addDays(13));  
                if(  conList.size() > 0 && conList[0].Deactivated_Date__c != null && activationdate != null && ( date.valueof(startdate) < date.valueOf(conList[0].Deactivated_Date__c) ) ) {  
                    //if(date.valueof(startdate) <= activationdate && date.valueof(enddate) >= activationdate){
                    if(activationdate <  date.valueof(enddate)) {
                        dateRange.add(startDate+' to '+ enddate);
                    }                    
                } else if (conList.size() > 0 && conList[0].Deactivated_Date__c == null && (date.valueof(startdate) < Date.today()) ){
                    if(activationdate <  date.valueof(enddate)) {
                        dateRange.add(startDate+' to '+ enddate);
                    }
                }                        
                startDate = String.valueof(date.valueof(enddate).addDays(1));                            
            }
        }
        return dateRange;         
     }
}