/**
 * Class UI Element is a wrapper for DOM element, marking, that such object has a DOM element representing it's
 * visualization.
 */
class XNode {
    constructor(node) {
        this.node = node
    }

    get() {
        return this.node
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

function text(value) {
    if(value instanceof XValue) {
        var builder = xText(document.createTextNode(value.get()))
        value.onChange(function(event) {
            builder.setValue(event.value)
        }, false)
        return builder
    } else {
        return xText(document.createTextNode(value))
    }
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

    remove() {
        this.node.parentNode.removeChild(this.node)
        return this
    }

    replace(replacement) {
        this.node.parentNode.replaceChild(replacement.node, this.node)
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
        let value = X(...args)
        let node = this.node;
        function attr(event) {
            if(event.value === null) node.removeAttribute(name)
            else node.setAttribute(name, event.value)
        }
        if(value instanceof XValue) value.onChange(attr)
        else attr({value: value})
        return this
    }

    setClass(...args) {
        return this.set('class', ...args)
    }

    id(value) {
        return this.set('id', value)
    }

    name(value) {
        return this.set('name', value)
    }

    title(value) {
        return this.set('title', value)
    }

    href(...parts) {
        return this.set('href', ...parts)
    }

    type(value) {
        return this.set('type', value)
    }

    value(value) {
        return this.set('value', value)
    }

    readonly(value) {
        return this.set('readonly', value)
    }

    method(value) {
        return this.set('method', value)
    }

    size(value) {
        return this.set('size', value)
    }

    src(value) {
        return this.set('src', value)
    }

    alt(value) {
        return this.set('alt', value)
    }

    draggable(value) {
        return this.set('draggable', value)
    }

    rel(value) {
        return this.set('rel', value)
    }

    /*
      Manipulation of Element style properties
     */
    css(property, ...args) {
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

    width(value, unit) {
        return this.css('width', X(value, unit || 'px'))
    }

    height(value, unit) {
        return this.css('height', X(value, unit || 'px'))
    }

    top(value, unit) {
        return this.css('top', X(value, unit || 'px'))
    }

    bottom(value, unit) {
        return this.css('bottom', X(value, unit || 'px'))
    }

    left(value, unit) {
        return this.css('left', X(value, unit || 'px'))
    }

    right(value, unit) {
        return this.css('right', X(value, unit || 'px'))
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
        return this.css('backgroundColor', value)
    }

    position(value) {
        return this.css('position', value)
    }

    float(value) {
        return this.css('float', value)
    }

    paddingLeft(value, unit) {
        return this.css('paddingLeft', X(value, unit || 'px'))
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


function uiBuilder(node) {
    return new XBuilder(node)
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