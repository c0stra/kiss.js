# kiss.js
> Keep It Simple... pure javascript MVC library

Kiss.js is client side only, EcmaScript 6 based
strict MVC implementation.

It's an early stage of development, now containing
rather low level components, with the plan to build
fully featured GUI toolkit.

The main theme is strict separation of models and
views, complemented by tiny glues - commands.

## Models
Currently there are just two, but powerful models.

```
XValue
```
Model of simple value.
There are no restrictions on the type, so it can
serve many different purposes. Holding e.g. value
to be displayed somewhere in the page (and updated
when changed), but also with boolean values as a
toggle used for changing state of various GUI
controls, but big power comes with connecting value
models using functions.

```
XProducer
```
Model of dynamically added elements (e.g. table
rows).
E.g. model of list extends it.

## Views
Currently view layer is pretty low level. It's
about building dynamic HTML content using javascript
fluent builders.
The power is in connection of the builders with
models very easilly.

Exanple of simple updatable value:
```
let model = textModel('Initializing')
body().add(div().add(model))
```
Immediately, on change of the value in model by
 `model.set('Done')`, the disolayed value changes.

Example of control of hideable element:
```
let displayToggle = booleanModel() // default initual value is `false`
body().add(
    div().add('Click for details').onClick(toggle(disolayToggle)),
    div().add('Detail hiddeable').display(displayToggle)
)
```
The html builder method `display()` normally sets the
css style property `display`, but in this example it
accepts directly the boolean model, so if it's `false`,
the element wont be visible.

Builder methods for attributes and style properties
accept vararg parameters. If more arguments provided,
the meaning is - model function to concatenate the
arguments.
This brings a powerful feature, when one wants to
dynamically control part of the value.
Typical usecase is to switch or toggle a css class,
but at the same time keep others unchanged.

Example:
```
let toggleClass = booleanModel()

body().add(
    div().setClass('fixed', mapBooleanModel(toggleClass, ' on')).add('Some text')
)
```
This code will toggle the class `on`, so it will be there, or not.
If the mapping receives one more argumen, it will switch
between them.

