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
if (<condition) {<code>} ?[else {<code>}]
assert(<condition) ?[<val>];
throw ?[<val>];
<fn>;
```
Guide
```javascript
<var type> = A typed variable - type name
<var types...> = A comma-seperated list of typed variables - type name, type name...
<var> = variable access, e.g. storage.xx, input.xx, xx.yy.zz...
<val> = any evaluated code, either a <var>, result of a function, or a literal (nat 5)
<fn> = a function that doesn't return anything
?[] = optional
```

