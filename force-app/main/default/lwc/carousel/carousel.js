import { LightningElement, api } from 'lwc';

export default class Carousel extends LightningElement {
    currentPage =1
    totalRecords
    @api recordSize = 1
    totalPage = 0
    get records(){
        return this.visibleRecords
    }
    @api 
    set records(data){
        if(data){ 
            this.totalRecords = data
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.recordSize = Number(this.recordSize)
            this.totalPage = Math.ceil(data.length/this.recordSize)
            console.log(this.totalPage, data.length,this.recordSize )
            this.updateRecords()
        }
    }

    get disablePrevious(){ 
        return this.currentPage<=1
    }
    get disableNext(){ 
        return this.currentPage>=this.totalPage
    }
    previousHandler(){ 
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1
            this.updateRecords()
        }
    }
    nextHandler(){
        if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage+1
            this.updateRecords()
        }
    }
    updateRecords(){ 
        const start = (this.currentPage-1)*this.recordSize
        const end = this.recordSize*this.currentPage
        this.visibleRecords = this.totalRecords.slice(start, end)
        console.log(JSON.stringify(this.totalRecords), JSON.stringify(this.visibleRecords))
        this.dispatchEvent(new CustomEvent('update',{ 
            detail:{ 
                records:this.visibleRecords
            }
        }))
    }
}