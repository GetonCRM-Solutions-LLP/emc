/* eslint-disable no-restricted-globals */
import {
    LightningElement, api
} from 'lwc';
// import {
//      openEvents
// } from 'c/utils';
import emcCss from '@salesforce/resourceUrl/EmcCSS';
import logo from '@salesforce/resourceUrl/mBurseCss';
export default class NavigationMenu extends LightningElement {
    @api driverMenuItem;
    @api driverName;
    @api driverEmail;
    @api profileId;
    menuLabel;
    initialized = false;
    scroll = false;
    showButtons = false;
    mileageMenu = false;
    manualMenu = false;
    company = logo + '/mburse/assets/mBurse-Icons/mBurse-logo.png';
    companyShort = logo + '/mburse/assets/mBurse-Icons/mBurse-short.png';
    user = emcCss + '/emc-design/assets/images/Icons/SVG/Green/User.svg';
    _originalAdmin = 'Admin';
    _originalDriver = 'Driver';
    _admin = 'A';
    _driver = 'D';
    _role;

    get adminText(){
        return this._admin
    }

    set adminText(value){
        this._admin = value;
    }

    get driverText(){
        return this._driver
    }

    set driverText(value){
            this._driver = value;
    }

    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    handleRedirect(event) {
        event.stopPropagation();
        let menu = this.template.querySelectorAll(".tooltipText");
        menu.forEach((item) => item.classList.remove('active'))
        const selectedMenu = (event.currentTarget !== undefined ) ? event.currentTarget.dataset.name : event;
        for (let i = 0; i < menu.length; i++) {
            if (selectedMenu === menu[i].dataset.name) {
                menu[i].classList.add('active');
                menu[i].href = `#${selectedMenu}`;
            }
        }
        //openEvents(this, selectedMenu)
        // this.mileageMenu = (selectedMenu === 'historical-mileage') ? true : false;
        // this.manualMenu = (selectedMenu === 'Manual-Entry') ? true : false;
    }

    @api toggleStyle(value) {
        let menu = this.template.querySelectorAll(".tooltipText");
        menu.forEach((item) => item.classList.remove('active'))
        const sMenu = value;
        for (let i = 0; i < menu.length; i++) {
           // console.log("Menu---->", sMenu , "name---->", menu[i].dataset.name)
            if (sMenu === menu[i].dataset.name) {
                menu[i].classList.add('active');
                menu[i].href = `#${sMenu}`;
            }
        }

        // this.mileageMenu = (selectedMenu === 'historical-mileage') ? true : false;
        // this.manualMenu = (selectedMenu === 'Manual-Entry') ? true : false;
    }

    redirectToHomePage(){
        // eslint-disable-next-line no-restricted-globals
        var url, path;
        url = location;
        path = url.origin + url.pathname + url.search;
        location.replace(path);
    }

    toggleSideBar() {
        const sidebar = this.template.querySelector('nav');
        if(this.showButtons){
            const textAdmin =  this._originalAdmin;
            const textDriver =  this._originalDriver;
            this._admin = (sidebar.className === 'sidebar') ? textAdmin.substring(0,1) : this._originalAdmin
            this._driver = (sidebar.className === 'sidebar') ? textDriver.substring(0,1) : this._originalDriver
        }
      
        this.dispatchEvent(
            new CustomEvent("sidebar", {
                detail: sidebar.className
            })
        );
        sidebar.classList.toggle("close");
    }

    logOut(){
        const logoutEvent = new CustomEvent('logout', {detail: 'logout'});
        this.dispatchEvent(logoutEvent);
    }

    redirectToDriverProfile(){
        window.location.href = location.origin + '/app/driverProfileDashboard' + location.search;
    }

    redirectToProfile(){
        if(this.profileId === '00e31000001FRDXAA4'){
            window.location.href = location.origin + '/app/managerProfileDashboard' + location.search;
        }else{
            window.location.href = location.origin + '/app/adminProfileDashboard' + location.search;
        }
    }

    handleContextMenu = (event) =>{
       // console.log(event)
        event.preventDefault();
    }

    renderedCallback() {
        const sidebar = this.template.querySelector('nav');
        if(!this.initialized){
           // console.log("render", this.initialized)
            this.cssStyle();
            this.initialized = true
            if(this.showButtons){
                let btn = this.template.querySelector('.admin-btn');
                let driverBtn = this.template.querySelector('.driver-btn');
                if(location.pathname === '/app/managerProfileDashboard' || location.pathname === '/app/adminProfileDashboard'){
                  btn.classList.add('active');
                  driverBtn.classList.remove('active');
                }else{
                  btn.classList.remove('active');
                  driverBtn.classList.add('active');
                }
          }
        }
        
        sidebar.addEventListener("mousedown", (evt) => {
            let element = evt.target;
            if (element) {
                if (element.className === "menu-links" || element.className === "menu" || element.className === 'text-head' || element.className === 'menu-bar') {
                    this.dispatchEvent(
                        new CustomEvent("sidebar", {
                            detail: sidebar.className
                        })
                    );
                    sidebar.classList.toggle("close");
                }
            }
        })
    }

    mouseOverLink(event){
        // console.log("mouse over", event);
        let _aLink = (event.toElement) ? event.toElement.name : '';
        let parent = this.template.querySelector('.tooltipValue').parentElement.className
        let yPosition = (event.clientY + "px")
        // console.log(yPosition, event.pageY + this.template.querySelector('.tooltipValue').clientHeight + 10, document.body.clientHeight)
        if(_aLink !== ''){
            if(parent === 'sidebar close'){
                this.menuLabel = _aLink;
                this.template.querySelector('.tooltipValue').style.top = yPosition;
                this.template.querySelector('.tooltipValue').classList.remove('hidden')
                this.template.querySelector('.tooltipValue').classList.add('tooltipVisible')
            }
        }
    }

    mouseLeave(){
           this.menuLabel = '';
           this.template.querySelector('.tooltipValue').classList.remove('tooltipVisible');
           this.template.querySelector('.tooltipValue').classList.add('hidden');
    }

    scrollEnable(){
        if(!this.scroll){
            let obj = this.template.querySelector('.menu-bar');
            if(obj.scrollTop === (obj.scrollHeight - obj.offsetHeight)){
                this.scroll = true;
            }
        }else{
            this.scroll = false;
        }
    }

    connectedCallback(){
        console.log("Pr--", this.profileId)
        if(this.profileId){
          //  const roleParamValue = new URL(window.location.href).searchParams.get('role');
            this.showButtons = (this.profileId === '00e31000001FRDXAA4' || this.profileId === '00e31000001FRDZAA4') ? true : false;
            this._originalAdmin = (this.profileId === '00e31000001FRDXAA4') ? 'Manager' : 'Admin';
            this._admin = (this.profileId === '00e31000001FRDXAA4') ? 'M' : 'A';
           // console.log("role", roleParamValue)
           // this._role = roleParamValue;
            // if(this.getUrlParamValue(window.location.href, 'role') !== undefined){
            //     this._role = this.getUrlParamValue(window.location.href, 'role')
            // }
        }
    }
    

    cssStyle(){
        if(this.template.querySelector('.menu-bar')){
            if(this.showButtons)
                this.template.querySelector('.menu-bar').style.height = 'calc(100% - 212px)';
            else
                this.template.querySelector('.menu-bar').style.height = 'calc(100% - 120px)';
        }
    }

    // cssStyleRemove(){
    //     this.template.querySelector('.menu-bar').classList.remove('revert');
    // }

    // connectedCallback(){
    //     window.addEventListener('contextmenu', this.handleContextMenu);
    // }

}