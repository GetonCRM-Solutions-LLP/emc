import { LightningElement, api } from 'lwc';
export default class UserResource extends LightningElement {

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