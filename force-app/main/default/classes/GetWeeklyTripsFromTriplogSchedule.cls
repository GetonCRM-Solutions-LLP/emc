global class GetWeeklyTripsFromTriplogSchedule implements Schedulable {
    global void execute(SchedulableContext sc) {
        GetWeeklyTripsFromTriplog reimbursementtobecreated = new GetWeeklyTripsFromTriplog('U'); 
        Database.executeBatch(reimbursementtobecreated, 1);
    }
}