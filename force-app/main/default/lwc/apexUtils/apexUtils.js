import getLocation from '@salesforce/apex/ImportLocationController.getLocation';
import updateLocationMlog from '@salesforce/apex/ImportLocationController.updateLocationMlog';
import updateLocation from '@salesforce/apex/ImportLocationController.updateLocation';
import currentMonthMileages  from '@salesforce/apex/ManualEntryMileageController.currentMonthMileages';
import fetchMileages  from '@salesforce/apex/ManualEntryMileageController.fetchMileages';
import locationList from '@salesforce/apex/ManualEntryMileageController.fromAndToVal';
import getAllDriversLastMonthUnapprovedReimbursementsclone from "@salesforce/apex/ManagerDashboardController.getAllDriversLastMonthUnapprovedReimbursementsclone";
const getLocations = (param1) => {
    return getLocation({conId: param1}).then((result) => {
        return result;
    }).catch((error) => {
        console.log(error);
    });
};

const uploadLocations = (param1, param2, param3) => {
    return updateLocationMlog({locationJSONString: param1, contactId: param2, localJSONString: param3}).then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error);
    })
};

const toLocation = (param1, param2, param3) => {
    return updateLocation({locationJSONString: param1, contactId: param2, localJSONString: param3}).then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error);
    })
}

const manualMileage = (param1) => {
    return currentMonthMileages({conID: param1}).then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error);
    })
}

const directions = (param1) => {
    return locationList({conId: param1}).then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error);
    })
}

const getMileages = () => {
    return fetchMileages().then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error);
    })
}

const getUnapproveMileages = (param1, param2, param3) => {
    getAllDriversLastMonthUnapprovedReimbursementsclone({accountId: param1, contactId: param2, showTeam: param3}).then((result)=>{
        return result;
    }).catch((error)=>{
        console.log(error);
    })
}

export { getLocations, uploadLocations, toLocation, manualMileage, directions, getMileages, getUnapproveMileages};