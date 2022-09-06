import {
    LightningElement,
    api
} from 'lwc';

export default class PaginatedCarousel extends LightningElement {
    /* decorator for content to render in body of popover */
    @api totalContacts;

    /* decorator for styling popover */
    @api styleCarousel;

    /* decorator for styling header of popover */
    @api styleHeader;

    /* decorator for styling footer of popover */
    @api styleFooter;

    /* decorator for styling body of popover */
    @api styleBody;

    /* decorator for header text of popover */
    @api headerTitle;

    visibleContacts;


    /* Event handle from child pagination */
    updateContactHandler(event) {
        this.visibleContacts = [...event.detail.records]
        console.log("visible", this.visibleContacts)
    }

    /*Event to close popover handle at parent component*/
    closePopover() {
        this.dispatchEvent(new CustomEvent('pop', {
            detail: ''
        }))
    }
}