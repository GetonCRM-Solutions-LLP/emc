Global class MileageSubmissionInstructions implements Database.Batchable<sObject> {
	Global  List<EmailTemplate> temp;
    //Global  OrgWideEmailAddress[] owea;
    
    Public List<EmailTemplate> start(Database.BatchableContext bc)  {
         temp = new List<EmailTemplate>([SELECT id, Subject, body, HTMLValue 
                                         FROM EmailTemplate 
                                            WHERE DeveloperName = 'Mileage_submission_instructions_Email']);
        return temp;
        //owea = [select Id from OrgWideEmailAddress where Address =:'driverservices@mburse.com'];
    }
    global void execute(Database.BatchableContext bc, List<EmailTemplate> temp) {
        Messaging.SingleEmailMessage mail;
        List<Messaging.SingleEmailMessage> mail_list = new List<Messaging.SingleEmailMessage>();
        List<Contact> conList = [SELECT id,AccountId,Name,Email, Mileage_submission_instructions__c,Deactivated_Date__c from Contact where Mileage_submission_instructions__c = true and Account.Name =: Label.MileageSubmissionName and Deactivated_Date__c = null and (Role__c = 'Driver' or Role__c = 'Driver/Admin' or Role__c = 'Driver/Manager')];
        System.debug('conList :'+conList);
         for(Contact con : conList){
            //if(con.id == System.Label.ERMI_Account || Test.isRunningTest()){
                List<String> sendingTo = new List<String>();
                string htmlbody = '';
                mail = new Messaging.SingleEmailMessage();
                 /*if (owea.size() > 0) {
                    mail.setOrgWideEmailAddressId(owea.get(0).Id);
                }*/
                sendingTo.add(con.Email);
                mail.setToAddresses(sendingTo);
                mail.setSubject(temp[0].Subject);
                htmlbody = temp[0].HTMLValue;
                
                date dt = System.today();
                Integer dtMonth = dt.month()+1;
                Date newMonthdt = Date.newInstance(dt.year(), dtMonth, 02);
                Date secondNewMonthdt = Date.newInstance(dt.year(), dtMonth, 04);
                System.debug('date: '+newMonthdt);
                String dtStr = DateTime.newInstance(newMonthdt.year(),newMonthdt.month(),newMonthdt.day()).format('MMMM d, yyyy');
                String dtStrSecond = DateTime.newInstance(secondNewMonthdt.year(),secondNewMonthdt.month(),secondNewMonthdt.day()).format('MMMM d');
                System.debug('>>>>' + dtStr);
                htmlbody = htmlbody.replace('{!firstDate}', dtStr);
                htmlbody = htmlbody.replace('{!secondDate}', dtStrSecond);
                
                mail.setPlainTextBody(htmlbody);
                List<String> bccaddress = new list<String>();
                mail.setBccAddresses(bccaddress);
                mail.setHtmlBody(htmlbody);
                mail_list.add(mail);
             System.debug('mail list: '+mail_list);
            //}
        }
        if(mail_list.size() > 0 && !Test.isRunningTest()){
            Messaging.sendEmail(mail_list);  
            System.debug('mail: '+ Messaging.sendEmail(mail_list));
        }
    }
    Public void finish(Database.BatchableContext bc){
    } 
}