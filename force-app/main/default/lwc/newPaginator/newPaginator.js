import { LightningElement, api ,track} from 'lwc';

export default class newPaginator extends LightningElement {
    currentPage =1;
    totalRecords;
    recordSize;
    visibleRecords;
    hasPrev = false;
    hasNext = true;
    totalpagebutton = false;
    totalPage = 0;
    totalPagenew = [];
    pages = [];
    paginate = [];
    setSize;
    @track moveNext = 3;
    @track moveBefore = 7;
    @track shortPaginate = 10;
    @track maxPage = 10;

    renderedCallback() {
        this.renderButtons();
    }
    renderButtons = () => {
        this.template.querySelectorAll('a').forEach((but) => {
            if(but.dataset.id != '..'){
                but.style.backgroundColor = this.currentPage === parseInt(but.dataset.id, 10) ? '#55903c' : '';
                but.style.color = this.currentPage === parseInt(but.dataset.id, 10) ? 'white' : 'black';
            }
          else{
              but.classList.remove('slds_link');
              but.classList.add('disable');
          }
        });
    }
   
    onPrev(){ 
        if(this.currentPage>1){
           
            this.currentPage = this.currentPage-1
            this.updateRecords(this.totalRecords , this.recordSize)
            if (this.paginate.length > this.shortPaginate) {
                if (this.currentPage < this.paginate.length) {
                    if (this.currentPage > 10) {
                        this.nextPrevChange(this.currentPage);
                    } else {
                        this.noPageChange(this.currentPage);
                    }
                }
            }
        }else if(this.currentPage == 1){
            this.hasPrev = false;
            this.hasNext = true;
        }
    }
    onPageClick(event){
        this.currentPage =  event.target.dataset.id;
        if(this.currentPage == this.totalPage){
            console.log('in this.currentPage == this.totalPage')
            this.hasNext = false;
            this.hasPrev = true;
        }else if(this.currentPage < this.totalPage && this.currentPage != 1){
            console.log('in this.currentPage < this.totalPage')
            this.hasNext = true;
            this.hasPrev = true;
        }else if(this.currentPage == 1 && this.totalPage > 1){
            console.log('in this.currentPage == 1')
            this.hasPrev = false;
            this.hasNext = true;
        }    
        this.updateRecords(this.totalRecords , this.recordSize)
        this.currentPage = parseInt(event.target.dataset.id, 10);
        if (this.paginate.length > this.shortPaginate) {
            this.next;
            //console.log("buttonClick",this.maxPage,this.pageCount);
            if (this.currentPage != this.paginate.length) {
                if (this.currentPage === this.maxPage) {
                    this.next = this.currentPage;
                    this.paginateChange(this.currentPage);
                  //  console.log('move1',this.next);
                } else {
                    this.reverseEndPaginate(this.currentPage, this.next);
                   // console.log('move',this.next);
                }
            } else {
                this.onLastPage(this.currentPage);
            }
        }
    }
    
    onNext(){
        if(this.currentPage < this.totalPage){
            this.hasPrev = true;
            this.hasNext = true;
        }else if(this.currentPage == this.totalPage){
            this.hasNext = false;
            this.hasPrev = true;
        }
            this.currentPage++;
            this.updateRecords(this.totalRecords , this.recordSize)
            if (this.paginate.length > this.shortPaginate) {
                if (this.currentPage > 10) {
                    this.nextPrevChange(this.currentPage);
                }
            }
        
        
    }
    @api updateRecords(data , recordperPage){ 
        //this.pages = [];
        this.paginate = [];
        this.totalRecords = data;
        this.recordSize = Number(recordperPage);
        this.totalPage = Math.ceil(data.length/this.recordSize);
        
        let pagecount = [];
        for(let i=0 ; i < this.totalPage ;i++){
            pagecount.push(i+1) ;
        }
        this.totalPagenew = JSON.parse(JSON.stringify(pagecount));

        if(this.totalPagenew.length != 0){
            this.totalpagebutton = true;
            for (let index = 1; index <= this.totalPage; index++) {
                //this.pages.push(index);
                this.paginate.push(index);
            }
            if(this.totalPagenew.length > this.shortPaginate){
                this.mapPages();
           }
        }else{
            this.totalpagebutton = false;
        }
        const start = (this.currentPage-1)*this.recordSize
        const end = this.recordSize*this.currentPage
        this.visibleRecords = this.totalRecords.slice(start, end)
        
        console.log('visible',JSON.parse(JSON.stringify(this.visibleRecords)));
        this.dispatchEvent(new CustomEvent('update',{ 
            detail:{ 
                records:this.visibleRecords
            }
        }))
    }

    mapPages(){
        var pagelen = this.totalPagenew.length;
        var indexlen = pagelen - (this.maxPage + 1)
        if(this.totalPagenew.length > this.maxPage){
            this.totalPagenew.splice(this.maxPage,indexlen,"..");
        }
      console.log(this.totalPagenew);
    }

    onLastPage(index){
        let pageSkip = index - 10;
        this.totalPagenew = this.paginate.slice();
        this.totalPagenew.splice(1,pageSkip,'..');
    }
    nextPrevChange(index){
        var len = this.paginate.length;//46
        if(index != len ){
            this.totalPagenew = this.paginate.slice(); 
            var startP = index + this.moveNext;
            var skiplen = len - (startP + 1);
            var inclen = index - this.moveBefore;
            if(startP < len){
                    this.totalPagenew.splice(startP,skiplen,'..');
                    this.totalPagenew.splice(1,inclen,'..');
            }else{
                this.totalPagenew.splice(1,inclen,'..');
            }
         //   console.log(this.pages);
        }
    }

    noPageChange(index){
        this.maxPage = 10;
        var pagelen = this.paginate.length;
        var indexlen = pagelen - (this.maxPage + 1)
        if(index === this.maxPage){
            this.totalPagenew = this.paginate.slice();
            this.totalPagenew.splice(this.maxPage,indexlen,'..');
        }
    }

    /* When user moves back while filter pagination*/
    reverseEndPaginate(index, nextClick) {
        if(nextClick === undefined){
            nextClick = this.paginate.length;
        }
        if (index < nextClick) {
            if (index >= 10) {
              //  console.log("inside paginateChange")
                this.paginateChange(index);
            } else {
                this.maxPage = 10;
                var pagelen = this.paginate.length;
                var indexlen = pagelen - (this.maxPage + 1)
                this.totalPagenew = this.paginate.slice();
                this.totalPagenew.splice(this.maxPage, indexlen, '..');
            }
        } else {
            if (index === 1) {
                this.maxPage = 10;
                var pagelen = this.paginate.length;
                var indexlen = pagelen - (this.maxPage + 1)
                this.totalPagenew = this.paginate.slice();
                this.totalPagenew.splice(this.maxPage, indexlen, '..');
            }

        }
        //  console.log('reverse:-', index, nextClick);
    }
    paginateChange(index) {
        var totalpage = this.paginate.length;
        if (index != totalpage) {
            this.totalPagenew = this.paginate.slice();
            this.maxPage = index + this.moveNext;
            this.minPage = index - this.moveBefore;
            var skip = totalpage - (this.maxPage + 1)
            if (this.maxPage != totalpage && this.maxPage < totalpage) {
                this.totalPagenew.splice(this.maxPage, skip, '..');
                this.totalPagenew.splice(1, this.minPage, '..');
            } else {
                this.totalPagenew.splice(1, this.minPage, '..');
            }
        }
      //  console.log(this.pages);
    }
}