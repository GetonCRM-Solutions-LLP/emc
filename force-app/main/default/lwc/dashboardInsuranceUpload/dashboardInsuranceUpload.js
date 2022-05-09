import {
    LightningElement,
    api
} from 'lwc';
import mBurseCss from '@salesforce/resourceUrl/EmcCSS';
import readFromFileInchunk from '@salesforce/apex/NewAccountDriverController.readFromFileInchunk';
import sendInsuranceEmail from '@salesforce/apex/NewAccountDriverController.sendInsuranceEmail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
import {
    events,
    backEvents
} from 'c/utils';
export default class DashboardInsuranceUpload extends LightningElement {
/* eslint-disable @lwc/lwc/no-api-reassignments */
    @api isUploadShow;
    @api isUploadSkip;
    @api contactId;
    @api accountId;
    @api attachmentid;
    @api contactName;
    @api contactEmail;
    @api dayLeft;
    driverDetails;
    fileName;
    fSize;
    errorUploading;
    fileResult;
    choosefile;
    fileList = {};
    chooseFileName = '';
    chunkSize = 950000; //Maximum Javascript Remoting message size is 1,000,000 
    attachment;
    attachmentName;
    fileSize;
    positionIndex;
    doneUploading;
    driverObject;
    dPacket = false;
    nextShow = false;
    nextPacketShow = false;
    isError = false;
    isVisible = false;
    isSpinner = false;
    isUploaded = false;
    renderInitialized = false;
    uploaded = mBurseCss + '/emc-design/assets/images/file-uploaded.png';
    @api 
    get client(){
        return this.driverObject;
    }
    set client(value){
        let tempObject =  this.proxyToObject(value)
        this.driverDetails = value;
        this.driverObject = tempObject[0];
    }
    toggleBoxError() {
        this.isError = true;
        this.isVisible = false;
        this.template.querySelector('.box').classList.add('has-advanced-upload-error');
        this.template.querySelector('.box').classList.remove('has-advanced-upload');
        this.template.querySelector('.file-message').classList.add('pd-10');
        this.template.querySelector('.file-message').classList.remove('pd-3');
    }
    toggleBox() {
        this.isError = false;
        this.isVisible = true;
        this.template.querySelector('.box').classList.remove('has-advanced-upload-error');
        this.template.querySelector('.box').classList.add('has-advanced-upload');
        this.template.querySelector('.file-message').classList.remove('pd-10');
        this.template.querySelector('.file-message').classList.add('pd-3');
    }
    fileReader(baseTarget) {
        var fileSize, choosenfileType = '',
            photofile, reader, fileExt, i = 0,
            exactSize, fIndex, subString;
        this.choosefile = baseTarget;
        console.log(this.choosefile.files)
        fileSize = this.choosefile.files[0].size;
        photofile = baseTarget.files[0];
        choosenfileType = photofile.type;
        this.fileList = photofile;
        this.chooseFileName = photofile.name;
        fIndex = this.chooseFileName.lastIndexOf(".");
        subString = this.chooseFileName.substring(fIndex, this.chooseFileName.length);
        if (subString === '.pdf') {
            if (this.choosefile.files[0].size > 0 && this.choosefile.files[0].size < 4350000) {
                this.choosefile = baseTarget;
                this.toggleBox();
                this.errorUploading = '';
            } else {
                this.toggleBoxError();
                this.errorUploading = 'Base 64 Encoded file is too large.  Maximum size is 4 MB .';
                console.error('Base 64 Encoded file is too large.  Maximum size is 4 MB .');
            }
        } else {
            this.toggleBoxError();
            this.errorUploading = 'Please upload correct File. File extension should be .pdf'
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

    fileChanged(event) {
        console.log('File change')
        this.fileReader(event.target)
    }
    proxyToObject(e) {
        return JSON.parse(e)
    }
    uploadAttachment(fileId) {
        var attachmentBody = "";
        this.isSpinner = true;
        if (this.fileSize <= this.positionIndex + this.chunkSize) {
            attachmentBody = this.attachment.substring(this.positionIndex);
            this.doneUploading = true;
        } else {
            attachmentBody = this.attachment.substring(this.positionIndex, this.positionIndex + this.chunkSize);
        }
        console.log(this.attachmentid, this.contactEmail, this.contactName)
        readFromFileInchunk({
                attachmentBody: attachmentBody,
                attachmentName: this.attachmentName,
                attachmentId: fileId,
                contactId: this.contactId,
                accountId: this.accountId,
                contactattachementid: this.attachmentid
            })
            .then((file) => {
                if (this.doneUploading === true) {
                    sendInsuranceEmail({
                            id: this.contactId,
                            name: this.contactName,
                            email: this.contactEmail
                        })
                        .then(() => {
                            var contact;
                            contact = this.proxyToObject(this.driverDetails);
                            contact[0].insuranceStatus = "Uploaded";
                            updateContactDetail({
                                contactData: JSON.stringify(contact)
                            })
                            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
                            this.isSpinner = false;
                            this.isUploaded = true;
                            this.isUploadShow = false;
                        })
                } else {
                    this.isSpinner = false;
                    this.positionIndex += this.chunkSize;
                    this.uploadAttachment(file);
                }
            })
            .catch((error) => {
                console.log(error);
            });
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
                    this.toggleBoxError();
                    this.errorUploading = 'There was an error reading the file.  Please try again.';
                }
                this.fileReader.onabort = function () {
                    console.log("Reading aborted!");
                    this.toggleBoxError();
                    this.errorUploading = 'There was an error reading the file.  Please try again.';
                }
                this.fileReader.onloadend = ((e) => {
                    e.preventDefault();
                    this.attachment = window.btoa(this.fileReader.result);
                    this.positionIndex = 0;
                    this.fileSize = this.attachment.length;
                    this.doneUploading = false;
                    if (this.fileSize < maxStringSize) {
                        this.uploadAttachment(null)
                    } else {
                        this.toggleBoxError();
                        this.errorUploading = 'Base 64 Encoded file is too large.  Maximum size is ' + maxStringSize + ' your file is ' + this.fileSize + '.';
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

    nextDoneUpload() {
            events(this, 'Next Driver Packet');
    }

    backToPrevious() {
        backEvents(this, 'Next Declaration Upload');
    }

    renderedCallback() {
        if (this.renderInitialized) {
            return;
          }
        this.renderInitialized = true;
        if (this.template.querySelector('form') != null) {
            this.template.querySelector('form').addEventListener(
                'submit',
                this._handler = (event) => this.handleFormSubmit(event)
            );
        }
    }

    handleDropFile(event) {
        // prevent default action (open as link for some elements)
        var files;
        console.log('Drop File--', event)
        console.log("files--", event.dataTransfer.files)
        event.preventDefault();
        event.stopPropagation();
        files = event.dataTransfer.files;
        if (files.length === 1) {
            this.template.querySelector('.box').classList.remove('is-dragover');
            this.fileReader(event.dataTransfer)
        } else {
            if (files.length > 1) {
                this.template.querySelector('.box').classList.remove('is-dragover');
                this.fileName = '';
                this.fSize = '';
                this.toggleBoxError();
                this.errorUploading = 'Please select only one file';
            }
        }
    }

    onDrag(event) {
        event.dataTransfer.dropEffect = 'copy';
        event.preventDefault();
        this.template.querySelector('.box').classList.add('is-dragover');
    }
    onDragLeave(event) {
        event.preventDefault();
        this.template.querySelector('.box').classList.remove('is-dragover');
    }
    handleFormSubmit(event) {
        event.preventDefault();
    }
}