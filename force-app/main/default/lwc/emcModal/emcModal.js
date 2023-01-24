import { LightningElement, api } from 'lwc';
const CSS_CLASS = 'modal-hidden';
export default class EmcModal extends LightningElement {
    _modalId;
    _headerPrivate;
    hasHeaderString = false;
    showModal = false;
    @api showFooter = false;
    @api showBtn = false;
    @api headerClass;
    @api subheaderClass;
    @api sdHeader;
    get modalId() {
        return this._modalId;
    }
    set modalId(value) {
       this._modalId = value;
       this.setAttribute('modal-id',value);
    }

    get modalContentId(){
        return `modal-content-id-${this.modalId}`;
    }

    get modalHeadingId(){
        return `modal-heading-id-${this.modalId}`;
    }
    
    @api 
    get header() {
        return this._headerPrivate;
    }
    set header(value) {
        this.hasHeaderString = value !== '';
        this._headerPrivate = value;
    }
    
    @api show() {
        this.showModal = true;
    }

    @api hide() {
        this.showModal = false;
    }
    handleDialogClose() {
        //Let parent know that dialog is closed (mainly by that cross button) so it can set proper variables if needed
        const closedialog = new CustomEvent('closedialog');
        this.dispatchEvent(closedialog);
        this.hide();
    }

    handleSlotTaglineChange() {
        // Only needed in "show" state. If hiding, we're removing from DOM anyway
        if (this.showModal === false) {
            return;
        }
        const taglineEl = this.template.querySelector('p');
        taglineEl.classList.remove(CSS_CLASS);
    }

    handleSlotFooterChange() {
        // Only needed in "show" state. If hiding, we're removing from DOM anyway
        if (this.showModal === false) {
            return;
        }
        const footerEl = this.template.querySelector('footer');
        footerEl.classList.remove(CSS_CLASS);
    }

    handleDownload(){
        const exceldownload = new CustomEvent('exceldownload');
        this.dispatchEvent(exceldownload);
    }
}