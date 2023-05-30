import { LightningElement,track,wire } from 'lwc';
import getWebinarName from '@salesforce/apex/goToWebinarNewUIController.getWebinarName';
import registerWebinarCallout from '@salesforce/apex/goToWebinarNewUIController.registerWebinarCallout';
import urlMaking from '@salesforce/apex/goToWebinarNewUIController.urlMaking';
import urlMakingforOutlook from '@salesforce/apex/goToWebinarNewUIController.urlMakingforOutlook';
import SVG_LOGO from '@salesforce/resourceUrl/andriod_svg';
import SVG_LOGO_Apple from '@salesforce/resourceUrl/apple_svg';

export default class GoToWebinarNewUI extends LightningElement {
    svgApple = `${SVG_LOGO_Apple}`
    svgURL = `${SVG_LOGO}`

    mainPage = true;
    secondPage = false;

    @track firstName;
    @track lastName;
    @track email;
    @track recordId;

    @track meetingName;
    @track description;

    // @wire webinarName;
    @track url;
    @track outlookUrl;

    @track startDate;
    @track endDate;
    @track timeZone;
    @track startDateIST;
    @track endDateIST;
    @track fullDateIST;

    @track startDateForOutlook
    @track endDateForOutlook

    @track registrantKey;
    @track joinUrl;
    @track status;
    @track webinarKey;

    @track userKey;

    connectedCallback(){
        // this.recordId = `${this.currentPageReference.accid}`;
        this.recordId = new URL(location.href).searchParams.get('accid');
        console.log(this.recordId);
        console.log('connected callback');

        getWebinarName({
            accId: this.recordId 
        }).then((result) => {
            console.log('result',result);
            let obj = JSON.parse(result);
            console.log('mapOfValues==: ',obj);
            this.meetingName = obj.webinarName;
            this.description = obj.description;
            this.startDate = obj.startDate;
            this.endDate = obj.endDate;

            this.startDateIST = convertTZ(obj.startDate,'Asia/Kolkata');
            this.endDateIST = convertTZ(obj.endDate,'Asia/Kolkata');

            this.startDateIST = convertISTDT(this.startDateIST);
            this.endDateIST = convertISTDT(this.endDateIST);

            this.fullDateIST = this.startDateIST +' - '+ this.endDateIST +' IST';
                       
            this.startDate = convertTZ(obj.startDate,obj.timeZone);
            this.endDate = convertTZ(obj.endDate,obj.timeZone);

            this.timeZone = obj.timeZone;
            // this.startDateOriginal = obj.startDateOriginal;
            // this.endDateOriginal = obj.endDateOriginal;
            console.log('obj.startDate==== ' + obj.startDate);
            console.log('obj.endDate==== ' + obj.endDate);
            console.log('==== ' + obj.description);
            console.log('startDate==== ' + this.startDate);
            console.log('endDate==== ' + this.endDate);
            console.log('fullDateIST==== ' + this.fullDateIST);

            this.startDateForOutlook = convertForOutlook(this.startDate);
            this.endDateForOutlook =  convertForOutlook(this.endDate);

            this.startDate = convertDateVal(this.startDate );
            this.endDate = convertDateVal(this.endDate);

            console.log('startDateOriginalAfter==== ' + this.startDate);
            console.log('endtDateOriginalAfter==== ' + this.endDate);

            console.log('startDateForOutlook==== ' + this.startDateForOutlook);
            console.log('endDateForOutlook==== ' + this.endDateForOutlook);

            // urlMaking({
            //     webinarName : this.meetingName,
            //     startDate : this.startDate,
            //     endDate : this.endDate,
            //     timeZone : this.timeZone

            // }).then((result) => {
            //     console.log('result',result);
            //     this.url = result;
            // })
        })
        .catch((error) => {
            console.log(error);
        });

        function convertTZ(date, tzString) {
            return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
        }

        function convertForOutlook(dateStr) {
            let dateVal = new Date(dateStr)
            let hours = dateVal.getHours();
            let minutes = dateVal.getMinutes();
            hours = hours < 10 ? '0'+hours : hours;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            let strTime = hours+':' + minutes;
            let year = dateVal.getFullYear();
            let month = (dateVal.getMonth()+1);
            let date = dateVal.getDate();
            month = month < 10 ? '0'+month : month;
            date = date < 10 ? '0'+date : date;
            let dateRes = month+'/'+date+'/'+year;
            let fullStr = dateRes+' '+strTime 
            return fullStr;
        }
        
        function convertDateVal(dateValue) {
            let dateVal = new Date(dateValue)
            let hours = dateVal.getHours();
            let minutes = dateVal.getMinutes();
            let seconds = dateVal.getSeconds();
            hours = hours < 10 ? '0'+hours : hours;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            seconds = seconds < 10 ? '0'+seconds : seconds;
            let strTime = hours+'' + minutes+'' +seconds;
            let year = dateVal.getFullYear();
            let month = (dateVal.getMonth()+1);
            let date = dateVal.getDate();
            month = month < 10 ? '0'+month : month;
            date = date < 10 ? '0'+date : date;
            let startdt = year+''+''+month+''+date;
            let fullstr = startdt +'T'+strTime;
            return fullstr;
        }
        function convertISTDT(dateIST) {
            var dateVal = new Date(dateIST)

            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

            let day = weekday[dateVal.getDay()];
            let monthval = month[dateVal.getMonth()];

            let hours = dateVal.getHours();
            let minutes = dateVal.getMinutes();
            hours = hours < 10 ? '0'+hours : hours;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            let AmOrPm = hours >= 12 ? 'PM' : 'AM';
            hours = (hours % 12) || 12;
            let datenum = dateVal.getDate();
            datenum = datenum < 10 ? '0'+datenum : datenum;
            let year = dateVal.getFullYear();

            let fullstr = day+', '+monthval+' '+datenum+', '+year+' '+hours+':'+minutes+' '+AmOrPm;
            return fullstr;
        }
        
    } 
    get options() {
        return [
            {
                Name: 'Google Calendar',
                Id: 'option1',
            },
            {
                Name: 'Outlook.com Calendar',
                Id: 'option2',
            },
            {
                Name: 'iCal',
                Id: 'option3',
            }
        ];
    }
    
    handleGetSelectedValue(event){ 
        // console.log(event.target.value);      
        if(event.target.value == 'option1'){
            console.log('call google calendar');   
            window.open(this.url, '_blank');
        } else if(event.target.value == 'option2'){
            console.log('call outlook calendar');  
            window.open(this.outlookUrl, '_blank'); 
        }else if(event.target.value == 'option3'){
            console.log('call ICal');  
            window.location="https://globalattspa.gotowebinar.com/icsCalendar.tmpl?webinar="+this.webinarKey+"&user="+this.userKey;
        }
    } 
    
    handleFNameChange(event){
        this.firstName = event.target.value;
    }
    handleLNameChange(event){
        this.lastName = event.target.value;
    }
    handleEmailChange(event){
        this.email = event.target.value;
    }

    // handleRegister(event){
    //     console.log('First Name:',this.firstName);
    //     console.log('Last Name:',this.lastName);
    //     console.log('Email:',this.email);
    //     console.log('Email:',this.recordId);
    // }
    handleRegister(event){
        const objChild = this.template.querySelector('c-toast');  
        const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
        if (isInputsCorrect) {
            registerWebinarCallout({
                firstName: this.firstName ,
                lastName: this.lastName ,
                email: this.email ,
                accid: this.recordId
            })
            .then((result) => {
                console.log(result);
                if(result != 'Error'){
                    objChild.showToast('Success', 'Register Successfully','success', true); 
                    
                    let obj = JSON.parse(result);
                    console.log('mapOfValues==: ',obj);
                    this.registrantKey = obj.registrantKey;
                    this.joinUrl = obj.joinUrl;
                    this.status = obj.status;
                    this.webinarKey = obj.webinarKey;
                    const joinUrlArray = (this.joinUrl).split("/");
                    this.userKey = joinUrlArray[joinUrlArray.length-1]
                    console.log('userKey: ',this.userKey);
                    console.log('registrantKey: ',this.registrantKey);
                    console.log('joinUrl: ',this.joinUrl);
                    console.log('status: ',this.status);
                    
                    urlMaking({
                        webinarName : this.meetingName,
                        startDate : this.startDate,
                        endDate : this.endDate,
                        timeZone : this.timeZone,
                        registrantKey : this.registrantKey,
                        joinUrl : this.joinUrl,
                        status : this.status,
                        webinarKey : this.webinarKey,
                        // startDateOriginal : this.startDateOriginal,
                        // endDateOriginal : this.endDateOriginal
                    }).then((result) => {
                        console.log('result',result);
                        this.url = result;
                    })

                    urlMakingforOutlook({
                        webinarName : this.meetingName,
                        timeZone : this.timeZone,
                        registrantKey : this.registrantKey,
                        joinUrl : this.joinUrl,
                        status : this.status,
                        webinarKey : this.webinarKey,
                        startDateOutlook : this.startDateForOutlook,
                        endDateOutlook : this.endDateForOutlook
                        
                    }).then((result) => {
                        console.log('result',result);
                        this.outlookUrl = result;
                    })

                    this.mainPage = false;
                    this.secondPage = true;
                }
                // if(result.hasOwnProperty('success')){
                //      objChild.showToast('Success', 'Register Successfully','success', true);
                // }else{
                //     objChild.showToast('Error', result.error,'error', true);
                // }
                // this.error = undefined; 
            })
            .catch((error) => {
                console.log({error});
                console.log(JSON.parse(JSON.stringify({error})));
                objChild.showToast('Error', 'Some Error Accured','error', true);
            });
        }
    }
}