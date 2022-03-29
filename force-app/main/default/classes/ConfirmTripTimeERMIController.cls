/**
 * @Author: GetonCRM Solutions LLP
 * @Description: This class is use for checking driver was confirm or error biweekly reimbursement for ERMI account.Based on checkbox value we will redirect on paege.
 * @Modification logs
 * ========================================================================================================================
 * @Date: 20 January 2022 | Sanket Goswami
 * @description: EMC-238
 */
public with sharing class ConfirmTripTimeERMIController {
    public static String contactId;
    public string mileageDetailWrapper {get; set;}
    public ConfirmTripTimeERMIController (){
        contactId = ApexPages.currentPage().getParameters().get('id');
         if(contactId != null){
           mileageDetailWrapper = getMileageData();
        }
    }
    /*This method is used to display biweekly reimbursement data of last completed biweekly reimbursment period */
    public static string getMileageData(){
        system.debug('getMileageData.contactId=='+ contactId);
        List<MileageWrapper> mileageWrapList = new List<MileageWrapper >();
        for(Bi_Weekly_Reimbursement__c  biweek : [SELECT id, name, Confirm_Hours__c, Error_Hours__c,
                                                         Total_Time__c, Total_Drive_Time__c,Count_Error_Check__c, 
                                                         Total_Stay_Time__c, Total_Approved_Pending_Mileage__c,
                                                         Contact__r.FirstName, Contact_Email__c  
                                                      FROM Bi_Weekly_Reimbursement__c 
                                                      WHERE Contact__c =: contactId 
                                                      AND Start_Date__c != null 
                                                      AND End_Date__c != null 
                                                      AND End_Date__c <= TODAY order by End_Date__c desc limit 1 ]){
                    MileageWrapper milWrap = new MileageWrapper(); 
                    milWrap.biWeekId = biweek.Id;   
                    milWrap.biWeekPayperiod = biweek.Name;  
                    milWrap.driverName = biweek.Contact__r.FirstName;
                    milWrap.driverEmail = biweek.Contact_Email__c ;    
                    milWrap.mileage = biweek.Total_Approved_Pending_Mileage__c ;
                    milWrap.confirmCheck = biweek.Confirm_Hours__c;
                    milWrap.errorCheck = biweek.Error_Hours__c;
                    milWrap.driveTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweek.Total_Drive_Time__c));
                    milWrap.stayTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweek.Total_Stay_Time__c));
                    milWrap.totalTime = Utils.ConvertMinuteToHours(Integer.valueOf(biweek.Total_Time__c));
                    milWrap.countErrorCheck = biweek.Count_Error_Check__c != null ? Integer.valueOf(biweek.Count_Error_Check__c) : 0;
                    mileageWrapList.add(milWrap);
        }
        String wrapjson = JSON.serialize(mileageWrapList);
        return wrapjson;
    }
    /*This method is used for update checkbox value and send confirm email to driver if he confirm the data */
    @RemoteAction
    public static string updateBiWeekData(String biweekData)
    {
        system.debug('biweekData=='+ biweekData);
        List<Bi_Weekly_Reimbursement__c> updateBiweekList = new List<Bi_Weekly_Reimbursement__c >();
        map<id,Bi_Weekly_Reimbursement__c > conMap = new map<id,Bi_Weekly_Reimbursement__c >();
        if(biweekData != null)
        {
            List<MileageWrapper> biweekWrapUpdateList = new List<MileageWrapper>();
            biweekWrapUpdateList = (List<MileageWrapper>)Json.deserialize(biweekData,List<MileageWrapper>.class);
            
            for(MileageWrapper conwrap : biweekWrapUpdateList ){
                System.debug('conwrap'+conwrap);
                Bi_Weekly_Reimbursement__c biweek = new Bi_Weekly_Reimbursement__c ();
                biweek.Id = Id.valueOf(conwrap.biWeekId) ;
                biweek.Confirm_Hours__c = conwrap.confirmCheck ; 
                biweek.Error_Hours__c = conwrap.errorCheck ;
                biweek.Count_Error_Check__c = conwrap.countErrorCheck ;
                if(biweek.Confirm_Hours__c == true){
                    Integer countError = 0;
                    sendConfirmEmail(conwrap.driverEmail,conwrap.driverName,conwrap.biWeekPayperiod,conwrap.mileage,conwrap.DriveTime,conwrap.StayTime,conwrap.TotalTime,countError);
                }
                updateBiweekList.add(biweek );                
            }
        }
        conMap.putall(updateBiweekList);
        if(conMap.size() > 0){            
            update conMap.values();
        }        
        return 'Success';
    }
    /*This method is used to send a email to driver and admin when he click on confirm or error checkbox */
    public static void sendConfirmEmail (String conEmail,String driverName,String biweekName,Decimal mileage,String driveTime,String stayTime,String totalTime,Integer countError){
        List<Messaging.SingleEmailMessage> emailist = new List<Messaging.SingleEmailMessage>();
        OrgWideEmailAddress[] owea = [SELECT Id,Address from OrgWideEmailAddress where Address = 'driverservices@mburse.com' ];
        List<String> toAddress = new List<String>();
        List<String> bccAddress = new List<String>();
        EmailTemplate templateId;
        String newemailBody;
        if(countError == 0 ){
            templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Ermi_Time_And_Mileage_Correct' Limit 1];
        } else if(countError == 1 ){
            templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Ermi_Error_Count_1' Limit 1];
            //bccAddress.add('eizelp@mburse.com');
            bccAddress.add(System.Label.CountError1Ermi);
            
        } else if(countError == 2 ){
            templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'Ermi_Error_Count_2' Limit 1];
            //bccAddress.add('driverservices@mburse.com');
            bccAddress.add(System.Label.DriverServicesEmail);
        }
        //conEmail = 'sjg.it22@gmail.com';
        toAddress.add(conEmail);
        newemailBody = templateId.HtmlValue;
        if(countError != 2){
            String htmlTemplate = '<tr align="center" style="border:2px solid black;"> <td style="border:1px solid black;">'  
                                + mileage +'</td><td style="border:2px solid black;">'
                                + driveTime+'</td><td style="border:2px solid black;">' 
                                + stayTime+'</td><td style="border:2px solid black;">'
                                + totalTime +'</td>'                         
                                +'</tr>';
            
            newemailBody = newemailBody.replace('{tableDynamicData}', htmlTemplate);
            newemailBody = newemailBody.replace('{!BiweekName}', biweekName);
        }
        newemailBody = newemailBody.replace('{!DriverName}', driverName);        
        newemailBody = newemailBody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        messaging.singleEmailMessage email;
        if(countError == 0){
            email = Utils.CreateEmail(templateId.Subject,newemailBody,toAddress,null,null,null);
        }  else if(countError == 1 || countError == 2 ){
            email = Utils.CreateEmail(templateId.Subject,newemailBody,toAddress,null,bccAddress,null);
        }        
        emailist.add(email);
        SendEmail__c  sendEmailObj = SendEmail__c.getValues('ConfirmTripTimeERMIController');
        if(emailist.size() > 0 && !Test.isRunningTest() && sendEmailObj.Send_email_from_code__c == true){
            Messaging.SendEmailResult [] result = Messaging.sendEmail(emailist, false);
        }
        
    }
    @RemoteAction
    public static void sendErrorEmail (String conEmail,String driverName,String biweekName,Decimal mileage,String driveTime,String stayTime,String totalTime,Integer countError){
        if(countError != null && countError == 1){
            sendConfirmEmail(conEmail,driverName,biweekName,mileage,driveTime,stayTime,totalTime,countError);
        } else if(countError != null && countError == 2){
            sendConfirmEmail(conEmail,driverName,biweekName,mileage,driveTime,stayTime,totalTime,countError);
        }
    }

    //This method is use for sync trips for Ermi account.When driver has any issue on synced trips then this method is clicked.
    @RemoteAction
    public static String syncTripsForErmi (String contactId,String startdate,String enddate){
        if( startdate != null && enddate != null && contactId != null){
            set<string> monthList = new set<String>();
            String contactName;
            String contactEmail;
            if(startdate.contains('/')) {
                list<String> lstSplitDate = startdate.split('/');
               // lstSplitDate[0] = Integer.valueOf(lstSplitDate[0]) > 9 ? lstSplitDate[0] : '0'+lstSplitDate[0];
                monthList.add(lstSplitDate[0]+'-'+ lstSplitDate[2]); 
            }
            Id reimId;
            if(monthList.size() > 0){
                for(Employee_Reimbursement__c reim : [SELECT id 
                                                    FROM Employee_Reimbursement__c 
                                                    WHERE Month__c IN: monthList 
                                                    AND Contact_Id__c =: contactId ]){
                                                        reimId = reim.ID;
                }
            }
            for(Bi_Weekly_Reimbursement__c bireim : [SELECT id,name,Contact__r.FirstName,
                                                            Start_Date__c, End_Date__c, 
                                                            Contact__r.External_Email__c, 
                                                            Contact__c, MPG__c, Maintenance_and_Tires__c, 
                                                            Fuel_Price__c, Contact__r.Account.Triplog_API__c
                                                        FROM Bi_Weekly_Reimbursement__c 
                                                        WHERE Start_Date__c =: Date.parse(startdate)
                                                            AND End_Date__c =: Date.parse(enddate)
                                                            AND Contact__c =: contactId ]){
                                                                contactName = bireim.Contact__r.FirstName;
                                                                contactEmail = bireim.Contact__r.External_Email__c;
                                                                system.debug('bireim ' + bireim );
                if(!Test.isRunningTest() && reimId != null){
                system.debug('inserted in if');
                date sd = date.parse(startdate);
                date ed = date.parse(enddate);
                    GetTripCalloutforCommute.GetTripCalloutForCommuteMileage(reimId, bireim.Contact__r.External_Email__c, bireim.Contact__c, String.valueof(sd), String.valueof(ed), String.valueOf(bireim.Fuel_Price__c), String.valueOf(bireim.MPG__c), String.valueOf(bireim.Maintenance_and_Tires__c), bireim.Contact__r.Account.Triplog_API__c, 'U' ,false, 'Business',true,bireim.Id);
                }
            }  
            List<Messaging.SingleEmailMessage> emailist = new List<Messaging.SingleEmailMessage>();
            EmailTemplate templateId;
            String newemailBody;
            OrgWideEmailAddress[] owea = [SELECT Id,Address from OrgWideEmailAddress where Address = 'driverservices@mburse.com' ];
            List<String> toAddress = new List<String>();
            templateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'SendDriverConfirmTA' Limit 1];
            newemailBody = templateId.HtmlValue;
            if(contactName != null){
                 newemailBody = newemailBody.replace('{!ContactName}', contactName);
            }           
            toAddress.add(contactEmail);
            newemailBody = newemailBody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
            messaging.singleEmailMessage email = new messaging.singleEmailMessage();
            email = Utils.CreateEmail(templateId.Subject,newemailBody,toAddress,null,null,null);
            emailist.add(email); 
            EmailTemplate adminTemplateId = [SELECT Id, Subject,HtmlValue, body FROM EmailTemplate WHERE developerName = 'SendAdminConfirmTA' Limit 1];
            String newAdminEmailBody = adminTemplateId.HtmlValue;
            newAdminEmailBody = newAdminEmailBody.replace('{!ContactName}', 'Alexis');
            newAdminEmailBody = newAdminEmailBody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
            String subjectModify = adminTemplateId.Subject;
            if(contactName != null){
                subjectModify = subjectModify.replace('{!DriverName}', contactName);
            }            
            List<String> toAddressDriver = new List<String>();
            //String contactDriverEmail = 'a.wright@ermi-motion.com';
            toAddressDriver.add(System.Label.ErmiAdminAlexis);
            messaging.singleEmailMessage email2 = new messaging.singleEmailMessage();
            email2 = Utils.CreateEmail(subjectModify,newAdminEmailBody,toAddressDriver,null,null,null);
            emailist.add(email2);   
            SendEmail__c  sendEmailObj = SendEmail__c.getValues('ConfirmTripSyncErmi'); 
            if(emailist.size() > 0 && !Test.isRunningTest() && sendEmailObj.Send_email_from_code__c == true){
                Messaging.SendEmailResult [] result2 = Messaging.sendEmail(emailist, false);
            }                     
        }
        return 'sucess';
    }
    public class MileageWrapper {
        public string biWeekId { get; set; }
        public string biWeekPayperiod {get; set;}
        public Decimal mileage { get; set; }
        public string driveTime { get; set; }
        public string stayTime { get; set; }        
        public string totalTime { get; set; }
        public string driverEmail {get; set;}
        public string driverName {get; set;}
        public Boolean confirmCheck { get; set; }
        public Boolean errorCheck { get; set; }
        public Integer countErrorCheck { get; set; }
    }
}