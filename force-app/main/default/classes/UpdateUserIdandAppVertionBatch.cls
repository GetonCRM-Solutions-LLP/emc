Public class UpdateUserIdandAppVertionBatch implements Database.Batchable<sObject>, Database.AllowsCallouts, Database.stateful {
    public static final String MLOGACCOUNT = System.Label.Triplog_New_URL;
    public String responseOfAPICall = '';
    
    Public UpdateUserIdandAppVertionBatch() {}

    Public List<Account> start(Database.BatchableContext bc) {  
        return [ SELECT id,
                        Name,
                        Triplog_API__c 
                    FROM Account 
                    WHERE isUsingTriplog__c = true 
                        AND Triplog_API__c != null ];
    }
    Public void execute(Database.BatchableContext bc, List<Account> scope){
        Set<Id> accountIds = new Set<Id>();
        List<Contact> contactToUpdateList = new List<Contact>();
        Map<String,Contact> contactMap = new Map<String,Contact>();
        
        for(Account accountObj : (List<Account>) scope){
            accountIds.add(accountObj.Id);
        }
        system.debug('accountIds==' + accountIds);
        for(Contact currentContact : [SELECT id,
                                            Name,
                                            Firstname,
                                            Triplog_UserID__c,
                                            External_Email__c,
                                            Deactivated_Date__c 
                                        FROM Contact 
                                        WHERE AccountId IN: accountIds 
                                            AND  (Role__c != 'Manager' 
                                            OR Role__c != 'Admin') ])
        {
            contactMap.put(currentContact.External_Email__c.toLowerCase(),currentContact);
        }

        for(Account accountObj : (List<Account>) scope){
            if (!Test.isRunningTest()) {
                responseOfAPICall = getTripIds(accountObj.Triplog_API__c);
            }
            system.debug('responseOfAPICall==' + responseOfAPICall);
            if(String.isNotBlank(responseOfAPICall) && responseOfAPICall != 'Error' ) { 
                TriplogJsonUserParse triplogRes = TriplogJsonUserParse.parse(responseOfAPICall); 
                system.debug('triplogRes==' + triplogRes);               
                if(triplogRes.user !=null && !triplogRes.user.isEmpty()) {

                    for(TriplogJsonUserParse.Users currentUser : triplogRes.user) {
                        if(String.isNotBlank(currentUser.email) && contactMap.containsKey(currentUser.email.toLowerCase())) {                             
                            Contact currentContact = new Contact();
                            system.debug('currentUser.id==' + currentUser.id);
                            currentContact = contactMap.get(currentUser.email);
                            currentContact.Triplog_UserID__c = String.valueOf(currentUser.id);
                            currentContact.App__c = currentUser.appVersion;
                            if(currentUser.timeZone != null){
                                List<String> resZone = currentUser.timeZone.split(',');                                
                                currentContact.Time_Zone__c = resZone[0].substringAfter('=').replace('\"', '');
                            }                             
                            contactToUpdateList.add(currentContact);
                        }
                    }
                }
                if(!contactToUpdateList.isEmpty()) {
                    List<Database.SaveResult> srList = Database.update(contactToUpdateList, false);
                }
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