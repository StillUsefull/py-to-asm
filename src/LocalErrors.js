

export default class LocalError {
    constructor(localName, text){
        this.localName = localName;
        this.text = text;
    }
    log(){
        console.log(`${this.localName}: ${text}`);
    }
}

