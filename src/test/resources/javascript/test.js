
let model = enabledValueModel()
let items = producer()
let aModel = booleanModel()
let andModel = andOperatorBuilder().operand(model).operand(aModel)

let colorPool = pool("yellow", "red", "green")
let c1 = booleanModel()
let c2 = booleanModel()
let c3 = booleanModel()
let c4 = booleanModel()

let size = valueModel(0)
let loaded = valueModel(0)
let total = valueModel(0)
let processed = valueModel(0)

let inputModel = valueModel('input test')
let textareaModel = valueModel('textarea test')

let list = listModel(['a', 'b', 'c'])

let slot = transfer()

let obj = {}

body().add(
    div().title(X('a ', mapBooleanModel(model, 'X', 'Y'), ' x')).add('Click').onClick(toggle(model)),
    expander(model),
    div().display(model).add('Hidden element'),
    each(items, item => div('item').add(item)),
    div().add('A').onClick(toggle(aModel)),
    div().add(andModel),
    span().add("c1").backgroundColor(pooledModel(c1, colorPool)).onClick(toggle(c1)), " ",
    span().add("c2").backgroundColor(pooledModel(c2, colorPool)).onClick(toggle(c2)), " ",
    span().add("c3").backgroundColor(pooledModel(c3, colorPool)).onClick(toggle(c3)), " ",
    span().add("c4").backgroundColor(pooledModel(c4, colorPool)).onClick(toggle(c4)), " ",
    progressBar(loaded, size).add(loaded, ' / ', size, ' loaded'),
    progressBar(processed, total).add(processed, ' of ', total, ' elements processed'),
    buildView(model, () => div().add('Hello')),
    inputText('X').model(inputModel), br(),
    inputModel, br(),
    textarea('y').model(textareaModel), br(),
    textareaModel, br(), div().add('e: ', obj.e),
    each(list, c => div().add(c)),
    span().add('Drag me').transfer(slot, 'A'),
    span().add('Drop here').receive(slot, data => alert(data))
)

items.add("Item 1")
items.add("Item 2")
items.add("Item 3")

setTimeout(e => model.enabled.set(true), 2000)

let c = pre()

list.remove('a')
let source = textModel('data')
populate(list).from(source,'.json')//.every(1000)

setTimeout(() => source.set('data2'), 2000)

apply(function rule(node, prefix) {

    c.add(prefix + tagOf(node) + ' ')
    apply(attr => {
        c.add(' ' + attr.nodeName)
    }).onAttributesOf(node)
    c.add('\n')
    if(tagOf(node) === 'data') {
        apply(rule).by(1, 200).useTotalModel(total).useProgressModel(processed).onChildrenOf(node, '\t' + prefix)
    } else {
        apply(rule).onChildrenOf(node, '\t' + prefix)
    }

}).useTotalModel(size).useProgressModel(loaded).onDocument("https://cdn.jsdelivr.net/gh/c0stra/kiss.js@main/src/test/resources/test.xml", '+- ')

body().add(c)
