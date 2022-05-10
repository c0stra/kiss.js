
function exp(model) {
    return span().setClass(mapToggleModel(model, 'node expanded', 'node')).add('▶').onClick(toggle(model))
}

function hbar(valueModel, className) {
    return div(className || 'progress').position('absolute').bottom(0).left(0).height(100, '%').width(valueModel, '%')
}

function vbar(valueModel, className) {
    return div(className || 'progress').position('absolute').bottom(0).left(0).width(100, '%').height(valueModel, '%')
}
