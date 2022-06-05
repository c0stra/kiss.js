
function expander(model) {
    let e = span().display('inline-block').cursor('pointer').transition('transform .2s ease-in-out').transform(optional(model, 'rotate(90deg)')).add('▶').onClick(toggle(model))
    if(model instanceof XEnabledValue) {
        e.color(mapBooleanModel(model.enabled, null, 'silver'))
    }
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
