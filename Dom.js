class Dom {
    costructor(){

    }

    updateState(state, action){
        return {...state, ...action};
    }

    // (type: String, props: Object, children: ...(Node|String)) => HTMLElement
    element(type, props, ...children){
        let dom = document.createElement(type);
        if (props) Object.assign(dom, props);
        for (let child of children){
            if (typeof child != "string") dom.appendChild(child);
            else dom.appendChild(document.createTextNode(child));
        }
        return dom;
    }
}