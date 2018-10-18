Root level:
```javascript
storage type name;
const type name value;
obj name(<var type...>)
public name(<var types...>){<code>}
private name(<var types...>) ?returns (<var types...>){<code>}
```
Code
```javascript
let <var_type> = <val>;
<var> = <val>;
if (<condition) {<code>} ?else {<code>}
assert(<condition) ?<val>;
throw ?<val>;
<fn>;
```
Guide
```javascript
<var type> = type name
<var types...> = type name, type name...
<var> = variable accerss, e.g. storage.xx, input.xx, xx.yy.zz...
<val> = any evaluated code, either a <var>, result of a function, or a literal
<fn> = a function that doesn't return anything
? = optional
```

