import { LightningElement, api, track, wire } from 'lwc';
import manageNotificationController from '@salesforce/apex/ManageNotificationController.manageNotificationController';
import FILE_ICON from '@salesforce/resourceUrl/fileUploadIcon';
import TEXT_ICON from '@salesforce/resourceUrl/textIcon';
import EDIT_ICON from '@salesforce/resourceUrl/editAction';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import NOTIFICATION_ICON from '@salesforce/resourceUrl/notificationIcon';
import getMileage from '@salesforce/apex/ManageNotificationController.ImportMileage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendInsuranceEmail from '@salesforce/apex/ManageNotificationController.sendInsuranceEmail';
import readFromFileInchunk from '@salesforce/apex/ManageNotificationController.readFromFileInchunk';
import UploadLocation from '@salesforce/apex/ManageNotificationController.UploadLocation';
import editInlineNewEmployee from '@salesforce/apex/ManageNotificationController.editInlineNewEmployee';
import {
  toastEvents
} from 'c/utils';

export default class UserTools2 extends LightningElement {
  @api contactList;
  @api contactInfo;
  @api accountId;
  @api contactId;
  @api tripColumn;
  @api tripKeyFields;
  @track isModalOpen = false;
  sortable = true;
  isFalse = true;
  isRecord = false;
  modalKeyFields;
  modalListColumn;
  isScrollable = false;
  isSort = true;
  isRowDn = true;
  isScrollable = false;
  paginated = false;
  data = [];
  notificationObj = {};
  accordionKeyFields;
  isPayperiod = false;
  textMessaging = false;
  name;
  userName;
  driverId;
  dataList = [];
  isdataLoaded = false;
  notificationDate = "";
  notiTextMessage = "";
  msgIndex = "";
  isNotification = false;
  @api accordionKeyFields = ["fullname", "insurance", "insuranceFile", "expirationDate", "locationFile", "notiMessage", "messageHolder"];
  accordionList = [];
  fileIconUrl = `${FILE_ICON}#file`;
  @api textIconUrl = `${TEXT_ICON}#text`;
  @api notificationIconUrl = `${NOTIFICATION_ICON}#notification`;
  @api editIconUrl = `${EDIT_ICON}#editicon`;
  fileData;

  @api accordionListColumn = [
    {
      "id": 1,
      "name": "Name",
      "colName": "fullname",
      "colType": "String",
      "style": "width:12rem",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 2,
      "name": "Insurance Status",
      "colName": "insurance",
      "colType": "String",
      "style": "width:12rem",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 3,
      "name": "Insurance",
      "colName": "insuranceFile",
      "colType": "String",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 4,
      "name": "Expires",
      "colName": "expirationDate",
      "colType": "Date",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 5,
      "name": "Location",
      "colName": "locationFile",
      "colType": "String",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 6,
      "name": "Notification Message",
      "colName": "notiMessage",
      "colType": "String",
      "style": "width:15rem",
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    },
    {
      "id": 7,
      "name": "Message",
      "colName": "messageHolder",
      "colType": "String",
      "sort": true,
      "arrUp": false,
      "arrDown": false,
      "isCheckBox": false,
      "isChecked": false
    }
  ];

  @api recordId;
  @api classToTable = 'slds-table--header-fixed_container preview-height';
  searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
  currentPageReference = null;
  urlStateParameters = null;
  headerModalText = "Communication";
  contentMessage = "Communication";
  subMessage = "body Content";
  modalcontentstyle = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small overflow-visible"
  modalClass = "slds-modal slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft";
  headerClass = "slds-modal__header header-preview slds-p-left_xx-large slds-clearfix";
  subheaderClass = "slds-modal__title slds-hyphenate hedear-style_class";
  modalContent = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small";
  styleHeader = "slds-modal__container modal--small";
  closebtnclass = "close-notify";
  isCheckbox = true;
  onloadTool;
  istrueInsurance = false;
  isMileageLoaded = false;
  mileageData;
  mileageListColumn;
  @api isEditMode = false;
  @api editableView;
  istrueMessaging = false;
  locationData;
  mileageKeyFields;
  insuranceLabel = 'Send insurance reminder';
  selectedData;
  disableBtn = true;
  isTrueCancelProcess = false;
  messagingLabel = 'Mass text message';
  fileKey;
  fileContent;
  handleCloseModal() {

  }
  rowHandler(event) {

    console.log('RowSelection', event.detail.targetId);
  }
  openMenu() {
    // this.isModalOpen = true;
    this.styleheader = "slds-modal__container slds-m-top_medium modal_width"
    if (this.template.querySelector('c-user-profile-modal')) {
      if (this.isMileageLoaded) {
        const evt = new ShowToastEvent({
          title: 'Toast Info',
          message: 'Cancel the existing process first to access the menu',
          variant: 'info',
          mode: 'dismissable'
        });
        this.dispatchEvent(evt);
      } else {
        console.log('OpenMenu');
        this.template.querySelector('c-user-profile-modal[data-id="menu"]').show();
      }

    }
  }

  handleModal(event) {
    // this.template.querySelector('c-user-profile-modal[data-id="upload"]').show();

    this.fileKey = event.detail.key;
    if (this.fileKey == 'locationFile' || this.fileKey == 'insuranceFile') {
      const fileInput = this.template.querySelector('input[type="file"]');
      fileInput.click();
    } else {
      this.template.querySelector('c-user-profile-modal[data-id="message"]').show();
    }

  }

  /*Added by Megha */
  getUser(id) {
    let list = this.proxyToObject(this.data);
    return list.find(user => (user.contactId === id));
  }

  
  handlePopup(event) {
    if (event && event.detail) {
      let key = event.detail.key;
      let id = event.detail.id;
      let singleUser = this.getUser(id);
      this.notificationObj = singleUser;
      this.userName = singleUser.fullname;
      this.driverId = singleUser.contactId;
      this.notiTextMessage = (singleUser.notiMessage === null) ? "" : singleUser.notiMessage;
      if (key === 'textMessage') {
        this.textMessaging = true;
      } else {
        this.msgIndex = id;
        this.isNotification = true;
      }
      console.log("Name ---", key, singleUser.fullname)
    }
  }

  getUsers() {
    manageNotificationController({ accId: this.accountId, adminId: this.contactId })
      .then(response => {
        this.data = [];
        this.data = JSON.parse(response);
        this.dataList = this.proxyToObject(this.data);
        console.log('configData', this.data);
        this.dynamicBinding(this.data, this.accordionKeyFields);
        this.template
        .querySelector("c-user-preview-table").tableListRefresh(this.data);
        this.spinnerComplete();
        this.isdataLoaded = true;
        // console.log('this.data ',this.dataList);
      }).catch(error => {
        console.log('configData-Error', error);
      });
  }

  spinnerProgress(msg) {
    this.dispatchEvent(
      new CustomEvent("showloader", { detail: { message: msg } })
    );
  }

  spinnerComplete() {
    this.dispatchEvent(
      new CustomEvent("hideloader", { detail: { message: '' } })
    );
  }

  closeNotificationPopup() {
    this.isNotification = false;
  }


  sendNotification(evt) {
    var textInput = this.template.querySelector(`data-id${this.msgIndex},.noti_TextInput`).value, notification = [];
    this.spinnerProgress('Sending...');
    evt.preventDefault();
    if (textInput === "") {
      this.spinnerComplete();
      this.template.querySelector(`data-id${this.msgIndex},.span-error`).classList.remove("d-none");
      this.template.querySelector(`data-id${this.msgIndex},.message-controls`).classList.add("border-error");
    } else {
      this.template.querySelector(`data-id${this.msgIndex},.span-error`).classList.add("d-none");
      this.template.querySelector(`data-id${this.msgIndex},.message-controls`).classList.remove("border-error");
      this.notificationObj.notiMessage = textInput;
      notification.push(this.notificationObj);
      console.log("Notification--", JSON.stringify(notification))
      editInlineNewEmployee({
        listofemployee: JSON.stringify(notification),
        adminId: this.contactId
      })
        .then(result => {
          if (result === 'Success') {
            this.getUsers();
            this.isNotification = false;
            let message = "Notification has been sent to " + this.notificationObj.name + ' ' + this.notificationObj.lastname;
            let toastSuccess = { type: "success", message: message };
            toastEvents(this, toastSuccess);
            this.notification = [];
          } else {
            this.spinnerComplete();
          }
        }).catch(error => {
          this.spinnerComplete();
          console.log('editInlineNewEmployee', this.proxyToObject(error));
        });
    }
  }

 
  closePopup() {
    this.textMessaging = false
  }

  /*Added by Megha ends*/

  handleFileChange(event) {
    // this.fileData = event.target.files[0];
    const testURL = window.location.href;
    let newURL = new URL(testURL).searchParams;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      let fileData = reader.result;
      this.fileContent = fileData;
      console.log('Selected locationFile1:', this.fileContent);
      uploadLocations({ location: this.fileContent, accId: newURL.get('accid') })
        .then(response => {
          console.log('uploadLocations', response);
        }).catch(error => {
          console.log('uploadLocations-Error', error);
        });
    };

    reader.readAsText(file);
    // console.log('Selected locationFile:',this.fileContent);
    if (this.fileKey == 'locationFile') {
      const fileInput = this.template.querySelector('input[type="file"]');
      fileInput.click();
      console.log('Selected locationFile:', this.fileContent);
      // uploadLocations({location:this.fileContent,accId:newURL.get('accid')})
      // .then(response => {
      //       console.log('uploadLocations',response);
      // }).catch(error => {
      //     console.log('uploadLocations-Error',error);
      // });
    } else if (this.fileKey == 'insuranceFile') {
      const fileInput = this.template.querySelector('input[type="file"]');
      fileInput.click();
      console.log('Selected insuranceFile:');
      // readFromFileInchunk({attachmentBody:,attachmentName:,attachmentId:,did:,accid:,contactattachementid:})
      // .then(response => {
      //       console.log('readFromFileInchunk',response);
      // }).catch(error => {
      //     console.log('readFromFileInchunk-Error',error);
      // });
    }
  }
  closeModal() {
    this.isModalOpen = false;
  }

  dynamicBinding(data, keyFields) {
    data.forEach(element => {
      let model = [];
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          let singleValue = {}
          if (keyFields.includes(key) !== false) {
            singleValue.key = key;
            singleValue.value = element[key];
            singleValue.uId = (element.contactId) ? element.contactId : element.id;
            singleValue.truncate = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
            singleValue.tooltip = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
            singleValue.tooltipText = (key === 'notiMessage') ? (element[key] !== null) ? element[key] : false : false;
            singleValue.onlyIcon = (key === "messageHolder" || key === "locationFile" || key === "insuranceFile") ? true : false;
            /*Added by Megha */
            singleValue.multipleIcon = (key === "messageHolder") ? [{ "key": "textMessage", "iconUrl": this.textIconUrl }, { "key": "notification", "iconUrl": this.notificationIconUrl }] : null;
            singleValue.iconUrl = (key === "messageHolder") ? this.notificationIconUrl : (key === "locationFile" || key === 'insuranceFile') ? this.fileIconUrl : '';
            /*Added by Megha ends --- */
            singleValue.onlyLink = (key === "driverName" || key === "fullname") ? true : false;
            singleValue.isLink = (key === "driverName" || key === "fullname") ? true : false;

            /*Added by Megha */
            singleValue.isLabel = (key === "insurance") ? true : false;
            singleValue.labelClass = (key === "insurance") ? (element[key] !== null) ? ((element[key] === 'Yes') ? 'status status-text status-success text-green' : (element[key] === 'No' || element[key] === 'Expired') ? 'status status-text status-error text-red' : 'status status-text status-normal') : '' : '';
            /*Added by Megha ends -- */
            model.push(singleValue);
          }
          singleValue.id = (element.contactId) ? element.contactId : element.id;
        }
      }
      element.id = (element.contactId) ? element.contactId : element.id;
      element.toggle = false;
      element.isChecked = false;
      element.keyFields = this.mapOrder(model, keyFields, 'key');
    });
  }

  connectedCallback() {
    this.onloadTool = true;
    this.istrueMessaging = false;
    this.istrueInsurance = false;
    this.isScrollable = true;
    this.paginatedModal = true;
    this.modalListColumn = [];
    this.modalKeyFields = [];
    this.isCheckbox = true;
    const today = new Date();
    this.notificationDate = today;
    const testURL = window.location.href;
    let newURL = new URL(testURL).searchParams;
    manageNotificationController({ accId: newURL.get('accid'), adminId: newURL.get('id') })
      .then(response => {
        this.data = JSON.parse(response);
        this.dataList = this.proxyToObject(this.data);
        console.log('configData', this.data);
        this.dynamicBinding(this.data, this.accordionKeyFields);
        this.isdataLoaded = true;
        // console.log('this.data ',this.dataList);
      }).catch(error => {
        console.log('configData-Error', error);
      });
  }

  proxyToObject(data) {
    return JSON.parse(JSON.stringify(data));
  }

  mapOrder(array, order, key) {
    array.sort(function (a, b) {
      var A = a[key],
        B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      }
      return -1;
    });

    return array;
  }

  handleInsuranceReminder() {

    if (this.template.querySelector('c-user-profile-modal')) {
      console.log('close');
      this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
      this.insuranceLabel = 'Send Insurance Reminder';
      this.istrueInsurance = true;
      this.onloadTool = false;
      this.istrueMessaging = false;
    }
  }

  handleMessaging() {
    this.onloadTool = false;
    this.isModalOpen = false;
    // this.isdataLoaded = false;
    console.log('handleMessaging');
    this.istrueMessaging = true;
    this.istrueInsurance = false;
    this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
  }
  handleMilleage() {
    this.isdataLoaded = false;
    this.istrueInsurance = false;
    this.isMileageLoaded = true;
    this.isModalOpen = false;
    this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
    this.mileageKeyFields = ["driverName", "totalMileage"];
    this.mileageListColumn = [
      {
        "id": 1,
        "name": "Name",
        "colName": "driverName",
        "colType": "String",
        "arrUp": false,
        "arrDown": false
      },
      {
        "id": 2,
        "name": "Jun",
        "colName": "totalMileage",
        "colType": "String",
        "arrUp": false,
        "arrDown": false
      }
    ];
    this.isCheckbox = false;
    const testURL = window.location.href;
    let newURL = new URL(testURL).searchParams;
    getMileage({ accountId: newURL.get('accid') })
      .then(response => {
        this.mileageData = JSON.parse(response);
        console.log('Mileage-Data-', response);
        this.editableView = true;
        this.dynamicBinding(this.mileageData, this.mileageKeyFields);
      }).catch(error => {
        console.log('configData-Error', error);
      });

  }
  handleUpdateList(event) {
    this.selectedData = JSON.parse(event.detail);
    let selected = [];
    // console.log('se',this.mileageData.id);
    this.items = this.selectedData.filter(el => {
      if (el.isChecked) {
        return true;
      }
    });
    if (this.istrueInsurance) {
      console.log('Insurance', this.items.contactId);
      this.insuranceLabel = 'Send mail';
    } else if (this.istrueMessaging) {
      this.messagingLabel = 'Create text message';
    }
    console.log('selected', this.items);
  }

  editMode() {
    this.isEditMode = true;
    console.log('EditMode');
  }
  
  startSpinner() {
    this.dispatchEvent(
      new CustomEvent("show", {
        detail: "spinner"
      })
    );
  }
  stopSpinner() {
    this.dispatchEvent(
      new CustomEvent("hide", {
        detail: "spinner"
      })
    );
    let toastFinish = { type: "success", message: 'Insurance reminder mail successfully sent.' };
    toastEvents(this, toastFinish);
  }
  handleSendInsuranceReminder() {
    // this.isCheckbox = true;
    this.startSpinner();
    this.istrueInsurance = true;
    this.isTrueCancelProcess = true;
    this.istrueMessaging = false;
    console.log('handleSendInsuranceReminder');
    this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    if (this.insuranceLabel === 'Send Mail') {
      this.items.forEach(element => {
        sendInsuranceEmail({ Id: element.id, Name: element.name, email: element.contactEmail })
          .then(response => {
            console.log('sendMail', response);
            this.stopSpinner();
          }).catch(error => {
            console.log('send-Error', error);
          });
      });
      // const evt = new ShowToastEvent({
      //   title: 'Mail Sent',
      //   message: 'Insurance reminder mail successfully sent',
      //   variant: 'success',
      // });
      // this.dispatchEvent(evt);      
    }
  }
  handleMassTextMessage() {
    this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    this.isTrueCancelProcess = true;
    if (this.messagingLabel === 'Create text message') {
      console.log('Create Text Message');
    }
  }
  handleCancelProcess() {
    this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
    this.insuranceLabel = 'Send insurance reminder';
    this.messagingLabel = 'Mass text message';
    this.isTrueCancelProcess = false;
    this.istrueInsurance = false;
    this.items.forEach(element => {
      element.isChecked = false;
    });
    // this.isdataLoaded = true;
    this.isMileageLoaded = false;
    this.isCheckbox = false;
    console.log('cancel', this.data);
    this.dynamicBinding(this.data, this.accordionKeyFields);
    this.isdataLoaded = true;
    this.onloadTool = true;
    this.istrueMessaging = false;
  }

  handleChange(){
    this.template
    .querySelector("c-user-preview-table")
    .searchByKey(this._value);
  }
  
  downloadLocationTemp() {
    var data = JSON.stringify(this.jsonLocation)
    this.locationData = [
      ['Name (optional)', 'Address', 'Latitude (optional)', 'Longitude (optional)', 'Default Activity (optional)'],
      ['The White House', '1600 Pennsylvania Ave NW, Washington, DC 20500', '38.683885', '-8.6109719', 'Business']
    ];
    console.log(this.locationData);
    let rowEnd = '\n';
    let csvString = '';
    let rowData = new Set();
    this.locationData.forEach(function (record) {
      Object.keys(record).forEach(function (key) {
        rowData.add(key);
      });
    });
    rowData = Array.from(rowData);

    csvString += rowData.join(',');
    csvString += rowEnd;

    for (let i = 0; i < this.locationData.length; i++) {
      let colValue = 0;

      console.log('Row data');
      for (let key in rowData) {
        if (rowData.hasOwnProperty(key)) {
          let rowKey = rowData[key];
          if (colValue > 0) {
            csvString += ',';
          }
          let value = this.locationData[i][rowKey] === undefined ? '' : this.locationData[i][rowKey];
          csvString += '"' + value + '"';
          colValue++;
        }
      }
      csvString += rowEnd;
    }
    let downloadElement = document.createElement('a');

    downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    downloadElement.target = '_self';
    downloadElement.download = 'Location template.csv';
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }
  exportToExcel() {
    let rowEnd = '\n';
    let csvString = '';
    let rowData = new Set();
    this.data.forEach(function (record) {
      Object.keys(record).forEach(function (key) {
        rowData.add(key);
      });
    });
    rowData = Array.from(rowData);

    csvString += rowData.join(',');
    csvString += rowEnd;

    for (let i = 0; i < this.data.length; i++) {
      let colValue = 0;

      console.log('Row data');
      for (let key in rowData) {
        if (rowData.hasOwnProperty(key)) {
          let rowKey = rowData[key];
          if (colValue > 0) {
            csvString += ',';
          }
          let value = this.data[i][rowKey] === undefined ? '' : this.data[i][rowKey];
          csvString += '"' + value + '"';
          colValue++;
        }
      }
      csvString += rowEnd;
    }
    let downloadElement = document.createElement('a');

    downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    downloadElement.target = '_self';
    downloadElement.download = 'Location Data.csv';
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }
}