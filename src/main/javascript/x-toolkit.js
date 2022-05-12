
function expander(model) {
    return span().display('inline-block').transition('transform .2s ease-in-out').transform(optional(model, 'rotate(90deg)')).add('▶').onClick(toggle(model))
}

function hbar(valueModel, className) {
    return div(className || 'progress').position('absolute').bottom(0).left(0).height(100, '%').width(valueModel, '%')
}

function vbar(valueModel, className) {
    return div(className || 'progress').position('absolute').bottom(0).left(0).width(100, '%').height(valueModel, '%')
}
