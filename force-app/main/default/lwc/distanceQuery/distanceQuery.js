import { LightningElement, api } from 'lwc';

export default class DistanceQuery extends LightningElement {
    iframeObj;
    vfHost;
    renderedCallback(){
        let url = window.location.origin;
        let urlHost = url + '/app/googleMapDistanceAPI';
        this.vfHost = urlHost;
        console.log('vf',this.template.querySelector(".vf-iframe").contentWindow)
       // if(this.template.querySelector(".vf-iframe")){
            this.iframeObj = this.template.querySelector(".vf-iframe").contentWindow;
            this.template.querySelector(".vf-iframe").contentWindow.postMessage('message', url);
       // }
    }
}