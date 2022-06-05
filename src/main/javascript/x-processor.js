
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
            setTimeout(() => batch(generator), delay)
    }

    return {
        batchSize: -1,

        totalCount: valueModel(0),

        doneCount: valueModel(0),

        batchDelay: 0,

        onDocument(uri, ...args) {
            let request = new XMLHttpRequest()
            request.open('GET', uri, true)
            this.onRequest(request, ...args)
            request.send()
        },

        onRequest(request, ...args) {
            request.onreadystatechange = function () {
                if(request.readyState === request.DONE && SUCCESS_STATUSES.has(request.status)) {
                    if(request.responseXML)
                        process(request.responseXML, ...args)
                }
            }
        },

        onChildrenOf(node, ...args) {
            batch(chunks(node, this.batchSize, this.totalCount, this.doneCount, ...args), this.delay)
        },

        onAttributesOf(node, ...args) {
            for(let i = 0; i < node.attributes.length; i++)
                process(node.attributes[i], ...args)
        },

        by(batchSize, delay = 0) {
            this.batchSize = batchSize
            return this
        },

        onTotal(handler) {
            this.totalCount.onChange(handler)
            return this
        },

        onProgress(handler) {
            this.doneCount.onChange(handler)
            return this
        }

    }

}

apply.onerror = function(error) {
    throw error
}
