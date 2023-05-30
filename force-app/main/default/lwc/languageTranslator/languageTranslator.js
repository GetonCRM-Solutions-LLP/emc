import { LightningElement, track } from 'lwc';

export default class LanguageTranslator extends LightningElement {
    @track languageOptions=[]

    fromLang;
    toLang;
    languageInputed;
    convertedText;
    @track convertButtnstateDisabled=true;

    connectedCallback(){
       this.getListLanguages();
    }

    getLanguage = (code) => {
        const lang = new Intl.DisplayNames(['en'], {type: 'language'});
        return lang.of(code);
    }
    
    formatData(apiResult){
        // eslint-disable-next-line array-callback-return
        apiResult.data.languages.map(data => {

            const option = {
                label : ''+ this.getLanguage(data.language),
                name: ''+ this.getLanguage(data.language),
                value : data.language
            };
            this.languageOptions = [...this.languageOptions, option];
        })

       this.languageOptions= this.languageOptions.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        console.log('** updateDataWithLanguageName **'+JSON.stringify(this.languageOptions));
    }

    getListLanguages(){
        const options = {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': '58755bacb4msh2b323a55a2d692cp11dcd1jsne4b11b8241bd',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            }
        };
        
        // fetch('https://google-translate1.p.rapidapi.com/language/translate/v2/languages', options)
        //     .then(res => {
        //         console.log("*****", res)
        //         return res.json()
        //     })
        //     .then(res => {
        //         this.formatData(res)
        //         console.log(res)
        //     })
        //     .catch(err => console.error(err));
    }


    handleLangSelection(event){

        if(event.target.dataset.id==='fromLang'){
        this.fromLang = event.target.value;
       }else{
        this.tolanguage = event.target.value;
       }

      // console.log("** this.fromLanugage", this.fromLanugage)

       this.validateButtonState();
    }

    handleTextChange(event){
        //  alert('handleTextChange');
        this.languageInputed = event.target.value
        this.validateButtonState();
      }
  
      validateButtonState(){
  
          if(( this.languageInputed!=null &&  this.languageInputed.length>0) && (this.fromLang!=null) && (this.toLang!=null)){
              this.convertButtnstateDisabled=false;
          }
  
          console.log("languageInputed", this.languageInputed)
          console.log("fromLanugage", this.fromLang)
  
          console.log("tolanguage", this.toLang)
      }

      convertText(){

        const encodedParams = new URLSearchParams();
        encodedParams.append("q", this.languageInputed);
        encodedParams.append("target", this.toLang);
        encodedParams.append("source", this.fromLang);

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': '58755bacb4msh2b323a55a2d692cp11dcd1jsne4b11b8241bd',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            body: encodedParams
        };        

    //   fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', options)
    //  	.then(response => {
    //         return  response.json()
    //     })
	//     .then(response => {
    //        // alert(JSON.stringify(response)); 
    //         console.log(response)
    //         this.convertedText=response.data.translations[0].translatedText
    //         console.log(this.convertedText);
    //     })
	//     .catch(err => {
    //         console.log(JSON.stringify(err)); 
    //         console.error(err)
    //     });

       }


}