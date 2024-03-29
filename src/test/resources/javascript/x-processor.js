
function tagOf(node) {
    return node.tagName || node.nodeName
}

function valueOf(node) {
    return node.textContent
}

const SUCCESS_STATUSES = new Set([200, 0])

function apply(processor) {

    function process(target, ...args) {
        try {
            processor(target, ...args)
        } catch (error) {
            apply.onerror(error, target, ...args)
        }
    }

    function* chunks(node, batchSize, totalCount, doneCount, ...args) {
        let i = 0
        totalCount.set(node.childNodes.length)
        for(let child = node.firstChild; child; child = child.nextSibling, i++) {
            process(child, ...args)
            if(batchSize > 0 && (i % batchSize === 0)) {
                doneCount.set(i)
                yield
            }
        }
        doneCount.set(i)
    }

    function batch(generator, delay) {
        if(!generator.next().done)
            setTimeout(() => batch(generator, delay), delay)
    }

    return {
        batchSize: 0,

        totalCount: valueModel(0),

        doneCount: valueModel(0),

        batchDelay: 0,

        onerror: apply.onerror,

        onDocument(uri, ...args) {
            apply((r, ...a) => {
                if(r.responseXML)
                    processor(r.responseXML, ...a)
                else
                    this.onerror(new Error('No XML response received for: ' + uri), r)
            }).by(this.batchSize, this.batchDelay)
              .useTotalModel(this.totalCount)
              .useProgressModel(this.doneCount)
              .onGetRequest(uri, ...args)
        },

        onGetRequest(uri, ...args) {
            let request = new XMLHttpRequest()
            request.open('GET', uri, true)
            this.onRequest(request, ...args)
            request.send()
        },

        onRequest(request, ...args) {
            request.onprogress = event => {
                if(event.lengthComputable)
                    this.totalCount.set(event.total)
                this.doneCount.set(event.loaded)
            }
            request.onreadystatechange = () => {
                if(request.readyState === request.DONE) {
                    if(SUCCESS_STATUSES.has(request.status))
                        process(request, ...args)
                    else
                        this.onerror(new Error('Request failed: ' + request.status + ' ' + request.statusText + '\n\n' + request.responseText))
                }
            }
        },

        onChildrenOf(node, ...args) {
            batch(chunks(node, this.batchSize, this.totalCount, this.doneCount, ...args), this.batchDelay)
        },

        onAttributesOf(node, ...args) {
            if(node.attributes) for(let i = 0; i < node.attributes.length; i++)
                process(node.attributes[i], ...args)
        },

        by(batchSize, delay = 0) {
            this.batchSize = batchSize
            this.batchDelay = delay
            return this
        },

        onTotal(handler) {
            this.totalCount.onChange(handler)
            return this
        },

        useTotalModel(model) {
            this.totalCount = model
            return this
        },

        onProgress(handler) {
            this.doneCount.onChange(handler)
            return this
        },

        useProgressModel(model) {
            this.doneCount = model
            return this
        }

    }

}

apply.onerror = function(error) {
    throw error
}



function populate(model) {
    return {
        from(...uri) {
            let uriModel = X(...uri)
            if(!(uriModel instanceof XValue))
                uriModel = valueModel(uriModel)
            let f = () => apply(request => model.set(JSON.parse(request.responseText))).onGetRequest(uriModel.get())
            uriModel.onChange(f)
            model.update = f
            return {
                every(millis) {
                    setInterval(f, millis)
                    return this
                },
                model() {
                    return model
                }
            }
        }
    }
}

class XChannel {

    constructor(uri, model = valueModel(), ready = booleanModel()) {
        this.model = model
        this.uri = uri instanceof XValue ? uri : valueModel(uri)
        this.ready = ready.set(true)
        this.uri.onChange(() => this.update(), false)
    }

    setModel(model) {
        this.model = model
        return this
    }

    getModel() {
        return this.model
    }

    getReady() {
        return this.ready
    }

    setReady(model) {
        this.ready = model
        return this
    }

    set(value) {
        this.model.set(value)
        this.ready.set(true)
        return this
    }

    update() {
        this.ready.set(false)
        apply(request => this.set(JSON.parse(request.responseText))).onGetRequest(this.uri.get())
        return this
    }

    every(milliseconds) {
        setInterval(() => this.update(), milliseconds)
        return this
    }

}

function channel(...uri) {
    return new XChannel(X(uri))
}


class XDemand {
    constructor(expander, channel, initial) {
        this.expander = expander
        this.channel = channel.setReady(this.expander.enabled)
        this.initial = initial
        this.expander.onChange(event => event.value ? this.channel.update() : this.channel.set(this.initial))
    }

    expand() {
        return this.expander
    }

    getChannel() {
        return this.channel
    }

    model() {
        return this.channel.getModel()
    }

}

function demand(channel, initial = null) {
    return new XDemand(enabledValueModel(false), channel, initial)
}
