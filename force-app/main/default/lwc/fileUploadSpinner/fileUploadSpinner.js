import { LightningElement,api,wire } from 'lwc';
import customSettingsForMessage from '@salesforce/apex/NewAccountDriverController.getCustomSettingsForMessage'
export default class FileUploadSpinner extends LightningElement {
    @api showSpinner = false;
    fileMessageUrl = '';
    @wire(customSettingsForMessage)
    myCustomSettings({ error, data }){
        if (data) {
            this.fileMessageUrl = data.File_Loader__c;
          } else if (error) {
              console.log(error);
          }
    }
}