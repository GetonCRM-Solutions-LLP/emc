/* eslint-disable no-unused-expressions */
import { LightningElement, api, track } from "lwc";
import { directions , manualMileage} from 'c/apexUtils'
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
export default class ManualEntry extends LightningElement {
  @api contactId;
  @api accountId;
  dropdownList;
  modalColumn;
  modalKeyFields;
  locationName = '';
  locationAddress = '';
  locationId = '';
  _range = '';
  keyFields = ["id", "name", "address"];
  placeholder;
  headerText = '';
 @track directionList;
  editModal = false;
  isSortable = false;
  isScrollable = false;
  paginatedModal = false;
  noMessage = 'There is no trip data available'
  searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
  modelList;
  _RkeyFields = [
    "tripdate",
    "fromLocation",
    "toLocation",
    "mileage",
    "notes",
    "tag"
  ];
  _Rcolumn = [
    {
      id: 1,
      name: "Trip date",
      colName: "tripdate",
      colType: "Date",
      arrUp: true,
      arrDown: false
    },
    {
      id: 2,
      name: "From",
      colName: "fromLocation",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 3,
      name: "To",
      colName: "toLocation",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 4,
      name: "Mileage",
      colName: "mileage",
      colType: "Decimal",
      arrUp: false,
      arrDown: false
    },
    {
      id: 5,
      name: "Notes",
      colName: "notes",
      colType: "String",
      arrUp: false,
      arrDown: false
    },
    {
      id: 6,
      name: "Tags",
      colName: "tag",
      colType: "String",
      arrUp: false,
      arrDown: false
    }
  ];

  // @track modalList = [
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/9/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/9/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/8/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/8/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 1.1,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/8/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 1.1,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/8/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/7/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/7/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/5/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/5/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/4/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/4/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/3/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/3/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/2/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/2/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/1/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "11/1/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/31/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/31/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/29/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/29/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/28/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/28/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/27/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/27/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/26/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/26/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/25/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/25/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/24/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/24/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/22/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/22/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/21/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/21/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/20/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/20/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/19/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/19/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/18/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/18/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/17/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/17/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/15/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/15/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/14/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/14/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/13/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 1.1,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/13/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/13/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 1.1,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/13/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/12/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 34,
  //     "From Location Name": "",
  //     "From Location Address": "S&S Tire 590 Hill Avenue Nashville, TN 37120",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/12/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 34,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "S&S Tire 590 Hill Avenue Nashville, TN 37120",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/12/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/11/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/11/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7.9,
  //     "From Location Name": "",
  //     "From Location Address": "5044 Murfreesboro Rd LaVergne, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/11/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 23.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "5044 Murfreesboro Rd LaVergne, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/10/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 23.6,
  //     "From Location Name": "",
  //     "From Location Address": "5044 Murfreesboro Rd LaVergne, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/10/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 23.6,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "5044 Murfreesboro Rd LaVergne, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/8/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/8/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/7/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/7/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/6/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/6/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/5/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/5/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/4/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/4/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/3/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "1406 NW Broad St 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/3/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 10.1,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1406 NW Broad St 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/1/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "10/1/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/30/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/30/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/29/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/29/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/28/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/28/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/27/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/27/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/26/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/26/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/24/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/24/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/23/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/23/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/22/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/22/22",
  //     "Day": "Thu",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/21/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/21/22",
  //     "Day": "Wed",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/20/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/20/22",
  //     "Day": "Tue",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/19/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/19/22",
  //     "Day": "Mon",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 7,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1211 Memorial Blvd Murfreesboro, TN 37129",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/17/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/17/22",
  //     "Day": "Sat",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/16/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "To Location Name": "",
  //     "To Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   },
  //   {
  //     "Driver": "Daniels, Mike",
  //     "Email": "driverservices@mburse.com",
  //     "Date": "9/16/22",
  //     "Day": "Fri",
  //     "Start Time": "",
  //     "End Time": "",
  //     "Activity": "Business",
  //     "Mileage (mi)": 18.3,
  //     "From Location Name": "",
  //     "From Location Address": "1011 Sgt Asbury Hawn Smyrna, TN 37167",
  //     "To Location Name": "",
  //     "To Location Address": "341 Leconte Dr Murfreesboro, TN 37128",
  //     "Tags": "",
  //     "Notes": "",
  //     "Tracking Method": ""
  //   }
  //  ];
  // _RkeyFields = [
  //   "Date",
  //   "From Location Address",
  //   "To Location Address",
  //   "Mileage (mi)",
  //   "Notes",
  //   "Tags"
  // ];
  // _Rcolumn = [
  //   {
  //     id: 1,
  //     name: "Trip date",
  //     colName: "Date",
  //     colType: "Date",
  //     arrUp: true,
  //     arrDown: false
  //   },
  //   {
  //     id: 2,
  //     name: "Origin",
  //     colName: "From Location Address",
  //     colType: "String",
  //     arrUp: false,
  //     arrDown: false
  //   },
  //   {
  //     id: 3,
  //     name: "Destination",
  //     colName: "To Location Address",
  //     colType: "String",
  //     arrUp: false,
  //     arrDown: false
  //   },
  //   {
  //     id: 4,
  //     name: "Mileage",
  //     colName: "Mileage (mi)",
  //     colType: "Decimal",
  //     arrUp: false,
  //     arrDown: false
  //   },
  //   {
  //     id: 5,
  //     name: "Notes",
  //     colName: "Notes",
  //     colType: "String",
  //     arrUp: false,
  //     arrDown: false
  //   },
  //   {
  //     id: 6,
  //     name: "Tags",
  //     colName: "Tags",
  //     colType: "String",
  //     arrUp: false,
  //     arrDown: false
  //   }
  // ];

  proxyToObject(e) {
    return JSON.parse(e);
  }

  mapOrder(array, order, key) {
    array.sort(function (a, b) {
      var A = a[key],
        B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      }
      return -1;
    });

    return array;
  }

  validateField(event){
    event.target.value = event.target.value
    .replace(/[^\d]/g, '')             // numbers only
    .replace(/(^\.*)\./g, '$1')          // single dot retricted
    .replace(/(^[\d]{5})[\d]/g, '$1')   // not more than 4 digits at the beginning
  }

  dynamicBinding(data, keyFields) {
    data.forEach((element) => {
      element.fromLocation = (element.originalOriginName === null || element.originalOriginName === 'null' || element.originalOriginName === '') ? element.origin : element.originalOriginName;
      element.toLocation  = (element.OriginalDestinationName === null || element.OriginalDestinationName === 'null' || element.OriginalDestinationName === '') ? element.destination : element.OriginalDestinationName;
      let model = [];
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          let singleValue = {};
          if (keyFields.includes(key) !== false) {
            singleValue.id = element.id;
            singleValue.key = key;
            singleValue.value = (element[key] === "null" || element[key] === null) ? "" : element[key];
            singleValue.truncate = (key === 'fromLocation' || key === 'toLocation') ? true : false;
            singleValue.tooltip = (key === 'fromLocation' || key === 'toLocation') ? true : false;
            singleValue.tooltipText = (key === 'fromLocation') ? (element.origin != null ? element.origin : 'This trip was manually entered without an address.') : (key === 'toLocation') ? (element.destination != null ? element.destination : 'This trip was manually entered without an address.') : '';
            singleValue.twoDecimal = (key === "mileage" )? true : false;
            model.push(singleValue);
          }
        }
      }
      element.keyFields = this.mapOrder(model, keyFields, "key");
    });
  }

  addTrip() {
       var  row; 
        this.modalList.forEach(item=>{
           row = item
        });
        const newUser = Object.assign({}, row);
        newUser.id = row.id + 1;
        this.modalList.push(newUser);
        //this.template.querySelector('c-advance-user-table').intializeDatepicker();
        console.log("Row",  JSON.stringify(this.modalList))
  }

  addPreviewTrip(){
    this.template.querySelector('c-advance-user-table').openForm();
  }

  closeAddTrip(event){
    if(event.detail > 0){
      this.template.querySelector('.add-trip').disabled = true;
    }else{
      this.template.querySelector('.add-trip').disabled = false;
    }
  }

  handleChange(event) {
		this._value = event.target.value;
    if(this._value.length > 0){
      this.template.querySelector('.add-trip').disabled = true;
    }else{
      this.template.querySelector('.add-trip').disabled = false;
    }
    this.template.querySelector('c-advance-user-table').searchByKey(this._value, this.modelList)
	}

  
  filterList(data, keyFields){
   let model = [];
    data.forEach((element) => {
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          let singleValue = {};
          if (keyFields.includes(key) !== false) {
            singleValue.id = element.id;
            singleValue.label =   (element.name != null || "") ? element.name : element.address;
            singleValue.value =  element.id;
            singleValue.name = element.name != null ? element.name : '';
            singleValue.address = element.address != null ? element.address : '';
            singleValue.range = element.range != null ? element.range : '';
            singleValue.listclass = "slds-listbox__item";
            model.push(singleValue);
        }
        }
      }
    });
    model.splice(0, 0, {id: '', label: '', value: 0})
    const unique2 = model.filter((obj, index) => {
      return index === model.findIndex(o => obj.id === o.id && obj.label === o.label);
    });

    this.dropdownList = unique2;
    console.log("dropdownList", JSON.stringify(unique2))
  }

  handleEventFromEdit(event){
    let location = this.proxyToObject(event.detail);
    if(location !== ''){
      this.locationName = location.name === undefined ? '' : location.name;
      this.locationAddress = location.address === undefined ? '' : location.address;
      this._range = (location.range === undefined || location.range === 0 || location.range === '') ? 300 : location.range;
      this.locationId = location.id;
    }
    console.log(location.name, location)
    this.headerText = 'Edit Location';
    this.editModal = true;
    if (this.template.querySelector('c-user-profile-modal')) {
      this.template.querySelector('c-user-profile-modal').show();
   }
  }

  async connectedCallback() {
    this.directionList = await directions(this.contactId);
    this.manualMileage = await manualMileage(this.contactId);
    console.log('location list', this.directionList);
    if(this.directionList){
      this.dropdownList  = this.proxyToObject(this.directionList);
      this.filterList(JSON.parse(this.dropdownList), this.keyFields)
    }
    if(this.manualMileage){
      this.modelList = this.proxyToObject(this.manualMileage)
    }
    this.modalColumn = this._Rcolumn;
    this.modalKeyFields = this._RkeyFields;
   // this.placeholder = 'Trip Preview';
    this.isSortable = true;
    if(this.modelList){
        this.isScrollable = this.modelList.length > 6 ? true : false;
    }
  
    this.paginatedModal =  true;
    this.dynamicBinding(this.modelList, this.modalKeyFields);
    console.log(JSON.stringify(this.modelList))
  }
}
