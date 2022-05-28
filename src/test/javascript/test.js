
let model = enabledValueModel()
let items = producer()
let aModel = booleanModel()
let andModel = andOperatorBuilder().addOperand(model).addOperand(aModel)

let colorPool = pool("yellow", "red", "green")
let c1 = booleanModel()
let c2 = booleanModel()
let c3 = booleanModel()
let c4 = booleanModel()

body().add(
    div().title(X('a ', mapBooleanModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model), //.color(mapBooleanModel(enabled, null, 'silver')),
    div().display(model).add('Hidden element'),
    each(items, item => div('item').add(item)),
    div().add('A').onClick(toggle(aModel)),
    div().add(andModel),
    span().add("c1").backgroundColor(pooledModel(c1, colorPool)).onClick(toggle(c1)), " ",
    span().add("c2").backgroundColor(pooledModel(c2, colorPool)).onClick(toggle(c2)), " ",
    span().add("c3").backgroundColor(pooledModel(c3, colorPool)).onClick(toggle(c3)), " ",
    span().add("c4").backgroundColor(pooledModel(c4, colorPool)).onClick(toggle(c4)), " "
)

items.add("Item 1")
items.add("Item 2")
items.add("Item 3")

setTimeout(e => model.enabled.set(true), 2000)
