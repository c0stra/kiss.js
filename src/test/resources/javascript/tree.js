
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

    table().add(
        thead().add(tr().add(
            th().add('Node'),
            th().add('Count')
        )),
        tbody().add(
            range(
                tr().add(td().setClass('level1').add(expander(level1.expand()), ' Root'), td().add('')),
                level1.model(),
                item => {
                    let level2 = demand(channel('items2.json').setModel(listModel()), [])
                    return range(
                        tr().add(td().setClass('level2').add(expander(level2.expand()), ' ', item), td().add(item)),
                        level2.model(),
                        i2 => tr().add(td().setClass('level3').add(i2), td().add(i2))
                    )
                }
            )
        )
    )
)
