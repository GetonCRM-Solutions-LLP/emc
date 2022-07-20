import { LightningElement, api } from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';
import Chart from '@salesforce/resourceUrl/chartJs';
export default class ViewChart extends LightningElement {
    error;
    chart;
    chartlabels;
    chartdata;
    chartJsInitialized = false;
    @api chartData;
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
                console.log(this.chartData);
                // disable Chart.js CSS injection
                if (this.chartData != undefined) {
                    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    
                    var todaysdate = new Date();
                    var chartdata = JSON.parse(this.chartData);
                    var currentmonth = todaysdate.getMonth();
                    var chartlabels = [];
                    var mileages = [];
                    var splittedmonth = [];
                    if(currentmonth == 0)
                    {
                        
                        chartlabels.push(months[9]);
                        chartlabels.push(months[10]);
                        chartlabels.push(months[11]);
                    }
                    else if(currentmonth == 1)
                    {
                        chartlabels.push(months[0]);
                        chartlabels.push(months[10]);
                        chartlabels.push(months[11]);
                        
                    }
                    else if(currentmonth == 2)
                    {
                        chartlabels.push(months[0]);
                        chartlabels.push(months[1]);
                        chartlabels.push(months[11]);
                    }
                    else
                    {                       
                        chartlabels.push(months[currentmonth-3]);
                        chartlabels.push(months[currentmonth-2]);
                        chartlabels.push(months[currentmonth-1]);
                    }
                    
                    if(chartdata!=null && chartdata!=undefined)
                    {
                        for(var i=0;i<chartdata.length;i++)
                        {                            
                            if(chartdata[i].Month__c!=null && chartdata[i].Month__c!=undefined)
                            {
                                
                                splittedmonth = chartdata[i].Month__c.split("-");
                                                           
                                if(currentmonth == 0)
                                {                                    
                                    if(splittedmonth[0] == "10")
                                    {
                                         mileages[0]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[0]!=null)?mileages[0]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                         
                                    }
                                    else if(splittedmonth[0] == "11")
                                    {
                                         mileages[1]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[1]!=null)?mileages[1]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                         
                                    }
                                    else if(splittedmonth[0] == "12")
                                    {
                                         mileages[2]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[2]!=null)?mileages[2]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                         
                                    }
                                }
                                else if(currentmonth == 1)
                                {
                                    if(splittedmonth[0] == "12")
                                    {
                                         mileages[0]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[0]!=null)?mileages[0]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;   
                                         
                                    }
                                    else if(splittedmonth[0] == "1" || splittedmonth[0] == "01")
                                    {
                                         mileages[1]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[1]!=null)?mileages[1]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                         
                                    }
                                    else if(splittedmonth[0] == "11")
                                    {
                                         mileages[2]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[2]!=null)?mileages[2]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                         
                                    }
                                }
                                else if(currentmonth == 2)
                                {
                                    if(splittedmonth[0] == "2" || splittedmonth[0] == "02")
                                    {
                                        mileages[1]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[1]!=null)?mileages[1]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                        
                                         
                                    }
                                    else if(splittedmonth[0] == "12")
                                    {
                                        mileages[0]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[0]!=null)?mileages[0]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;   
                                         
                                    }
                                    else if(splittedmonth[0] == "1" || splittedmonth[0] == "01")
                                    {
                                         mileages[2]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[2]!=null)?mileages[2]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                         
                                    }
                                }
                                else
                                {
                                    
                                    if(currentmonth-parseInt(splittedmonth[0])==2)
                                    {                                         
                                         mileages[0]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[0]!=null)?mileages[0]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;   
                                         
                                        
                                    }
                                    else if(currentmonth-parseInt(splittedmonth[0])==1)
                                    {                                        
                                        mileages[1]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[1]!=null)?mileages[1]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                        
                                       
                                    }
                                    else if(currentmonth-parseInt(splittedmonth[0])==0)
                                    {
                                        mileages[2]=(mileages!=null && mileages!=undefined && mileages.length>0 && mileages[2]!=null)?mileages[2]+chartdata[i].Total_Mileage__c:chartdata[i].Total_Mileage__c;
                                    }  
                                }                                                                
                            }
                        }
                    }
                    
                    this.chartdata = mileages.map(function(each_element){
                        return each_element.toFixed(2);
                    });                    
                    this.chartlabels = chartlabels;

                    console.log("chart component", this.chartdata);
                    console.log("chart labels", this.chartlabels);
                    this.config = {
                        type: 'bar',
                        data: {
                            labels: this.chartlabels,
                            datasets: [{
                                data: this.chartdata,
                                backgroundColor: ['#313A49','#313A49','#313A49']   
                            }]
                        },
                        options: {
                            hover: {mode: null},
                            legend: {
                                display: false
                            },
                            tooltips: {
                                custom: function(tooltip) {
                                    if (!tooltip) return;
                                    // disable displaying the color box;
                                    tooltip.displayColors = false;
                                },
                                titleFontSize: 100,
                                bodyFontSize: 20,
                                enabled: true,
                                mode: 'single',
                                callbacks: {
                                    label: function(tooltipItems, data) {
                                        return tooltipItems.yLabel;
                                       
                                    },
                                    labelColor: function(tooltipItem, chart) {
                                        return {
                                            backgroundColor: 'rgb(255, 0, 0)'
                                        }
                                    },
                                    title: function(tooltipItem, data) {
                                    return;
                                       
                                    }
                                },
                                backgroundColor: '#78bc42'
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }],
                                xAxes: [{
                                    gridLines: {
                                        display: false
                                    }
                                }]
                            }
                        }
                    }
                }
                
                window.Chart.platform.disableCSSInjection = true;

                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 140;
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chart = new window.Chart(ctx, this.config);
            })
            .catch((error) => {
                this.error = error;
            });
    }
}