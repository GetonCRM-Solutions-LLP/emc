import { LightningElement, api } from 'lwc';

export default class DashboardTable extends LightningElement {
    @api isCheckbox;
    @api keyName;
    @api headers;
    @api body;
    @api isRecord;
    @api noData;
    @api displayCheckboxForApprove;
    @api  manageSelectAllStyle(value){
        let allCheckbox = this.template.querySelector('.select-all-checkbox');
        if(!allCheckbox) return;
        allCheckbox.checked = value;
        console.log(allCheckbox);
    }
    sortedColumn='name';
    sortedDirection='asc';

    connectedCallback(){
        console.log("checkbox", this.isCheckbox )
        console.log("header->", this.headers)
        console.log("body->", this.body)
        console.log("btn", this.displayCheckboxForApprove)
    }
    getSource(){
            return this.body;
    }
    proxyToObj(source){
        return JSON.parse(JSON.stringify(source));
    }

    sort(event){
        let colName = event ? event.target.name : undefined;
        var data;
        if (this.sortedColumn === colName)
            this.sortedDirection = (this.sortedDirection === 'asc' )? 'desc' : 'asc' ;
        else
            this.sortedDirection = 'asc';

        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;
        if ( colName )
            this.sortedColumn = colName;
        else
            colName = this.sortedColumn;

        console.log(this.sortedColumn, this.sortedDirection)
        data = this.getSource();
        data = this.proxyToObj(data).sort( ( a, b ) => {
            if(colName == 'totalMileages' || colName == 'rejectedMileages' || colName == 'approvedMileages'){
                a = a[ colName ] ? parseFloat(a[ colName ]) : '';
                b = b[ colName ] ? parseFloat(b[ colName ]) : '';
                return  a > b ? 1 * isReverse :  -1 * isReverse;    
            }else{
                a = a[ colName ] ? a[ colName ].toLowerCase() : ''; 
                b = b[ colName ] ? b[ colName ].toLowerCase() : '';
                return a > b ? 1 * isReverse : -1 * isReverse;
            }
        });
        this.displaySortIcon(colName,this.sortedDirection);
        this.body = data;
    }

    displaySortIcon(colName, sortOrder){
        let data = this.proxyToObj(this.headers);
        if(data){
            for(var i = 0; i < data.length; i++){
                data[i].arrowUp = false;
                data[i].arrowDown = false;                    
            }
            for(var i = 0; i < data.length; i++){
                if(data[i].name == colName){
                    if(sortOrder == 'asc'){
                        data[i].arrowUp = true;
                    }else{
                        data[i].arrowDown = true;
                    }
                }
            };
        };
        this.headers = data;
    }

    handleAllRowsSelection(event){
        let isChecked = event.target.checked;
        console.log("isChecked: " , isChecked);
        this.dispatchEvent(new CustomEvent('allrowselection', {detail: isChecked}));
    }

    handleRowSelection(event){
        let isCheck = event.target.checked;
        let dataId = event.currentTarget.dataset.id;
        let reimId = event.currentTarget.dataset.rid;
        let unId = event.currentTarget.dataset.unid;
        var rowDetail = {checked: isCheck, rowId: dataId, reimbId: reimId, unapproveId: unId};
        this.dispatchEvent(new CustomEvent('rowselection', {detail: rowDetail}));
    }

    openunapprovemodal(event){
        var rowIndex = event.target.dataset.value;
        let unList = this.body[rowIndex];
        this.dispatchEvent(new CustomEvent('openmodalforunapprove', {detail: unList}));
    }

    modalForProcessing(event){
        var rowId = event.target.dataset.value;
        let list = this.body[rowId];
        this.dispatchEvent(new CustomEvent('openmodalforalert', {detail: list}));
    }
    
}