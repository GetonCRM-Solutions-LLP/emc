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
    menuLabel;
    scroll = false;
    mileageMenu = false;
    manualMenu = false;
    company = logo + '/mburse/assets/mBurse-Icons/mBurse-logo.png';
    companyShort = logo + '/mburse/assets/mBurse-Icons/mBurse-short.png';
    user = emcCss + '/emc-design/assets/images/Icons/SVG/Green/User.svg';

    handleRedirect(event) {
        event.stopPropagation();
        let menu = this.template.querySelectorAll("a");
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
        let menu = this.template.querySelectorAll("a");
        menu.forEach((item) => item.classList.remove('active'))
        const sMenu = value;
        for (let i = 0; i < menu.length; i++) {
            console.log("Menu---->", sMenu , "name---->", menu[i].dataset.name)
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
        var locate = location;
        locate.reload();
    }

    toggleSideBar() {
        const sidebar = this.template.querySelector('nav');
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

    handleContextMenu = (event) =>{
        console.log(event)
        event.preventDefault();
    }

    renderedCallback() {
        const sidebar = this.template.querySelector('nav');
        sidebar.addEventListener("mousedown", (evt) => {
            let element = evt.target;
            console.log("mouse", evt.target.className);
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
        console.log("mouse over", event);
        let _aLink = (event.toElement) ? event.toElement.name : '';
        let parent = this.template.querySelector('.tooltipValue').parentElement.className
        if(_aLink !== ''){
            if(parent === 'sidebar close'){
                this.menuLabel = _aLink;
                console.log("mouse over", _aLink);
                this.template.querySelector('.tooltipValue').style.top = (!this.scroll) ? event.toElement.offsetTop + 'px'  : (event.toElement.offsetTop - 52) + 'px';
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

    scrollEnable(event){
        if(!this.scroll){
            let obj = this.template.querySelector('.menu-bar');
            if( obj.scrollTop === (obj.scrollHeight - obj.offsetHeight)){
                this.scroll = true;
            }
        }else{
            this.scroll = false;
        }
        console.log("scroll", event, this.template.querySelector('.menu-bar').scrollTop,  this.template.querySelector('.menu-bar').scrollHeight , this.template.querySelector('.menu-bar').offsetHeight)
    }
    

    // cssStyle(){
    //     console.log("css",  this.template.querySelector('.menu-bar').style.overflow)
    //     this.template.querySelector('.menu-bar').classList.add('revert');
    // }

    // cssStyleRemove(){
    //     this.template.querySelector('.menu-bar').classList.remove('revert');
    // }

    // connectedCallback(){
    //     window.addEventListener('contextmenu', this.handleContextMenu);
    // }

}