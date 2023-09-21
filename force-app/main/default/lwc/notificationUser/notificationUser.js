/* eslint-disable no-restricted-globals */
import { LightningElement, api } from 'lwc';
import emcCss from '@salesforce/resourceUrl/EmcCSS';
import logo from '@salesforce/resourceUrl/mBurseCss';
export default class NotificationUser extends LightningElement {
  /*adminProfileMenu = [
    {
      id: 1,
      label: "Mileage",
      menuItem: [
        {
          menuId: 101,
          menu: "Mileage-Approval",
          menuLabel: "Approval",
          menuClass: "active",
          logo: logo + "/emc-design/assets/images/Icons/SVG/Green/Approval.svg#approval",
          logoHov: logo + "/emc-design/assets/images/Icons/SVG/White/Approval.svg#approval"
        },
        {
          menuId: 102,
          menu: "Mileage-Summary",
          menuLabel: "Summary",
          menuClass: "active",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Mileage_summary.svg#summary",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/SVG/White/Mileage_summary.svg#summary"
        },
        {
          menuId: 103,
          menu: "Mileage-Preview",
          menuLabel: "Preview",
          menuClass: "active",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Historical_Mileage.svg#historical",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/SVG/White/Historical_Mileage.svg#historical"
        }
      ]
    },
    {
      id: 2,
      label: "Plan management",
      menuItem: [
        {
          menuId: 201,
          menu: "Team",
          menuLabel: "Team",
          menuClass: "",
          logo:
            logo + "/emc-design/assets/images/Icons/SVG/Green/Drivers_list.svg#drivers",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Drivers_list.svg#drivers"
        },
        {
          menuId: 202,
          menu: "Reports",
          menuLabel: "Reports",
          menuClass: "",
          logo:
            logo + "/emc-design/assets/images/Icons/SVG/Green/Reports.svg#report",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Reports.svg#report"
        },
        {
          menuId: 203,
          menu: "Tools",
          menuLabel: "Tools",
          menuClass: "",
          logo:
            logo + "/emc-design/assets/images/Icons/SVG/Green/Tools.svg#tools",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Tools.svg#tools"
        },
        {
          menuId: 204,
          menu: "Users",
          menuLabel: "Users",
          menuClass: "",
          logo:
            logo + "/emc-design/assets/images/Icons/SVG/Green/Users.svg#users",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Users.svg#users"
        }
      ]
    },
    {
      id: 3,
      label: "Help & info",
      menuItem: [
        {
          menuId: 301,
          menu: "Notifications",
          menuLabel: "Notifications",
          menuClass: "",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Notifications.svg#notification",
          logoHov:
            logo + "/emc-design/assets/images/Icons/SVG/White/Notifications.svg#notification"
        },
        {
          menuId: 302,
          menu: "Videos",
          menuLabel: "Videos/Training",
          menuClass: "",
          logo:
            logo +
            "/emc-design/assets/images/Icons/SVG/Green/Driver_Videos_Training.svg#videos",
          logoHov:
            logo +
            "/emc-design/assets/images/Icons/SVG/White/Driver_Videos_Training.svg#videos"
        }
      ]
    }
  ];*/
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
  _originalAdmin = 'Admin Dashboard';
  _originalDriver = 'Driver Dashboard';
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
        //console.log("Menu---->", selectedMenu , "name---->", menu[i])
          if (selectedMenu === menu[i].dataset.name) {
              menu[i].classList.add('active');
              menu[i].href = `#${selectedMenu}`;
          }
      }
  }

  @api toggleStyle(value) {
      let menu = this.template.querySelectorAll(".tooltipText");
      menu.forEach((item) => item.classList.remove('active'))
      const sMenu = value;
      for (let i = 0; i < menu.length; i++) {
          console.log("Menu---->", sMenu , "name---->", menu[i])
          if (sMenu === menu[i].dataset.name) {
              menu[i].classList.add('active');
              menu[i].href = `#${sMenu}`;
          }
      }
  }

  redirectToHomePage(){
      // eslint-disable-next-line no-restricted-globals
      var url, path;
      url = location;
      path = url.origin + url.pathname + url.search;
      location.replace(path);
  }

  toggleSideBar() {
      const sidebar = this.template.querySelector('.sidebar');
      if(this.showButtons){
          const textAdmin =  this._originalAdmin;
          const textDriver =  this._originalDriver;
          this._admin = (sidebar.className === 'sidebar open') ? textAdmin.substring(0,1) : this._originalAdmin
          this._driver = (sidebar.className === 'sidebar open') ? textDriver.substring(0,1) : this._originalDriver
      }

      this.dispatchEvent(
          new CustomEvent("sidebar", {
              detail: sidebar.className
          })
      );
      sidebar.classList.toggle("open");
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

  // mouseOverLink(){
  //   this.template.querySelector('.menu-wrapper').classList.add('overflow-visible');
  // }

  // mouseLeave(){
  //   this.template.querySelector('.menu-wrapper').classList.remove('overflow-visible');
  // }

  connectedCallback(){
    console.log("Pr--", this.profileId)
    if(this.profileId){
        this.showButtons = (this.profileId === '00e31000001FRDXAA4' || this.profileId === '00e31000001FRDZAA4') ? true : false;
        this._originalAdmin = (this.profileId === '00e31000001FRDXAA4') ? 'Manager Dashboard' : 'Admin Dashboard';
        this._admin = (this.profileId === '00e31000001FRDXAA4') ? 'M' : 'A';
    }
  }

  renderedCallback() {
      const sidebar = this.template.querySelector('.sidebar');
      const menu = this.template.querySelector('.menu-wrapper');
      var tooltips = this.template.querySelectorAll(".tooltip");
      if(!this.initialized){
         // console.log("render", this.initialized)
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
              if (element.className === "nav-list"  || element.className === 'text-head') {
                  this.dispatchEvent(
                      new CustomEvent("sidebar", {
                          detail: sidebar.className
                      })
                  );
                  sidebar.classList.toggle("open");
              }
          }
      })

      menu.addEventListener('scroll', () => {
       if(menu.scrollTop === (menu.scrollHeight - menu.offsetHeight)){
         tooltips.forEach(tooltip => {
            //console.log(tooltip.getBoundingClientRect(), tooltip.parentElement.getBoundingClientRect())
              let v = tooltip.parentElement.getBoundingClientRect().y - tooltip.getBoundingClientRect().y;
              tooltip.style.marginTop = ((v - menu.scrollTop) - tooltip.parentElement.getBoundingClientRect().height) - 49 +"px"; 
              //-35 is the default marginTop value of tooltip
          });
      }else{
        tooltips.forEach(tooltip => {
          //console.log(tooltip.getBoundingClientRect(), tooltip.parentElement.getBoundingClientRect())
            let v = tooltip.parentElement.getBoundingClientRect().y - tooltip.getBoundingClientRect().y;
            tooltip.style.marginTop = (v - menu.scrollTop) - 49 +"px"; 
            //-8 is the default marginTop value of tooltip
        });
      }
    
    });
  }

  /*renderedCallback(){
    let sidebar = this.template.querySelector(".sidebar");
    let closeBtn = this.template.querySelector(".toggle");
    closeBtn.addEventListener("click", ()=>{
      sidebar.classList.toggle("open");
    });

  }*/
}