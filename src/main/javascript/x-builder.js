/**
 * Class UI Element is a wrapper for DOM element, marking, that such object has a DOM element representing it's
 * visualization.
 *
 * @constructor
 */
function XNode() {}

XNode.prototype.initXNode = function (node) {
    this.node = node
    return this
}

XNode.prototype.get = function () {
    return this.node
}

function xNode(node) {
    return new XNode().initXNode(node);
}

function XText() {}
XText.prototype = new XNode()

XText.prototype.setValue = function(value) {
    this.node.nodeValue = value
    return this;
}

XText.prototype.initXText = function(text) {
    return this.initXNode(text instanceof Node ? text : document.createTextNode(text))
}

function xText(text) {
    return new XText().initXText(text)
}

function x(parameter) {
    if(parameter instanceof XNode) return parameter
    if(parameter instanceof Node) return xNode(parameter)
    return text(parameter)
}

function text(value) {
    if(value instanceof ValueModel) {
        var builder = xText(document.createTextNode(value.value))
        value.onValueChange(function(event) {
            builder.setValue(event.value)
        }, false)
        return builder
    } else {
        return xText(document.createTextNode(value))
    }
}

/**
 * Class DOM fluent builder.
 *
 * @constructor
 */
function XBuilder() {}
XBuilder.prototype = new XNode()

XBuilder.prototype.initDomBuilder = function(node) {
    return this.initXNode(node)
}

XBuilder.prototype.get = function() {
    return this.node
}

function uiBuilder(node) {
    return new XBuilder().initDomBuilder(node)
}

/*
  Fluent DOM tree manipulation methods
 */
XBuilder.prototype.add = function() {
    for(var i = 0; i < arguments.length; i++)
        this.node.appendChild(x(arguments[i]).get())
    return this
}

XBuilder.prototype.to = function(parent) {
    parent.add(this)
    return this
}

XBuilder.prototype.remove = function () {
    this.node.parentNode.removeChild(this.node)
    return this
}

XBuilder.prototype.replace = function (replacement) {
    this.node.parentNode.replaceChild(replacement.node, this.node)
    return this
}

XBuilder.prototype.clear = function () {
    while(this.node.firstChild) this.node.removeChild(this.node.firstChild)
    return this
}

XBuilder.prototype.setValue = function (value) {
    this.node.nodeValue = value
    return this;
}

/*
  Manipulation of Element attributes.
 */
XBuilder.prototype.set = function (name, value) {
    var node = this.node
    function attr(event) {
        if(event.value === null) node.removeAttribute(name)
        else node.setAttribute(name, event.value)
    }
    if(value instanceof ValueModel) value.onValueChange(attr)
    else attr({value: value})
    return this
}


XBuilder.prototype.setClass = function() {
    return this.set('class', concatModel(arguments))
}

XBuilder.prototype.id = function(value) {
    return this.set('id', value)
}

XBuilder.prototype.title = function(value) {
    return this.set('title', value)
}

XBuilder.prototype.name = function(value) {
    return this.set('name', value)
}

XBuilder.prototype.href = function(value) {
    return this.set('href', value)
}

XBuilder.prototype.title = function(value) {
    return this.set('title', value)
}

XBuilder.prototype.type = function(value) {
    return this.set('type', value)
}

XBuilder.prototype.value = function(value) {
    return this.set('value', value)
}

XBuilder.prototype.readonly = function(value) {
    return this.set('readonly', value)
}

XBuilder.prototype.method = function(value) {
    return this.set('method', value)
}

XBuilder.prototype.size = function(value) {
    return this.set('size', value)
}

XBuilder.prototype.src = function(value) {
    return this.set('src', value)
}

XBuilder.prototype.alt = function(value) {
    return this.set('alt', value)
}

XBuilder.prototype.draggable = function(value) {
    return this.set('draggable', value)
}

XBuilder.prototype.rel = function(value) {
    return this.set('rel', value)
}

/*
  Manipulation of Element style properties
 */
XBuilder.prototype.css = function (property, value) {
    var node = this.node
    function css(event) {
        if(event.value === null) node.style.removeProperty(property)
        else node.style.setProperty(property, event.value)
    }
    if(value instanceof ValueModel) value.onValueChange(css)
    else css({value: value})
    return this
}

XBuilder.prototype.width = function(value, unit) {
    return this.css('width', X(value, unit || 'px'))
}

XBuilder.prototype.height = function(value, unit) {
    return this.css('height', X(value, unit || 'px'))
}

XBuilder.prototype.top = function(value, unit) {
    return this.css('top', X(value, unit || 'px'))
}

XBuilder.prototype.bottom = function(value, unit) {
    return this.css('bottom', X(value, unit || 'px'))
}

XBuilder.prototype.left = function(value, unit) {
    return this.css('left', X(value, unit || 'px'))
}

XBuilder.prototype.right = function(value, unit) {
    return this.css('right', X(value, unit || 'px'))
}

XBuilder.prototype.color = function(value) {
    return this.css('color', value)
}

XBuilder.prototype.display = function(value) {
    return this.css('display', (value instanceof ValueModel && (value.value === true || value.value === false)) ? mapToggleModel(value, null, 'none') : value)
}

XBuilder.prototype.visibility = function(value) {
    return this.css('visibility', value)
}

XBuilder.prototype.opacity = function(value) {
    return this.css('opacity', value)
}

XBuilder.prototype.backgroundColor = function (value) {
    return this.css('backgroundColor', value)
}

XBuilder.prototype.position = function(value) {
    return this.css('position', value)
}

XBuilder.prototype.float = function(value) {
    return this.css('float', value)
}

XBuilder.prototype.paddingLeft = function (value, unit) {
    return this.css('paddingLeft', X(value, unit || 'px'))
}

XBuilder.prototype.transition = function(value) {
    return this.css('transition', value)
}

XBuilder.prototype.transform = function(value) {
    return this.css('transform', value)
}

XBuilder.prototype.rotate = function(value, unit) {
    return this.transform(X('rotate(', value, unit, ')'))
}

/*
  Dealing with events
 */
XBuilder.prototype.on = function(event, handler, bubble) {
    this.node.addEventListener(event, bubble ? function (e) {
        handler(e)
    } : function (e) {
        handler(e)
        e.preventDefault()
        return false
    })
    return this
}

XBuilder.prototype.onClick = function (handler, bubble) {
    return this.on('click', handler, bubble)
}

XBuilder.prototype.onSubmit = function (handler, bubble) {
    return this.on('submit', handler, bubble)
}

XBuilder.prototype.onReset = function (handler, bubble) {
    return this.on('reset', handler, bubble)
}

/*
  Ready to use element builders.
 */
function body() {
    return uiBuilder(document.body)
}

function head() {
    return uiBuilder(document.head)
}

function byId(id) {
    return uiBuilder(document.getElementById(id))
}

function element(name, className) {
    var builder = uiBuilder(document.createElement(name))
    if(className) builder.setClass(className)
    return builder
}

function div(className) {
    return element('div', className)
}

function span(className) {
    return element('span', className)
}

function img(src) {
    return element('img').src(src)
}

function link(rel) {
    return element('link').rel(rel)
}

function a(href) {
    var builder = element('a')
    if(href) builder.href(href)
    return builder
}

function h1() {
    return element('h1')
}

function h2() {
    return element('h2')
}

function h3() {
    return element('h3')
}

function h4() {
    return element('h4')
}

function h5() {
    return element('h5')
}

function p() {
    return element('p')
}

function pre() {
    return element('pre')
}

function code() {
    return element('code')
}

function ul() {
    return element('ul')
}

function ol() {
    return element('ul')
}

function li() {
    return element('li')
}

function small() {
    return element('small')
}

function strong() {
    return element('strong')
}

function em() {
    return element('em')
}

function abbr() {
    return element('abbr')
}

function time(value) {
    return element('time').add(text(value))
}

function form(method) {
    return element('form').method(method || 'POST')
}

function textarea(name) {
    return element('textarea').name(name)
}

function input(type, name) {
    return element('input').type(type).name(name)
}

function inputText(name) {
    return input('text', name)
}

function password(name) {
    return input('password', name)
}

function checkbox(name, checked) {
    return input('checkbox', name)
}

function submit(value) {
    return input('submit').value(value)
}

function reset(value) {
    return input('reset').value(value)
}

function select(name) {
    return element('select').name(name)
}

function option(value) {
    return element('option').value(value)
}

function label(forInput) {
    return element('label').set('for', forInput)
}

function fieldset(legendValue) {
    return legendValue ? element('fieldset').add(legend(legendValue)) : element('fieldset')
}

function legend(value) {
    return element('legend').add(text(value))
}

function dd() {
    return element('dd')
}

function dl() {
    return element('dl')
}

function dt() {
    return element('dt')
}

function dfn() {
    return element('dfn')
}

function table() {
    return element('table')
}

function tbody() {
    return element('tbody')
}

function thead() {
    return element('thead')
}

function tfoot() {
    return element('tfoot')
}

function tr() {
    return element('tr')
}

function td() {
    return element('td')
}

function th() {
    return element('th')
}

function sub() {
    return element('sub')
}

function sup() {
    return element('sup')
}

function details() {
    return element('details')
}

function summary() {
    return element('summary')
}

function del() {
    return element('del')
}

function ins() {
    return element('ins')
}
