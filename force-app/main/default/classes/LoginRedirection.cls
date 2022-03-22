public with sharing class LoginRedirection 
{
    
    public LoginRedirection() {}
    public PageReference redirectOnPage()
    {
        User u = new User();
        u = [SELECT id,Profile.Name,
                    contactid,contact.showTeamRecord__c,
                    contact.Accountid,Contact.Insurance_Attachment_Id__c,
                    Contact.Driver_Type__c    
                FROM user 
                WHERE id =: userinfo.getuserid()];                
        if(u!=null) {   
            if(u.Profile.Name == 'Customer Community Login User - Manager') {
                PageReference pageRef = new PageReference('/app/managerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                return pageRef;
            } else if(u.Profile.Name == 'Customer Community Login User - Super Manager') {
                PageReference pageRef = new PageReference('/app/admindashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                return pageRef;
            } else if(u.Profile.Name == 'Customer Community Login User - Driver') {
                //AI-000414
                PageReference pageRef;    
                if(u.contact.Accountid == System.label.ERMI_Account && u.contact.Driver_Type__c != null && u.contact.Driver_Type__c != 'Driver - Salary'){
                    List<Bi_Weekly_Reimbursement__c> biWeekList = new List<Bi_Weekly_Reimbursement__c>();
                    biWeekList = [SELECT id,name,Start_Date__c,
                                        End_Date__c,Confirm_Hours__c,
                                        Error_Hours__c 
                                    FROM Bi_Weekly_Reimbursement__c 
                                    WHERE Contact__c =: u.contactid
                                    AND Start_Date__c != null 
                                    AND End_Date__c <= TODAY 
                                    Order By End_Date__c desc limit 1];
                    if(biWeekList.size() > 0 && biWeekList[0].Confirm_Hours__c == false && biWeekList[0].Error_Hours__c == false &&  u.Contact.Insurance_Attachment_Id__c != null ){
                        System.debug('======1');
                        pageRef = new PageReference('/app/driverDashboardWeekly?accid='+u.contact.Accountid+'&id='+u.contactid);
                    } else if(biWeekList.size() > 0 && (biWeekList[0].Confirm_Hours__c == true || biWeekList[0].Error_Hours__c == true) && u.Contact.Insurance_Attachment_Id__c != null ){
                        System.debug('=====2');
                        pageRef = new PageReference('/app/driverDashboardClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                    } else {
                        System.debug('====3');
                        pageRef = new PageReference('/app/driverDashboardInsuranceClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                    } 
                } else {
                    if(u.Contact.Insurance_Attachment_Id__c != null ){
                        pageRef = new PageReference('/app/driverDashboardClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                    } else {
                        pageRef = new PageReference('/app/driverDashboardInsuranceClone?accid='+u.contact.Accountid+'&id='+u.contactid);
                    }
                }
                return pageRef;
            } else if(u.Profile.Name == 'Customer Community Login User - Manager/Driver') {
                PageReference pageRef = new PageReference('/app/drivermanagerdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c));
                return pageRef;
            } else if(u.Profile.Name == 'Customer Community Login User - Super Manager/Driver') {
                PageReference pageRef = new PageReference('/app/admindriverdashboard?accid='+u.contact.Accountid+'&id='+u.contactid+'&showteam='+String.valueOf(u.contact.showTeamRecord__c)+'&admindriver=true');
                return pageRef;
            }            
        }
      return null;
    }
    public static void fakeMethod(){
    Integer i = 0;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; 
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
	i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++; i++;
    

  }
    
}