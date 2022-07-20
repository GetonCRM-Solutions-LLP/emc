/****************************************************************************************************
 * Create By : Dhanraj Khatri
 * Create Date : 06/07//2022
 * Description : Web Service for Receieving message and inserting message in salesforce       
 * Modification Log:
 *  -------------------------------------------------------------------------------------------------
 *  * Developer                         Date                   Description
 *  *------------------------------------------------------------------------------------------------
 *  *   -                                -                         -
*****************************************************************************************************/

@RestResource(urlMapping='/api/webhook/*')
global class TrueDialogReceiveMessage {
    
      public static  RestRequest req = RestContext.request;
      public static  RestResponse res = RestContext.response;
      public static  Map<String, Object> FetchRequestBody = new  Map<String, Object>();
      
      @HttpPost
      global static void insertMessage() {

        TrueDialog_Keys__c tdKeys =TrueDialog_Keys__c.getValues('TrueDialogKeys');

        System.debug('****Callback  Token*****'+tdKeys.Callback_Token__c);

        FetchRequestBody = (Map<String, Object>)JSON.deserializeUntyped(req.requestbody.tostring());

        

        Integer trueDialogContactId = (Integer)FetchRequestBody.get('ContactId');

        String trueDialogContactIdString = String.valueOf(trueDialogContactId);

        System.debug('true Dialog contact id ****'+trueDialogContactIdString);
      
        Contact contact=[Select id,TrueDialog_Contact_Id__c 
                          FROM Contact
                          WHERE TrueDialog_Contact_Id__c=:trueDialogContactIdString 
                          Limit 1];
        
        System.debug('tdKeys.Callback_Token__c'+tdKeys.Callback_Token__c);
      
        if(tdKeys.Callback_Token__c == String.valueOf(FetchRequestBody.get('CallbackToken'))){
         
          Message__c message = new Message__c();

          message.Action_Id__c = String.valueOf(FetchRequestBody.get('ActionId'));
          message.Unread__c = true;
          message.Incoming_Message__c =true;
          message.Contacts__c = contact.Id;
          message.Message_Id__c =(String) FetchRequestBody.get('MessageId');
          message.Message__c = (String) JSON.serialize(FetchRequestBody.get('Message'));
          
          insert message; 
          
        }else{
          System.debug('Callback token URL is not Matched.');
        }  
    } 
}