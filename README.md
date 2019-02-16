# fi - Smart Contract language for Tezos

fi is a powerful, smart contract language for Tezos that compiles down to valid and verifiable Michelson code. fi is currently in early alpha stages, with the aim of release a complete alpha release soon.

[Check us out online](https://stephenandrews.github.io/fi/), or read through our [Documentation](https://fi-code.gitbooks.io/documentation/content/) to get started

## Installation

### Node.js

You can install the npm plugin:

```npm install fi-compiler```

You can the include the installed module:

```javascript
var fi = require("fi-compiler");
```

### Web

You can also build a distributable version to be included on the web:

```npm run build```

This will generate a file within the dist directory. You can download and use the currently built dist file as well.

```html
<script src="fi-compile.min.js"></script>
```

This will expose a global function, fi:

```javascript
console.log(fi);
```

## Usage

You can use the followed exposed functions:

### fi.version

This returns the current version number of the fi-compiler.

```console.log(fi.version);```

### fi.compile(code)

This takes one input argument, a string containing fi compile. This returns an object with two elements, code and abi.

```javascript
var ficode = `
storage string name;
entry changeName(string name ){
  storage.name = input.name;
}
`;
var compiled = fi.compile(ficode);
console.log(compiled.ml); //Michelson code
console.log(compiled.abi); //ABI JSON string
```

### fi.abi.load(abi)

You can manually loan an ABI string, which can be used to build input parameters for contract calls. In future, we aim to add additional support for more helper functions.

```javascript
fi.abi.load(compiled.abi);
```

### fi.abi.call(entry, input)

This function allows you to convert a JSON input object into packed bytes for calling a contract using a loaded ABI file. This function takes two input arguments, the name of the function you are calling, and the JSON object with the input.

```javascript
var input = {
  name : "Stephen"
};
console.log(fbi.abi.call("changeName", input)); // Returns packed bytes for a contract call
```
```
