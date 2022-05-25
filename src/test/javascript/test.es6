
var model = enabledValueModel()
var items = iterator()

body().add(
    div().title(X('a ', mapBooleanModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model), //.color(mapBooleanModel(enabled, null, 'silver')),
    div().display(model).add('Hidden element'),
    each(items, item => div('item').add(item))
)

items.next("Item 1")
items.next("Item 2")
items.next("Item 3")

setTimeout(e => model.enabled.set(true), 2000)