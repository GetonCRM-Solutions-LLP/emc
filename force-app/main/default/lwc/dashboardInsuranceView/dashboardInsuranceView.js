import { LightningElement, api} from 'lwc';
import { events } from 'c/utils';
export default class DashboardInsuranceView extends LightningElement {
    @api videoLink
    video;
    vfHost;
    originUrl;
    videoWidth = 396;
    videoHeight = 223;
    insuranceVideoUrl = '';
    isPlay = false;
    renderInitialized = false;

    /* Move to next page */
    nextDeclarationUpload(){
        events(this, 'Next Declaration Upload')
    }

    /* converts string to json object */
    proxyToObject(e) {
        return JSON.parse(e)
    }

    /* play video on click of button */
    playVideo(){
        this.isPlay = true;
    }

    /* rendered callback */ 
    renderedCallback() {
        if (this.renderInitialized) {
            return;
        }
        this.renderInitialized = true;
        const video = this.template.querySelector('.video-frame')
        if (video != null) {
            video.addEventListener('load',
                this._handler = () => this.handleFireToVf(this.videoLink)
            );
        }
    }

    handleFireToVf(vurl) {
        var vfData, message
        vfData = {
                vfHeight: this.videoHeight,
                vfWidth: this.videoWidth,
                vfSource: vurl
                // vfSource: (vurl) ? vurl : this.sessionStorageOptionUrl 
            }
            message = JSON.stringify(vfData);
            // Fire an event to send data to visualforce page
            this.template.querySelector('iframe').contentWindow.postMessage(message, this.originUrl)
    }

    connectedCallback() {
        let url = window.location.origin;
        let urlHost = url + '/app/mBurseVideoFrame';
        this.originUrl = url;
        this.vfHost = urlHost;
    }
}