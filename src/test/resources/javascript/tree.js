
let demand1 = demand(channel('items1.json').setModel(listModel()), [])
let demand2 = demand(channel('items2.json').setModel(listModel()), [])

let level1 = demand(channel('items1.json').setModel(listModel()), [])

function node(channel, label, content) {
    return li().add(
        expander(channel.expand()), label,
        ul().add(each(channel.model(), item => content(item)))
    )
}


body().add(
    ul().add(
        node(demand1, fragment(' Item 1 ', demand1.expand().mapTo("Expanded", "Collapsed")), item => {
            let demand3 = demand(channel('items3.json').setModel(listModel()), [])
            return node(demand3, ' ' + item, l2i => li().add(l2i))
        }),
        li().add(
            expander(demand2.expand()), ' Item 1',
            ul().add(
                each(demand2.model(), item => li().add(item))
            )
        )
    ),
    br(), br(),

    div().add(
        div('level1').add(expander(level1.expand()), ' root'),
        each(level1.model(), item => {
            let level2 = demand(channel('items2.json').setModel(listModel()), [], andOperatorBuilder().operand(level1.expand()).operand(enabledValueModel()))
            return fragment(div('level2').add(expander(level2.expand()), ' ', item), each(level2.model(), i2 => div('level3').add(i2)))
        })
    )
)
