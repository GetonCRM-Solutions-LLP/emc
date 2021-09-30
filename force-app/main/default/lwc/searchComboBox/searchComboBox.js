import { LightningElement, api } from 'lwc';

export default class SearchComboBox extends LightningElement {
    @api optionlist;
    @api label = '';
    @api key = '';
    @api value = '';
    @api required;
    @api placeholder = '';
    initialized = false;
    showdropdown= false;
    optionData;

    connectedCallback(){
        this.optionData = this.optionlist;
    }
    // show dropdown on text box focus
    handleShowdropdown(){
        this.showdropdown = true;
    }
    // hide dropdown on blur of text box
    handleShow(){
        setTimeout(() => {
            this.showdropdown = false;
        }, 150);
    }

    // update option martch with text box value
    updateOption(event){
        this.value = event.target.value;
        if(event.target.value){
            let data = this.proxyToObject(this.optionlist);
            data = data.filter(({value}) => (value.toUpperCase().includes(event.target.value.toUpperCase())));
            console.log({data});
            this.optionData = data;
        }else{
            this.optionData = this.optionlist
        }
       
        
    }

    // dispatch event with selecte option
    handleOptionSelect(event){
        let id = event.target.id;
        id = id.split('-')[0];
        let selectedRow = this.optionlist.filter(({key}) => (key == id));
        this.value = selectedRow[0].value;
        this.dispatchEvent(new CustomEvent('optionselect', { 
            bubbles: false, 
            detail: { key: id, value: this.value } 
        }));
    }

    
    proxyToObject(object){
        return JSON.parse(JSON.stringify(object));
    }
}