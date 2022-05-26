
var model = enabledValueModel()
var items = producer()

body().add(
    div().title(X('a ', mapBooleanModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model), //.color(mapBooleanModel(enabled, null, 'silver')),
    div().display(model).add('Hidden element'),
    each(items, item => div('item').add(item))
)

items.add("Item 1")
items.add("Item 2")
items.add("Item 3")

setTimeout(e => model.enabled.set(true), 2000)
