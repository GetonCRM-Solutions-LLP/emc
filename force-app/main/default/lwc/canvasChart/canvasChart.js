/* eslint-disable no-else-return */
/* eslint-disable vars-on-top */
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
    @api chartComponent;
    @api chartData;
    @api defaultMonth;
    config;
    /* fires after every render of the component. */
    renderedCallback() {
        var _self = this;
        if (this.chartJsInitialized) {
            return;
        }
        /* Load Static Resource For Script*/
        Promise.all([
                loadScript(this, Chart + '/Chart.min.js'),
                loadStyle(this, Chart + '/Chart.min.css')
            ]).then(() => {
                this.chartJsInitialized = true;
                // disable Chart.js CSS injection
                if (_self.chartData !== undefined) {
                    let monthData = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];
                    let monthList = this.defaultMonth;
                    let listOfChart = this.chartData;
                    console.log(monthList, listOfChart);
                    this.config = {
                        type: 'bar',
                        data: {
                            labels: listOfChart.chartLabel,
                            datasets: [{
                                label: listOfChart.labelA,
                                data: [...listOfChart.dataA],
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
                                label: listOfChart.labelB,
                                data: [...listOfChart.dataB],
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
                            // legend: false,
                            // legendCallback: function(chart){
                            //     var text = [];
                            //     text.push('<div class="_legend' + chart.id + '">');
                            //     for (var i = 0; i < chart.data.datasets.length; i++) {
                            //       text.push(`<div><div class="legendValue"><span class='symbol-${chart.data.datasets[i].label}' style="background-color:${chart.data.datasets[i].backgroundColor[0]}">&nbsp;&nbsp;&nbsp;&nbsp;</span>`);
                                  
                            //       if (chart.data.datasets[i].label) {
                            //         text.push('<span class="label">' + chart.data.datasets[i].label + '</span>');
                            //       }
                          
                            //       text.push('</div></div><div class="clear"></div>');
                            //     }
                          
                            //     text.push('</div>');
                          
                            //     return text.join('');
                            // },
                            legend: {
                                labels: {
                                    usePointStyle: true,
                                    padding: 15,
                                    fontSize: 14,
                                    fontColor: '#1D1D1D',
                                    fontFamily: 'Proxima Nova',
                                    fontWeight: '800'
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
                                            monthList.forEach((ymonth, index) => {
                                                var m = ymonth;
                                                var charString = m.charAt(0);
                                                if (charString === titleInitial) {
                                                    if (titleIndex === index) {
                                                        if (m === element.substring(0, 3)) {
                                                            tooltipTitle = element;
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                        return tooltipTitle;
                                    },
                                    label: function (tooltipItem, data) {
                                        //tooltipItem.yLabel = tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        if (_self.chartComponent === 'Reimbursement') {
                                            return data.datasets[tooltipItem.datasetIndex].label + ': $' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        } else {
                                            return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }

                                    }
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: 0,
                                        minRotation: 0,
                                        fontSize: 13,
                                        fontFamily: 'Proxima Nova',
                                        fontColor: '#1D1D1D'
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        lineHeight: '1.6',
                                        fontSize: 13,
                                        fontFamily: 'Proxima Nova',
                                        fontColor: '#1D1D1D',
                                        userCallback: function(value) {
                                            // Convert the number to a string and splite the string every 3 charaters from the end
                                            value = value.toString();
                                            value = value.split(/(?=(?:...)*$)/);
                                            value = value.join(',');
                                            if (_self.chartComponent === 'Reimbursement') {
                                                return '$' + value;
                                            }else{
                                                return value;
                                            }
                                        }
                                    }
                                }],
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    }
                
               // window.Chart.platform.disableCSSInjection = true;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.canvas.width = 246;
                ctx.canvas.height = 200;
                this.template.querySelector('div.chart').appendChild(canvas);
                this.chart = new window.Chart(ctx, this.config);
                }
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