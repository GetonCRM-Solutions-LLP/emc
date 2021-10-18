public class JSONMilList {
    public String Trip_Date;
    public String Trip_Origin;
    public String Trip_Destination;
    public String Trip_Status;
    public String Approved_Date;
    public String Day_Of_Week;
<<<<<<< HEAD
    public Integer Actual_Mileage;
=======
    public Double Actual_Mileage;
>>>>>>> 23d15e014b76ce594205833d4b868697b34d67c7
    public String Activity;
    public String Contact_Email;
    public Integer EmployeeId;
    public String Notes;
    public String Tag;
    public static List<JSONMilList> parse(String json) {
        return (List<JSONMilList>) System.JSON.deserialize(json, List<JSONMilList>.class);
    }
}