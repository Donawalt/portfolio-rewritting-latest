// My custom event bus for trigger and communicate stuff between pages and componentss

const eventBus = {
    listeners: new Map(),
    
    on(event, callback) {
        const wrappedCallback = (e) => callback(e.detail);
        this.listeners.set(callback, wrappedCallback);
        document.addEventListener(event, wrappedCallback);
    },
    
    dispatch(event, data) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    
    remove(event, callback) {
        const wrappedCallback = this.listeners.get(callback);
        if (wrappedCallback) {
            document.removeEventListener(event, wrappedCallback);
            this.listeners.delete(callback);
        }
    }
};

export default eventBus;
