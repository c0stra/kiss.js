
let demand1 = demand(channel('items1.json').setModel(listModel()), [])
let demand2 = demand(channel('items2.json').setModel(listModel()), [])


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
    )
)
