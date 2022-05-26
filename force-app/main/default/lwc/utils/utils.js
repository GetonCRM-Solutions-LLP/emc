const events  = (component, param) => {
    const e = new CustomEvent('navigate', {detail: param});
    component.dispatchEvent(e);
}

const skipEvents  = (component, param) => {
    const e = new CustomEvent('skip', {detail: param});
    component.dispatchEvent(e);
}

const backEvents  = (component, param) => {
    const e = new CustomEvent('back', {detail: param});
    component.dispatchEvent(e);
}
export {events, skipEvents, backEvents}