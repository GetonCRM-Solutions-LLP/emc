import { LightningElement, api } from 'lwc';

export default class PointChloropleth extends LightningElement {
    vfHost;
    origin;
    iframeObj;
    contactList = [{
        name: 'McKinney, TX 75070',
        lat: 33.19957747563422,
        lon:  -96.63959152198672
      },{
        name: 'Cumming, GA 30040',
        lat: 34.20806995119908,
        lon: -84.14007144521936
      }, {
        name: 'Chandler, AZ 85248',
        lat: 33.30971356207762,
        lon: -111.83914293625658
      },{
        name: 'East Hampton, CT 06424',
        lat: 41.57643500060803, 
        lon: -72.50126920038343, 
      },{
        name: 'Hilton Head Island, SC 29926',
        lat: 32.217066625471965,
        lon: -80.74998035785816, 
      },{
        name: 'Brownsburg, IN 46112',
        lat: 39.84320935098485,
        lon: -86.39280812048153
      },{
        name: 'Houston, TX 77043',
        lat: 29.758786848922732, 
        lon: -95.37123439392165
      },{
        name: 'Manchester, CT 06040',
        lat: 41.77753923980666, 
        lon: -72.52363314803868
      },{
        name: 'Norwalk, CA 90650',
        lat: 33.902747239345466, 
        lon: -118.08123705589887
      },{
        name: 'Oregon City, OR 97045',
        lat: 45.35544432543128,
        lon: -122.60567195956779
      },{
        name: 'Kingwood, TX 77339',
        lat: 30.051087593655836,
        lon: -95.18465700444477
      },{
        name: 'Coldwater, MI 49036',
        lat: 41.94073526168949, 
        lon: -85.00328141040885
    }];
    renderInitialized = false;
    @api locate;
    @api background;
    @api borderColor;
    @api height;
    @api width;
    initializeChart() {
        // eslint-disable-next-line no-restricted-globals
        let url = location.origin;
        let urlHost = url + '/app/mapPointChart';
        this.vfHost = urlHost;
        this.origin = url;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.locate = (this.locate !== undefined) ? this.locate : [];
        console.log("Mapp---", this.locate)
        let obj = {modal : this.locate, background: this.background, border: this.borderColor, height: this.height, width: this.width}
        let messagePost = JSON.stringify(obj)
        if(this.template.querySelector('.vf-iframe').contentWindow){
                    this.template.querySelector('.vf-iframe').contentWindow.postMessage(messagePost, this.origin)
            }
    }
}