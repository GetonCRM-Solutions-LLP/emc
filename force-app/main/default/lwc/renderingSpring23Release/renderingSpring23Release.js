import { LightningElement } from 'lwc';

export default class RenderingSpring23Release extends LightningElement {
    /* Getter */
    certificate = 'Experience Cloud'
    nextCertificate = 'Administrator'
    get isValidCertification(){
        console.log("isValidCertification Getter is called");
        return this.certificate === "Experience Cloud"
    }

    handleChangeEvent(evt){
        this.certificate = evt.target.value;
    }

    get isValidNextCertificate(){
        console.log("isValidNextCertificate Getter is called");
        return this.nextCertificate === "Administrator"
    }

    get isValidNextCertificate2(){
        console.log("isValidNextCertificate2 Getter is called");
        return this.nextCertificate === "Javascript"
    }

    handleChangeEvent1(evt){
        this.nextCertificate = evt.target.value;
    }
}