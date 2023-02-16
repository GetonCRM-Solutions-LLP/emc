import { LightningElement,track,wire } from 'lwc';
import registerWebinarCallout from '@salesforce/apex/goToWebinarNewUIController.registerWebinarCallout';

import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import jQuery from '@salesforce/resourceUrl/timePickerjQuery';

export default class GoToWebinarNewUI extends LightningElement {
    @track firstName;
    @track lastName;
    @track email;
    @track recordId;

    connectedCallback(){
        // this.recordId = `${this.currentPageReference.accid}`;
        this.recordId = new URL(location.href).searchParams.get('accid');
        console.log(this.recordId);
        console.log('connected callback');
    }   

    handleFNameChange(event){
        this.firstName = event.target.value;
    }
    handleLNameChange(event){
        this.lastName = event.target.value;
    }
    handleEmailChange(event){
        this.email = event.target.value;
    }

    // handleRegister(event){
    //     console.log('First Name:',this.firstName);
    //     console.log('Last Name:',this.lastName);
    //     console.log('Email:',this.email);
    //     console.log('Email:',this.recordId);
    // }
    handleRegister(event){
        const objChild = this.template.querySelector('c-toast');  
        registerWebinarCallout({
            firstName: this.firstName ,
            lastName: this.lastName ,
            email: this.email ,
            accid: this.recordId
        })
        .then((result) => {
            console.log({result});
            console.log('Id:',result.success);
            if(result.hasOwnProperty('success')){
                 objChild.showToast('Success', 'Register Successfully','success', true);
            }else{
                objChild.showToast('Error', result.error,'error', true);
            }
            this.error = undefined; 
        })
        .catch((error) => {
            console.log({error});
            objChild.showToast('Error', 'Some Error Accured','error', true);
        });
    }

    renderedCallback(){
        loadScript(this, jQuery)
        .then(() => {
            console.log('JQuery loaded.');
        })
        .catch(error=>{
            console.log('Failed to load the JQuery : ' +error);
        });
    }
    handleTextChange(event){
        console.log('text chamge ');
        $(this.template.querySelector('.form-control')).timepicker({
            format: 'hh:mm A',
          });
    }
    slideIt(event){
        $(this.template.querySelector('.panel')).slideToggle("slow");
    }
}