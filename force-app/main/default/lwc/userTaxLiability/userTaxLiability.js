import { LightningElement, api } from "lwc";
import resourceImage from "@salesforce/resourceUrl/mBurseCss";
import getCompliance from "@salesforce/apex/DriverDashboardLWCController.getCompliance";
// import highcharts from "@salesforce/resourceUrl/HighChart";
// import { loadScript } from "lightning/platformResourceLoader";
export default class UserTaxLiability extends LightningElement {
  downloadIcon =
    resourceImage + "/mburse/assets/mBurse-Icons/Plan-Info/download.png";
  lengthS = false;
  reimbursementValue = false;
  vfHost;
  origin;
  iframeObj;
  messageOfCompliance;
  complianceData;
  reimbursements;
  maxAllow;
  taxLiablity;
  chartResourcesLoaded = false;
  @api contactId;

  proxyToObject(e) {
    return JSON.parse(e);
  }

  getCompliancedata(data) {
    data.forEach((element) => {
      let number = element.quarterno;
      element.ordinal =
        isNaN(number) || number < 1
          ? ""
          : number % 100 === 11 || number % 100 === 12
          ? "th"
          : number % 10 === 1
          ? "st"
          : number % 10 === 2
          ? "nd"
          : number % 10 === 3
          ? "rd"
          : "th";
    });
    return data;
  }

  redirectToCompliance(){
    const redirectEvent = new CustomEvent('redirect', {detail: 'Compliance'});
    this.dispatchEvent(redirectEvent);
  }

  fetchCompliance() {
    getCompliance({
      contactId: this.contactId
    })
      .then((data) => {
        console.log("getCompliance", data)
        let reimVal, maxVal, taxVal;
        if (data[1]) {
          this.messageOfCompliance = this.proxyToObject(data[1]);
        }

        if (data[2]) {
          this.complianceData = this.getCompliancedata(
            this.proxyToObject(data[2])
          );
        }

        if (data[4]) {
          this.summaryR = this.proxyToObject(data[4]);
          this.lengthS = this.summaryR.length > 0 ? true : false;
        }

        if (data[5]) {
          reimVal = this.proxyToObject(data[5]);
          this.reimbursements = parseFloat(reimVal);
        }

        if (data[6]) {
          maxVal = this.proxyToObject(data[6]);
          this.maxAllow = parseFloat(maxVal);
        }

        if (data[7]) {
          taxVal = this.proxyToObject(data[7]);
          this.taxLiablity =
            parseFloat(taxVal) === 0 ? null : parseFloat(taxVal);
          console.log("taxVal", taxVal, this.taxLiablity)
        }

        if (this.reimbursements !== undefined && this.maxAllow !== undefined) {
          this.reimbursementValue = true;
        }else{
          this.reimbursementValue = false;
        }
      })
      .catch((error) => {
        console.log("getCompliance error", error.body.message, error.message);
      });
  }

  initializeChart() {
    // eslint-disable-next-line no-restricted-globals
    let url = location.origin;
    let urlHost = url + '/app/taxLiabilityChart';
    this.vfHost = urlHost;
    this.origin = url;
      let obj = { reimbursements: this.reimbursements, maxAllow: this.maxAllow, taxLiablity: this.taxLiablity }
      let messagePost = JSON.stringify(obj)
      console.log('chart', this.renderInitialized, this.template.querySelector('iframe').contentWindow)
      if (this.template.querySelector('.vf-iframe')) {
        this.template.querySelector('.vf-iframe').contentWindow.postMessage(messagePost, this.origin)
      }
 }

  connectedCallback() {
    this.fetchCompliance();
    // Promise.all([
    //   //   loadScript(this, highcharts + '/jquery-3.1.1.min.js')
    //   loadScript(this, highcharts + "/highchartsv9.js"),
    //   loadScript(this, highcharts + "/rounded-corners.js"),
    //   loadScript(this, highcharts + "/exporting.js"),
    //   loadScript(this, highcharts + "/export-data.js")
    //   //loadScript(this, highcharts + '/accessibility.js')
    // ])
    //   .then(() => {
    //     console.log("bar chart Loaded");
    //     this.chartResourcesLoaded = true;
    //     getCompliance({
    //       contactId: this.contactId
    //     })
    //       .then((data) => {
    //         let reimVal, maxVal, taxVal;
    //         if (data[1]) {
    //           this.messageOfCompliance = this.proxyToObject(data[1]);
    //         }

    //         if (data[2]) {
    //           this.complianceData = this.getCompliancedata(
    //             this.proxyToObject(data[2])
    //           );
    //         }

    //         if (data[4]) {
    //           this.summaryR = this.proxyToObject(data[4]);
    //         }
    //         this.lengthS = this.summaryR.length > 0 ? true : false;
    //         if (data[5]) {
    //           reimVal = this.proxyToObject(data[5]);
    //           this.reimbursements = parseFloat(reimVal);
    //         }

    //         if (data[6]) {
    //           maxVal = this.proxyToObject(data[6]);
    //           this.maxAllow = parseFloat(maxVal);
    //         }

    //         if (data[6]) {
    //           taxVal = this.proxyToObject(data[7]);
    //           this.taxLiablity =
    //             parseFloat(taxVal) === 0 ? null : parseFloat(taxVal);
    //             console.log("taxVal", taxVal, this.taxLiablity)
    //         }
    //         //   this.reimbursements = this.proxyToObject(data[5]);
    //         //   this.maxAllow = this.proxyToObject(data[6]);
    //         //   this.taxLiablity = this.proxyToObject(data[7]);
    //         let mapContain = this.template.querySelector(".chart");
    //         let _self = this;
    //         if (mapContain) {
    //           let categoryList = (this.taxLiablity === null) ? ["Reimbursement","Max Allowable"] : ["Reimbursement",
    //             "Max Allowable",
    //             "Tax Liabilitty"
    //           ]

    //           let dataList = (this.taxLiablity === null) ? [_self.reimbursements,_self.maxAllow] : [_self.reimbursements,_self.maxAllow, _self.taxLiablity]
    //           // eslint-disable-next-line no-undef
    //           Highcharts.chart(mapContain, {
    //             colors: ["#37c1ee", "#37c1ee", "#37c1ee", "#37c1ee"],
    //             chart: {
    //               type: "column"
    //             },
    //             title: {
    //               text: ""
    //             },
    //             exporting: {
    //               enabled: false
    //             },
    //             credits: {
    //               enabled: false
    //             },
    //             xAxis: {
    //               categories: categoryList,
    //               lineColor: "#000000",
    //               labels: {
    //                 style: {
    //                   color: "#1D1D1D",
    //                   fontSize: "14px",
    //                   fontFamily: "Proxima Nova"
    //                 }
    //               }
    //             },
    //             yAxis: {
    //               title: {
    //                 text: null
    //               },
    //               tickInterval: 50,
    //               gridLineWidth: 0,
    //               lineColor: "transparent",
    //               labels: {
    //                 enabled: false
    //               }
    //             },
    //             plotOptions: {
    //               series: {
    //                 dataLabels: {
    //                   enabled: true,
    //                   inside: true,
    //                   color: "white",
    //                   style: {
    //                     fontFamily: "Proxima Nova",
    //                     fontSize: "20px"
    //                   },
    //                   formatter: function () {
    //                     // display only if larger than 1
    //                     return (
    //                       "$" +
    //                       this.y
    //                         .toString()
    //                         .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //                     );
    //                   }
    //                 },
    //                 colorByPoint: true
    //               }
    //             },
    //             series: [
    //               {
    //                 data: dataList,
    //                 colors: ["#7ABA4A", "#404b5a66", "#404B5A"],
    //                 pointWidth: 200,
    //                 borderRadiusTopLeft: "20px",
    //                 borderRadiusTopRight: "20px"
    //               }
    //             ],
    //             legend: {
    //               enabled: false
    //             },
    //             tooltip: {
    //               borderRadius: 0,
    //               padding: 10,
    //               formatter: function () {
    //                 return (
    //                   this.x +
    //                   ": <b> $" +
    //                   this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    //                   "</b>"
    //                 );
    //               },
    //               style: {
    //                 fontSize: "12px"
    //               }
    //             }
    //           });
    //         }
    //       })
    //       .catch((error) => {
    //         console.log("getCompliance error", error);
    //       });
    //   })
    //   .catch((error) => {
    //     console.log("Bar chart : " + error);
    //   });
  }
}
