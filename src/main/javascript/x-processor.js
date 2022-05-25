
function tagOf(node) {
    return node.tagName
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

    return {
        onDocument: function onDocument(uri, ...args) {
            let request = new XMLHttpRequest()
            request.open('GET', uri, true)
            this.onRequest(request, ...args)
            request.send()
        },

        onRequest: function onRequest(request, ...args) {
            request.onreadystatechange = function () {
                if(request.readyState === request.DONE && SUCCESS_STATUSES.has(request.status)) {
                    if(request.responseXML)
                        processor(request.responseXML, ...args)
                }
            }
        },

        onChildrenOf: function onChildrenOf(node, ...args) {
            for(let child = node.firstChild; child; child = child.nextSibling)
                processor(child, ...args)
        },

        onAttributesOf: function onAttributesOf(node, ...args) {
            for(let i = 0; i < node.attributes.length; i++)
                processor(node.attributes[i], ...args)
        }
    }
}

apply.onerror = function(error) {
    throw error
}
