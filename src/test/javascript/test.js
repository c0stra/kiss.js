
var model = newToggleModel()

body().add(
    div().title(X('a ', mapToggleModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model)
)
