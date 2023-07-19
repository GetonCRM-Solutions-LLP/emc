import { LightningElement, api } from 'lwc';
import getlistAllEmployees from '@salesforce/apex/RosterController.getlistAllEmployees';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import EDIT_ICON from '@salesforce/resourceUrl/editAction';
import ADD_ICON from '@salesforce/resourceUrl/addAction';
import editInlineNewEmployee from '@salesforce/apex/RosterController.editInlineNewEmployee';
import getDrivingStates from '@salesforce/apex/RosterController.getDrivingStates';
import getJobTitle from '@salesforce/apex/RosterController.getJobTitle';
import getCompany from '@salesforce/apex/RosterController.getCompany';
import getDepartment from '@salesforce/apex/RosterController.getDepartment';
import updateLockDate from '@salesforce/apex/RosterController.updateLockDate';
import sendSignatureRequestForDriver from '@salesforce/apex/NewAccountDriverController.sendSignatureRequestForDriver';
import getPickListValuesIntoList from '@salesforce/apex/RosterController.getPickListValuesIntoList'



import {
    toastEvents, modalEvents
} from 'c/utils';



export default class UsersRoster extends LightningElement {

    @api employeeColumn = [
        {
          "id": 2,
          "name": "Name",
          "colName": "name",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": true,
		  "isCheckBox": false
        },
        {
          "id": 3,
          "name": "Email",
          "colName": "email",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 4,
          "name": "Deactivation",
          "colName": "deactivaedDate",
          "colType": "Date",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 5,
          "name": "Role",
          "colName": "role",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 6,
          "name": "Freeze",
          "colName": "freeze",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 7,
          "name": "Manager",
          "colName": "managerName",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 8,
          "name": "Zip Code",
          "colName": "zipCode",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 9,
          "name": "App version",
          "colName": "appVersion",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        },
        {
          "id": 10,
          "name": "Driving State",
          "colName": "drivingStates",
          "colType": "String",
          "arrUp": false,
          "arrDown": false,
		  "isChecked": false,
		  "isCheckBox": false
        }
      ];
	@api activities = ["Activity","Mass Deactivate", "Freeze", "UnFreeze", "Send Driver Packet", "Concur", "Mass Reset Password", "Enable User", "Mileage Lock Date"];
	@api activityList = [];
    isSort = true;
    @api employeeList;
	@api employees
    @api empKeyFields = ["name", "email", "deactivaedDate", "role", "freeze", "managerName", "zipCode", "appVersion", "drivingStates", ];
    sortable = true;
    isdataLoaded = false;
    @api editableView = false;
    @api classToTable = 'slds-table--header-fixed_container preview-height';
	@api paginated = false;
	@api isEditMode = false;
	searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
	isRecord = false;
	@api isScrollable = false;
	@api isCheckbox = false;
	@api editIconUrl = `${EDIT_ICON}#editicon`;
	@api addIconUrl = `${ADD_ICON}#addicon`;
	isListEmployeetab = true;
	isAddEmployeeTab = false;
	isImportTab = false;
	@api showModal = false;
    @api roles;
    @api managers;
	managersList;
	roleList;
	@api accid;
	@api contactid;
    isFalse = false;
	@api tags = [];
  	newTag = '';
	noMessage = 'There is no user data available'
	isDrivingStateModal = false;
	isDeactivateDateModal = false;
	isMileageLockDateModal = false;
	isMassDeactivationModal = false;
	massDeactivationDate  = '';
	validStateList = [];
	currentModalRecord;
	@api jobTitles;
	@api departments;
	@api companies;
	@api deactivaedDate;
	@api payRollAmount;
	@api isSubmitVisible = false;
	@api currentActivity = "Activity";
	lockDateList = [];
	@api reiMonth;
	@api lockDate;
	@api vehicleTypeList;
	currentRecord;
	
    
    dynamicBinding(data, keyFields) {
        data.forEach(element => {
            let model = [];
            for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                    let singleValue = {}
                    if (keyFields.includes(key) !== false) {
                        singleValue.key = key;
                        if(key === "drivingStates") {
                          if(element[key]) {
                            singleValue.value = element[key];
                          }else {
							singleValue.value = []
						  }
                        }else {
                          singleValue.value = element[key];
                        }
						singleValue.isIcon = key === "deactivaedDate" ? true : false;
						singleValue.isDate = key === "deactivaedDate" ? true : false;
                        singleValue.isDropDown = (key === "role" || key === "managerName") ? true : false;
						singleValue.isTag = key === "drivingStates" ? true : false;
						singleValue.isAddress = key === "zipCode" ? true : false;
						singleValue.city = key === "zipCode" ? element['city'] : '';
						singleValue.isNoneEditable = (key === "appVersion" || key === "freeze") ?  true : false;
						singleValue.toggle = false;
						// singleValue.isToggle = 
						// Drop down keys
                        if(key === "role") {
                            singleValue.dropDownList = this.roleList;
                        } else if(key === "managerName") {
                            singleValue.dropDownList = this.managersList;
                        }
						// icon keys
						if(key === "deactivaedDate") {
							singleValue.iconUrl = this.editIconUrl;	
						} else if(key === "drivingStates") {
							singleValue.iconUrl = this.addIconUrl;
						} else {
							singleValue.iconUrl = '';
						}

						singleValue.twoDecimal = false;
						singleValue.uId = element.userid;
                        singleValue.onlyLink = key === "name" ? true : false;
                        singleValue.isLink = key === "name" ? true : false;
                        model.push(singleValue);
                    }
                    singleValue.id = element['userid'];
                }
            }
			element.id = element['userid'];
			element.toggle = false;
			element.isChecked = false;
			element.isEdited = false;
            element.keyFields = this.mapOrder(model, keyFields, 'key');
        });
		this.employeeList = data;
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

    connectedCallback() {
        this.accid = this.getUrLParam('accid');
        this.contactid = this.getUrLParam('id');
		this.activityList = this.formatArray(this.activities);
		this.getListOfDropDownData();
		if(this.managers && this.roles) {
			this.managersList = this.proxyToObject(this.managers);
			this.roleList = this.proxyToObject(this.roles)
		}
		if(this.employees && this.employees.length){
			this.employeeList = this.proxyToObject(this.employees);
			this.dynamicBinding(this.employeeList, this.empKeyFields);
            this.isdataLoaded = true;
            this.editableView = true;
			this.paginated = true;
			this.isScrollable = true;
			this.isCheckbox = true;
		} else {
			// this.startSpinner();
			this.getEmployees();
			// this.editableView = true;
			// this.paginated = true;
			// this.isScrollable = true;
			// this.isCheckbox = true;
		}
    }

    proxyToObject(data) {
        return JSON.parse(JSON.stringify(data));
    }

	getUrLParam(param) {
		let url = new URL(location.href);
		return url.searchParams.get(param);
	}
    
	editMode(){
        this.isEditMode = true;
    }

	cancelEditMode(){
        this.isEditMode = false;
        if(this.template.querySelector('.filter-input')){
            this.template.querySelector('.filter-input').value = "";
        }
		this.startSpinner();
		this.getEmployees();
        // this.template.querySelector('c-user-preview-table').refreshTable(this.employeeList);
    }

	handleUpdateList(event){
		this.employeeList = JSON.parse(event.detail);
    }

	async updateEmployee() {
		this.startSpinner();
		editInlineNewEmployee({
			listofemployee: JSON.stringify(this.employeeList),
			accid: this.accid ,
			contactid: this.contactid
		})
		.then(response => {
			let result = JSON.parse(response);
			if(result?.hasError) {
				this.stopSpinner();
				console.error(result.message);
				let toastError = { type: "error", message: "Something went wrong." };
				toastEvents(this, toastError);
			}
			if(!result?.hasError) {
				this.dynamicBinding(this.employeeList, this.empKeyFields);
				this.template.querySelector('c-user-preview-table').refreshTable(this.employeeList);
				this.isEditMode = false;
				this.stopSpinner();
				let updateEmpMessage = `Records updated`;
				let toastSuccess = { type: "success", message: updateEmpMessage };
				toastEvents(this, toastSuccess);
			}
			// this.getEmployees();
		})
		.catch(err=> {
			console.log(this.proxyToObject(err));
		})
	}

	handleChange(event) {
		this._value = event.target.value;
        this.template.querySelector('c-user-preview-table').searchByKey(this._value, this.employeeList)
	}

	downloadAllEmployee(){
		let employee = [];
		let filename = this.dateTime(new Date());
		let sheetName = "Employee"
		let employeeList = this.sort(this.employeeList, "name");
		employee.push([
			"First Name",
			"Last Name",
			"Company",
			"Email",
			"City",
			"State",
			"Zip Code",
			"Cell Phone",
			"Driving States",
			"Activation Date",
			"Frozen Date",
			"Deactivation Date",
			"Role",
			"Manager",
			"Standard Vehicle",
			"Fixed Amount",
			"Compliance",
			"Average Monthly Reimbursement",
			"Average Monthly Mileage",
			"App Version",
			"App Setting",
			"Business and After Hours",
			"Last Trip Date",
		]);
		employeeList.forEach(emp => {
			employee.push([
				emp.firstName,
				emp.lastName,
				emp.company,
				emp.email,
				emp.city,
				emp.state,
				emp.zipCode,
				emp.cellphone,
				(emp.drivingStates && emp.drivingStates.length) ? emp.drivingStates.join(";") : '',
				emp.activationDate,
				emp.deactivaedDate,
				emp.deactivaedDate,
				emp.role,
				emp.managerName,
				emp.vehicalType,
				emp.fixedamount,
				emp.compliancestatus,
				"Average Monthly Reimbursement",
				"Average Monthly Mileage",
				emp.appVersion,
				emp.appSetting,
				emp.Businesshours,
				"lastTripdate"
			]);
		});
		this.template.querySelector("c-export-excel").download(employee, filename, sheetName);
	}

	handleTab(event) {
		let tab = event.currentTarget.dataset.id;
		if(tab === 'employee'){
			this.currentRecord = '';
			this.isListEmployeetab = true;
			this.isAddEmployeeTab = false;
			this.isImportTab = false;
		}
		if(tab === 'add') {
			this.isListEmployeetab = false;
			this.isImportTab = false;
			this.isAddEmployeeTab = true;
		}

		if(tab === 'import') {
			this.currentRecord = '';
			this.isListEmployeetab = false;
			this.isAddEmployeeTab = false;
			this.isImportTab = true;
		}
		const buttons = this.template.querySelectorAll('.tab-btn');
        buttons.forEach(button => {
            button.classList.remove('is-active');
        });

        // Add the active class to the clicked button
        const clickedButton = event.target;
        clickedButton.classList.add('is-active');
	}

	handleModal(event) {
    	this.template.querySelector('c-user-profile-modal').show();
		if(event && event.detail ) {
			let key = event.detail.key;
			let id = event.detail.id;
			this.currentModalRecord = id;
			if(key === "drivingStates") {
				this.isDrivingStateModal = true;
				let singleEmp = this.getSingleEmployee(id);
				this.tags = (singleEmp && singleEmp.drivingStates) ? singleEmp.drivingStates : [];
			} else if(key === "deactivaedDate") {
				this.isDeactivateDateModal = true;
			}
		}
	}

	handleCloseModal(){
		this.tags = [];
		this.deactivaedDate = '';
		this.payRollAmount = '';
		this.massDeactivationDate = ''
		this.reiMonth = '';
		this.lockDate = '';
		this.template.querySelector('c-user-profile-modal').hide();
		this.isDeactivateDateModal = false;
		this.isDrivingStateModal = false;
		this.isMileageLockDateModal = false;
		this.isMassDeactivationModal = false;
	}

	handleCancel() {
		this.showModal = false;
	}

	handleTagInput(event) {
		if (event.key === 'Enter' || event.type === 'blur') {
			const value = event.target.value.trim();
		  let validState = this.validStateList ? this.validStateList.split(',') : [];
		  if (value &&  this.validStateList && validState.includes(value) && !this.tags.includes(value)) {
				this.tags.push(value);
				let empIndex = this.employeeList.findIndex(emp => emp.userid === this.currentModalRecord )
				this.employeeList[empIndex].drivingStates = this.tags;
				this.template.querySelector('c-tag-state-list').updatetags(this.tags);
				this.updateEmp(this.currentModalRecord);
				this.newTag = '';
		  }
		}
	  }
	
	handleRemoveTag(event) {
		const tagToRemove = this.proxyToObject(event.detail);
		if(tagToRemove && tagToRemove.hasOwnProperty('record')) {
			this.editMode();
			let recordIndex = this.employeeList.findIndex((emp => emp.userid == tagToRemove.record));
			let stateList = this.employeeList[recordIndex].drivingStates;
			if(stateList && stateList.length && stateList.includes(tagToRemove.tag)) {
					stateList = stateList.filter(state => state !== tagToRemove.tag);
			}
			this.tags = stateList;
			this.employeeList[recordIndex].drivingStates = stateList;
			// this.template.querySelector('c-tag-state-list').updatetags(this.tags);
			this.updateEmp();
		} else {
			let recordIndex = this.employeeList.findIndex((emp => emp.userid == this.currentModalRecord));
			let stateList = this.employeeList[recordIndex].drivingStates;
			if(stateList && stateList.length && stateList.includes(tagToRemove)) {
					stateList = stateList.filter(state => state !== tagToRemove);
			}
			this.tags = stateList;
			this.employeeList[recordIndex].drivingStates = stateList;
			this.template.querySelector('c-tag-state-list').updatetags(this.tags);
			this.updateEmp();
		}
	}

     
	getEmployees() {
		getlistAllEmployees({accid: this.accid, contactid: this.contactid})
        .then(response => {
            this.employeeList = JSON.parse(response);
            this.dynamicBinding(this.employeeList, this.empKeyFields);
			this.isdataLoaded = true;
            this.editableView = true;
			this.paginated = true;
			this.isScrollable = true;
			this.isCheckbox = true;
			this.template.querySelector('c-user-preview-table').refreshTable(this.employeeList);
			// this.cancelEditMode();
			this.stopSpinner();
        })
        .catch(err => {
            console.log(this.proxyToObject(err));
        });
	}

	updateEmployeeList(empList, updateEmpMessage) {
		this.employeeList = this.proxyToObject(empList);
		this.stopSpinner();
		this.dynamicBinding(JSON.parse(this.employeeList), this.empKeyFields);
		let toastSuccess = { type: "success", message: updateEmpMessage };
		toastEvents(this, toastSuccess);
	}

	getSingleEmployee(id) {
		let employelist = this.proxyToObject(this.employeeList);
		return employelist.find(employee => (employee.userid === id));
	}

	updateEmp() {
		this.dynamicBinding(this.employeeList, this.empKeyFields);
		this.template.querySelector('c-user-preview-table').refreshTable(this.employeeList);
	}

	AddEmployee(event) {
		this.template.querySelector(".tab-wrapper .employee").click();
		let updateEmpMessage = event?.detail?.updateEmpMessage;
		let result = event?.detail?.result;
		this.updateEmployeeList(result, updateEmpMessage);
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

	showToast(event) {
		this.dispatchEvent(
		  new CustomEvent("toast", {
			detail: event.detail
		  })
		);
	  }
	
	  showErrorToast(event){
		this.dispatchEvent(
			new CustomEvent("error", {
				detail: event.detail
			})
		);
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


	showTooltip(){
		let popOver = this.template.querySelector('.state-popover');
		if(popOver.style) {
			popOver.style.visibility = "visible";
		}
	}

	hideTooltip() {
		let popOver = this.template.querySelector('.state-popover');
		if(popOver.style) {
			popOver.style.visibility = "hidden";
		}
	}

	getListOfDropDownData() {
		getDrivingStates()
		.then(response => {
			let stateList = JSON.parse(response);
			if(stateList && stateList.length){
				this.validStateList = stateList.toString();
			}
		})
		.catch(err => {
			console.log(err)
		});
		getJobTitle()
		.then(responce => {
			this.jobTitles = this.formatArray(JSON.parse(responce));
			// this.template.querySelector('c-add-employee').updateJobList(this.jobTitles);
			console.log("drop-data", this.proxyToObject(this.jobTitles));
		})
		.catch(err => {
			console.log("JOBLISTERRR",err);
		});
		getDepartment()
		.then(responce => {
			this.departments = this.formatArray(JSON.parse(responce));
			
		})
		.catch(err => {
			console.log({err});
		});
		getCompany()
		.then(responce => {
			console.log("drop-data", this.proxyToObject(responce));
			this.companies = this.formatArray(JSON.parse(responce));
		})
		.catch(err => {
			console.log({err});
		});
		getPickListValuesIntoList({accid:this.accid})
		.then(responce => {
			console.log("drop-data", this.proxyToObject(responce));
			let vehicles = JSON.parse(responce);
			if(vehicles && vehicles.length && Array.isArray(vehicles)) {
				this.vehicleTypeList = this.formatArray(vehicles[1].split(";"));
			}
		})
		.catch(err => {
			console.log(this.proxyToObject(err));
		})
		this.generateLockDateMonthList()
	}

	generateLockDateMonthList() {
		const currentDate = new Date();
		const lastTwoMonths = [];

		for (let i = 0; i < 2; i++) {
			const month = currentDate.getMonth() - i;
			const year = currentDate.getFullYear();

			if (month < 0) {
				month += 12;
				year -= 1;
			}

			lastTwoMonths.push(`${("0" + (month + 1)).slice(-2)}-${year}`);
		}

		lastTwoMonths.reverse();
		this.lockDateList = this.formatArray(lastTwoMonths);
	}

	formatArray(data) {
		if(data && data.length){
		return 	data.map(key => ({
				id: key,
				label: key,
				value: key
			}));
		}
		return data;
	}

	handledate(event) {
		this.deactivaedDate = event.detail;
	}

	handlePayRoll(event) {
		this.payRollAmount = event.target.value;
	}

	updateDeactivationDate() {
		let id = this.currentModalRecord;
		let recordIndex = this.employeeList.findIndex(emp => emp.userid === id);
		this.employeeList[recordIndex].deactivaedDate = this.deactivaedDate;
		this.employeeList[recordIndex].finalPayrollAmount = this.payRollAmount;
		this.updateEmp(id);
		this.handleCloseModal();
	}

	handleKeyDown(event) {
		// Allow only digit-related keys, arrow keys, delete, and backspace
		if (
		  !(
			/[0-9]/.test(event.key) ||
			['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(event.key)
		  )
		) {
		  event.preventDefault();
		}
	}

	handleInput(event) {
		// Remove any non-digit characters from the input value
		const inputValue = event.target.value.replace(/\D/g, '');
		event.target.value = inputValue;
	}

	handleActivity(event) {
		if(event && event.detail && event.detail.value) {
			this.currentActivity = event.detail.value;
			let activityList = this.activityList;
			const filteredArray = activityList.filter(obj => obj.id !== "Activity");
			this.activityList = filteredArray;
		}
		//isMassDeactivationModal
		if(this.currentActivity === "Send Driver Packet") {
			this.sendPacket(this.accid);
		} else if(this.currentActivity === "Mileage Lock Date"){
			this.isMileageLockDateModal = true;
			this.template.querySelector('c-user-profile-modal').show();
		} else {
			this.template.querySelector('c-user-preview-table').toggleCheckBox(true);
			if(event && event.detail && event.detail.value) {
				this.currentActivity = event.detail.value;
			}
			if(this.currentActivity === "Mass Deactivate") {
				this.isMassDeactivationModal = true;
			}
		}
	}

	disableCheckbox(event) {
		this.isSubmitVisible = false;
		this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
	}

	enableSubmit() {
		if(this.isSubmitVisible) {
			return
		}
		this.isSubmitVisible = true;
	}

	submitActivity(event) {
		let employeeList = this.getSelectedRecords();
		if(this.currentActivity === "Mass Deactivate") {
			this.template.querySelector('c-user-profile-modal').show();
		} else {
			this.template.querySelector('c-activity-actions').handleActivity(this.currentActivity, employeeList, this.accid, this.contactid);
		}
	}

	getSelectedRecords() {
		let selectedEmployee = this.employeeList;
		selectedEmployee = selectedEmployee.filter(employee => employee.isChecked === true);
		return selectedEmployee;
	}

	sendPacket(accId) {
        if(accId) {
            this.startSpinner()
            sendSignatureRequestForDriver({accountID: accId})
            .then(responce => {
                this.stopSpinner();
            })
            .catch(err => {
                this.stopSpinner()
            })
        }
    }

	handleLockMonth(event) {
		if(event && event.detail) {
			this.reiMonth = event.detail.value;
		}
	}

	handleMileageLockDate(event) {
		if(event && event.detail) {
			this.lockDate = event.detail;
		}
	}

	handleLockDate(event) {
		this.startSpinner()
		console.log(this.proxyToObject({accountId: this.accid, lockDate: this.lockDate, reiMonth: this.reiMonth}));
		updateLockDate({accountId: this.accid, lockDate: this.lockDate, reiMonth: this.reiMonth})
		.then(responce => {
			console.log(this.proxyToObject(responce));
			this.handleCloseModal();
			this.stopSpinner();
			if(this.proxyToObject(responce) == "Success") {
				let toastSuccess = { type: "success", message: "Mileage has been locked." };
                    toastEvents(this, toastSuccess);
			} else {
				let toastError = { type: "error", message: "Something went wrong." };
            	toastEvents(this, toastError);
			}
			
		})
		.catch(err => {	
			console.log(this.proxyToObject(err));
			this.stopSpinner();
		})
	}

	editEmployee(event) {
		let record = this.getSingleEmployee(event?.detail);
		this.template.querySelector('.tab-wrapper .add-employee').click();
		this.currentRecord = record;

	}

	handleMassDeactivationDate(event) {
		this.massDeactivationDate = event?.detail;
	}

	handleMassDeactivation() {
		if(!this.massDeactivationDate) {
			let message = "please select mass deactivation date";
			let evtobj = {type : "error", message : message}
			toastEvents(this, evtobj)
		} else {
			this.startSpinner();
			let employeeList = this.getSelectedRecords();
			employeeList = employeeList.map(emp => ({
				...emp,
				IsMassDeactivated: true,
				deactivaedDate: this.massDeactivationDate
			}));
			editInlineNewEmployee({listofemployee: JSON.stringify(employeeList), accid: this.accid, contactid: this.contactid})
            .then(response => {
                let result = JSON.parse(response);
                // this.displayToast(result, `Records updated`);
                if(result?.hasError) {
                    this.stopSpinner();
                    console.error(result.message);
                    let toastError = { type: "error", message: "Something went wrong." };
                    toastEvents(this, toastError);
                }
                if(!result?.hasError) {
                    // this.stopSpinner();
                    let updateEmpMessage = `Records updated`;
                    let toastSuccess = { type: "success", message: updateEmpMessage };
                    toastEvents(this, toastSuccess);
					this.isSubmitVisible = false;
					this.template.querySelector('c-user-preview-table').toggleCheckBox(false);
					this.handleCloseModal();
					this.getEmployees();
                }
            })
            .catch(err => {
                this.stopSpinner()
                console.log(this.proxyToObject(err)) 
            });
		}

	}

}