import { LightningElement, api } from 'lwc';
import {
    loadScript
} from 'lightning/platformResourceLoader';
import jsPdf from '@salesforce/resourceUrl/JsPDF';
import htmlCanvas from '@salesforce/resourceUrl/htmlCanvas';
export default class PdfModule extends LightningElement {
    @api htmlSource;
    generateTextPDF(){
        // eslint-disable-next-line no-undef
        const pdfDoc = new jsPDF();
        pdfDoc.text("Hello world!", 20, 20);
        pdfDoc.text("This is a demo for lightning web component pdf generator", 20, 30);
        pdfDoc.save("Hello World.pdf");
    }

    generateHtmlPDF(){
      // eslint-disable-next-line no-undef
      const doc = new jsPDF();
      const margins = {
         top: 80,
         bottom: 60,
         left: 40,
         width: 522
     };
     // all coords and widths are in jsPDF instance's declared units
     // 'inches' in this case
     try{
        doc.addHTML(
            this.htmlSource, // HTML string or DOM elem ref.
                   margins.left, // x coord
                   margins.top, {// y coord
                       'width': margins.width // max width of content on PDF
                   },{},function() {
                    doc.save('test.pdf');
                  });
     }catch(e){
        console.log("excep", e.message)
     }
    
    }

    renderedCallback(){
        /* Load Static Resource For Script*/
        console.log("Html", this.htmlSource);
        Promise.all([
            loadScript(this, htmlCanvas),
           loadScript(this, jsPdf)
        ]).then((result)=>{
           if(this.htmlSource !== undefined){
            console.log("From Pdf------",result)
            this.generateHtmlPDF();
           }
         
        }).catch((error)=>{
           console.log("Error from Pdf-----", JSON.stringify(error.message), error)
        })
   }
}