global class ImportContactdatafromCSVController implements Database.Batchable<String>, Database.Stateful, Database.AllowsCallouts {
    global final Blob dataDocuments;
    global String exceptionMessage = '';
    global string accId;
    global string adminMailId;
    global Map<Integer,String> errorMap = new Map<Integer,String>();
    global List<Contact> allContactList = new List<Contact>();
    global String vehicleName;
   
    global ImportContactdatafromCSVController (String data,String accountId, String adminId){        
        Blob beforeblob = Blob.valueOf(data);
        this.dataDocuments = beforeblob;
        accId  = accountId;
        for(Contact con : [SELECT id,External_Email__c 
                            FROM contact 
                            WHERE id =: adminId]) {
                                adminMailId = con.External_Email__c;           
        }
    }
    
    global Iterable<String> start(Database.BatchableContext bc){    
        return new CSVIterator(this.dataDocuments.toString(), '\n');
    }
    
    global void execute(Database.BatchableContext info, List<String> scope){
        Savepoint spMain = Database.setSavepoint();
        
        Map<String, String> vehicleNameUrlMap = new Map<String, String>();
        Set<String> existingVehiclelist = new Set<String>();
        List<Vehicle_URL_Mapping__c> allVehiclelist = new List<Vehicle_URL_Mapping__c>();
        try {
                 TrueDialog_Keys__c tdKeys =TrueDialog_Keys__c.getInstance('TrueDialogKeys');
                 tdKeys.Contact_Insert_From_File__c = true;
                 update tdKeys;
                //Getting all vehicle details
                for (Vehicle_URL_Mapping__c veh : [SELECT Name FROM Vehicle_URL_Mapping__c limit 50000]) {
                    existingVehiclelist.add(veh.Name);
                }
                for(String row : scope){
                    string[] csvRecordData = row.split(',');
                    if(csvRecordData[29] != '' && csvRecordData[31] != '' && existingVehiclelist.contains(csvRecordData[29]) == false){
                        VehicleNameUrlMap.put((csvRecordData[29]).trim(), csvRecordData[31]);
                    }
                }
            
            //Insert Vehicles
            for(String vName : VehicleNameUrlMap.keySet()) {
                Vehicle_URL_Mapping__c vehicleObj = new Vehicle_URL_Mapping__c();
                vehicleObj.Name = vName;
                vehicleObj.Year__c = vName.substringBefore(' ');
                vehicleObj.vehicle__c = vName.substringAfter(' ');
                vehicleObj.URL__c = VehicleNameUrlMap.get(vName);
                allVehiclelist.add(vehicleObj);
            }
            Database.UpsertResult[] urVehicleList = Database.upsert(allVehiclelist, Vehicle_URL_Mapping__c.Name );
            if(allVehiclelist.size() > 0 && allVehiclelist[0].Name != null){
                vehicleName = allVehiclelist[0].Name;
            }
            
            for(String row : scope){
            System.debug('row=== '+row );
                String[] csvRecordData = row.split(',');
                System.debug('CSV Records'+csvRecordData);
                //System.debug('preparecontactList==='+preparecontactList(csvRecordData, accId));
                allContactList.add(preparecontactList(csvRecordData, accId, allVehiclelist[0].Name));
            }
            system.debug('allContactList=='  + allContactList);
            if(!allContactList.isEmpty()){
               
                System.debug('All Contact List: '+allContactList);
                Database.saveResult[] insertDriverList = Database.insert(allContactList, false);
                system.debug('insertDriverList=='  + insertDriverList);
                Integer erroFlagCount = 0;

                for (Database.saveResult sr : insertDriverList) {
                    system.debug('sr=='  + sr);
                    System.debug('sr sucess: '+ sr.isSuccess());
                    if (sr.isSuccess() == false) {
                        for(Database.Error objErr : sr.getErrors()) {
                            String errorlog = json.serialize(objErr);
                            system.debug('error list: '+errorlog);
                            //errorMap.put(erroFlagCount, errorlog);
                            errorMap.put(erroFlagCount, objErr.getMessage());
                            System.debug('Error in insert Contact ' + errorMap);
                        }
                    }
                    erroFlagCount ++;
                }
            
                /*List<Database.SaveResult> insertDriverList = Database.insert(allContactList, false);
                Integer erroFlagCount = 0;
                for(Integer i=0;i<insertDriverList.size();i++){
                    if (insertDriverList.get(i).isSuccess()){
                        insertDriverList.get(i).getId();

                    }else if (!insertDriverList.get(i).isSuccess()){
                        // DML operation failed
                       Database.Error error = insertDriverList.get(i).getErrors().get(0);
                        //String failedDML = error.getMessage();
                        allContactList.get(i);//failed record from the list
                        system.debug('Failed ID'+allContactList.get(i).Id);
                            errorMap.put(erroFlagCount, error.getMessage());
                    }
                    erroFlagCount ++;
                }  */
            }
            system.debug('errorMap=='  + errorMap);
            Map<String, Contact> contactMap = new Map<String, Contact>();
            Id adminId;
            system.debug('');
            for(Contact conObj : allContactList){
                if(conObj.id != null){
                    contactMap.put(conObj.Email, conObj);
                    if(conObj.Role__c != null && conObj.Role__c != '' && conObj.Role__c != 'Driver' /*&& (conObj.Manager_External_Email__c == null || conObj.Manager_External_Email__c == '')*/){
                        adminId = conObj.id;
                    }
                }
            }
            Map<String, Contact> oldContactMap = new Map<String, Contact>();
            if(accId != null && accId != ''){
                Account accountContactList = [Select id,(Select id,Email,Admin__c,Manager__c,Manager_External_Email__c from contacts) from account where id =: accId];
                
                for(Contact conListObj : accountContactList.contacts){
                    if(conListObj.Id != null){
                        oldContactMap.put(conListObj.Email, conListObj);
                        if((conListObj.Manager__c == null) && conListObj.Manager_External_Email__c != null && !contactMap.containskey(conListObj.Email)){
                            System.debug('11-->');
                            contactMap.put(conListObj.Email, conListObj);
                        }                        
                        if(adminId != null) {
                            adminId = conListObj.Admin__c;
                        }
                            
                    }
                }
            }
            for(contact conObj : contactMap.values()){
                if((conObj.Manager__c == null) && conObj.Manager_External_Email__c != null){
                    contactMap.get(conObj.Email).Manager__c = contactMap.containsKey(conObj.Manager_External_Email__c) ? contactMap.get(conObj.Manager_External_Email__c)?.Id : oldContactMap.containsKey(conObj.Manager_External_Email__c) ? oldContactMap.get(conObj.Manager_External_Email__c)?.Id : null;
                    if(conObj.Manager_External_Email__c != null && conObj.Manager_External_Email__c != '') {
                        contactMap.get(conObj.Email).Admin__c = adminId;
                    }
                        
                }
            }
            Database.saveResult[] insertDriverList = Database.update(contactMap.values(), false);
            
        }   catch(Exception e){
            exceptionMessage = 'Exception:-'+e.getMessage()+' '+e.getLineNumber();
            System.debug('Exception error Messagae'+e.getMessage());
            Database.rollback(spMain);
        }
    }

    public static Contact preparecontactList(String[] csvRecordData, string accId, String vehicleName){
        System.debug('csv record data'+csvRecordData);
        String invalidNumbers = '[^0-9]';
        Contact conObj = new Contact();
        conObj.Role__c = csvRecordData[0] ;
        if (accId != null) { 
            conObj.AccountId = accId;
        }             
        conObj.FirstName = csvRecordData[1];

        //below two field added to not activate community user when contact is created.
        conObj.isCommunityUser__c = false;
        conObj.IsCreatedFromCommunity__c = false;
    
        conObj.LastName = csvRecordData[2];
        conObj.Email = csvRecordData[3];
        conObj.External_Email__c = csvRecordData[3];  
        conObj.MobilePhone = csvRecordData[4];
        conObj.Phone = csvRecordData[4];
        conObj.MailingCity = csvRecordData[5];
        conObj.MailingState = csvRecordData[6];
        conObj.MailingPostalCode = csvRecordData[7];
        conObj.Department = csvRecordData[8];   
        conObj.Job_Title__c = csvRecordData[9];
        conObj.Manager_First_Name__c = csvRecordData[10];
        conObj.Manager_Last_Name__c = csvRecordData[11];
        string managerExtEmail = csvRecordData[12];
        if (managerExtEmail != '') {
            conObj.Manager_External_Email__c = managerExtEmail;
        }

        if(csvRecordData[29] != ''){conObj.Vehicle_Type__c = csvRecordData[29]; }  
        if(csvRecordData[13] != '' && csvRecordData[13] != null && csvRecordData[13] != 'null'){conObj.Insurance_Rate__c = Decimal.valueOf(csvRecordData[13]);}
        if(csvRecordData[14] != '' && csvRecordData[14] != null && csvRecordData[14] != 'null'){conObj.License_Ragistration__c = Decimal.valueOf(csvRecordData[14]);}
        if(csvRecordData[15] != '' && csvRecordData[15] != null && csvRecordData[15] != 'null'){conObj.Taxes__c = Decimal.valueOf(csvRecordData[15]);}
        if(csvRecordData[16] != '' && csvRecordData[16] != null && csvRecordData[16] != 'null'){conObj.Depreciation__c = Decimal.valueOf(csvRecordData[16]);}
        if(csvRecordData[17] != '' && csvRecordData[17] != null && csvRecordData[17] != 'null'){conObj.Annual_Fixed_Cost__c = Decimal.valueOf(csvRecordData[17]);}
        if(csvRecordData[18] != '' && csvRecordData[18] != null && csvRecordData[18] != 'null'){conObj.Fixed_Amount__c = Decimal.valueOf(csvRecordData[18]) ; }
        if(csvRecordData[19] != '' && csvRecordData[19] != null && csvRecordData[19] != 'null'){conObj.Fixed_Cost_Adjustment__c = Decimal.valueOf(csvRecordData[19]);}
        if(csvRecordData[20] != '' && csvRecordData[20] != null && csvRecordData[20] != 'null'){conObj.Total_Fixed_Costs__c = Decimal.valueOf(csvRecordData[20]);}
        if(csvRecordData[21] != '') {conObj.Meeting__c = csvRecordData[21];}
        //conObj.Packet__c = csvRecordData[26];
        if(csvRecordData[23] != '') {
            conObj.Added_Date__c = convertDateFormat(csvRecordData[23]);
        }

        if(csvRecordData[24] != ''){
            conObj.Activation_Date__c = convertDateFormat(csvRecordData[24]);    
        }
        if(csvRecordData[25] != '' && csvRecordData[25] != 'null' && csvRecordData[25] != null){conObj.MPG__c = Decimal.valueOf(csvRecordData[25]);}   
        if(csvRecordData[26] != '' && csvRecordData[26] != 'null' && csvRecordData[26] != null){conObj.Maintenance__c = Decimal.valueOf(csvRecordData[26]);}   
        if(csvRecordData[27] != '' && csvRecordData[27] != 'null' && csvRecordData[27] != null){conObj.Tires__c = Decimal.valueOf(csvRecordData[27]);}
        if(csvRecordData[28] != '' && csvRecordData[28] != 'null' && csvRecordData[28] != null){conObj.Maintenance_and_Tires__c = Decimal.valueOf(csvRecordData[28]) ; }            
        if(csvRecordData[29] != ''){
            conObj.Vehicle_Type__c = csvRecordData[29];
        } else {
            conObj.Vehicle_Type__c = vehicleName;
        } 
        if(csvRecordData[30] != '' && csvRecordData[30] != 'null' && csvRecordData[30] != null){conObj.Compliance_Mileage__c = Decimal.valueOf(csvRecordData[30]);}
        if(csvRecordData[31] != ''){conObj.Car_Image__c = csvRecordData[31];}
        System.debug('conObj :::' +conObj);
        return conObj;
    }
    public static Date convertDateFormat(String csvRecordData){
        String[] dts;
        Date myDateIN;
        if(csvRecordData.contains('/')){
            dts = csvRecordData.split('/');
            system.debug('dts==' + dts );
            if(dts[2].contains(' ')){ 
                dts[2] = dts[2].split(' ')[0];
                myDateIN = Date.newinstance(Integer.valueOf(dts[0]), Integer.valueOf(dts[1]), Integer.valueOf(dts[2]));
            } else {               
                myDateIN = Date.newinstance(Integer.valueOf(dts[2]), Integer.valueOf(dts[0]), Integer.valueOf(dts[1]));                
            }
        } else if (csvRecordData.contains('-')){
            dts = csvRecordData.split('-');
            if(dts[2].contains(' ')){ 
                dts[2] = dts[2].split(' ')[0];               
                myDateIN = Date.newinstance(Integer.valueOf(dts[0]), Integer.valueOf(dts[1]), Integer.valueOf(dts[2]));
            } else {               
                myDateIN = Date.newinstance(Integer.valueOf(dts[2]), Integer.valueOf(dts[0]), Integer.valueOf(dts[1]));
            }           
        }
        return myDateIN;
    }
    global void finish(Database.BatchableContext info){  


        for(Contact con : allContactList){
            if(con.id != null) {
                try {                 
                    contactTriggerHelper.putHTTPCallout(con.AccountId,con.External_Email__c);
                } catch(Exception e){
                      system.debug('Catch=');
                }
            }
           
        }       
       
        Set<String> tmpConIdSet = new Set<String>();
        for(contact con : allContactList){
            tmpConIdSet.add(con.Id);     
        }
        Map<Id,Contact> contactIdMap =  new Map<Id, Contact>([select id, MobilePhone,
                                        Email,Account.True_Dialog__c FROM Contact 
                                        WHERE id IN: tmpConIdSet AND Account.True_Dialog__c=true ]);
        system.debug('contactIdMap=='+ contactIdMap);
        Set<Id> contactIdSet=contactIdMap.keyset();      
     
        TrueDialog_Keys__c tdKeys =TrueDialog_Keys__c.getInstance('TrueDialogKeys');

        if(contactIdSet.size() > 0  ){
            tdKeys.Contact_Insert_From_File__c = true;
            update tdKeys;            
            TrueDialog_Keys__c tdKeys1 =TrueDialog_Keys__c.getValues('TrueDialogKeys');        
            TrueDialogContactAPI tdContactApi = new TrueDialogContactAPI(contactIdSet);
            Database.executeBatch(tdContactApi,5);
        }        
        String errorEmail = adminMailId;
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {errorEmail};
        email.setToAddresses(toAddresses);
        String errorSubject;
        String htmlbody;
        Boolean emailFalg = false;
        System.debug('exception message: '+exceptionMessage);
        System.debug('error map is empty: '+errorMap.isEmpty());
      
        if((exceptionMessage == null || exceptionMessage == '') && !errorMap.isEmpty()) {           
            Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
            String finalstr;
            
           string header = 'Role'+','+'First Name'+','+'Last Name'+','+'Email Address'+','+'Cell Phone'+','+'City'+','+'State'+','+'Zip Code'+','+'Department'+','+'Job Title'+','+'Managers First Name'+','+'Managers Last Name'+','+'Managers Email'+','+'Insurance Rate'+','+'License and Registration'+','+'Personal Property Tax'+','+'Depreciation'+','+'Annual Fixed Cost'+','+'Fixed Amount'+','+'FCA'+','+'Total Fixed Amount'+','+'Meeting'+','+'Packet'+','+'Date Added'+','+'Activation Date'+','+'MPG'+','+'Maint'+','+'Tires'+','+'Maint/Tires'+','+'Standard Vehicle'+','+'Compliance Mileage'+','+'Vehicle URL'+','+'Error'+' \n';
           
            finalstr = header;
            String cellPhone,managersEmail,insuraceRate,licenseandRegistration,personalPropertyTax,depreciation,annualFixedCost,
            fixedAmount,fca,totalFixedAmount,meeting,addedDate,activationDate,mpg,maint,tires,maintTires,standardVehicle,
            complianceMileage,vehicleURL;

            for(Integer mapkey : errorMap.keySet()){
                    cellPhone = String.valueof(allContactList.get(mapkey)?.Phone) != null ? String.valueof(allContactList.get(mapkey)?.Phone) : '';
                    managersEmail = allContactList.get(mapkey).Manager_External_Email__c != null ? allContactList.get(mapkey).Manager_External_Email__c : '';
                    insuraceRate = String.valueof(allContactList.get(mapkey)?.Insurance_Rate__c) != null ? String.valueof(allContactList.get(mapkey)?.Insurance_Rate__c)  : '';
                    licenseandRegistration = String.valueof(allContactList.get(mapkey).License_Ragistration__c) != null ? String.valueof(allContactList.get(mapkey).License_Ragistration__c) : '';
                    personalPropertyTax = String.valueof(allContactList.get(mapkey).Taxes__c) != null ? String.valueof(allContactList.get(mapkey).Taxes__c) : '';
                    depreciation = String.valueof(allContactList.get(mapkey).Depreciation__c) != null ? String.valueof(allContactList.get(mapkey).Depreciation__c) : '';
                    annualFixedCost = String.valueof(allContactList.get(mapkey).Annual_Fixed_Cost__c) != null ? String.valueof(allContactList.get(mapkey).Annual_Fixed_Cost__c) : '';
                    fixedAmount = String.valueof(allContactList.get(mapkey).Fixed_Amount__c) != null ? String.valueof(allContactList.get(mapkey).Fixed_Amount__c) : '';
                    fca = String.valueof(allContactList.get(mapkey).Fixed_Cost_Adjustment__c) != null ? String.valueof(allContactList.get(mapkey).Fixed_Cost_Adjustment__c) : '';
                    totalFixedAmount = String.valueof(allContactList.get(mapkey).Total_Fixed_Costs__c) != null ? String.valueof(allContactList.get(mapkey).Total_Fixed_Costs__c) : '';
                    meeting = allContactList.get(mapkey).Meeting__c != null ? allContactList.get(mapkey).Meeting__c : '';
                    mpg = String.valueof(allContactList.get(mapkey).MPG__c) != null ? String.valueof(allContactList.get(mapkey).MPG__c) : '';
                    maint = String.valueof(allContactList.get(mapkey).Maintenance__c) != null ? String.valueof(allContactList.get(mapkey).Maintenance__c) : '';
                    tires = String.valueof(allContactList.get(mapkey).Tires__c) != null ? String.valueof(allContactList.get(mapkey).Tires__c) : '';
                    maintTires = String.valueof(allContactList.get(mapkey).Maintenance_and_Tires__c) != null ? String.valueof(allContactList.get(mapkey).Maintenance_and_Tires__c): '';
                    standardVehicle = allContactList.get(mapkey).Vehicle_Type__c != null ? allContactList.get(mapkey).Vehicle_Type__c : '';
                    complianceMileage = String.valueOf(allContactList.get(mapkey).Compliance_Mileage__c) != null ? String.valueof(allContactList.get(mapkey).Compliance_Mileage__c) : '';
                    vehicleURL = allContactList.get(mapkey).Car_Image__c != null ? allContactList.get(mapkey).Car_Image__c : '';
                    
                    if(allContactList.get(mapkey).Added_Date__c != null) {
                        addedDate = allContactList.get(mapkey).Added_Date__c != null ? allContactList.get(mapkey).Added_Date__c.day() + '/' + allContactList.get(mapkey).Added_Date__c.month()+'/'+ allContactList.get(mapkey).Added_Date__c.year() : '';
                    }
                    if(allContactList.get(mapkey)?.Activation_Date__c != null) {
                        activationDate = allContactList.get(mapkey).Activation_Date__c != null ? allContactList.get(mapkey).Activation_Date__c.day() + '/' + allContactList.get(mapkey).Activation_Date__c.month()+'/'+ allContactList.get(mapkey).Activation_Date__c.year() : '';
                    
                    String recordstring = '"'+allContactList.get(mapkey).Role__c+'","'+allContactList.get(mapkey).FirstName+'","'+allContactList.get(mapkey).LastName+'","'+allContactList.get(mapkey).Email+'","'+CellPhone+'","'+allContactList.get(mapkey).MailingCity+'","'+allContactList.get(mapkey).MailingState+'","'+allContactList.get(mapkey).MailingPostalCode+'","'+allContactList.get(mapkey).Department+'","'+allContactList.get(mapkey).Job_Title__c+'","'+allContactList.get(mapkey).Manager_First_Name__c+'","'+allContactList.get(mapkey).Manager_Last_Name__c+'","'+ManagersEmail+'","'+insuraceRate +'","'+LicenseandRegistration+'","'+PersonalPropertyTax+'","'+Depreciation+'","'+AnnualFixedCost+'","'+FixedAmount+'","'+FCA+'","'+TotalFixedAmount+'","'+Meeting+'","'+''+'","'+addedDate+'","'+activationDate+'","'+MPG+'","'+Maint+'","'+Tires+'","'+MaintTires+'","'+StandardVehicle+'","'+ComplianceMileage+'","'+VehicleURL+'","'+errorMap.get(mapkey)+'"    \n';
                    
                    finalstr = finalstr + recordstring;
                    }   
            }          
            
            attach.setBody(blob.valueOf(finalstr));
            attach.setFileName('Contact Error File .Csv');
            errorSubject = 'Error Result Of Contact Csv File';
            htmlbody = 'Your job is not completed due to some record has error, so please see the last column in attached csv file for error';
            email.setFileAttachments(new Messaging.EmailFileAttachment[] {attach});
        }if((exceptionMessage == null || exceptionMessage == '') && errorMap.isEmpty()) {
            emailFalg = true;          
        }else if(exceptionMessage != null && exceptionMessage != ''){
            errorSubject = 'Your job is rollback';
            htmlbody = 'Your job is rollback due to the error '+exceptionMessage + ',  please upload again or connect administrator';
        }
        email.setSubject(errorSubject);
        email.setHTMLBody(htmlbody);
        if(emailFalg == false) {
            Messaging.SendEmailResult [] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});   
        }

       
    } 
     
}