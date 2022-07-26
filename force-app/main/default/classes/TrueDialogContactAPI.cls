/****************************************************************************************************
 * Create By : Dhanraj Khatri
 * Create Date : 06/07//2022
 * Description :  Batch class for Post and Put Contact Record in TrueDialog.
               
 * Modification Log:
 *  -------------------------------------------------------------------------------------------------
 *  * Developer                         Date                   Description
 *  *------------------------------------------------------------------------------------------------
 *  *   -                                -                         -
*****************************************************************************************************/



global  class  TrueDialogContactAPI implements Database.Batchable<sObject>,Database.AllowsCallouts,Database.Stateful{
    
    Set<Id> idSetBatch=new Set<Id>();

    //Constructor for Batch class that initiliaze contact Id Set
    global TrueDialogContactAPI(Set<Id> contactIdSet){
        idSetBatch = contactIdSet;
    }

    //Batchable Start Method
    global Database.QueryLocator start(Database.BatchableContext BC){
        return Database.getQueryLocator([Select Id,email,MobilePhone, 
                                        phone,name,lastname,firstname,
                                        TrueDialog_Contact_Id__c ,TrueDialog_SMS_Enabled__c,
                                        TrueDialog_MMS_Enabled__c,Account.True_Dialog__c
                                        FROM Contact 
                                        WHERE Id IN: idSetBatch and MobilePhone != null
                                        and Account.True_Dialog__c = true]);
    }

     //Batchable execute - 
    global static void execute(Database.BatchableContext BC, List<Contact> scope) {    
       
        HttpResponse response = new HttpResponse();      
        String requestBody;
        
        List<Contact> conList = new List<Contact>();
        try {

            for(Contact con:scope){
                requestBody = TrueDialogContact.generateTrueDialogContactReqBody(con);

                if(con.TrueDialog_Contact_Id__c!=null){
                    response = TrueDialogAPICallout.executeCallout('PUT','contact',requestBody,con.TrueDialog_Contact_Id__c);
                }else{
                    response = TrueDialogAPICallout.executeCallout('POST','contact',requestBody,'');
                }
      
                if (response.getStatusCode() < 300) {
                    if(con.TrueDialog_Contact_Id__c==null){    
                        
                        TrueDialogContact trueDialog = TrueDialogContact.parse(response.getBody());   
                        con.TrueDialog_Contact_Id__c = trueDialog.id;
                        
                        con.TrueDialog_SMS_Enabled__c = true;
                        con.TrueDialog_MMS_Enabled__c = true;
                        update con;
                        
                        conList.add(con);
                    }

                }else{
                    String trueDialogError =response.getBody() + ',' + response.getStatusCode() + ': ' + response.getStatus() + '\n'; 
                    throw new TrueDialogApiException(trueDialogError);
                } 
                
            }
            update conList; 

        }catch(Exception e) {
            System.debug('Exception caught: ' + e.getMessage());       
        }  
    }

    global void finish(Database.BatchableContext BC){
        System.debug('TrueDialogContactAPI executed successfully.');
    }

    public class TrueDialogApiException extends Exception {}
}