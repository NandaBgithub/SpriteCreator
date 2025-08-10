class StateManager{
    constructor(state){
        this.state = state;
        this.subscribers = [];
    }

    updateState(state){
        this.state = state;
        this._publish();
    }

    subscribe(func){
        this.subscribers.push(func);
    }

    _publish(){
        this.subscribers.forEach((func) => {
            func(this.state);
        })
    }
}

export default StateManager;