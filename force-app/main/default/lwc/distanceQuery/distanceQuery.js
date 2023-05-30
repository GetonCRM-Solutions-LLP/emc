import { LightningElement } from 'lwc';

export default class DistanceQuery extends LightningElement {
    iframeObj;
    vfHost;
    origin;
    destination;
    renderedCallback(){
        let url = window.location.origin;
        let urlHost = url + '/app/googleMapDistanceAPI';
        this.origin = '341 Leconte Dr Murfreesboro, TN 37128';
        this.destination = '1011 Sgt Asbury Hawn Smyrna, TN 37167';
        this.latitudeOrigin = { lat: 33.808169, lng: -118.358222};
        this.originname = JSON.stringify(this.latitudeOrigin);
        this.vfHost = urlHost + '?origin=' + this.origin + '&destination=' + this.destination + '&name=' + this.originname;
        console.log('vf',this.template.querySelector(".vf-iframe").contentWindow, url)
       // if(this.template.querySelector(".vf-iframe")){
            this.iframeObj = this.template.querySelector(".vf-iframe").contentWindow;
            this.template.querySelector(".vf-iframe").contentWindow.postMessage('Welcome', url);
       // }
    }
}