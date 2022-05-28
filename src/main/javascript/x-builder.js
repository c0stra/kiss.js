/**
 * Class UI Element is a wrapper for DOM element, marking, that such object has a DOM element representing it's
 * visualization.
 */
class XNode {
    constructor(node) {this.node = node}

    get() {
        return this.node
    }

    prepend(node) {
        this.node.parentNode.insertBefore(x(node).get(), this.node)
        return this
    }

    remove() {
        this.node.parentNode.removeChild(this.node)
        return this
    }

    replace(replacement) {
        this.node.parentNode.replaceChild(replacement.node, this.node)
        return this
    }
}

function xNode(node) {
    return new XNode(node);
}

class XText extends XNode {
    constructor(text) {
        super(text instanceof Node ? text : document.createTextNode(text));
    }

    setValue(value) {
        this.node.nodeValue = value
        return this;
    }
}


function xText(text) {
    return new XText(text)
}

function x(parameter) {
    if(parameter instanceof XNode) return parameter
    if(parameter instanceof Node) return xNode(parameter)
    return text(parameter)
}

function valueView(value) {
    var builder = xText(document.createTextNode(value.get()))
    value.onChange(event => builder.setValue(event.value), false)
    return builder
}

function text(value) {
    return value instanceof XValue ? valueView(value) : xText(document.createTextNode(value));
}

class XBuilder extends XNode {
    /**
     * Class DOM fluent builder.
     *
     * @constructor
     */
    constructor(node) {
        super(node);
    }

    /*
          Fluent DOM tree manipulation methods
         */
    add(...args) {
        for(let i = 0; i < args.length; i++)
            this.node.appendChild(x(args[i]).get())
        return this
    }

    to(parent) {
        parent.add(this)
        return this
    }

    clear() {
        while(this.node.firstChild) this.node.removeChild(this.node.firstChild)
        return this
    }

    setValue(value) {
        this.node.nodeValue = value
        return this;
    }

    /*
     Manipulation of Element attributes.
     */
    set(name, ...args) {
        if(args.length === 0)
            return this
        let attr = event => {
            if(event.value === null) this.node.removeAttribute(name)
            else this.node.setAttribute(name, event.value)
        }
        let value = X(...args)
        if(value instanceof XValue) value.onChange(attr)
        else attr({value: value})
        return this
    }

    setClass(...value) {
        return this.set('class', ...value)
    }

    id(...value) {
        return this.set('id', ...value)
    }

    name(...value) {
        return this.set('name', ...value)
    }

    title(...value) {
        return this.set('title', ...value)
    }

    href(...value) {
        return this.set('href', ...value)
    }

    type(...value) {
        return this.set('type', ...value)
    }

    value(...value) {
        return this.set('value', ...value)
    }

    readonly(...value) {
        return this.set('readonly', ...value)
    }

    method(...value) {
        return this.set('method', ...value)
    }

    size(...value) {
        return this.set('size', ...value)
    }

    src(...value) {
        return this.set('src', ...value)
    }

    alt(...value) {
        return this.set('alt', ...value)
    }

    draggable(...value) {
        return this.set('draggable', ...value)
    }

    rel(...value) {
        return this.set('rel', ...value)
    }

    /*
      Manipulation of Element style properties
     */
    css(property, ...args) {
        if(args.length === 0)
            return this
        let value = X(...args)
        let node = this.node;
        function css(event) {
            if(event.value === null) node.style.removeProperty(property)
            else node.style.setProperty(property, event.value)
        }
        if(value instanceof XValue) value.onChange(css)
        else css({value: value})
        return this
    }

    width(value, unit = 'px') {
        return this.css('width', X(value, unit))
    }

    height(value, unit = 'px') {
        return this.css('height', X(value, unit))
    }

    top(value, unit = 'px') {
        return this.css('top', X(value, unit))
    }

    bottom(value, unit = 'px') {
        return this.css('bottom', X(value, unit))
    }

    left(value, unit = 'px') {
        return this.css('left', X(value, unit))
    }

    right(value, unit = 'px') {
        return this.css('right', X(value, unit))
    }

    color(value) {
        return this.css('color', value)
    }

    display(value) {
        return this.css('display', (value instanceof XValue && (value.value === true || value.value === false)) ? mapBooleanModel(value, null, 'none') : value)
    }

    visibility(value) {
        return this.css('visibility', value)
    }

    opacity(value) {
        return this.css('opacity', value)
    }

    backgroundColor(value) {
        return this.css('background-color', value)
    }

    position(value) {
        return this.css('position', value)
    }

    float(value) {
        return this.css('float', value)
    }

    paddingLeft(value, unit = 'px') {
        return this.css('padding-left', X(value, unit))
    }

    paddingRight(value, unit = 'px') {
        return this.css('padding-right', X(value, unit))
    }

    paddingTop(value, unit = 'px') {
        return this.css('padding-top', X(value, unit))
    }

    paddingBottom(value, unit = 'px') {
        return this.css('padding-bottom', X(value, unit))
    }

    marginLeft(value, unit = 'px') {
        return this.css('margin-left', X(value, unit))
    }

    marginRight(value, unit = 'px') {
        return this.css('margin-right', X(value, unit))
    }

    marginTop(value, unit = 'px') {
        return this.css('margin-top', X(value, unit))
    }

    marginBottom(value, unit = 'px') {
        return this.css('margin-bottom', X(value, unit))
    }

    cursor(value) {
        return this.css('cursor', value)
    }

    transition(value) {
        return this.css('transition', value)
    }

    transform(value) {
        return this.css('transform', value)
    }

    rotate(value, unit) {
        return this.transform(X('rotate(', value, unit, ')'))
    }

    /*
     Dealing with events
     */
    on(event, handler, bubble) {
        this.node.addEventListener(event, bubble ? function (e) {
            handler(e)
        } : function (e) {
            handler(e)
            e.preventDefault()
            return false
        })
        return this
    }

    onClick(handler, bubble) {
        return this.on('click', handler, bubble)
    }

    onSubmit(handler, bubble) {
        return this.on('submit', handler, bubble)
    }

    onReset(handler, bubble) {
        return this.on('reset', handler, bubble)
    }

}


function builder(node) {
    return new XBuilder(node)
}



/*
  Ready to use element builders.
 */
function body() {
    return builder(document.body)
}

function head() {
    return builder(document.head)
}

function byId(id) {
    return builder(document.getElementById(id))
}

function element(name, ...className) {
    return  builder(document.createElement(name)).setClass(...className)
}

function div(...className) {
    return element('div', ...className)
}

function span(...className) {
    return element('span', ...className)
}

function img(...src) {
    return element('img').src(...src)
}

function link(rel) {
    return element('link').rel(rel)
}

function a(...href) {
    return element('a').href(...href)
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

function fragment() {
    return builder(document.createDocumentFragment())
}


function each(iterator, itemView = item => item, boundary = xText('')) {
    iterator.onNext(item => boundary.prepend(itemView(item.value)))
    return fragment().add(boundary)
}
