Root level:
```javascript
storage <var type>;
const <var type...> value;
obj name(<var types...>)
public name(<var types...>){<code>}
private name(<var types...>) ?[returns (<var types...>)] {<code>}
```
Code
```javascript
let <var_type> = <val>;
<var> = <val>;
if (<condition) {<code>} ?[else ?[(<condition>)] {<code>}]
assert(<condition) ?[<val>];
throw ?[<val>];
<fn>;
```
Guide
```javascript
<var type> = A typed variable - type name, where type is a literal type or a defined obj
<var types...> = A comma-seperated list of typed variables - <var type>, <var type>...
<var> = variable access, e.g. storage.xx, input.xx, xx.yy.zz...
<val> = any evaluated code, either a <var>, global variable, constant, result of a function, or a literal (nat 5)
<fn> = a function that doesn't return anything
?[] = optional
```

