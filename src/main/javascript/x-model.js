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
        return this
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
            const c = i
            inputs[i].onChange(event => {args[c] = event.value; result.set(func(...args))}, false)
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
    return transform(value => value ? trueValue : falseValue, model)
}

function optional(model, value) {
    return mapBooleanModel(model, value, null)
}

function X(...inputs) {
    return inputs.length > 1 ? functionModel((...args) => args.join(""), ...inputs) : inputs[0]
}

class XEnabledValue extends XValue {
    constructor(enabled, initialValue) {
        super(initialValue);
        this.enabled = booleanModel(enabled)
    }

    set(newValue) {
        return this.enabled.get() ? super.set(newValue) : this;
    }
}

function enabledValueModel(enabled = false, initialValue = false) {
    return new XEnabledValue(enabled, initialValue)
}


class XProducer {
    constructor() {
        this.nextSignal = new XSignal()
    }

    add(item) {
        this.nextSignal.fire({value: item})
        return item
    }

    onNext(handler) {
        this.nextSignal.add(handler)
    }
}


function producer() {
    return new XProducer()
}
