
class XSignal {
    constructor() {
        this.handlers = []
    }

    fire(event) {
        for (let i = 0; i < this.handlers.length; i++)
            this.handlers[i](event)
    }

    add(handler) {
        this.handlers.push(handler)
    }
}


class XValue {
    constructor(initialValue) {
        this.value = initialValue
        this.signal = new XSignal()
    }

    get() {
        return this.value
    }

    set(newValue) {
        this.signal.fire({oldValue: this.value, value: this.value = newValue})
    }

    onChange(handler, initialize = true) {
        this.signal.add(handler)
        if(initialize) handler({oldValue: this.value, value: this.value})
    }
}


function valueModel(initialValue = null) {
    return new XValue(initialValue)
}

function booleanModel(initialValue = false) {
    return new XValue(initialValue)
}

function textModel(initialValue = "") {
    return new XValue(initialValue)
}


function functionModel(func, ...inputs) {
    let args = new Array(inputs.length);
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i] instanceof XValue) {
            args[i] = inputs[i].get()
            inputs[i].onChange(event => {args[i] = event.value; result.set(func(...args))}, false)
        } else {
            args[i] = inputs[i]
        }
    }
    let result = valueModel(func(...args));
    return result
}

function transform(func, model) {
    return functionModel(func, model)
}
function mapBooleanModel(model, trueValue, falseValue) {
    return transform(value => value ? trueValue : falseValue)
}
function optional(model, value) {
    return mapBooleanModel(model, value, null)
}

function X(...inputs) {
    return inputs.length > 1 ? functionModel(() => Array.from(arguments).join(""), ...inputs) : inputs[0]
}

