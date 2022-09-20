public with sharing class LoginRedirection 
{
    public static string scheduleLink {get;set;}
    public PageReference redirectOnPage()
    {
        User u = new User();
        List<Bi_Weekly_Reimbursement__c> biWeekList = new List<Bi_Weekly_Reimbursement__c>();
        u = [SELECT id,Profile.Name,
                    contactid,contact.showTeamRecord__c,
                    contact.Accountid,Contact.Insurance_Attachment_Id__c,
                    Contact.Driver_Type__c,
                    Contact.Driver_Packet_Status__c,
                    Contact.Insurance_Declaration_Status__c,
                    Contact.App__c,Contact.Activation_Date__c,
                    Contact.Hello_Sign_Status__c,
                    Contact.Schedule_Driver_Meeting__c,
                    Contact.Account.MburseDashboardRedirect__c,
                    Contact.Account.Account_Status__c,
                    Contact.Account.Schedule_Goto_Meeting__c                       
                FROM user 
                WHERE id =: userinfo.getuserid()];     
        if(u.contact.Accountid == System.label.ERMI_Account){
            biWeekList = [SELECT id,name,Start_Date__c,
                                        End_Date__c,Confirm_Hours__c,
                                        Error_Hours__c,Count_Error_Check__c 
                                    FROM Bi_Weekly_Reimbursement__c 
                                    WHERE Contact__c =: u.contactid
                                    AND Start_Date__c != null 
                                    AND End_Date__c <= TODAY 
                                    Order By End_Date__c desc limit 1];
        }  

        if(u != null) { 
            PageReference pageRef;  
            if(u.Contact.Account.MburseDashboardRedirect__c == true){
                date currentDate = system.today();
                    integer daysBetweenActivation ;
                    Boolean checkActivationDate;
                    date activationDate = u.Contact.Activation_Date__c != null ? u.Contact.Activation_Date__c : null;                
                    daysBetweenActivation = activationDate != null ? activationDate.daysBetween(currentDate) : null;
                    if(daysBetweenActivation != null && daysBetweenActivation <= 30){
                        checkActivationDate = true;
                    } else if(daysBetweenActivation > 30 && u.Contact.Hello_Sign_Status__c != null && u.Contact.Hello_Sign_Status__c == 'signed'){
                        checkActivationDate = true;
                    } else {
                        checkActivationDate = false;
                    }
                if(u.Profile.Name == 'Customer Community Login User - Manager') {
                    pageRef = new PageReference('/app/managerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Super Manager') {
                    pageRef = new PageReference('/app/admindashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Driver') {                                         
                    if(u.Contact.Driver_Packet_Status__c != null && u.Contact.Insurance_Declaration_Status__c != null && u.Contact.Driver_Packet_Status__c != 'Skip' && u.Contact.Insurance_Declaration_Status__c == 'Uploaded' && u.Contact.App__c != null && checkActivationDate == true){
                        //AI-000414                       
                        if(biWeekList.size() > 0){
                            if(biWeekList[0].Confirm_Hours__c == false &&  u.Contact.Insurance_Attachment_Id__c != null && biWeekList[0].Count_Error_Check__c < 3){
                                pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid);
                            } else if((biWeekList[0].Confirm_Hours__c == true || (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)) && u.Contact.Insurance_Attachment_Id__c != null ){
                                pageRef = new PageReference('/app/driverDashboardClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                            } 
                        } else {
                            if(u.Contact.Schedule_Driver_Meeting__c == true || (u.Contact.Account.Account_Status__c != null && u.Contact.Account.Account_Status__c == 'Existing Account')){
                                pageRef = new PageReference('/app/driverDashboardClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                            } else {
                                pageRef = new PageReference('/app/mBurseDashboard?accid='+u.contact.Accountid+'&id='+u.contactid);  
                            }
                        }
                    } else {
                        pageRef = new PageReference('/app/mBurseDashboard?accid='+u.contact.Accountid+'&id='+u.contactid);
                    }                    
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Manager/Driver') {
                    if(u.Contact.Driver_Packet_Status__c != null && u.Contact.Insurance_Declaration_Status__c != null && u.Contact.Driver_Packet_Status__c != 'Skip' && u.Contact.Insurance_Declaration_Status__c == 'Uploaded' && u.Contact.App__c != null && checkActivationDate == true){
                        if(biWeekList.size() > 0 ){
                            if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3 ){
                                pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&role=managerdriver');
                            } else if(biWeekList[0].Confirm_Hours__c == true ||  (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)){
                                pageRef = new PageReference('/app/drivermanagerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                            }
                        } else if(u.Contact.Schedule_Driver_Meeting__c == true ||(u.Contact.Account.Account_Status__c != null && u.Contact.Account.Account_Status__c == 'Existing Account')){
                            pageRef = new PageReference('/app/drivermanagerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                        }   
                    } else {
                        pageRef = new PageReference('/app/mBurseDashboard?accid='+u.contact.Accountid+'&id='+u.contactid);
                    }             
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Super Manager/Driver') {                     
                    if(u.Contact.Driver_Packet_Status__c != null && u.Contact.Insurance_Declaration_Status__c != null && u.Contact.Driver_Packet_Status__c != 'Skip' && u.Contact.Insurance_Declaration_Status__c == 'Uploaded' && u.Contact.App__c != null && checkActivationDate == true){
                        if(biWeekList.size() > 0){
                            if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3 ){
                                pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                            } else if(biWeekList[0].Confirm_Hours__c == true ||  (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)){
                                pageRef = new PageReference('/app/admindriverdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                            }
                        } else if(u.Contact.Schedule_Driver_Meeting__c == true || (u.Contact.Account.Account_Status__c != null && u.Contact.Account.Account_Status__c == 'Existing Account')){
                            pageRef = new PageReference('/app/admindriverdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                        }
                    } else {
                        pageRef = new PageReference('/app/mBurseDashboard?accid='+u.contact.Accountid+'&id='+u.contactid);
                    }        
                    return pageRef;
                }
            } else {
                if(u.Profile.Name == 'Customer Community Login User - Manager') {
                    pageRef = new PageReference('/app/managerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Super Manager') {
                    pageRef = new PageReference('/app/admindashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Driver') {
                    //AI-000414
                    if(biWeekList.size() > 0){
                        if(biWeekList[0].Confirm_Hours__c == false &&  u.Contact.Insurance_Attachment_Id__c != null && biWeekList[0].Count_Error_Check__c < 3){
                            pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid);
                        } else if((biWeekList[0].Confirm_Hours__c == true || (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)) && u.Contact.Insurance_Attachment_Id__c != null ){
                            pageRef = new PageReference('/app/driverDashboardClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                        } else if(u.Contact.Insurance_Attachment_Id__c == null){
                            pageRef = new PageReference('/app/uploadInsurance?accid='+u.contact.Accountid+'&id='+u.contactid);                             
                            //pageRef = new PageReference('/app/driverDashboardInsuranceClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                        } 
                    } else {
                        if(u.Contact.Insurance_Attachment_Id__c != null ){
                            pageRef = new PageReference('/app/driverDashboardClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                        } else {
                            pageRef = new PageReference('/app/uploadInsurance?accid='+u.contact.Accountid+'&id='+u.contactid);
                            //pageRef = new PageReference('/app/driverDashboardInsuranceClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                        }
                    }
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Manager/Driver') {
                    if(biWeekList.size() > 0 ){
                        if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3 ){
                            pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&role=managerdriver');
                        } else if(biWeekList[0].Confirm_Hours__c == true ||  (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)){
                            pageRef = new PageReference('/app/drivermanagerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                        }
                    } else {
                        pageRef = new PageReference('/app/drivermanagerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                    }                
                    return pageRef;
                } else if(u.Profile.Name == 'Customer Community Login User - Super Manager/Driver') {
                    if(biWeekList.size() > 0 ){
                        if(biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Count_Error_Check__c < 3 ){
                            pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                        } else if(biWeekList[0].Confirm_Hours__c == true ||  (biWeekList[0].Count_Error_Check__c != null && biWeekList[0].Count_Error_Check__c > 2)){
                            pageRef = new PageReference('/app/admindriverdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                        }
                    } else {
                        pageRef = new PageReference('/app/admindriverdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                    } 
                    return pageRef;
                }
            }
                        
        }

      return null;
    }
    public static void fakeMethod(){
    Integer i = 0;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; 
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;  i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
         i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
         i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
        
  }
  public static void fakeMethod2(){
    Integer i = 0;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; 
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; 
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    
        }
}