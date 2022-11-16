
function expander(model) {
    let e = span().display('inline-block').cursor('pointer').transition('transform .2s ease-in-out').transform(optional(model, 'rotate(90deg)')).add('▶').onClick(toggle(model))
    if(model instanceof XEnabledValue) e.color(mapBooleanModel(model.enabled, null, 'silver'))
    return e
}

function hbar(valueModel, className) {
    return div(className || 'progress').position('absolute').bottom(0).left(0).height(100, '%').width(valueModel, '%')
}

function vbar(valueModel, className) {
    return div(className || 'progress').position('absolute').bottom(0).left(0).width(100, '%').height(valueModel, '%')
}

function progressBar(done, total, className = 'progress-bar') {
    return div(className).backgroundSize(functionModel((d, t) => ((t > 0) ? 100 * d / t : 0), done, total), '%')
}


function dataTable(model) {
    let def = {

    }
    let t = table().add(
        thead().add(tr()),
        tbody()
    )
    function update() {

    }
    model.onChange(update, false)
    return {
        add(...colDefs) {
            colDefs.forEach(colDef => def[colDef.key] = colDef)
            update()
            return this
        }
    }
}

function column(key) {
    return {
        key: key,
        _name: key,
        _value: row => row[key],
        name(n) {this._name = n; return this},
        value(f) {this._value = f; return this}
    }
}


function treeNode() {

}

function treeContent() {

}