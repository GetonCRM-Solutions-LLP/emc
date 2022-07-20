import { LightningElement, api } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import myLib from '@salesforce/resourceUrl/J_emc';
import naoTipCSS from '@salesforce/resourceUrl/naoTooltipCSS';
import naoTipJS from '@salesforce/resourceUrl/naoTooltipJS';
import select from '@salesforce/resourceUrl/select_emc';
import selectCss from '@salesforce/resourceUrl/selectCss_emc';

export default class DReports extends LightningElement {
    dInitialized = false;
    list;
    naotool = false;
    @api headers;
    @api body;
    @api isRecord;
    @api noData;
    fixedWidth = "width:15rem;";

    connectedCallback(){
        window.addEventListener('resize', this.resizeWindow);
        console.log(this.isRecord)
    }

    resizeWindow = () => {
    }

    renderedCallback() {
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;

        Promise.all([
            loadScript(this, myLib)
        ])
        .then(() => {
            Promise.all([
                loadStyle(this, naoTipCSS),
                loadScript(this, naoTipJS)
            ]) 
             .then(() => {
                console.log('loaded');
                this.initializeTooltip();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
        }) .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Jquery',
                    message: error.message,
                    variant: 'error'
                })
            );
        });
          
    }

    initializeL2() {
    const data = [{
            id: '1',
            text: 'Acme'
        },
        {
            id: '2',
            text: 'Aperture'
        },
        {
            id: '3',
            text: 'Acme'
        },
        {
            id: '4',
            text: 'Aperture'
        },
        {
            id: '5',
            text: 'Acme'
        }
    ]
    // eslint-disable-next-line no-undef
    $(this.template.querySelector('[data-name="select"]')).select2({
        data: data,
        width: 'resolve'
    });
    // $(this.template.querySelector('.js-example-basic-single js-states form-control')).select2();
    }

    initializeTooltip() {
         /* Initialise all the tooltips using the wrapper class */
        // eslint-disable-next-line no-undef
        $(this.template.querySelector('.naoTooltip-wrap')).naoTooltip();

        /* Or initialise customising the speed (by default is 400) */
        // eslint-disable-next-line no-undef
        $(this.template.querySelector('.naoTooltip-wrap')).naoTooltip({ speed: 200 });
    }
    // mouseOver(event){
    //     let tId,naoTip;
    //     let to = event.toElement;
    //     if(to != null || to !== undefined){
    //         tId = to.dataset.id;
    //         naoTip = to.children[0];
    //         if(tId === naoTip.dataset.id){
    //             naoTip.children[0].style.visibility = 'visible';
    //             naoTip.children[0].style.opacity = 1;
    //         }
    //     }
    //     console.log("mouse over event: ", event, tId);
    // }
    // mouseOut(event){
    //     let tId,naoTip;
    //     let to = event.fromElement;
    //     if(to != null || to !== undefined){
    //         tId = to.dataset.id;
    //         naoTip = to.children[0];
    //         if(tId === naoTip.dataset.id){
    //             naoTip.children[0].style.visibility = 'hidden';
    //             naoTip.children[0].style.opacity = 0;
    //         }
    //     }
    //     console.log("mouse out event: ", event, tId);
    // }
    }