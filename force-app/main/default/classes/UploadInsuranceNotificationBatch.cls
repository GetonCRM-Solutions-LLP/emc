Public class UploadInsuranceNotificationBatch implements Database.Batchable<sObject>,Database.Stateful {
    
    Public  List<EmailTemplate> temp;
    Public OrgWideEmailAddress[] owea;
    public String after30DaysDate ; 
    
    Public UploadInsuranceNotificationBatch(){
        temp = new List<EmailTemplate>([SELECT id, Subject, body, HTMLValue 
                                        FROM EmailTemplate 
                                        WHERE DeveloperName = 'Skiped_Insurance_Notification']);
        owea = [select Id from OrgWideEmailAddress where Address =:'driverservices@mburse.com'];
    }
    Public List<Contact> start(Database.BatchableContext bc) {
        List<Contact> conList = new List<Contact>();
        conList = [SELECT Id,name,FirstName,External_Email__c,Activation_Date__c
                   FROM contact 
                   WHERE  Role__c != 'Admin' 
                   AND Role__c != 'Manager' 
                   AND Account.isUsingTriplog__c = True 
                   AND Deactivated_Date__c = NULL 
                   AND Activation_Date__c != NULL
                   AND Insurance_Attachment_Id__c = NULL
                   AND Insurance_Declaration_Status__c = 'Skip'
                   WITH SECURITY_ENFORCED ];
        return conList;
    }
    Public void execute(Database.BatchableContext bc, List<Contact> scope){
        System.debug('scope==' + scope.size());
        Messaging.SingleEmailMessage mail;
        List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();
        
        for(contact con : (List<contact>) scope){
            system.debug('con==' + con);
            date activationDate = con.Activation_Date__c;
            date currentDate = system.today();
            integer numberDaysDue = currentDate.daysBetween(activationDate);
            integer remainder = Math.Mod(numberDaysDue,5);
            string activationplus30 = String.valueOf(con.Activation_Date__c.adddays(30));
            String[] splitDate = activationplus30.split('-');
            system.debug('splitDate[0]==' + splitDate[0]);
            system.debug('splitDate[1]==' + splitDate[1]);
            system.debug('splitDate[2]==' + splitDate[2]);
            if(Integer.valueOf(splitDate[1]) == 01){
                after30DaysDate = 'January ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 02) {
                after30DaysDate = 'February ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 03) {
                after30DaysDate = 'March ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 04) {
                after30DaysDate = 'April ' + splitDate[2] + ',' + splitDate[0];
            }  else if (Integer.valueOf(splitDate[1]) == 05) {
                after30DaysDate = 'May ' + splitDate[2] + ',' + splitDate[0];
            }  else if (Integer.valueOf(splitDate[1]) == 06) {
                after30DaysDate = 'June ' + splitDate[2] + ',' + splitDate[0];
            }  else if (Integer.valueOf(splitDate[1]) == 07) {
                after30DaysDate = 'July ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 08) {
                after30DaysDate = 'August ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 09) {
                after30DaysDate = 'September ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 10) {
                after30DaysDate = 'Octomber ' + splitDate[2] + ',' + splitDate[0];
            }   else if (Integer.valueOf(splitDate[1]) == 11) {
                after30DaysDate = 'November ' + splitDate[2] + ',' + splitDate[0];
            }   else if(Integer.valueOf(splitDate[1]) == 12) {
                after30DaysDate = 'December ' + splitDate[2] + ',' + splitDate[0];
            }
            
            if(remainder == 0)  {
                system.debug('Insertinto if condition==' + remainder);
                List<String> sendingTo = new List<String>();
                string htmlbody = '';
                mail = new Messaging.SingleEmailMessage();
                if (owea.size() > 0) {
                    mail.setOrgWideEmailAddressId(owea.get(0).Id);
                }
                // sendingTo.add(con.External_Email__c);
                sendingTo.add('snehal.gat@kiwiqa.com');
                mail.setToAddresses(sendingTo);
                mail.setSubject(temp[0].Subject);
                htmlbody = temp[0].HTMLValue;
                htmlbody = htmlbody.replace('{!Contact.FirstName}',con.FirstName);
                //htmlbody = htmlbody.replace('{!Contact.Skip_Insurance_Date__c}', string.valueOf(con.Activation_Date__c.adddays(30)));
                htmlbody = htmlbody.replace('{!Contact.Skip_Insurance_Date__c}', after30DaysDate);
                htmlbody = htmlbody.replace('{!$Label.Driver_Forword_Logo}', System.Label.Driver_Forword_Logo);
                mail.setPlainTextBody(htmlbody);
                List<String> bccaddress = new list<String>();
                mail.setHtmlBody(htmlbody);
                mailList.add(mail);
            }
        }
        System.debug('mailList.size()=='+ mailList.size());
        if(mailList.size() > 0 && !Test.isRunningTest()){
            Messaging.sendEmail(mailList);  
        }
    }    
    Public void finish(Database.BatchableContext bc){
        
    }   
}