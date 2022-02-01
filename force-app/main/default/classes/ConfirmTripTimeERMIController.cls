public with sharing class ConfirmTripTimeERMIController {
    public static String contactId;
    public string mileageDetailWrapper {get; set;}
    public ConfirmTripTimeERMIController (){
        contactId = ApexPages.currentPage().getParameters().get('id');
        system.debug('contactId=='+ contactId);
         if(contactId != null){
           mileageDetailWrapper = getMileageData();
        }
        
    }
    public static string getMileageData(){
        system.debug('getMileageData.contactId=='+ contactId);
        List<MileageWrapper> mileageWrapList = new List<MileageWrapper >();
        for(Bi_Weekly_Reimbursement__c  biweek : [SELECT id, name, Confirm_Hours__c, Error_Hours__c,
                                                         Total_Time__c, Total_Drive_Time__c, 
                                                         Total_Stay_Time__c, Total_Approved_Pending_Mileage__c 
                                                      FROM Bi_Weekly_Reimbursement__c 
                                                      WHERE Contact__c =: contactId 
                                                      AND Start_Date__c != null 
                                                      AND End_Date__c != null 
                                                      AND End_Date__c <= TODAY order by End_Date__c desc limit 1]){
                    MileageWrapper milWrap = new MileageWrapper(); 
                    milWrap.biWeekId = biweek.Id;   
                    milWrap.biWeekPayperiod = biweek.Name;                           
                    milWrap.mileage = biweek.Total_Approved_Pending_Mileage__c ;
                    milWrap.confirmCheck = biweek.Confirm_Hours__c;
                    milWrap.errorCheck = biweek.Error_Hours__c;
                    milWrap.DriveTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweek.Total_Drive_Time__c));
                    milWrap.StayTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweek.Total_Stay_Time__c));
                    milWrap.TotalTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweek.Total_Time__c));
                    mileageWrapList.add(milWrap);
        }
        String wrapjson = JSON.serialize(mileageWrapList);
        return wrapjson;
    }
    @RemoteAction
    public static string UpdateBiWeekData(String biweekData)
    {
        system.debug('biweekData=='+ biweekData);
        List<Bi_Weekly_Reimbursement__c> updateBiweekList = new List<Bi_Weekly_Reimbursement__c >();
        map<id,Bi_Weekly_Reimbursement__c > conMap = new map<id,Bi_Weekly_Reimbursement__c >();
        if(biweekData != null)
        {
            List<MileageWrapper> BiweekWrapUpdateList = new List<MileageWrapper>();
            BiweekWrapUpdateList = (List<MileageWrapper>)Json.deserialize(biweekData,List<MileageWrapper>.class);
            
            for(MileageWrapper conwrap : BiweekWrapUpdateList ){
                Bi_Weekly_Reimbursement__c biweek = new Bi_Weekly_Reimbursement__c ();
                biweek.Id = conwrap.biWeekId ;
                biweek.Confirm_Hours__c = conwrap.confirmCheck ; 
                biweek.Error_Hours__c = conwrap.errorCheck ;                 
                updateBiweekList.add(biweek );
            }
        }
        conMap.putall(updateBiweekList);
        if(conMap.size() > 0){            
            update conMap.values();
        }        
        return 'Success';
    }
    @RemoteAction
    public static String readFromFileInchunk(String attachmentBody, String attachmentName, String attachmentId,String did,String accid,String contactattachementid)
    {
        return  WrapperUtils.readFromFileInchunk(attachmentBody,attachmentName,attachmentId,did,accid,contactattachementid);   
    }
    @RemoteAction
    public static String getdriverInsurance(string attachmentid) {        
        String query = 'select id,Body,Name from Attachment where id= \''+attachmentid+'\'';      
        return String.escapeSingleQuotes(JSON.serialize((List<Attachment>)ExecuteQueryUtil.getRecordListFromsObject(query)));
    }
    @RemoteAction
    public static String getDriverDetailsClone(String contactid)
    {            
        system.debug('contactidgetdriver==='+ contactid);
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id, Name, MailingPostalCode, MailingState, MailingCity,Driver_Type__c, 
                                        Fixed_Amount__c, compliancestatus__c, Car_Image__c, Account.Name, Account.Logo_Document_Id__c, 
                                        Vehicle_Type__c,Insurance_Attachment_Id__c, Account.Triplog_API__c, Email,
                                        Maintenance__c,Tires__c, Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                        Depreciation__c, Total_Monthly_Costs__c, Business_Use__c,Fixed_Cost_Adjustment__c
                                    FROM Contact 
                                    WHERE id =: contactid];
        return JSON.serialize(driverDataList ).unescapeHtml4();
    }
    public static String getReimbursementsList()
    {         
         return String.escapeSingleQuotes(WrapperUtils.getReimbursementsList(contactId ,'Approved'));
    }
    public static String getDriverDetails()
    {
        return getDriverDetailsClone(contactId);
    }
    public class MileageWrapper {
        public string biWeekId { get; set; }
        public string biWeekPayperiod {get; set;}
        public Decimal mileage { get; set; }
        public string DriveTime { get; set; }
        public string StayTime { get; set; }        
        public string TotalTime { get; set; }
        public Boolean confirmCheck { get; set; }
        public Boolean errorCheck { get; set; }
    }
}