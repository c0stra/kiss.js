function Listeners() {}

Listeners.prototype.initListeners = function() {
    this.listeners = []
    return this
}

Listeners.prototype.addEventListener = function(listener) {
    this.listeners.push(listener)
}

Listeners.prototype.trigger = function(event) {
    for (var i = 0; i < this.listeners.length; i++) {
        this.listeners[i](event)
    }
}

function newEventListeners() {
    return new Listeners().initListeners()
}

/**
 * Class Value Model
 *
 * @constructor
 */
function ValueModel() {}

ValueModel.prototype.initValueModel = function(value) {
    this.value = value
    this.valueChange = newEventListeners()
    return this
}

ValueModel.prototype.onValueChange = function(handler, initialize) {
    this.valueChange.addEventListener(handler)
    if(false !== initialize) handler({value: this.value, oldValue: null})
    return this
}

ValueModel.prototype.setValue = function (value) {
    if(value !== this.value) {
        var event = {value: value, oldValue: this.value}
        this.value = value
        this.valueChange.trigger(event)
    }
    return this
}

ValueModel.prototype.getValue = function () {
    return this.value
}

function newValueModel(value) {
    return new ValueModel().initValueModel(value)
}

function newTextModel(value) {
    return newValueModel(value || "")
}

function ToggleModel() {}

ToggleModel.prototype = new ValueModel()

ToggleModel.prototype.initToggleModel = function(initial) {
    return this.initValueModel(initial)
}

ToggleModel.prototype.toggle = function() {
    return this.setValue(!this.value)
}

function newToggleModel(initial) {
    return new ToggleModel().initToggleModel(initial || false)
}

function optional(toggleModel, value) {
    return mapToggleModel(toggleModel, value, null)
}

function ObjectModel() {}

ObjectModel.prototype.update = function (source) {

}

function CollectionModel() {}

CollectionModel.prototype.initCollectionModel = function() {
    this.collection = []
    this.existing = {}
    this.createHandlers = newEventListeners()
    this.removeHandlers = newEventListeners()
    this.updateHandlers = newEventListeners()
    return this
}

CollectionModel.prototype.onItemCreated = function(listener) {
    this.createHandlers.addEventListener(listener)
    return this
}

CollectionModel.prototype.onItemRemoved = function(listener) {
    this.removeHandlers.addEventListener(listener)
    return this
}

CollectionModel.prototype.add = function(itemModel) {
    this.collection.push(itemModel)
    this.existing[itemModel.id] = itemModel
    this.createHandlers.trigger({item: itemModel})
    return this
}

CollectionModel.prototype.remove = function(id) {
    if(this.existing[id]) {
        this.collection.remove(this.existing[id])
        delete this.existing[id]
        this.removeHandlers.trigger({item: itemModel})
    }
    return this
}

function newCollectionModel() {
    return new CollectionModel().initCollectionModel()
}


function functionModel(logic, inputs) {
    var args = new Array(inputs.length)
    function bind(i) {
        args[i] = inputs[i].value
        inputs[i].onValueChange(function(e) {args[i] = e.value; resultModel.setValue(calculate());}, false)
    }
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i] instanceof ValueModel) bind(i)
        else args[i] = inputs[i]
    }
    function calculate() {
        return logic.apply(null, args)
    }
    var resultModel = newValueModel(calculate())
    return resultModel
}

function mapToggleModel(toggleModel, trueValue, falseValue) {
    return functionModel(function (inputValue) {
        return inputValue ? trueValue : falseValue
    }, [toggleModel])
}

function concatModel(inputs) {
    return inputs.length > 1 ? functionModel(function() {return Array.from(arguments).join("")}, inputs) : inputs[0]
}

function X() {
    return concatModel(arguments)
}
