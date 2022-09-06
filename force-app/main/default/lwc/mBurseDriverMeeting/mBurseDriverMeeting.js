import { LightningElement } from 'lwc';
import EMC_CSS from '@salesforce/resourceUrl/EmcCSS';
export default class MBurseDriverMeeting extends LightningElement {
    /* Static resource files */
    fuelIconUrl = EMC_CSS + '/emc-design/assets/images/Driver-dashboard-icons/Profile_fuel_pump_45-01.svg';
    umbrellaIconUrl = EMC_CSS + '/emc-design/assets/images/Driver-dashboard-icons/Parameters_100_300_100.svg';
    speedometerIconUrl = EMC_CSS + '/emc-design/assets/images/Driver-dashboard-icons/Parameters_Speedometer.svg';
    calendarIconUrl = EMC_CSS + '/emc-design/assets/images/Driver-dashboard-icons/Parameters_years.svg';
    complianceIconUrl = EMC_CSS + '/emc-design/assets/images/Driver-dashboard-icons/Parameters_In_compliance.svg';
    carouselT = false;
    carouselS = false;

    /* Content to be pass in carousel that contains text */
    carouselKey = [{
        "id": "1",
        "name": "Add the upload insurance with the upward icon and text"
    }, {
        "id": "2",
        "name": "Complete all required fields. You can edit any of the fields after the users have been created"
    }, {
        "id": "3",
        "name": "Make sure to use the correct date format. For example, if the driver activation date is March 2, 2023, it should be entered as 03/02/2023 (MM/DD/YY)"
    },{
        "id": "4",
        "name": "Double-check your data and formatting before uploading"
    },{
        "id": "5",
        "name": "Uploads are limited to 100 new users or less. If importing more than 100 new users repeat the upload process or contact your Success Manager"
    }];

    /* Content to be pass in carousel that contains text with image */
    carouselImageKey = [{
        "id": "1",
        "icon": this.umbrellaIconUrl,
        "name": "Add the upload insurance with the upward icon and text"
    }, {
        "id": "2",
        "name": "Complete all required fields. You can edit any of the fields after the users have been created"
    }, {
        "id": "3",
        "name": "Make sure to use the correct date format. For example, if the driver activation date is March 2, 2023, it should be entered as 03/02/2023 (MM/DD/YY)"
    },{
        "id": "4",
        "icon": this.complianceIconUrl,
        "name": "Double-check your data and formatting before uploading"
    },{
        "id": "5",
        "icon": this.calendarIconUrl,
        "name": "Uploads are limited to 100 new users or less. If importing more than 100 new users repeat the upload process or contact your Success Manager"
    }];
    /* Styling for carousel with text */
    carousel = 'slds-popover slds-nubbin_left-top  slds-popover_large position-relative margin';
    body = 'slds-popover__body border';
    footer = 'slds-popover__footer border-footer slds-hide';
    header = 'slds-popover__header bg-dark-blue p_all';
    title = 'Pro Tips';

    /* Styling for carousel with text and image */
    styleOfImageCarousel = 'slds-popover slds-nubbin_top  slds-popover_large position-relative margin_carousel';
    styleOfImageBody = 'slds-popover__body border';
    styleOfImageFooter = 'slds-popover__footer border-footer slds-hide';
    styleOfImageHeader = 'slds-popover__header bg-green';
    titleOfImage = 'Instructions';

    /* Styling for footer carousel */
    styleFooter = 'slds-popover__footer border-footer';

    /* Event to show carousel on button click*/
    popOut(){
        this.carouselT = true;
    }

    popOutS(){
        this.carouselS= true;
    }
   

     /* Event handle in parent which is fired by child component */
    handlePopover(){
        this.carouselT = false;
    }

    handleImagePopover(){
        this.carouselS = false;
    }
     /* Event handle in parent which is fired by child component */
}