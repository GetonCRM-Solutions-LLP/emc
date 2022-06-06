import { LightningElement, wire, api } from 'lwc';
import  mBurseCss from '@salesforce/resourceUrl/mBurseCss';
import getCustomSettings from '@salesforce/apex/NewAccountDriverController.getCustomSettings';
import contactInfo from  '@salesforce/apex/NewAccountDriverController.getContactDetail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import { events, backEvents } from 'c/utils';
export default class MBurseDownloadMlog extends LightningElement {
    // Id of driver or contact
    @api contactId;

    // Type of account (New or Existing)
    @api accountType;

    // Type of phone (Employee Provided or Company Provided)
    @api cellType;

    // Watch driver meeting
    @api meeting;

    // Schedule driver meeting 
    @api schedule;

    // Android video link from custom settings
    androidVideoUrl;

    // Ios video link from custom settings
    iosVideoUrl;

    //mLog Tracking
    mLogTracking;

    // Width of iframe
    videoWidth = 100 + '%';

    // Height of iframe
    videoHeight = 100 + '%';

    // Flag to show/hide default element
    isDownload = true;

    // Flag to show/hide download now element
    isDownloadNow = false;

    // Flag to show/hide download later element
    isDownloadLater = false;

    // Flag to show/hide already download element
    isDownloadAlready = false;

    // Flag to show mburse chat bot
    isChatBot = false;

    // Flag to show/hide video element for iOS
    isPlay = false;

    // Flag to show/hide video element for android
    isPlayAndroid = false;

    //Flag to call render function once
    renderInitialized = false;

    // Link for instruction for android
    instructionUrlAndroid;

    // Link for instruction for iOS
    instructionUrlIOS;

    // Link for privacy pleadge
    privacyPledgeUrl;

    // A array of contact details
    arrayList;

    // Flag to show/hide element based on cellphone type
    render;

    // Store image from static resource android
    androidUrl = mBurseCss +  '/mburse/assets/Apple_Android/Android.svg';

    // Store image from static resource iOS
    appleUrl = mBurseCss +  '/mburse/assets/Apple_Android/Apple.svg';

    // Store image from static resource for video element
    videoLogoUrl = mBurseCss + '/mburse/assets/clipart3096799.png'

    // Get a list of custom setting named NewDashboardVideoLink
    @wire(getCustomSettings)
    myCustomSettings({ error, data }){
        if (data) {
             this.androidVideoUrl = data.Download_mLog_Link_For_Android__c;
             this.iosVideoUrl = data.Download_mLog_Link_For_IOS__c;
             this.privacyPledgeUrl = data.Privacy_Pledge_Link__c;
             this.instructionUrlAndroid = data.Donwload_instruction_for_Android__c;
             this.instructionUrlIOS = data.Donwload_instruction_for_IOS__c;
             this.mLogTracking = data.mLog_Mileage_Tracking__c;
          } else if (error) {
              console.log(error);
          }
    }

    // Event handler for Download now button click
    downloadNow(){
        this.isPlay = false;
        this.isPlayAndroid = false;
        this.isDownload = false;
        this.isDownloadNow = true;
        this.isDownloadLater = false;
        this.isDownloadAlready = false;
        this.isChatBot = false;
    }

    // Event handler for Download later button click
    downloadLater(){
        this.isPlay = false;
        this.isPlayAndroid = false;
        this.isDownload = false;
        this.isDownloadNow = false;
        this.isDownloadLater = true;
        this.isDownloadAlready = false;
        this.isChatBot = true; 
    }

    // Event handler for I already have mLog button click
    downloadAlready(){
        this.isPlay = false;
        this.isPlayAndroid = false;
        this.isDownload = false;
        this.isDownloadNow = false;
        this.isDownloadLater = false;
        this.isDownloadAlready = true;
        this.isChatBot = true;
    }

    // Convert JSON to Object
    proxyToObject(e) {
        return JSON.parse(e)
    }

    // Event handler for watch driver meeting button click
    nextDriverMeeting(){
        var list, d;
            contactInfo({
                contactId: this.contactId
            })
            .then((data) => {
                if (data) {
                    list = this.proxyToObject(data);
                    this.arrayList = list;
                    d = this.arrayList;
                    d[0].checkDriverMeeting = true;
                    updateContactDetail({
                        contactData: JSON.stringify(d),
                        driverPacket: true
                    })
                    events(this, 'Next mBursement Plan Preview');
                    if (d[0].accountStatus === 'New Account') {
                        console.log('New Account');
                        window.open(this.schedule)
                    } else {
                        window.open(this.meeting)
                    }
                }
            })
            .catch((error)=>{
                // If the promise rejects, we enter this code block
                console.log(error);
            })
        // let d = this.arrayList;
        // console.log("mlogApp before", d[0].mlogApp)
        // d[0].checkDriverMeeting = true;
        // console.log("list update ", JSON.stringify(d))
        // updateContactDetail({contactData: JSON.stringify(d)})
        // events(this, 'Next mBursement Plan Preview');
        // if(d[0].accountStatus === 'New Account'){
        //     console.log('New Account');
        //     window.open(this.schedule)
        // }else{
        //     window.open(this.meeting)
        // }
    }

    // Event handler for back button click
    backToDownloadPage(){
        this.isDownload = true;
        this.isPlay = false;
        this.isPlayAndroid = false;
        this.isDownloadNow = false;
        this.isDownloadLater = false;
        this.isDownloadAlready = false;
        this.isChatBot = false;
    }

    // Event handler for back button click
    backToPage(){
        backEvents(this, 'Next mLog Preview');
    }

    // Event handler for link click
    handleRedirect(){
        window.open(this.instructionUrlIOS)
    }

    // Event handler to render chat bot
    contactSupport(event){
        event.preventDefault();
        event.stopPropagation();
        this.template.querySelector('c-m-burse-support').renderChat();
    }
    
    // Event handler for video element iOS click
    playVideo(){
        this.isPlay = true;
    }

    // Event handler for video element android click
    playVideoAndroid(){
        this.isPlayAndroid = true;
    }

    // Life cycle hook to render UI
    renderedCallback(){
        if (this.renderInitialized) {
            return;
          }
        this.renderInitialized = true;
        this.render = (this.cellType === 'Company Provide') ? true : false;
    }
}