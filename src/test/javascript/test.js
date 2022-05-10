
var model = newToggleModel()

body().add(
    div().title(concatModel('a ', mapToggleModel(model, 'X', 'Y'), ' x')).add('Click').onClick(function() {model.toggle()})
)
