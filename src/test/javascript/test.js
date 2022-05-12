
var model = newToggleModel()
var enabled = newToggleModel()

body().add(
    div().title(X('a ', mapToggleModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model).color(mapToggleModel(enabled, null, 'silver')),
    div().display(model).add('Hidden element')
)
