public class HelloSignIntegrationHandler{
    @future(callout=true)
    public static void sendSignatureRequestForDriver(Set<String> newUserEmail){
        try{
            List<Contact> contactList = [Select id,Role__c,AccountId,Name,email,Hello_Sign_Request_Id__c,Hello_Sign_Status__c,
                                            Admin__c,Admin__r.Name,Admin__r.Email
                                            from contact 
                                            where email in : newUserEmail 
                                            and Role__c  in ('Driver','Driver/Manager','Driver/Admin')];
            Hello_Sign__c helloSignCustomSetting = Hello_Sign__c.getValues(Constants.apiOwnerName);
            Map<String, Contact> contactMap = new Map<String, Contact>();
            Set<Id> contactIds = new Set<Id>();
            for(Contact conObj : contactList){
                if(!contactMap.containskey(conObj.Email)){
                    contactMap.put(conObj.Email, conObj);
                }
                contactIds.add(conObj.Id);
            }
             System.debug('contactIds-->'+contactIds);
            Map<Id,Id> docAndAccountId = new Map<Id,Id>();
            if(!contactIds.isEmpty()){
            System.debug('contactIds-->'+contactIds);
                for( ContentDocumentLink contentDocLink : [SELECT ContentDocumentId,LinkedEntityId ,ContentDocument.LatestPublishedVersion.Title
                                                            FROM ContentDocumentLink 
                                                            where LinkedEntityId in : contactIds 
                                                            and ContentDocument.LatestPublishedVersion.Title =: Constants.driverAgreement]){
                                                            System.debug('contentDocLink -->'+contentDocLink );
                                docAndAccountId.put(contentDocLink.LinkedEntityId, contentDocLink.ContentDocumentId);
                }
            }
            System.debug('docAndAccountId-->'+docAndAccountId);
            HelloSign.SignatureRequestService sigReq;
            for(Contact conObj : contactList){
                sigReq = new HelloSign.SignatureRequestService();
                String adminName = conObj.Admin__r?.Name;
                String adminEmail = conObj.Admin__r?.Email;
                if(adminEmail == null || adminEmail == ''){
                    adminName = helloSignCustomSetting.Admin_Name__c;//'Manan Patel';
                    adminEmail = helloSignCustomSetting.Admin_Email__c;//'manan.patel@getoncrm.com';
                }
                //String adminEmail = 'willh@mburse.com';
                
                sigReq.fileIds = new List<Id>{ docAndAccountId.containsKey(conObj.Id) ? docAndAccountId.get(conObj.Id) : null };

                Map<String, HelloSign.ServiceObjects.Signer> signerMap = new Map<String, HelloSign.ServiceObjects.Signer>();
                HelloSign.ServiceObjects.Signer signer0 = new HelloSign.ServiceObjects.Signer(conObj.Email, conObj.Name);
                signer0.order = 0;
                signerMap.put('0', signer0);
                HelloSign.ServiceObjects.Signer signer1 = new HelloSign.ServiceObjects.Signer(adminEmail, adminName);
                signer1.order = 1;
                signerMap.put('1', signer1);
                sigReq.signers = signerMap;

                sigReq.test_mode = helloSignCustomSetting.TestMode__c;
                sigReq.use_text_tags = true;
                sigReq.hide_text_tags = true;
                sigReq.subject = Constants.signatureRequest;
                HelloSign.ServiceObjects.SignatureRequestResponse responseJSON;
                System.debug('sigReq-->'+sigReq);
                if(!Test.isRunningTest()){  responseJSON = sigReq.send(false);    
                }else{
                    responseJSON = new HelloSign.ServiceObjects.SignatureRequestResponse();
                }
                
                System.debug('responseJSON-->'+String.valueOf(responseJSON));
                String emailString='';
                if(responseJSON != null){
                    for(HelloSign.ServiceObjects.Signature signatureObj : responseJSON.signature_request.signatures){
                        if(contactMap.containskey(signatureObj.signer_email_address)){contactMap.get(signatureObj.signer_email_address).Hello_Sign_Request_Id__c = responseJSON.signature_request.signature_request_id;contactMap.get(signatureObj.signer_email_address).Packet__c = Constants.sentForSignature; ContactMap.get(signatureObj.signer_email_address).Document_Sent_Date__c = System.today();
                            if(signatureObj.order == 0){emailString = signatureObj.signer_email_address;contactMap.get(signatureObj.signer_email_address).Hello_Sign_Status__c = signatureObj.status_code;}
                        }
                        if(signatureObj.order == 1){contactMap.get(emailString).Hello_Sign_Admin_Status__c = signatureObj.status_code;
                        }
                    }
                }
                //time delay
                Long startingTime = System.now().getTime();long delayInMilliseconds = 200;while (System.now().getTime() - startingTime < delayInMilliseconds){}
            }
            if(!contactMap.values().isEmpty()){ Database.update(contactMap.values(), false);
                System.debug('contactMap.values()-->'+contactMap.values());
            }
        }catch(Exception e){
            System.debug('Exception Occur:- '+e.getmessage()+' - Line:-'+e.getLineNumber());
        }
    }
}