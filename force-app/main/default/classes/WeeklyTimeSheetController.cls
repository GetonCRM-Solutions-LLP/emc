/**********************************************************************************************************
 * Author :- GetOnCRM Solutions	LLP																		  *
 * Created Date :- 16/03/2022																			  *
 * Description :- Send an email to the Ermi's Part-time and Full-time driver to shown on the notification *
 * 				  page for the confirm or correct  weekly time and mileage for the week of 				  *
 * 				  last completed pay period.															  *
 * -------------------------------------------------------------------------------------------------------*
 * Modified by :- PARAS DHANANI																			  *
 * Modified Date :- 16/03/2022																			  *
 **********************************************************************************************************/ 


Global with sharing  class WeeklyTimeSheetController {

    Global  List<EmailTemplate> temp;
    Global  OrgWideEmailAddress[] owea;
    date reimEndDate = system.today().adddays(-1);
    //String  accID = System.Label.ERMI_Account; 
     
    Global WeeklyTimeSheetController() {
         temp = new List<EmailTemplate>([SELECT id, Subject, body, HTMLValue 
                                         FROM EmailTemplate 
											WHERE DeveloperName = 'Weekly_Time_Sheet_for_All_Drivers']);
         owea = [select Id from OrgWideEmailAddress where Address =:'driverservices@mburse.com'];
    } 

    Global void getWeeklyDriversData (){
        system.debug('reimEndDate==' + reimEndDate);
        Messaging.SingleEmailMessage mail;
        List<Messaging.SingleEmailMessage> mail_list = new List<Messaging.SingleEmailMessage>();
        for (Bi_Weekly_Reimbursement__c biweeklyReim : [SELECT id,name, Confirm_Hours__c,Total_Drive_Time__c,Contact__r.FirstName,
                                                                    Total_Stay_Time__c,Total_Time__c,Contact__r.External_Email__c 
                                                            FROM Bi_Weekly_Reimbursement__c
                                                            //WHERE Contact__r.AccountId =: accID
                                                            WHERE Contact__r.Account.Name = 'Ermi' 
                                                                    AND Start_Date__c != Null
                                                                    AND End_Date__c  != Null
                                                                    AND End_Date__C =:  reimEndDate ]){
                List<String> sendingTo = new List<String>();
            string htmlbody = '';
            mail = new Messaging.SingleEmailMessage();
            if (owea.size() > 0) {
                mail.setOrgWideEmailAddressId(owea.get(0).Id);
            }
            sendingTo.add(biweeklyReim.Contact__r.External_Email__c);
           //sendingTo.add('paras.dhanani@getoncrm.com');
            mail.setToAddresses(sendingTo);
            mail.setSubject(temp[0].Subject);
            htmlbody = temp[0].HTMLValue;
            htmlbody = htmlbody.replace('{!Contact.FirstName}', biweeklyReim.Contact__r.FirstName);
            htmlbody = htmlbody.replace('{!Bi_Weekly_Reimbursement__c.Name}', biweeklyReim.name ); 
            htmlbody = htmlbody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
            mail.setPlainTextBody(htmlbody);
            List<String> bccaddress = new list<String>();
            //bccaddress.add('driverservices@mburse.com');
            //mail.setBccAddresses(bccaddress);
            mail.setHtmlBody(htmlbody);
            mail_list.add(mail);
        }
        if(mail_list.size() > 0 && !Test.isRunningTest()){
            Messaging.sendEmail(mail_list);  
        }
    }
}