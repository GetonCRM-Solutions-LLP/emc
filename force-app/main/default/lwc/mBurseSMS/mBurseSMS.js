/* eslint-disable getter-return */
/* eslint-disable consistent-return */
import { LightningElement, api, track } from 'lwc';
import sendMessageToContact from '@salesforce/apex/TrueDialogSendMessageAPI.sendMessageToContact';
import getAllMessageByContact from '@salesforce/apex/TrueDialogSendMessageAPI.getAllMessageByContact';
import { formatList } from 'c/commonLib';
import EMC_CSS from '@salesforce/resourceUrl/EmcCSS';
export default class MBurseSMS extends LightningElement {
    /* Flag for contact name */
    @api driverName;

    /*Flag for id of driver*/
    @api driverId;

    /* Flag to store messages */
    @track messageRecords = [];

    /*Flag to for filter */
    @track filterMessage = [];

    /*Static resource for avatar image */
    avatar = EMC_CSS + '/emc-design/assets/images/File.png';
    
    //Flag to call render function once
    renderInitialized = false;

    contactPicture;

    get nameOfDriver() { 
        return (this.driverName != null || this.driverName !== undefined) ? this.driverName : ''
    }

    /*Filter data based on date  such as show latest messages as today and rest as yesterday or month name (July 2022 )*/
    filterRecord = () => {
        let _self = this
        if(_self.messageRecords.length > 0){
            let i = 0, messageLen = _self.messageRecords.length;
            for (i = 0; i < messageLen; i++){
                let date = _self.messageRecords[i].CreatedDate.split("T");
                _self.messageRecords[i].messageId = _self.messageRecords[i].Id;
                _self.messageRecords[i].Date = date[0];
                _self.messageRecords[i].parseValue = Date.parse(_self.messageRecords[i].CreatedDate)
            }
            _self.filterMessage = formatList(_self.messageRecords)
        }
    }
  
    /* Event to close modal*/
    handleClose() {
        this.dispatchEvent(
            new CustomEvent("close", {
                detail: "endchat"
            })
        );
    }

    /* Event to send message */
    onSendMessage(event){
        console.log(event.target.value)
        let _self = this;
        const keyCode = event.keyCode;
        let caretPos =   _self.template.querySelector('.message-input').value; 
        if(keyCode === 32 && caretPos === ""){
            event.preventDefault();
        }
        if (keyCode === 13) {
            sendMessageToContact({
                contactId: _self.driverId,
                message: event.target.value
            }).then((result) =>{
                console.log("result from sendMessageToContact", result)
            }).catch(error => {
                console.log("error from sendMessageToContact", error)
            })
            _self.template.querySelector('.message-input').value = "";
            event.target.value = '';
            event.preventDefault(); 
        }
    }
    proxyToList(data){
        return JSON.parse(data);
    }

    readURL(input, element){
        var reader;
        console.log(input.target)
        if(input.target.files && input.target.files[0]){
            reader = new FileReader();
            console.log("Filename: " + input.target.files[0].name);
            console.log("Type: " + input.target.files[0].type);
            console.log("Size: " + input.target.files[0].size + " bytes");
            reader.onload = function(e) {
                element.src = e.target.result
            }
            reader.readAsDataURL(input.target.files[0]);
        }
    }

    inputChange(event){
        let fileImage = this.template.querySelector('.chat__file-image');
        console.log("file", fileImage)
        this.readURL(event, fileImage);
    }

    renderedCallback(){
        if (this.renderInitialized) {
            return;
          }
        this.renderInitialized = true;
        let toHeight = this.template.querySelector('.doc-container').offsetHeight;
        if(toHeight != null || toHeight !== undefined){
            this.template.querySelector('.messageArea').style.maxHeight = (toHeight - 180) + 'px'
        }else{
            this.template.querySelector('.messageArea').style.maxHeight =  377 + 'px';
        }
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        window.addEventListener('resize',  this._handler = (event) => this.onResize(event, this.template.querySelector('.doc-container'), this.template.querySelector('.messageArea')));
    }
    
    onResize(event, element, target){
        let Height = element.offsetHeight;
        if(Height != null || Height !== undefined){
            target.style.maxHeight = (Height - 180) + 'px'
        }else{
            target.style.maxHeight =  377 + 'px';
        }
    }
    
    connectedCallback(){
        let _self = this;
        // getContactPicture({
        //     contactId: _self.driverId
        // }).then((result)=>{
        //     let image = _self.proxyToList(result);
        //     var document = (image[0].Contact_Picture__c != null )? new DOMParser().parseFromString(image[0].Contact_Picture__c, "text/html") : image[0].Contact_Picture__c;
        //     console.log(document.body.childNodes[0].childNodes[0].src)
        // })
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        window.setInterval(()=>{
            getAllMessageByContact({
                contactId: _self.driverId,
            }).then((result) =>{
                if(result){
                   if((_self.proxyToList(result)).length > 0){
                    _self.messageRecords = _self.proxyToList(result)
                    _self.filterRecord();
                   }
                }
            }).catch(error => {
                console.log("error from getAllMessageByContact", error)
            })
       }, 10)
    }
}