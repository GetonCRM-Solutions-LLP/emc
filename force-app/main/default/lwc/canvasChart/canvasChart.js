import {
    LightningElement,
    api
} from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';
import Chart from '@salesforce/resourceUrl/chartJs';
export default class CanvasChart extends LightningElement {
    error;
    chart;
    chartJsInitialized = false;
    @api chartData;
    @api defaultMonth;
    config;
    /* fires after every render of the component. */
    renderedCallback() {
        if (this.chartJsInitialized) {
            return;
        }
       
        this.chartJsInitialized = true;
        /* Load Static Resource For Script*/
        Promise.all([
                loadScript(this, Chart + '/Chart.min.js'),
                loadStyle(this, Chart + '/Chart.min.css')
            ]).then(() => {
                // disable Chart.js CSS injection
                if (this.chartData != undefined) {
                    var monthData = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];
                    var monthList = this.defaultMonth;
                    console.log(monthList);
                    this.config = {
                        type: 'bar',
                        data: {
                            labels: this.chartData.chartLabel,
                            datasets: [{
                                label: this.chartData.labelA,
                                data: this.chartData.dataA,
                                order: 2,
                                backgroundColor: [
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)'
                                ],
                                borderColor: [
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)',
                                    'rgba(0,0,0,0.2)'
                                ]
                            }, {
                                label: this.chartData.labelB,
                                data: this.chartData.dataB,
                                backgroundColor: [
                                    'rgb(255,255,255, 0)'
                                ],
                                borderColor: [
                                    'rgba(0, 128, 0, 0.7)'
                                ],
                                type: 'line',
                                pointStyle: 'line',
                                order: 1,
                                borderCapStyle: 'round',
                                options: {
                                    legend: {
                                        labels: {
                                            usePointStyle: true
                                        }
                                    }
                                }
                            }]
                        },
                        options: {
                            legend: {
                                labels: {
                                    usePointStyle: true,
                                    padding: 15,
                                    fontSize: 12,
                                    fontColor: '#000',
                                    fontFamily: 'Proxima Nova'
                                },
                                position: 'right',
                                align: 'end',
                               
                            },
                            tooltips: {
                                backgroundColor: 'rgba(0, 77, 0, 1)',
                                bodyFontFamily: 'Proxima Nova',
                                mode: 'label',
                                titleFontSize: 16,
                                xPadding: 8,
                                yPadding: 8,
                                usePointStyle: true,
                                callbacks: {
                                    title: function (tooltipItem, data) {
                                      var tooltipTitle;
                                      var titleInitial = data.labels[tooltipItem[0].index];
                                      var titleIndex = tooltipItem[0].index;
                                      monthData.forEach((element) => {
                                          monthList.forEach((ymonth, index)=>{
                                            var m = ymonth;
                                            var charString = m.charAt(0);
                                            if(charString === titleInitial){
                                                if(titleIndex === index){
                                                    if(m === element.substring(0,3)){
                                                        tooltipTitle = element;
                                                    }
                                                }
                                            }
                                          })
                                      })
                                     return tooltipTitle;
                                    },
                                    label: function(tooltipItem, data){
                                        //tooltipItem.yLabel = tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        return data.datasets[tooltipItem.datasetIndex].label +': ' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    }
                                }
                            },
                            maintainAspectRatio: true,
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: 0,
                                        minRotation: 0
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        display: false
                                    }
                                }],
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    }
                }
                window.Chart.platform.disableCSSInjection = true;

                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chart = new window.Chart(ctx, this.config);
                //this.chart.canvas.parentNode.style.position = 'relative';
                // this.chart.canvas.parentNode.style.margin = 'auto';
                // this.chart.canvas.parentNode.style.height = '200px';
                // this.chart.canvas.parentNode.style.width = '390px';
            })
            .catch((error) => {
                this.error = error;
            });
    }

}