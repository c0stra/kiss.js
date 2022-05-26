
function toggle(model) {
    return () => model.set(!model.get())
}

function set(model, value) {
    return () => model.set(value)
}
