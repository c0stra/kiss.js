
function toggle(model) {
    return () => model.set(!model.get())
}

function set(model, value) {
    return () => model.set(value)
}

function copyToClipboard(nodeOrBuilder) {
    let node = nodeOrBuilder instanceof XNode ? nodeOrBuilder.get() : nodeOrBuilder
    return function(event) {
        if(document.selection) {
            let ieRange = document.body.createTextRange()
            ieRange.moveToElementText(node)
            ieRange.select().createTextRange()
        } else if(window.getSelection) {
            let domRange = document.createRange()
            domRange.selectNode(node)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(domRange)
            document.execCommand("copy")
            window.getSelection().removeAllRanges()
        }
    }
}
