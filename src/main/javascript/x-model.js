class XSignal {

    
    constructor() {
        this.handlers = []
    }

    fire(event) {
        for (let i = 0; i < this.handlers.length; i++) try {
            this.handlers[i](event)
        } catch(error) {
            // We need not to prevent invoking all handlers
            
        }
    }

    add(handler) {
        this.handlers.push(handler)
    }
}

function transfer() {
    return valueModel()
}

class XValue {
    constructor(initialValue) {
        this.value = initialValue
        this.signal = new XSignal()
    }

    get() {
        return this.value
    }

    set(newValue, forceFire = false) {
        if(this.value !== newValue || forceFire)
            this.signal.fire({oldValue: this.value, value: this.value = newValue})
        return this
    }

    onChange(handler, initialize = true) {
        this.signal.add(handler)
        if(initialize) handler({oldValue: this.value, value: this.value})
    }

    map(f) {
        let model = new XValue()
        this.onChange(event => model.set(f(event.value)))
        return model
    }

    mapTo(trueValue, falseValue = null) {
        return this.map(v => v ? trueValue : falseValue)
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

function mapBooleanModel(model, trueValue, falseValue = null) {
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

function operatorBuilder(fast) {
    let args = []
    let model = booleanModel(fast)
    function f(operands) {
        for (let i = 0; i < operands.length; i++)
            if(operands[i] === fast)
                return fast
        return !fast
    }
    model.operand = function (operandModel) {
        let i = args.length
        args.push(operandModel.get())
        operandModel.onChange(() => { args[i] = operandModel.get(); model.set(f(args)) })
        return this
    }
    return model
}

function andOperatorBuilder() {
    return operatorBuilder(false)
}

function orOperatorBuilder() {
    return operatorBuilder(true)
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


class XList extends XProducer {
    constructor(initial) {
        super();
        this.items = []
        this.changeSignal = new XSignal()
        if(initial) iterate(initial, i => this.add(i))
    }

    add(item) {
        this.items.push(item)
        this.changeSignal.fire({value: this.items})
        return super.add(item);
    }

    splice(start, deleteCount, ...items) {
        this.items.splice(start, deleteCount, ...items)
        this.changeSignal.fire({value: this.items})
    }

    remove(item) {
        this.splice(this.items.indexOf(item), 1)
    }

    onChange(handler, initialize = true) {
        this.changeSignal.add(handler)
        if(initialize) handler({value: this.items})
    }

    set(array) {
        this.items = array
        this.changeSignal.fire({value: this.items})
    }

    onNext(handler, initialize = true) {
        super.onNext(handler);
        if(initialize) this.items.forEach(item => handler({value: item}))
    }

}

function listModel(array) {
    return new XList(array)
}

class XPool {
    constructor(...pool) {
        this.cycle = true
        this.size = pool.length
        this.items = pool
        this.indexes = []
        for(let i = 0; i < this.items.length; i++)
            this.indexes.push(i)
    }

    acquire() {
        if(this.indexes.length === 0)
            if(this.cycle)
                this.indexes.push(this.size++)
            else
                return {value: null}
        return {
            value: this.items[this.indexes[0] % this.items.length],
            index: this.indexes.shift(),
        }
    }

    release(item) {
        if(item) {
            this.indexes.unshift(item.index)
            this.indexes.sort()
        }
        return {value: null}
    }
}

function pool(...pool) {
    return new XPool(...pool)
}

function pooledModel(model, pool) {
    let m = valueModel()
    model.onChange(e => m.set(e.value ? pool.acquire() : pool.release(m.get())))
    return transform(value => value.value, m)
}
