import { LightningElement, api } from 'lwc';

export default class HelpText extends LightningElement {
    @api carousel;
    @api header;
    @api body;
    @api footer;
    @api content;
    @api titleName;
    filterContent;

    connectedCallback(){
        console.log("Help Text Working!!!")
        this.filterContent = JSON.parse(this.content);
    }

    handlePopover(){
        this.dispatchEvent(new CustomEvent('closetext', {
            detail: ''
          }))
    }
    
}