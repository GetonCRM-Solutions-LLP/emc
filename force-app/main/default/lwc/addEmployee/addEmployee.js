import { LightningElement, api, track } from 'lwc';
import resetPassword from '@salesforce/apex/RosterController.resetPassword';
import putHTTP from '@salesforce/apex/RosterController.putHTTP';
import getCountryStateCity from '@salesforce/apex/RosterController.getCountryStateCity';
import getDrivingStates from '@salesforce/apex/RosterController.getDrivingStates';
import manageEmployee from '@salesforce/apex/RosterController.manageEmployee';
import getJobTitle from '@salesforce/apex/RosterController.getJobTitle';
import getCompany from '@salesforce/apex/RosterController.getCompany';
import getDepartment from '@salesforce/apex/RosterController.getDepartment';
import getPickListValuesIntoList from '@salesforce/apex/RosterController.getPickListValuesIntoList';
import getAllManagers from '@salesforce/apex/RosterController.getAllManagers';
import getRoles from '@salesforce/apex/RosterController.getRoles';
import {
    toastEvents, modalEvents
} from 'c/utils';


export default class AddEmployee extends LightningElement {
	
    @track employeeFields = [
        {
          fieldName: "firstName",
          label: "First Name",
          type: "text",
          value: "",
          isRequired: true
        },
        {
          fieldName: "activationDate",
          label: "Activation Date",
          type: "date",
          value: "",
          isRequired: true
        },
        {
          fieldName: "lastName",
          label: "Last Name",
          type: "text",
          value: "",
          isRequired: true
        },
        {
          fieldName: "addedDate",
          label: "Added Date",
          type: "date",
          value: this.getTodayDate(),
          isRequired: false
        },
        {
          fieldName: "email",
          label: "Email",
          type: "text",
          value: "",
          isRequired: true
        },
        {
          fieldName: "vehicalType",
          label: "Vehicle Type",
          type: "select",
          value: "",
          isRequired: false
        },
        {
          fieldName: "role",
          label: "Role",
          type: "select",
          value: "",
          isRequired: true
        },
        {
          fieldName: "zipCode",
          label: "Zip Code",
          type: "text",
          value: "",
          isRequired: false
        },
        {
          fieldName: "managerName",
          label: "Manager",
          type: "select",
          value: "",
          isRequired: true
        },
        {
          fieldName: "city",
          label: "City",
          type: "select",
          value: "",
          isRequired: false
        },
        {
          fieldName: "employeeId",
          label: "Employee ID",
          type: "text",
          value: "",
          isRequired: false
        },
        {
          fieldName: "state",
          label: "State",
          type: "text",
          value: "",
          isRequired: false
        },
        {
          fieldName: "jobtitle",
          label: "Job Title",
          type: "select",
          value: "",
          isRequired: false
        },
        {
          fieldName: "drivingStates",
          label: "Driving States",
          type: "component",
          value: "",
          isRequired: false
        },
        {
          fieldName: "cellphone",
          label: "Cell Phone",
          type: "text",
          value: "",
          isRequired: true
        },
        {
          fieldName: "monthlymileage",
          label: "Monthly Mileage",
          type: "text",
          value: "",
          isRequired: false
        },
        {
          fieldName: "costCode",
          label: "Cost Code",
          type: "text",
          value: "",
          isRequired: false
        },
        {
          fieldName: "department",
          label: "Department",
          type: "select",
          value: "",
          isRequired: true
        },
        {
          fieldName: "deptDesign",
          label: "Department Design",
          type: "text",
          value: "",
          isRequired: true
        },
        {
          fieldName: "company",
          label: "Company",
          type: "select",
          value: "",
          isRequired: true
        },
        {
          fieldName: "am",
          label: "Region",
          type: "text",
          value: "",
          isRequired: false
        },
        {
          fieldName: "an",
          label: "Job Title",
          type: "text",
          value: "",
          isRequired: false
        }
      ];
    @api managersList;
    @api roleList;
	@api contactid;
	@api accid;
	@api cityList;
	@api record;
	@api isAddEmployeModal = false;
	@api tags = [];
	validStateList = [];
	newTag = '';
    @api requiredFields = {
        driver : ['firstName', 'activationDate', 'lastName', 'email', 'role', 'managerName', 'cellphone', 'department', 'deptDesign', 'company', 'vehicalType', 'zipCode', 'city', 'jobtitle', 'costCode', 'am', 'an'],
        manager: ['firstName', 'activationDate', 'lastName', 'email', 'role', 'managerName', 'cellphone', 'department', 'deptDesign', 'company'],
        admin: ['firstName', 'activationDate', 'lastName', 'email', 'role', 'managerName', 'cellphone', 'department', 'deptDesign', 'company']
    }
	isUpdateMode = false;

    connectedCallback() {
        
        this.manageFields();
		this.getListOfDropDownData();
		this.editRecord();
    }
    
    proxyToObj(data) {
        return data ? JSON.parse(JSON.stringify(data)) : '';
    }

    manageFields() {
        this.employeeFields = this.employeeFields.map((field) => ({
            ...field,
            isDateField: field.type === "date",
            isDropDown: field.type === "select",
			isPhone: field.fieldName === "cellphone"? true : false ,
			isDrivingState: field.fieldName === "drivingStates" ? true : false,
			displayValue : field.fieldName === "addedDate" ? this.convertDateFormat(this.getTodayDate()) : '',
            dropDownList: "",
            errorClass: (field.type !== "date" && field.type !== "select" && field.type !== "component" ) ? 'content-input' : '',
			isValid: false,
			isDependentDropDown: false,
            isDisable: (field.fieldName === "addedDate" || field.fieldName === "state")
        }));
    }

    getTodayDate() {
        const currentDate = new Date();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    handleInputChange(event) {
        const fieldName = event.target.dataset.fieldname;
        const fieldtype = event.target.dataset.inputType;
        let value;
        if(fieldtype) {
            if(fieldtype === "text") {
                value = event.target.value;
            } else  if( fieldtype === "select") {
                value = event.detail.value;
            } else if( fieldtype === "date") {
                value = event.detail;
            }
        }
		
        this.employeeFields = this.employeeFields.map((field) => {
			if (field.fieldName === fieldName) {
				if(fieldName === "cellphone") {
					return { ...field, value : this.autoPopulatePhone(value)  }
				}
				if(fieldName === "activationDate") {
					return { ...field, value : value, displayValue : this.convertDateFormat(value)  }
				}
				if(fieldName === "costCode") {
					return { ...field, value : this.autoCostCode(value)  }
				}
				if(fieldName === "am" || fieldName === "an") {
					return { ...field, value : this.isAlphabestOnly(value)  }
				}
				if(fieldName === "zipCode") {
					return { ...field, value : this.isZipCode(value)  }
				}
				if(fieldName === "monthlymileage") {
					return { ...field, value : this.monthlymileage(value)  }
				}
				return { ...field, value };
			}
			return field;
        });
		if(fieldName === "role") {
			this.updateRequiredField(value);
		}
		if(fieldName === "zipCode") {
			this.getCityList(value);
		}
      }

	  isAlphabestOnly(inputString) {
		return inputString.replace(/[^a-zA-Z]/g, '');
	  }

	  isDigitOnly(inputString) {
		return inputString.replace(/\D/g, '');
	}

	  isZipCode(inputString) {
		const maxLength = 5;
		let stringWithOnlyDigits = inputString.replace(/\D/g, '');
		return  stringWithOnlyDigits.slice(0, maxLength);
	  }

	  monthlymileage(inputString) {
		inputString = inputString.replace(/[^\d.]/g, '');

        // Allow only four digits at the beginning
        inputString = inputString.replace(/^(\d{0,4})\d*/, '$1');

        // Allow only two digits after a dot
        inputString = inputString.replace(/^(\d{0,4}\.\d{0,2})\d*/, '$1');
		return inputString;
	  }

	  validateInput(event) {
		const fieldName = event.target.dataset.fieldname;
        // const fieldtype = event.target.dataset.inputType;
		
		if(fieldName === "am" || fieldName === "an") {
			const allowedChars = /[a-zA-Z]/; // Regular expression to allow only alphabets
			if (!allowedChars.test(event.target.value)) {
				event.preventDefault(); // Prevents the non-alphabetic character from being entered
			}
		}
		if(fieldName === "cellphone") {
			// event.target.value = this.autoPopulatePhone(event.target.value);
		}
	  }
	  autoPopulatePhone(phone) {
		if (phone.trim().length > 0 && /^[0-9 \-]+$/.test(phone)) {
			const match = phone.replace(/\D+/g, '').match(/(\d.*){1,10}/)[0];
			const part1 = match.length > 3 ? `${match.substring(0, 3)}` : match;
			const part2 = match.length > 3 ? `-${match.substring(3, 6)}` : '';
			const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : '';
			return `${part1}${part2}${part3}`;
		} else {
			return '';
		}
	}

	autoCostCode(code) {
		if (code.trim().length > 0 && /^[0-9 \-]+$/.test(code)) {
			const match = code.replace(/\D+/g, '').match(/(\d.*){1,9}/)[0];
			const part1 = match.length > 2 ? `${match.substring(0, 2)}` : match;
			const part2 = match.length > 2 ? `-${match.substring(2, 6)}` : '';
			const part3 = match.length > 6 ? `-${match.substring(6, 9)}` : '';
			return `${part1}${part2}${part3}`;
		} else {
			return '';
		}
	}
	
	handleMLog() {
		let emailIndex = this.employeeFields.findIndex(emp => emp.fieldName === "email");
		let email = this.employeeFields[emailIndex].value;
		let fNameIndex = this.employeeFields.findIndex(emp => emp.fieldName === "firstName");
		let firstName = this.employeeFields[fNameIndex].value;
		let lNameIndex = this.employeeFields.findIndex(emp => emp.fieldName === "lastName");
		let lastName = this.employeeFields[lNameIndex].value;
		let toastMessage = ''
		if(this.isValidEmail(email) && firstName && lastName) {
			resetPassword({accountID: this.accid, empEmail: email })
			.then(responce => {
				if(this.proxyToObj(responce) === "Success") {
					toastMessage = { type: "success", message: `Email has been successfully send to  ${firstName} ${lastName}` };
				} else {
					toastMessage = { type: "error", message: "Something went wrong" };
				}
				toastEvents(this, toastMessage);
			})
			.catch(err => {
				console.log(this.proxyToObj(err));
			});
		} else {
			toastMessage = { type: "error", message: "Please add valid Email , Firstname & LastName." };
			toastEvents(this, toastMessage);
		}
		
	}

	handleMBurse() {
		if(this.record && this.isUpdateMode){
			putHTTP({contactID : this.record?.userid})
			.then(responce => {
				if(this.proxyToObj(responce) === "Success") {
					toastMessage = { type: "success", message: `Reset link was sent` };
				} else {
					toastMessage = { type: "error", message: "Something went wrong" };
				}
				toastEvents(this, toastMessage);
			})	
			.catch(err => {
				console.log(this.proxyToObj(err));
			})
		}
	}

	AddEmployee() {
		let employeeData = this.proxyToObj(this.employeeFields);
		employeeData = employeeData.map(emp => ({
			...emp,
			isValid : this.validateField(emp),
			errorClass : this.getClassName(emp)
		}));
		this.employeeFields = employeeData;
		if(this.employeeFields.every(emp => emp.isValid)) {
			let employee = {}
			
			this.employeeFields.forEach(emp => {
				employee[emp.fieldName] = emp.value;
			});
			if(this.isUpdateMode) {
				employee['userid'] = this.record?.userid;
			}
			this.startSpinner();
			manageEmployee({addNewEmployee: JSON.stringify([employee]), accid: this.accid, contactid: this.contactid })
			.then(responce => {
				let result = JSON.parse(responce);
				if(result?.hasError) {
					this.stopSpinner();
					console.error(result.message);
					let toastError = { type: "error", message: "Something went wrong." };
					toastEvents(this, toastError);
				} 
				if(!result?.hasError) {
					let mode = this.isUpdateMode ? 'Updated' : 'Added';
					let updateEmpMessage = `Success! You Just ${mode}  ${employee?.firstName}'s Details.` ;
					// this.stopSpinner();
					if(this.isAddEmployeModal) {
						this.stopSpinner();
						let toastMessage = { type: "success", message: updateEmpMessage };
						toastEvents(this, toastMessage);
					}
					const onAddEmployee = new CustomEvent("addemployee", {
						detail : {
							result : result.result,
							updateEmpMessage : updateEmpMessage,
						}
					});
					this.dispatchEvent(onAddEmployee);
				}
				
			})
			.catch(err => {
				let toastError = { type: "error", message: 'Something went wrong.' };
				toastEvents(this, toastError);
				console.log(this.proxyToObj(err));
			});
		} else {
			let error = {type : "error", message: "please fill all required field..!"}
			toastEvents(this, error);
		}
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

	validateSingleField(employee, index) {
		let isValid = this.validateField(employee);
		let errorClass = this.getClassName(employee);
		let empList = this.proxyToObj(this.employeeFields);
		empList[index].isValid = isValid;
		empList[index].errorClass = errorClass;
		this.employeeFields = empList;
	}

	getClassName(employee) {
		let isValid = this.validateField(employee);
		if(isValid) {
			if(employee.type === "select" || employee.type === "date" || employee.type === "component") {
				return 'content-select-success';
			} else {
				return 'content-input-success';
			}
		} else {
			if(employee.type === "select" || employee.type === "date" || employee.type === "component") {
				return 'content-select-error';
			} else {
				return 'content-input-error';
			}
		}
	}

	validateField(employee) {
		let  { value, fieldName, isRequired } = employee;
	
			if(fieldName === "email" && isRequired) {
				return this.isRequired(value) && this.isValidEmail(value)
			} else if(fieldName === "cellphone" && isRequired) {
				return  value.length === 12 &&  this.isRequired(value);
			}else if(isRequired) {
				return this.isRequired(value);
			} else {
				return true;
			}
	
	}

	isRequired(value) {
		if(!value) {
			return false
		}
		return true;
	}

	isValidEmail(email) {
		if(email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  			return emailRegex.test(email);
		}
		return false;
	}

	updateRequiredField(role) {
		let employeeFields = this.proxyToObj(this.employeeFields);
		if(role.includes('Driver')) {
			employeeFields = employeeFields.map(field => ({
				...field,
				isRequired : this.requiredFields.driver.includes(field.fieldName) ? true : false
			}) );
			this.employeeFields = employeeFields;
		} else if(role === "Admin" || role === "Manager") {
			employeeFields = employeeFields.map(field => ({
				...field,
				isRequired : this.requiredFields.manager.includes(field.fieldName) ? true : false
			}));
			this.employeeFields = employeeFields;
		}
	}

	getCityList(zip) {
		if(zip && zip.length === 5) {
			getCountryStateCity({zipcode: zip})
			.then(responce => {
				let cityArray = [];
				let isDependentDropDown = false;
				let state;
				if(responce) {
					let ListOfCity = this.proxyToObj(responce);
					ListOfCity = JSON.parse(ListOfCity);
					if(ListOfCity && ListOfCity.length){
						ListOfCity.forEach(city => {
							let singleCity = {};
							singleCity.id =   city.Id;
							singleCity.label = city.City__c;
							singleCity.value = city.City__c;
							cityArray.push(singleCity);
							state = city?.Abbreviation__c;
						});
						isDependentDropDown = true
					} 
				} 
				if(cityArray.length === 0) {
					let toastSuccess = { type: "error", message: "Add valid zip code" };
					toastEvents(this, toastSuccess);
				} else {
					this.employeeFields = this.employeeFields.map(emp => ({
						...emp,
						value: (emp.fieldName === "state") ? state : emp.value,
						isDependentDropDown: (emp.fieldName === "city") ? isDependentDropDown : emp.isDependentDropDown,
						dropDownList: (emp.fieldName === "city") ? cityArray : emp.dropDownList
					}));
				}
			})
			.catch(err => {
				console.log(this.proxyToObj(err));
			})
		}
	}

	handleRemoveTag(event) {
		const tagToRemove = event?.detail;
		if(this.tags && this.tags.length) {
			this.tags = this.tags.filter(state => state !== tagToRemove);
			this.updateDrivingState(this.tags);
		}
	}

	handleTagInput(event) {
		if (event.key === 'Enter' || event.type === 'blur') {
			const value = event.target.value.trim();
			let validState = this.validStateList ? this.validStateList.split(',') : [];
			if (value &&  this.validStateList && validState.includes(value) && !this.tags.includes(value)) {
				  this.tags.push(value);
				  this.updateDrivingState(this.tags);
			}
			if(!validState.includes(value)){
				let invalidStateError = `<b> Driving State entered </b> is a invalid state. Please enter an valid state.`;
				let toastSuccess = { type: "error", message: invalidStateError };
				toastEvents(this, toastSuccess);
			}
		}
	}

	updateDrivingState(tags) {
		this.employeeFields = this.employeeFields.map(emp => ({
			...emp,
			value : emp.fieldName === "drivingStates" ? tags : emp.value
		}))
	}
	
	editRecord(){
		let record = this.proxyToObj(this.record);
		if(record?.zipCode) {
			this.getCityList(record?.zipCode);
		}
		if(record?.role) {
			this.updateRequiredField(record?.role);
		}
		if(record?.userid) {
			this.isUpdateMode = true;
		}
		if(record?.drivingStates) {
			this.tags = this.proxyToObj(this.record?.drivingStates);
		}
		if(record) {
			this.employeeFields = this.employeeFields.map(emp => ({
				...emp,
				value :  record[emp.fieldName] ? record[emp.fieldName] : ''
			}));
		}
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
		getAllManagers({accID: this.accid})
		.then(managers => {
			let managerList = JSON.parse(managers);
			let managerArray = [];
			managerList.forEach(manager => {
				let singleManager = {};
				singleManager.id = manager.Id;
				singleManager.label = manager.Name;
				singleManager.value = manager.Id;
				managerArray.push(singleManager);
			});
			// this.managers = managerArray;
			this.setDependentDropDown("managerName", managerArray);
		})
		.catch(err => {
			console.log(err);
		});

		getRoles()
		.then(roles => {
			let roleList = this.formatArray(JSON.parse(roles));
			this.setDependentDropDown("role", roleList);
		})
		.catch(err => {
			console.log(err);
		});
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
			let jobTitles = this.formatArray(JSON.parse(responce));
			this.setDependentDropDown("jobtitle", jobTitles);
		})
		.catch(err => {
			console.log("JOBLISTERRR",err);
		});
		getDepartment()
		.then(responce => {
			let departments = this.formatArray(JSON.parse(responce));
			this.setDependentDropDown("department", departments);
		})
		.catch(err => {
			console.log({err});
		});
		getCompany()
		.then(responce => {
			let companies = this.formatArray(JSON.parse(responce));
			this.setDependentDropDown("company", companies);
		})
		.catch(err => {
			console.log({err});
		});
		getPickListValuesIntoList({accid:this.accid})
		.then(responce => {
			let vehicles = JSON.parse(responce);
			if(vehicles && vehicles.length && Array.isArray(vehicles)) {
				let vehicleTypeList = this.formatArray(vehicles[1].split(";"));
				this.setDependentDropDown("vehicalType", vehicleTypeList);
			}
		})
		.catch(err => {
			console.log(this.proxyToObj(err));
		})
	}

	setDependentDropDown(field, dropDownList) {
		this.employeeFields = this.employeeFields.map(emp => ({
			...emp,
			isDependentDropDown: (emp.fieldName === field) ? true : emp.isDependentDropDown,
			dropDownList: (emp.fieldName === field) ? dropDownList : emp.dropDownList
		}));
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

	convertDateFormat(dateString) {
		var dateParts = dateString.split('/');
		var month = dateParts[0];
		var day = dateParts[1];
		var year = dateParts[2].slice(-2);
		
		return month + '/' + day + '/' + year;
	}
}