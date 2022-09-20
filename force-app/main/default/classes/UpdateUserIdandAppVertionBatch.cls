/*
 * @Author:  GetonCRM Solutions LLP
 * @Description:  Batch class to fetch UserId,App version and Timezone of contacts from TripLog and update 
 * ------------------------------------------------------------------------------------------------------------------------
 * @Modification Logs
 * ------------------------------------------------------------------------------------------------------------------------
 * @version 1.1   - @Author:  Paras Dhanani - 01 September 2022
 * @Description: Update a code to run this batch daily basis
 */

Public class UpdateUserIdandAppVertionBatch implements Database.Batchable<sObject>, Database.AllowsCallouts, Database.stateful {
    public static final String MLOGACCOUNT = System.Label.Triplog_New_URL;
    public String responseOfAPICall = '';
    public String query;
    
    Public UpdateUserIdandAppVertionBatch(String accountId) {
        if(Test.isRunningTest()) {
            query = 'SELECT Id,Name, AccountId,Firstname,Triplog_UserID__c,Account.Triplog_API__c ,External_Email__c, App__c,Time_Zone__c, Deactivated_Date__c  FROM contact' ; 
        } else {
            query = 'SELECT Id,Name, AccountId,Firstname,Triplog_UserID__c,Account.Triplog_API__c ,External_Email__c, App__c,Time_Zone__c, Deactivated_Date__c FROM contact' + 
                    ' WHERE Deactivated_Date__c= null AND '  + 
                    '(Role__C != \'Admin\' OR Role__c != \'Manager\') AND '  + 
                    'Account.isUsingTriplog__c = true  AND Account.Triplog_API__c != null AND ' +  
                    'AccountId = \'' + accountId+ '\' ';
        }
    }

    Public Database.QueryLocator start(Database.BatchableContext bc) {  
        system.debug('Query==' + Query);
        return Database.getQueryLocator(query);
    }
    Public void execute(Database.BatchableContext bc, List<sObject> scope){
       Set<Id> accountIds = new Set<Id>();
        List<Contact> contactToUpdateList = new List<Contact>();
        Map<String,Contact> contactMap = new Map<String,Contact>();
        Map<String,String> userIDMap = new Map<String,String>();
        Map<String,String> appVertionMap = new Map<String,String>();
        Map<String,String> timeZoneMap = new Map<String,String>();
        List<String> resZone;
        String apikey;
        for (contact currentContact : (List<contact>) scope){
            apikey = currentContact.Account.Triplog_API__c;
            accountIds.add(currentContact.AccountId);
            contactMap.put(currentContact.External_Email__c.toLowerCase(),currentContact);
            userIDMap.put(currentContact.External_Email__c.toLowerCase(),currentContact.Triplog_UserID__c);
            appVertionMap.put(currentContact.External_Email__c.toLowerCase(),currentContact.App__c);
            timeZoneMap.put(currentContact.External_Email__c.toLowerCase(),currentContact.Time_Zone__c);
        }  
            responseOfAPICall = getTripIds(apikey );
            
            if(String.isNotBlank(responseOfAPICall) && responseOfAPICall != 'Error' ) { 
                TriplogJsonUserParse triplogRes = TriplogJsonUserParse.parse(responseOfAPICall);         
                if(triplogRes.user !=null && !triplogRes.user.isEmpty()) {

                    for(TriplogJsonUserParse.Users currentUser : triplogRes.user) {
                        system.debug('currentUser==' + currentUser.Email);
                        system.debug('mapemail==' + contactMap);
                        if(String.isNotBlank(currentUser.email) && contactMap.containsKey(currentUser.email.toLowerCase())) {                             
                            Contact currentContact = new Contact();
                            system.debug('currentUser.id==' + currentUser.id);
                            currentContact = contactMap.get(currentUser.email);
                            if(currentUser.timeZone != null){
                                resZone = currentUser.timeZone.split(',');                                  
                            } 
                            if(!userIDMap.containsKey(String.valueOf(currentUser.id))){
                                currentContact.Triplog_UserID__c = String.valueOf(currentUser.id);
                            }
                            if(!appVertionMap.containsKey(String.valueOf(currentUser.appVersion))){
                                currentContact.App__c = currentUser.appVersion;
                            }
                            if(currentUser.timeZone != null){
                                resZone = currentUser.timeZone.split(',');                                  
                            } 
                            if(!timeZoneMap.containsKey(resZone[0].substringAfter('=').replace('\"', ''))){
                                currentContact.Time_Zone__c = resZone[0].substringAfter('=').replace('\"', '');
                            }
                            /*if(currentUser.timeZone != null){
                                List<String> resZone = currentUser.timeZone.split(',');                                
                                currentContact.Time_Zone__c = resZone[0].substringAfter('=').replace('\"', '');
                            } */                            
                            contactToUpdateList.add(currentContact);
                        }
                    }
                }
                if(!contactToUpdateList.isEmpty()) {
                    List<Database.SaveResult> srList = Database.update(contactToUpdateList, false);
                }
            }
        

    }

    Public void finish(Database.BatchableContext bc){}

    Public Static String getTripIds(String passedApikey)
    {
        String baseURL = !MLOGACCOUNT.Contains(passedApikey) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint( baseURL + '/api/users');
        request.setMethod('GET');
        request.setHeader('Authorization','apikey ' + passedApikey);
        HttpResponse response = http.send(request);
        
        return response.getStatusCode() == 200 ? response.getBody() : 'Error';
    }
}