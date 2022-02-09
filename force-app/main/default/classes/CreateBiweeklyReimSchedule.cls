global class CreateBiweeklyReimSchedule implements Schedulable	{
    public static final String JOB_NAME = 'BiWeekly PayPeriod Created for PL Marketing';
    
    global void execute(SchedulableContext sc) {
        CreateBiweeklyReim biWeeklyreimbursementtobecreated = new CreateBiweeklyReim(); 
        Database.executeBatch(biWeeklyreimbursementtobecreated, 1);
        
        System.abortJob(sc.getTriggerId());

        Datetime workTime = System.now().addDays(14);
        String CRONEXP = '' + workTime.second() + ' ' + workTime.minute() + ' ' + workTime.hour()
                + ' ' + workTime.day() + ' ' + workTime.month() + ' ? ' + workTime.year();

        System.schedule(JOB_NAME, CRONEXP, new CreateBiweeklyReimSchedule());
    }
}