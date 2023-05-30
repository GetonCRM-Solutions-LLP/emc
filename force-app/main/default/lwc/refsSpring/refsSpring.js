import { LightningElement } from 'lwc';

export default class RefsSpring extends LightningElement {
  submitHandler(){
    const title = this.refs.titleRef.value;
    const branch = this.refs.branchRef.value;
    console.log("this.refs.titleRef-->", this.refs.titleRef);
    console.log("Title-->", title);
    console.log("Branch-->", branch);
    console.log('template', this.template.querySelector('.divinput') )
    // this.template.querySelector('.abc')
  }
}