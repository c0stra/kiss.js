
function toggle(model) {
    return function() {
        model.toggle()
    }
}

function set(model, value) {
    return function() {
        model.setValue(value)
    }
}
