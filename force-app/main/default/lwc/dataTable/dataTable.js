import { LightningElement, api } from 'lwc';

export default class DataTable extends LightningElement {

    // table headers
    @api headers;

    // become true if number of table record lenth is zero
    norecord = false;

    // store key paire value
    @api formateData;

    @api
    get  body(){
       return this.formateData;
    }

    set body(obj){
        this.formateData = this.dynemicRenderData(obj);
    }


    /*
        converting table record   into key value paire object
     */
    dynemicRenderData(body){
        let tdata = JSON.parse(JSON.stringify(body));
        let currentPageData = [];
        tdata.forEach(element => {
            let rowArray = []
            
            for (const key in element) {
                if (element.hasOwnProperty.call(element, key)) {
                    let singleValue = {};
                    const ele = element[key];
                    singleValue.key = ele;
                    rowArray.push(singleValue);
                }
            }
            currentPageData.push(rowArray);
        });
        return currentPageData;
    }


}