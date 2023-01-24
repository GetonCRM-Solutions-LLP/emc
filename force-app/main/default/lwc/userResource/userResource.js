import { LightningElement, api } from 'lwc';
import mBurseCss from '@salesforce/resourceUrl/LwcDesignImage';
export default class UserResource extends LightningElement {
    welcome = mBurseCss + '/Resources/PNG/Green/1.png';
    parameters  = mBurseCss + '/Resources/PNG/Green/2.png';
    mLog  = mBurseCss + '/Resources/PNG/Green/1.png';
    downloadmLog  = mBurseCss + '/Resources/PNG/Green/3.png';
    meeting = mBurseCss + '/Resources/PNG/Green/1.png';
    sync = mBurseCss + '/Resources/PNG/Green/4.png';
    troubleShoot  = mBurseCss + '/Resources/PNG/Green/5.png';
    optimize = mBurseCss + '/Resources/PNG/Green/6.png';
    faq  = mBurseCss + '/Resources/PNG/Green/7.png';
    instructions = mBurseCss + '/Resources/PNG/Green/8.png';
    compliance = mBurseCss + '/Resources/PNG/Green/9.png';
    tax = mBurseCss + '/Resources/PNG/Green/10.png';
    insurance = mBurseCss + '/Resources/PNG/Green/11.png';
    methodology = mBurseCss + '/Resources/PNG/Green/12.png';
    privacy = mBurseCss + '/Resources/PNG/Green/13.png';
    policy = mBurseCss + '/Resources/PNG/Green/14.png';

     // width of video
     videoWidth = "100%";

     // height of video
     videoHeight = "332px";

     // Header of resources
     resourceText = "";

     //content class of resources
     contentText = ""
     arrayObject;
     planPreview = false;
     planParameter = false;

     /*getter setter method for insurance minimums */
    @api 
    get minimums(){
        return this.arrayObject;
    }
    set minimums(value){
        if(value){
            let tempObject =  this.proxyToObject(value)
            this.arrayObject = tempObject[0];
        }
    }

     /* convert string to array */
     proxyToObject(e) {
        return JSON.parse(e)
    }

    /* event handler for plan preview*/
    OnPlanpreview(){
        this.contentText = "slds-modal__content transparent_content";
        this.planPreview = true;
        this.planParameter = false;
        this.resourceText = "Your Plan preview";
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal').show();
        }
    }

     /* event handler for plan parameters*/
     OnPlanparameter(){
        this.contentText = "slds-modal__content content";
        this.planPreview = false;
        this.planParameter = true;
        this.resourceText = "Your Plan parameters";
        if (this.template.querySelector('c-user-profile-modal')) {
            this.template.querySelector('c-user-profile-modal').show();
        }
    }

    connectedCallback(){
        console.log("listening from resource", JSON.stringify(this.minimums))
    }
}