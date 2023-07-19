import { LightningElement, api, track, wire } from 'lwc';
import manageNotificationController from '@salesforce/apex/ManageNotificationController.manageNotificationController';
import FILE_ICON from '@salesforce/resourceUrl/fileUploadIcon';
import TEXT_ICON from '@salesforce/resourceUrl/textIcon';
import EDIT_ICON from '@salesforce/resourceUrl/editAction';
import DELETE_ICON from '@salesforce/resourceUrl/deleteIcon';
import NOTIFICATION_ICON from '@salesforce/resourceUrl/notificationIcon';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getMileage from '@salesforce/apex/ManageNotificationController.ImportMileage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendInsuranceEmail from '@salesforce/apex/ManageNotificationController.sendInsuranceEmail';
import readFromFileInchunk from '@salesforce/apex/ManageNotificationController.readFromFileInchunk';
import UploadLocation from '@salesforce/apex/ManageNotificationController.UploadLocation';
import editInlineNewEmployee from '@salesforce/apex/ManageNotificationController.editInlineNewEmployee';
import sendMessageToMultipleContacts from '@salesforce/apex/ManageNotificationController.sendMessageToMultipleContacts';
import sendImageToMultipleContacts from '@salesforce/apex/ManageNotificationController.sendImageToMultipleContacts';
import clearMassNotification from '@salesforce/apex/ManageNotificationController.clearMassNotification';
import UpdateImportMileage from '@salesforce/apex/ManageNotificationController.UpdateImportMileage';
import clearNotification from '@salesforce/apex/ManageNotificationController.clearNotification';
import WORK_BOOK from "@salesforce/resourceUrl/xlsx";
import {
  toastEvents, modalEvents
} from 'c/utils';
import {
  loadStyle,
  loadScript
} from 'lightning/platformResourceLoader';

export default class UserTools extends LightningElement {

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
  accordionKeyFields;
  isPayperiod = false;
  textMessaging = false;
  name;
  dataList = [];
  isdataLoaded = false;
  @api accordionKeyFields = ["fullname", "insurance", "insuranceFile", "expirationDate", "locationFile", "notiMessage", "messageHolder"];
  accordionList = [];
  fileIconUrl = `${FILE_ICON}#file`;
  @api textIconUrl = `${TEXT_ICON}#text`;
  @api notificationIconUrl = `${NOTIFICATION_ICON}#notification`;
  @api deleteIconUrl = `${DELETE_ICON}#delete`;
  @api isSubmitVisible = false;
  fileData;
  isNotification = false;
  locationAttachment;
 
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
  messagingLabel = 'Mass Text Message';
  massNotimessageLabel = 'Mass Notification Message';
  fileKey;
  fileContent;
  fileId;
  pdfContent;
  choosefile;
  fileList;
  chooseFileName;
  errorUploading;
  fileName;
  fSize;
  attachmentName;
  attachment;
  positionIndex;
  fileSize;
  chunkSize = 950000;
  isSpinner = false;
  onmassText = false;
  onnotificationMessage = false;
  items = [];
  userName;
  msgIndex = "";
  notificationDate = "";
  driverId;
  locationChoose = [];
  notiTextMessage = "";
  massTextMessage;
  massNotificationMsg = "";
  attachUrl = "";
  notificationObj = {};
  imageUploaded = false;
  insertedText = false;
  mileageupdate;
  fileInputRef;
  get classForFile() {
    return (this.imageUploaded) ? 'chat__file-image chat_background' : 'chat__file-image'
  }

  get textStyle() {
      return (this.imageUploaded) ? 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_6-of-12 slds-p-right_medium' : 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_9-of-12 slds-p-right_medium'
  }

  get imageHolderStyle() {
      return (this.imageUploaded) ? 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_4-of-12 slds-p-right_xxx-small' : 'slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_1-of-12 slds-p-right_xxx-small'
  }
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
    this.fileKey = event.detail.key;
    this.fileId = event.detail.id;
    console.log(" fileKey",this.fileKey);
    if (this.fileKey == 'locationFile' || this.fileKey == 'insuranceFile') {
      const fileInput = this.template.querySelector('input[type="file"]');
      fileInput.click();
    } else {
      // this.template.querySelector('c-user-profile-modal[data-id="message"]').show();
    }

  }
  renderedCallback() {
    console.log("inside callback",this.accountId);
    if (this.renderInitialized) {
        return;
    }
    this.renderInitialized = true;
    Promise.all([loadScript(this, WORK_BOOK)])
      .then(() => {
        console.log("success");
      })
      .catch(error => {
        console.log("failure");
      });
}
initializeTooltip() {
  $(this.template.querySelector('.naoTooltip-wrap')).naoTooltip();

  $(this.template.querySelector('.naoTooltip-wrap')).naoTooltip({
      speed: 200
  });
}
  getUser(id) {
		let list = this.proxyToObject(this.data);
		return list.find(user => (user.contactId === id));
	}
  /*Added by Megha */
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
        this.template.querySelector("c-user-preview-table").tableListRefresh(this.data);
        this.spinnerComplete();
        this.isdataLoaded = true;
        // console.log('this.data ',this.dataList);
      }).catch(error => {
        console.log('configData-Error', error);
      });
  }
  getMileage() {
    getMileage({ accountId: this.accountId})
      .then(response => {
        this.mileageData = JSON.parse(response);
        console.log('Mileage-Data-', response);
        this.editableView = true;
        console.log('MileageKey',this.proxyToObject(this.mileageupdate));
        this.dynamicBinding(this.mileageupdate, this.mileageKeyFields);
        this.spinnerComplete();
        this.isMileageLoaded = true;
        this.template.querySelector('.mileage-user-table').tableListRefresh(this.mileageupdate);
      }).catch(error => {
        console.log('Mileage-Error', error);
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
  handlemassAtt(event){ 
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log("File reading",file);
    reader.readAsDataURL(file);
       if(!this.insertedText){
      let _selfTarget = this;
      let fileImage = _selfTarget.template.querySelector('.chat__file-image');
      this.messageLoading = false;
      this.fileReaderUpload(event.target);      
      if (_selfTarget.imageUploaded) {
          _selfTarget.readURL(event, fileImage);
      } else {
          fileImage.src = ""
          event.target.value = '';
          console.log("else done")
      }
        }else{
           event.target.value = '';
        }
  }
  readURL(input, element) {
    var readerList;
    if (input.target.files && input.target.files[0]) {
        readerList = new FileReader();
        readerList.onload = function (e) {
            element.src = e.target.result
        }
        readerList.readAsDataURL(input.target.files[0]);
    }
  }
  removeSelection() {
    let _self = this;
    console.log("FileRemoved----")
    _self.template.querySelector('.chat__file-image').src = "";
    _self.imageUploaded = false;
    //  _self.insertedText = false;
    _self.template.querySelector('input[data-id="attatch"]').value = "";
    
  }
  fileReaderUpload(baseTarget) {
    var fileSize, choosenfileType = '',
        photofile, reader, fileExt, i = 0,
        exactSize, fIndex, subString;
    this.choosefile = baseTarget;
    if (this.choosefile) {
        console.log("File----", this.choosefile.files[0])
        fileSize = this.choosefile.files[0].size;
        photofile = baseTarget.files[0];
        choosenfileType = photofile.type;
        this.fileList = photofile;
        this.chooseFileName = photofile.name;
        fIndex = this.chooseFileName.lastIndexOf(".");
        subString = this.chooseFileName.substring(fIndex, this.chooseFileName.length);
        console.log("File---1")
        if (subString === '.jpg' || subString === '.png' || subString === '.jpeg') {
            if (this.choosefile) {
                if (this.choosefile.files[0].size > 0 && this.choosefile.files[0].size < 300000) {
                    this.choosefile = baseTarget;
                    this.imageUploaded = true;
                    console.log("File---1")
                    // this.template.querySelector('.send_chat_button').style.pointerEvents = 'auto';
                    this.template.querySelector('.send-message').classList.remove('send-icon');
                    this.template.querySelector('.send-message').classList.add('send-icon_allowed');
                } else {
                    if (this.imageUploaded) {
                      console.log("File---2")
                        // this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
                        this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
                        this.template.querySelector('.send-message').classList.add('send-icon');
                    }
                    this.imageUploaded = false;
                    // this.toggleError('Base 64 Encoded file is too large.  Maximum size is 300 KB.');
                    // this.errorUploading = 'Base 64 Encoded file is too large.  Maximum size is 4 MB .';
                    console.error('Base 64 Encoded file is too large.  Maximum size is 300 KB .');
                }
            } else {
                if (this.imageUploaded) {
                    // this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
                    this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
                    this.template.querySelector('.send-message').classList.add('send-icon');
                }
                this.imageUploaded = false;
                // this.toggleError('There was an error uploading the file. Please try again.');
                console.error('There was an error uploading the file. Please try again');
            }
        } else {
            if (this.imageUploaded) {
                // this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
                // this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
                // this.template.querySelector('.send-message').classList.add('send-icon');
            }
            this.imageUploaded = false;
            // this.toggleError('Please upload correct File. File extension should be .png, .jpg or .jpeg.');
            console.error('Please upload correct File. File extension should be .png, .jpg or .jpeg');
        }
        console.log("done---1")
        reader = new FileReader();
        reader.onload = function () {
            this.fileResult = reader.result;
            console.log("File sResult-----", this.fileResult);
        };
        reader.readAsDataURL(photofile);
        fileExt = new Array('Bytes', 'KB', 'MB', 'GB');
        while (fileSize > 900) {
            fileSize /= 1024;
            i++;
        }
        exactSize = (Math.round(fileSize * 100) / 100) + ' ' + fileExt[i];
        this.fileName = this.chooseFileName;
        this.fSize = exactSize;
        console.log("File Size-----", fileSize);
        console.log("choosenfileType------", choosenfileType);
        console.log("chooseFileName-------", this.chooseFileName);
    }
  }
  onKeyPress(event) {
    console.log("keyCode-----", event.keyCode)
    let textPos = this.template.querySelector('.message-input').value;
    this.template.querySelector('.message-input').value.trimEnd();
    if (event.keyCode === 13 || (event.keyCode === 32 && textPos.length === 0)) {
        event.preventDefault();
    }
  }
  onCreateSMS() {
    let areaPos = this.template.querySelector('.message-input').value;
    if (areaPos.length > 0) {
      console.log('textarea');
        this.insertedText = true;
        this.messageLoading = true;
        this.template.querySelector('.send_chat_button').style.pointerEvents = 'auto';
        // this.template.querySelector('.send-message').classList.remove('send-icon');
        // this.template.querySelector('.send-message').classList.add('send-icon_allowed');
    } else {
        this.messageLoading = false;
        this.insertedText = false;
        this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
        // this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
        // this.template.querySelector('.send-message').classList.add('send-icon');
    }
  }
  sendMassMessage(event) {
    // var textInput = this.template.querySelector('textarea[data-id="textMessage"]').value, textMessage = [];
    //   console.log('textInput',textInput);
    let _self = this;
    var selected = this.items;
    console.log('selected',JSON.stringify(selected));
    console.log('imageUploaded',_self.imageUploaded);
    console.log('_self.insertedText',_self.insertedText);
    if (_self.imageUploaded === false && _self.insertedText) {
      console.log('sendMas');
        let caretPos = _self.template.querySelector('.message-input').value;
        this.messageLoading = false;
        console.log('sendMas',caretPos);
        // this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
        // this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
        // this.template.querySelector('.send-message').classList.add('send-icon');
        if (caretPos === "") {
            event.preventDefault();
        } else {
            sendMessageToMultipleContacts({
                contactId: selected,
                message: caretPos
            }).then((result) => {
                _self.stopAnimation();
                _self.insertedText = false;
                console.log("result from sendMessageToContact", result)
            }).catch(error => {
                console.log("error from sendMessageToContact", error)
            })
            _self.template.querySelector('.message-input').value = "";
            event.preventDefault();
        }
    }
    else {
      console.log('sendMaswith-attach');
        let textValue = _self.template.querySelector('.message-input').value;
        _self.uploadFileInChunkAtt(textValue);
        _self.template.querySelector('.message-input').value = ""
        let toHeight = _self.template.querySelector('.doc-container').offsetHeight;
        if (toHeight != null || toHeight !== undefined) {
            _self.template.querySelector('.messageArea').style.maxHeight = (toHeight - 180) + 'px'
        } else {
            _self.template.querySelector('.messageArea').style.maxHeight = 377 + 'px';
        }
    }
  }
  uploadFileInChunkAtt(textValue) {
    var file = this.fileList;
    var maxStringSize = 6000000; //Maximum String size is 6,000,000 characters
    var maxFileSize = 300000; //After Base64 Encoding, this is the max file size
    if (file !== undefined) {
        this.messageLoading = true;
        this.template.querySelector('.chat__file-image').src = "";
        this.imageUploaded = false;
        this.template.querySelector('.send_chat_button').style.pointerEvents = 'none';
        this.template.querySelector('.send-message').classList.remove('send-icon_allowed');
        this.template.querySelector('.send-message').classList.add('send-icon');
        if (file.size <= maxFileSize) {
            this.attachmentName = this.chooseFileName;
            this.fileReader = new FileReader();
            this.fileReader.onerror = function () {
                this.toggleError('There was an error reading the file.  Please try again.');
            }
            this.fileReader.onabort = function () {
                console.log("Reading aborted!");
                this.toggleError('There was an error reading the file.  Please try again.');
            }
            this.fileReader.onloadend = ((e) => {
                e.preventDefault();
                this.attachment = window.btoa(this.fileReader.result);
                this.positionIndex = 0;
                this.fileSize = this.attachment.length;
                this.doneUploading = false;
                if (this.fileSize < maxStringSize) {
                    this.uploadAttachment(textValue)
                } else {
                    this.toggleError('Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + this.fileSize + '.');
                }
            })
            this.fileReader.readAsBinaryString(file);
            // eslint-disable-next-line @lwc/lwc/no-async-operation
        } else {
            console.log()
        }
    } else {
        console.log();
    }
  }
  uploadAttachment(textValue) {
    var attachmentBody = "";
    if (this.fileSize <= this.positionIndex + this.chunkSize) {
        attachmentBody = this.attachment.substring(this.positionIndex);
        this.doneUploading = true;
    } else {
        attachmentBody = this.attachment.substring(this.positionIndex, this.positionIndex + this.chunkSize);
    }
    sendImageToMultipleContacts({
            contactId: this.driverId,
            attachmentBody: attachmentBody,
            attachmentName: this.attachmentName,
            message: (textValue === '') ? null : textValue
        })
        .then((result) => {
            this.messageLoading = false;
            this.insertedText = false;
            if (result === 'success') {
                console.log(result)
            } else {
                this.positionIndex += this.chunkSize;
              //  this.uploadAttachment(textValue);
              // this.toggleError('There was an error uploading the file.  Please try again.');
            }
        })
        .catch((error) => {
            console.log(error);
        });
  }
  sendMassAttatchment(){
    const fileInput = this.template.querySelector('input[data-id="attatch"]');
      fileInput.click();
  }
  sendNotification(evt) {
    var textInput = this.template.querySelector(`data-id${this.msgIndex},.noti_TextInput`).value, notification = [];
    console.log('textInput ',textInput);
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
            // this.spinnerComplete();
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

  handleChange(event){
    this._value = event.target.value;
    this.template.querySelector('c-user-preview-table').searchByKey(this._value, this.data);
  }
  handleFileChange(event) {
    this.fileRow = this.data.filter(el => {
      if (this.fileId == el.id) {
        return true;
      }
    });
    if (this.fileKey == 'locationFile') {
      this.locationFileChange(event.target);
      this.uploadLocationInChunk(event,this.fileRow[0]);
      event.target.value = '';
    } else if (this.fileKey == 'insuranceFile') {
        this.isSpinner = true;
        this.fileReader(event.target)
        
        // this.uploadFileInChunk();
        // event.target.value = '';
    }
  }
  locationFileChange(element) {
    var chooseFileName = '';
    var choosefile = '';
    var findex = '';
    var strsubstring = '';
    var choosenfileType = '';
    var choosefile = '';
    findex = (element.files[0].name).lastIndexOf(".");
    var photofile = element.files[0];
    chooseFileName = photofile.name;
    strsubstring = (chooseFileName).substring(findex, chooseFileName.length);
    if (strsubstring == '.xls' || strsubstring == '.xlsx' || strsubstring == '.csv') {
        if (photofile.size > 0 && photofile.size < 4350000) {
            choosefile = element;
            this.locationChoose.push(element);
        }
        else {
            let toastFinish = { type: "error", message: 'Base 64 Encoded file is too large.  Maximum size is 4 MB .' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
        }
    }
    else {
      let toastFinish = { type: "error", message: 'Please upload correct File. File extension should be .csv or .xls.' };
      toastEvents(this, toastFinish);
      this.isSpinner = false; 
    }
    choosenfileType = photofile.type;
    var reader = new FileReader();
    this.locationfsize = element.files[0].size;
    reader.onload = function (e) {
        this.locationdata = reader.result;
        console.log('this.locationdata',this.locationdata);
    };
    reader.readAsDataURL(photofile);

  }
  uploadLocationInChunk(element,contact) {
    var lfile;
    if (element.currentTarget != null || element.currentTarget != undefined) {
        this.locationChoose.forEach(fl => {
            if (fl.name === element.currentTarget.name) {
                lfile = fl.files[0];
                console.log('findlocation');
                // fileIndex = parseInt(element.currentTarget.name);
            }
        })
    if (lfile != undefined) {
        var selectedFile = lfile;
        var reader = new FileReader();
        var json_object;
        reader.onload = function (event) {
            var data = this.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            const testURL = window.location.href;
            let newURL = new URL(testURL).searchParams;
            this.accountId =  newURL.get('id');
            
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                json_object = JSON.stringify(XL_row_object);
            });     
        };
        reader.onloadend = ((e) => {
          this.uploadLocationAttachment(json_object, contact.triploguserid);
        })
        reader.onerror = function (event) {
            console.error("File could not be read! Code ");
        };
        reader.readAsBinaryString(selectedFile);
    }
    console.log("from location file", lfile);
  }
  }
  uploadLocationAttachment(json, usertriplogId){
    // this.startSpinner();
    var newArray;
    var replaceKeys = { "Default Activity (optional)": "activity", "Latitude (optional)": "latitude", "Longitude (optional)": "longitude", "Name (optional)": "name", "Address": "address" };
    var locationBody = JSON.parse(json);
    if (locationBody[0] != null || locationBody[0] != undefined) {
        var locationKeys = Object.keys(locationBody[0]);
        if (locationKeys.includes("Default Activity (optional)") || locationKeys.includes("Latitude (optional)")
            || locationKeys.includes("Longitude (optional)") || locationKeys.includes("Name (optional)")
            || locationKeys.includes("Address")) {  
            newArray = this.changeKeyObjects(locationBody, replaceKeys);
            if (newArray.length > 100) {
                let toastFinish = { type: "error", message: 'You can upload 100 locations at a time.' };
                toastEvents(this, toastFinish);
                this.isSpinner = false; 
            } else {
              console.log("from location Done");
              this.isSpinner = true;
              this.locationAttachment = JSON.stringify(newArray);
              UploadLocation({ location: this.locationAttachment, accId: this.accountId})
                  .then(response => {
                    console.log('uploadLocations', response);
                    let toastFinish = { type: "success", message: 'We have received your upload, the data will be processed and made available within 72 work hours.' };
                    toastEvents(this, toastFinish);
                    this.getUsers(); 
                    this.isSpinner = false;               
                  }).catch(error => {
                    console.log('uploadLocations-Error', error);
                    let toastFinish = { type: "error", message: 'Location file failed to upload.' };
                    toastEvents(this, toastFinish);
                    this.isSpinner = false;
                  }); 
              }
        } else {
            let toastFinish = { type: "error", message: 'The file you have uploaded is not valid for location.' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
        }
    } else {
      let toastFinish = { type: "error", message: 'The file you have uploaded is not valid for location.' };
      toastEvents(this, toastFinish);
      this.isSpinner = false;
    }
  }
  changeKeyObjects = (arr, replaceKeys) => {
    return arr.map(item => {
        const newItem = {};
        Object.keys(item).forEach(key => {
            newItem[replaceKeys[key]] = item[[key]];
        });
        return newItem;
    });
  };
  fileReader(baseTarget) {
    var fileSize, choosenfileType = '',
        photofile, reader, fileExt, i = 0,
        exactSize, fIndex, subString;
    this.choosefile = baseTarget;
    if (this.choosefile) {
        fileSize = this.choosefile.files[0].size;
        photofile = baseTarget.files[0];
        choosenfileType = photofile.type;
        this.fileList = photofile;
        this.chooseFileName = photofile.name;
        fIndex = this.chooseFileName.lastIndexOf(".");
        subString = this.chooseFileName.substring(fIndex, this.chooseFileName.length);
        if (subString === '.pdf' || subString === '.PDF') {
            if (this.choosefile) {
                if (this.choosefile.files[0].size > 0 && this.choosefile.files[0].size < 4350000) {
                    this.choosefile = baseTarget;
                    // this.toggleBox();
                    this.uploadFileInChunk();
                    this.errorUploading = '';
                } else {
                    // this.toggleBoxError();
                    let toastFinish = { type: "error", message: 'Base 64 Encoded file is too large.  Maximum size is 4 MB .' };
                    toastEvents(this, toastFinish);
                    this.isSpinner = false;
                    // this.errorUploading = 'Base 64 Encoded file is too large.  Maximum size is 4 MB .';
                    console.error('Base 64 Encoded file is too large.  Maximum size is 4 MB .');
                }
            } else {
                // this.toggleBoxError();
                let toastFinish = { type: "error", message: 'There was an error uploading the file. Please try again.' };
                toastEvents(this, toastFinish);
                this.isSpinner = false;
                console.error('There was an error uploading the file. Please try again');
            }
        } else {
            // this.toggleBoxError();
            let toastFinish = { type: "error", message: 'Please upload correct File. File extension should be .pdf/.PDF' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
            console.error('There was an error');
        }

        reader = new FileReader();
        reader.onload = function () {
            this.fileResult = reader.result;
        };
        reader.readAsDataURL(photofile);
        fileExt = new Array('Bytes', 'KB', 'MB', 'GB');
        while (fileSize > 900) {
            fileSize /= 1024;
            i++;
        }
        exactSize = (Math.round(fileSize * 100) / 100) + ' ' + fileExt[i];
        this.fileName = this.chooseFileName;
        this.fSize = exactSize;
        console.log("File Size-----", fileSize);
        console.log("choosenfileType------", choosenfileType);
        console.log("chooseFileName-------", this.chooseFileName);
    }
}
uploadFileInChunk() {
  var file = this.fileList;
  var maxStringSize = 6000000; //Maximum String size is 6,000,000 characters
  var maxFileSize = 4350000; //After Base64 Encoding, this is the max file size
  if (file !== undefined) {
      if (file.size <= maxFileSize) {
          this.attachmentName = this.chooseFileName;
          this.fileReader = new FileReader();
          this.fileReader.onerror = function () {
              // this.toggleBoxError();
            let toastFinish = { type: "error", message: 'There was an error reading the file.  Please try again.' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
              // this.errorUploading = 'There was an error reading the file.  Please try again.';
          }
          this.fileReader.onabort = function () {
            console.log("Reading aborted!");
            let toastFinish = { type: "error", message: 'There was an error reading the file.  Please try again.' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
              // this.toggleBoxError();
              // this.errorUploading = 'There was an error reading the file.  Please try again.';
          }
          this.fileReader.onloadend = ((e) => {
              e.preventDefault();
              this.attachment = window.btoa(this.fileReader.result);
              this.positionIndex = 0;
              this.fileSize = this.attachment.length;
              if (this.fileSize < maxStringSize) {
                  this.uploadAttachment(null)
              } else {
                  // this.toggleBoxError();
                  let toastFinish = { type: "error", message: 'Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + this.fileSize+'.' };
                  toastEvents(this, toastFinish);
                  this.isSpinner = false;
                  this.fileInputRef.value = null;
                  // this.errorUploading = 'Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + this.fileSize + '.';
              }
          })
          this.fileReader.readAsBinaryString(file);
          // eslint-disable-next-line @lwc/lwc/no-async-operation
      } else {
          console.log('else MaxSIze');
          this.isSpinner = false;
      }
  } else {
      console.log('file Undefined');
      this.isSpinner = false;
  }
}
uploadAttachment(fileId) {
  var attachmentBody = "";
  this.isSpinner = true;
  // console.log('if',this.fileSize,positionIndex,this.chunkSize);
  if (this.fileSize <= this.positionIndex + this.chunkSize) {
      attachmentBody = this.attachment.substring(this.positionIndex);
      this.doneUploading = true;
  } else {
    console.log('else',this.attachment);
      attachmentBody = this.attachment.substring(this.positionIndex, this.positionIndex + this.chunkSize);
  }
  let attatchment = this.data.filter(el => {
    if (el.id == this.fileId) {
      return true;
    }
  });
  const testURL = window.location.href;
  let newURL = new URL(testURL).searchParams;
  console.log(attatchment[0].insuranceId,fileId, this.attachmentName, attachmentBody,newURL.get('accid'),attatchment[0].contactId)
  readFromFileInchunk({
          attachmentBody: attachmentBody,
          attachmentName: this.attachmentName,
          attachmentId: fileId,
          did: attatchment[0].contactId,
          accid: newURL.get('accid'),
          contactattachementid: attatchment[0].insuranceId
      })
      .then((file) => {
          if (this.doneUploading === true) {
            console.log('doneUploadingTrue');
            let toastFinish = { type: "success", message: 'The insurance documentation has been successfully uploaded.' };
            toastEvents(this, toastFinish);
            this.isSpinner = false;
            this.getUsers();  
          } else {
              this.isSpinner = false;
              this.positionIndex += this.chunkSize;
              this.uploadAttachment(file);
          }
      })
      .catch((error) => {
          console.log(error);
          this.isSpinner = false;
      });
}
  closeModal() {
    this.isModalOpen = false;
  }
  proxyToObject(e) {
    return JSON.parse(e);
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
            singleValue.isDate = key === "expirationDate" ? true : false;
            singleValue.truncate = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
            singleValue.tooltip = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
            singleValue.tooltipText = (key === 'notiMessage') ? (element[key] !== null) ? element[key] : false : false;
            singleValue.cIcon = (key === 'notiMessage') ? (element[key] !== null) ? true : false : false;
            singleValue.tooltipIcon =  this.deleteIconUrl;
            singleValue.infoText = 'Delete Notification';
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
    this.loadManageNotification();
  }
  loadManageNotification(){
    // const testURL = window.location.href;
    // let newURL = new URL(testURL).searchParams;
    // this.accountId =  newURL.get('id');
    manageNotificationController({ accId: this.accountId, adminId: this.contactId})
      .then(response => {
        this.data = JSON.parse(response);
        this.dataList = this.proxyToObject(this.data);
        console.log('configData', this.data);
        this.dynamicBinding(this.data, this.accordionKeyFields);
        this.isdataLoaded = true;
        // this.template.querySelector('c-user-preview-table').refreshTable(this.data);
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
  handleClearMass(){
    this.startSpinner();
    console.log('accountId-', this.accountId);
    clearMassNotification({ accID: this.accountId})
      .then(response => {
        // this.mileageData = JSON.parse(response);
        console.log('clearMassNotification-Data-', response);
        this.getUsers();
        this.stopSpinner();
      }).catch(error => {
        console.log('clearMassNotification-Error', error);
      });
    // this.stopSpinner();
  }
  handleInsuranceReminder() {

    if (this.template.querySelector('c-user-profile-modal')) {
      console.log('close');
      this.template.querySelector('c-user-profile-modal[data-id="menu"]').hide();
      this.insuranceLabel = 'Send insurance reminder';
      this.istrueInsurance = true;
      this.onloadTool = false;
      this.istrueMessaging = false;
    }
  }

  deleteNotification(event) {
    clearNotification({
      contactID: event.detail.id
    }).then(response => {
     if(response === 'Success'){
      this.getUsers();
     }
    }).catch(error => {
      console.log(this.proxyToObject(error));
    });
    console.log("event---", event.detail.id)
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
  getMonthName(monthNumber) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months[monthNumber - 1];
  }
  handleMilleage() {
    this.isdataLoaded = false;
    this.istrueInsurance = false;
    this.isMileageLoaded = true;
    this.isModalOpen = false;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const monthName = this.getMonthName(currentMonth);
    // console.log('month',monthName);
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
        "name": monthName,
        "colName": "totalMileage",
        "colType": "String",
        "arrUp": false,
        "arrDown": false
      }
    ];
    this.isCheckbox = false;
    // const testURL = window.location.href;
    // let newURL = new URL(testURL).searchParams;
    getMileage({ accountId: this.accountId})
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
    // console.log('se',this.mileageData.id);
    this.items = this.selectedData.filter(el => {
      if (el.isChecked) {
        return true;
      }
    });
    if (this.istrueInsurance) {
      console.log('Insurance', this.items.contactId);
      this.insuranceLabel = 'Send mail';
    } else if (this.onmassText) {
      this.messagingLabel = 'Create Text Message';
    }else if (this.onnotificationMessage) {
      this.massNotimessageLabel = 'Create Notification Message';
    }
    console.log('selected', this.items);
  }
  handleUpdateListMileage(event){
    // console.log('selected', JSON.parse(event.detail));
    this.mileageupdate = JSON.parse(event.detail);
  }
  editMode() {
    this.isEditMode = true;
    console.log('EditMode');
  }
  cancelEditMode(){
		console.log("cancelEditMode");
        this.isEditMode = false;
        // if(this.template.querySelector('.filter-input')){
        //     this.template.querySelector('.filter-input').value = "";
        // }
		// this.startSpinner();
		// this.getEmployees();
        // this.template.querySelector('c-user-preview-table').refreshTable(this.employeeList);
    }
    enableSubmit() {
      if(this.isSubmitVisible) {
        return
      }
      this.isSubmitVisible = true;
    }
    updateMileage(){
      this.startSpinner();
      this.isEditMode = false;
      UpdateImportMileage({ responseData: JSON.stringify(this.mileageupdate)})
          .then(response => {
            console.log('updateMileage', response);
            this.getMileage();
            this.isEditMode = false;
            this.stopSpinner();  
            let toastFinish = { type: "success", message: 'Updated successfully.' };
            toastEvents(this, toastFinish);  
          }).catch(error => {
            this.isEditMode = false;
            console.log('updateMileage-Error', error);
            this.stopSpinner(); 
            let toastFinish = { type: "error", message: 'some error occur.' };
            toastEvents(this, toastFinish);
          });
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
  }
  handleMassNotiMessage(){
    this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    this.isTrueCancelProcess = true;
    this.onmassText = false;
    this.onnotificationMessage = true;
    if (this.massNotimessageLabel == 'Create Notification Message') {
      console.log('handleMassNotiMessage');
      this.template.querySelector('c-user-profile-modal[data-id="notificationmessage"]').show();
    }
  }
  // sendMassMessage(){
  //   var textInput = this.template.querySelector('textarea[data-id="textMessage"]').value, textMessage = [];
  //   console.log('textInput',textInput);
  //   var selected = this.items;
  //   console.log('selected',JSON.stringify(selected));
    
  //   sendMessageToMultipleContacts({ trueDialogContactIdList: JSON.stringify(selected), message: textInput})
  //         .then(response => {
  //           console.log('Multi Text', response);
  //         }).catch(error => {
  //           console.log('text-Error', error);
  //         });
  // }
  sendMassNotification(){
    var textInput = this.template.querySelector('textarea[data-id="massNoti"]').value, notification = [];
    console.log('textInput',textInput);
    this.startSpinner();
    this.items.forEach(element => {  
      let singleUser = this.getUser(element.contactId);
      this.notificationObj = singleUser;
      console.log('singleUser',singleUser);
      this.notificationObj.notiMessage = textInput;
      notification.push(this.notificationObj);
    }); 
    // this.spinnerProgress('Sending...');
    if (textInput === "") {
    //   this.spinnerComplete();
    //   this.template.querySelector(`data-id${this.msgIndex},.span-error`).classList.remove("d-none");
    //   this.template.querySelector(`data-id${this.msgIndex},.message-controls`).classList.add("border-error");
    } else {
      console.log("Notification--", JSON.stringify(notification))
      editInlineNewEmployee({
        listofemployee: JSON.stringify(notification),
        adminId: this.contactId
      })
        .then(result => {
          if (result === 'Success') {
            this.getUsers();
            this.isNotification = false;
            this.template.querySelector('c-user-profile-modal[data-id="notificationmessage"]').hide();
            this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
            this.stopSpinner();
            let message = "Notification has been sent successfully.";
            let toastSuccess = { type: "success", message: message };
            toastEvents(this, toastSuccess);
            this.notification = [];
          } else {
            // this.spinnerComplete();
            let message = "Some error has occur";
            let toastSuccess = { type: "error", message: message };
            toastEvents(this, toastSuccess);
          }
        }).catch(error => {
          let message = "Some error has occur";
          let toastSuccess = { type: "error", message: message };
          toastEvents(this, toastSuccess);
          this.spinnerComplete();
          console.log('editInlineNewEmployee', this.proxyToObject(error));
        });
    }
  }
  handleSendInsuranceReminder() {  
    this.istrueInsurance = true;
    this.isTrueCancelProcess = true;
    this.istrueMessaging = false;
    let counter = 0;
    // this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    if (this.insuranceLabel == 'Send mail') {
      this.startSpinner();
      this.items.forEach(element => {
        sendInsuranceEmail({ Id: element.id, Name: element.name, email: element.contactEmail })
          .then(response => {
            console.log('sendMail', response);
            counter++;
            if (counter === this.items.length) {
              this.stopSpinner();  
              this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
              let toastFinish = { type: "success", message: 'Insurance reminder mail successfully sent.' };
              toastEvents(this, toastFinish);  
              this.insuranceLabel = 'Send insurance reminder';
              this.getUsers();
            } 
          }).catch(error => {
            console.log('send-Error', error);
            counter++;
            if (counter === this.items.length) {
              this.stopSpinner();  
              let toastFinish = { type: "error", message: 'Some error has occur.' };
              toastEvents(this, toastFinish);
            }
          });
      }); 
    }else{
      this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    }
  }
  handleMassTextMessage() {
    this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
    this.isTrueCancelProcess = true;
    console.log('selectedMassText', this.items);
    this.onmassText = true;
    this.onnotificationMessage = false;
    if (this.messagingLabel == 'Create Text Message') {
      console.log('Create Text Message');
      this.template.querySelector('c-user-profile-modal[data-id="message"]').show();

    }
  }
  handleCancelProcess() {
    this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
    this.insuranceLabel = 'Send insurance reminder';
    this.messagingLabel = 'Mass Text Message';
    this.massNotimessageLabel = 'Mass notification message';
    this.isTrueCancelProcess = false;
    this.istrueInsurance = false;
    this.getUsers();
    // this.template.querySelector('c-user-preview-table').refreshTable(this.data);
    // this.items = [];
    this.isMileageLoaded = false;
    this.isdataLoaded = true;
    this.onloadTool = true;
    this.istrueMessaging = false;
  }
  downloadLocationTemp() {
    this.locationData = [
      ['Name (optional)', 'Address', 'Latitude (optional)', 'Longitude (optional)', 'Default Activity (optional)']
    ];
    let colName = [];
    // let data = this.sort(this.data, "name");
    console.log('row');

    let sheetName = "Location Template"
    let filename = "Location Template "+this.dateTime(new Date());
    colName.push([
			"Name (optional)",
			"Address",
			"Latitude (optional)",
      "Longitude (optional)",
      "Default Activity (optional)",
		]);
    // let rowData = new Set();
    this.locationData.forEach(ele => {
			colName.push([
				"The White House",
				"1600 Pennsylvania Ave NW, Washington, DC 20500",
				"38.683885",
        "-8.6109719",
        "Business"
			]);
		});
    console.log('row2',sheetName);
    this.template.querySelector("c-export-excel").download(colName, filename, sheetName);
    // console.log(this.locationData);
    // let rowEnd = '\n';
    // let csvString = '';
    // let rowData = new Set();
    // this.locationData.forEach(function (record) {
    //   Object.keys(record).forEach(function (key) {
    //     rowData.add(key);
    //   });
    // });
    // rowData = Array.from(rowData);

    // csvString += rowData.join(',');
    // csvString += rowEnd;

    // for (let i = 0; i < this.locationData.length; i++) {
    //   let colValue = 0;

    //   console.log('Row data');
    //   for (let key in rowData) {
    //     if (rowData.hasOwnProperty(key)) {
    //       let rowKey = rowData[key];
    //       if (colValue > 0) {
    //         csvString += ',';
    //       }
    //       let value = this.locationData[i][rowKey] === undefined ? '' : this.locationData[i][rowKey];
    //       csvString += '"' + value + '"';
    //       colValue++;
    //     }
    //   }
    //   csvString += rowEnd;
    // }
    // let downloadElement = document.createElement('a');

    // downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    // downloadElement.target = '_self';
    // downloadElement.download = 'Location template.csv';
    // document.body.appendChild(downloadElement);
    // downloadElement.click();
  }
  dateTime(date) {
		var yd, ydd, ymm, yy, hh, min, sec;
		yd = date;
		ydd = yd.getDate();
		ymm = yd.getMonth() + 1;
		yy = yd.getFullYear();
		hh = yd.getHours();
		min = yd.getMinutes();
		sec = yd.getSeconds();
		ydd = ydd < 10 ? "0" + ydd : ydd;
		ymm = ymm < 10 ? "0" + ymm : ymm;
		return (
		  ymm.toString() +
		  ydd.toString() +
		  yy.toString() +
		  hh.toString() +
		  min.toString() +
		  sec.toString()
		);
	  }
  sort(employees, colName) {
		employees.sort((a, b) => {
		  let fa =
			  a[colName] == null || a[colName] === ""
				? ""
				: a[colName].toLowerCase(),
			fb =
			  b[colName] == null || b[colName] === ""
				? ""
				: b[colName].toLowerCase();
	
		  if (fa < fb) {
			return -1;
		  }
		  if (fa > fb) {
			return 1;
		  }
		  return 0;
		});
	
		return employees;
	  }
  exportToExcel() {
    let colName = [];
    let data = this.sort(this.data, "name");
    console.log('row');

    let sheetName = "Insurance Report"
    let filename = "Insurance Report "+this.dateTime(new Date());
    colName.push([
			"Name",
			"Insurance Status",
			"Expires",
		]);
    // let rowData = new Set();
    data.forEach(ele => {
			colName.push([
				ele.fullname,
				ele.insurance,
				ele.expirationDate
			]);
		});
    console.log('row2',sheetName);
    this.template.querySelector("c-export-excel").download(colName, filename, sheetName);
     }
}