import { LightningElement,api } from 'lwc';
import logo from '@salesforce/resourceUrl/EmcCSS';
export default class DashboardProfileHeader extends LightningElement {
    @api userName;
    @api pageSource;
    @api fullName;
    @api companyLogo;
    @api isNavigate;
    @api expirationDate;
    notificationlogo = logo + '/emc-design/assets/images/Icons/PNG/Green/Notifications.png';
    @api setSource(value){
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.pageSource = value;
        console.log("source", this.pageSource)
    }

    @api styleHeader(value){
        if(value === 'sidebar close'){
              this.template.querySelector('.welcome-msg').classList.add('extend');
              this.template.querySelector('.welcome-msg').classList.remove('enclose');
        }else{
            this.template.querySelector('.welcome-msg').classList.add('enclose');
            this.template.querySelector('.welcome-msg').classList.remove('extend');
        }
    }

    @api styleLink(val){
        const Item = this.template.querySelectorAll("a");
            Item.forEach((el) =>{
                    if(val === el.name){
                        el.classList.add("is-active")
                    }else{
                        el.classList.remove("is-active")
                    }
            })
    }

    redirectToInsurance(){
        const redirectEvent = new CustomEvent('redirect', {detail: 'Insurance-Upload'});
        this.dispatchEvent(redirectEvent);
    }

    redirectToResource(){
        const redirectEvent = new CustomEvent('resourcenavigate', {detail: 'Videos'});
        this.dispatchEvent(redirectEvent);
    }

    handleContextMenu(evt){
        let name = (evt.srcElement) ? evt.srcElement.name : null
        var url , path;
        // eslint-disable-next-line no-restricted-globals
        url = location;
        path = url.origin + url.pathname + url.search + `#${name}`;
        if(name){
           // eslint-disable-next-line no-restricted-globals
           location.replace(path)
        }
        console.log('event', evt)
    }

    notificationRedirect(){
        const openEvent = new CustomEvent('notify', {detail: 'Videos'});
        this.dispatchEvent(openEvent);
    }

    renderedCallback(){
            const buttonItem = this.template.querySelectorAll("a");

            buttonItem.forEach((el) =>
                el.addEventListener("click", () => {
                    buttonItem.forEach((el2) => el2.classList.remove("is-active"));
                        el.classList.add("is-active")
                })
            );
    }

    logOut(){
        const logoutEvent = new CustomEvent('logout', {detail: 'logout'});
        this.dispatchEvent(logoutEvent);
    }
}