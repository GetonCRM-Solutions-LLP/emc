/****************************************************************************************************
 * Create By : Dhanraj Khatri
 * Create Date : 06/07//2022
 * Description :  Methods contains for 
                1) sendMessageToContact - Calling SendMessageApi and inserting message in salesforce,
                2) getAllMessageByContact -  Returning all message realted to contact in LWC
                3) getContactPicture - Returning contact picture.
            
 * Modification Log:
 *  -------------------------------------------------------------------------------------------------
 *  * Developer                         Date                   Description
 *  *------------------------------------------------------------------------------------------------
 *  *   -                                -                         -
*****************************************************************************************************/


public class TrueDialogSendMessageAPI {
    
    @AuraEnabled
    public static String sendMessageToContact(String contactId,String message){
        String result;
        try {
        
            System.debug('Contact Id :'+contactId);
            System.debug('message : '+message);

            Message__c messageRecord = new Message__c();

            HttpResponse response = new HttpResponse();

            String requestBody = TrueDiaolgSendMessageWrapper.generateSendMessageReqBody(contactId,message);
        
            System.debug('*****Request Body*****'+requestBody);

            response = TrueDialogAPICallout.executeCallout('POST','action-pushCampaign',requestBody,null);
            
            System.debug('*****Response Body*****'+response.getBody());

            if (response.getStatusCode() < 300) {
            
                TrueDiaolgSendMessageWrapper trueDialogWrapper = TrueDiaolgSendMessageWrapper.parse(response.getBody());
                messageRecord.Contacts__c = contactId;
                messageRecord.Action_Id__c = trueDialogWrapper.id;
                messageRecord.Message__c = message;
            }else{
  
                String trueDialogError =response.getBody() + ',' + response.getStatusCode() + ': ' + response.getStatus() + '\n';
                System.debug(trueDialogError);
                throw new TrueDialogApiException(trueDialogError);
            } 
                  
            System.debug('*****messageRecor*****'+messageRecord);

            Database.SaveResult saveResultList = Database.insert(messageRecord, false);

            if (saveResultList.isSuccess()) {
                System.debug('Successfully inserted message. Message ID: ' + saveResultList.getId());
                result = 'success';
            }
            else {                 
                result = 'failed';
            }
        }catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        }
        return result;
            
    }
    

    @AuraEnabled 
    public static String getAllMessageByContact(String contactId){
       

        List<Message__c> lstMessage = [Select id, Message__c,Unread__c, Incoming_Message__c, Contacts__r.Time_Zone__c,CreatedDate
                                        FROM Message__c
                                        WHERE Contacts__c =:contactId order by CreatedDate asc];


        System.debug('Message size:'+lstMessage.size());
        System.debug('Message:'+lstMessage);
                              
        return JSON.serialize(lstMessage);
    }
    
    @AuraEnabled
    public static string getContactPicture(String contactId){
      
       List<Contact> conList = [SELECT id,Contact_Picture__c
                                    FROM Contact 
                                    WHERE id =: contactId];

        String json = JSON.serialize(conList);
        return json;
    }

    public class TrueDialogApiException extends Exception {}
}