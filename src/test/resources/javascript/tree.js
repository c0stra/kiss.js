
let nodeDemand = demand(channel('data.json').setModel(listModel()), [])


function node(channel, label, content) {
    let d = demand(channel)
    return li().add(
        expander(d.expand()), label,
        ul().add(each(d.model(), item => content(item)))
    )
}

ul().add(
    node(nodeDemand, 'Item 1', item => node()),
    li().add(
        expander(nodeDemand.expand()), 'Item 1',
        ul().add(
            each(nodeDemand.model(), item => li().add(item))
        )
    )
)
