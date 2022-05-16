
var model = enabledValueModel()

body().add(
    div().title(X('a ', mapBooleanModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model), //.color(mapBooleanModel(enabled, null, 'silver')),
    div().display(model).add('Hidden element')
)

setTimeout(e => model.enabled.set(true), 2000)