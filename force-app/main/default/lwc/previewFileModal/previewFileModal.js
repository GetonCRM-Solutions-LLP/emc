import { LightningElement, api } from 'lwc';

export default class PreviewFileModal extends LightningElement {
    showFrame = false;
    showModal = false;
    modalText = "";    

    //content class of resources
    contentText = ""
    modalContainer = ""
    videoPlayUrl = ""
    // width of video
    videoWidth = "100%";

    // height of video
    videoHeight = "332px";
    @api show() {
      this.showModal = true;
    }

    @api showVideo(title, url){
      this.contentText = "slds-modal__content transparent_content";
      this.modalContainer = "slds-modal__container";
      this.template.querySelector('.parent').classList.remove('index');
      this.template.querySelector('.parent').classList.add('add-index');
      this.videoPlayUrl = url;
      this.modalText = title;
      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal').show();
      }
    }

    exitFullscreen() {
      this.template.querySelector('.parent').classList.remove('overlay-slide-down');
      this.template.querySelector('.parent').classList.add('overlay-slide-up');
      this.showModal = false;
    }

    closePopup(){
      this.template.querySelector('.parent').classList.remove('add-index');
      this.template.querySelector('.parent').classList.add('index');
    }
   
}