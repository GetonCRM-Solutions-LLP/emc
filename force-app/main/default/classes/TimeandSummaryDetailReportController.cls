public with sharing class TimeandSummaryDetailReportController {
    public List<mileageWrapper> mileageWrapperList{get;set;}
    public String xlsHeader{
        get{
            String strHeader = '';
            strHeader += '<?xml version="1.0" encoding="UTF-8"?>';
            strHeader += '<?mso-application progid="Excel.Sheet"?>';
            return strHeader;    
        }
    
    }
    public TimeandSummaryDetailReportController() {
        drivingTime();
    }
    public void drivingTime(){
    system.debug('drivingTime===');
        String Id = ApexPages.currentPage().getParameters().get('id');
        String startDate = ApexPages.currentPage().getParameters().get('startDate');
        String endDate = ApexPages.currentPage().getParameters().get('endDate');
        //String Id = 'a0v8H000000DgZR';
        //String startDate = '2022-05-29';
        //String endDate = '2022-06-11';
        mileageWrapperList = new List<mileageWrapper>();
        for(Bi_Weekly_Reimbursement__c biweeklyreim : [SELECT Name,Contact__r.Name, Contact__r.External_Email__c, 
                                                               Actual_Drive_Time__c, Actual_Stay_Time__c, Actual_Hours__c,
                                                               Actual_Mileages__c, Sync_1_Hours__c, Sync_1_Mileages__c, 
                                                               Sync_2_Hours__c, Sync_2_Mileages__c  
                                                           FROM Bi_Weekly_Reimbursement__c 
                                                           WHERE Start_Date__c =: Date.valueOf(startDate)
                                                           AND End_Date__c =: Date.valueOf(endDate)
                                                           AND (Contact__r.Driver_Type__c = 'Driver - Full Time' 
                                                           OR Contact__r.Driver_Type__c = 'Driver - Part Time') 
                                                           AND Contact__r.AccountId =: id ]){
                                                            mileageWrapper objMileageWrap = new mileageWrapper();
                                                            objMileageWrap.dates =  biweeklyreim.Name;
                                                            objMileageWrap.contactName =  biweeklyreim.Contact__r.Name ;
                                                            objMileageWrap.email =  biweeklyreim.Contact__r.External_Email__c ;                             
                                                            objMileageWrap.initialDriveTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweeklyreim.Actual_Drive_Time__c));
                                                            objMileageWrap.initialStayTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweeklyreim.Actual_Stay_Time__c));                                                            
                                                            objMileageWrap.initiaTotalTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweeklyreim.Actual_Hours__c));
                                                            objMileageWrap.mileage =   biweeklyreim.Actual_Mileages__c != null ? (biweeklyreim.Actual_Mileages__c).setScale(2) : 0;
                                                            objMileageWrap.sync1Time = Utils.ConvertMinuteToHours(Integer.valueOf(biweeklyreim.Sync_1_Hours__c));
                                                            objMileageWrap.sync1Mileage =   biweeklyreim.Sync_1_Mileages__c != null ? (biweeklyreim.Sync_1_Mileages__c).setScale(2) : 0;
                                                            objMileageWrap.sync2Time = Utils.ConvertMinuteToHours(Integer.valueOf(biweeklyreim.Sync_2_Hours__c));
                                                            objMileageWrap.sync2Mileage =  biweeklyreim.Sync_2_Mileages__c != null ?(biweeklyreim.Sync_2_Mileages__c).setScale(2) : 0;
                                                            mileageWrapperList.add(objMileageWrap);
                                                            system.debug('mileageWrapperList=='+mileageWrapperList);
        }
    }

    public class mileageWrapper{
        public string dates { get; set; }
        public string contactName { get; set; }
        public string email { get; set; }
        public string initialDriveTime { get; set; }
        public string initialStayTime { get; set; }
        public string initiaTotalTime { get; set; }
        public decimal mileage { get; set; }
        public string sync1Time { get; set; }
        public decimal sync1Mileage { get; set; }
        public string sync2Time { get; set; }
        public decimal sync2Mileage { get; set; }
        public mileageWrapper(){
        }
    }
}