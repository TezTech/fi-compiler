# Draft Token Standard for Tezos

The following Smart Contract is built with fi, and provides an initial specification for a Tezos Token Standard. You can view the compiled [Michelson code here](https://raw.githubusercontent.com/stephenandrews/fi/master/token_standard.tz).

```javascript
storage map(address=>nat) balances;
storage string name;
storage string sumbol;
storage nat decimals;

public transfer(address to, nat amount, ?bytes contractData){
  assert(!storage.balances.in(SENDER)) string "No token balance found";
  let nat senderBalance = storage.balances.get(SENDER);
  assert(senderBalance < input.amount) string "Balance is to low";
  let nat receiverBalance = nat 0;
  if (storage.balances.in(input.to)){
    receiverBalance = storage.balances.get(input.to);
  }
  senderBalance = sub(senderBalance, input.amount);
  senderBalance = abs(senderBalance);
  receiverBalance.add(input.amount);
  storage.balances.push(SENDER, senderBalance);
  storage.balances.push(input.to, receiverBalance);
  isset(input.contractData){
    transfer(mutez 0, input.to, input.contractData);
  }
}
```

## Testing
Please use the http://tztoken.github.io site to assist with creating your own tokens and playing with them.

### Storage
We store the storage data unserialized, making it cheaper on gas to run. We are still looking at how we can optimize this further. We are also using a map, not a big_map, to maintain balances while we explore our options.

We also store the required metadata for the token (Name, Symbol and Decimal places)

```
(Pair {Elt "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 100000000000000} (Pair "Tezos Test Token" (Pair "TTT" 1000000)))
```

#### Input: transfer
The input takes a single parameter of bytes, which we deserialize into the following type:

```
(pair address (pair nat (pair bool (option bytes))))
```
The first element is the receivers address, with the next (nat) being the amount of tokens to send. The final 2 variables are used when sending to a smart contract, and allows you to parse additional data. Here is an example of a basic transfer:

Note - the data needs to be packed before we send
```
pack('(Pair "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" (Pair 100000000 (Pair False None)))');
```

The ERC223 standard for ethereum extended the ERC20 standard by fixing the issue with sending tokens to smart contracts. This is done similar using the last 2 variables. Essentially, if you are sending the tokens to a smart contract which may want to update part of it's own storage (i.e. how a DEX might work) then you can submit additional data (as bytes) which will trigger an internal transaction to the smart contract. Here's an example:
```
var contractData = pack('(Pair 10 "testing")');
pack('(Pair "KT1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" (Pair 100000000 (Pair True '+contractData+')))');
```

The tokens will be allocated to the receipient address, but we also send the packed data (contractData) allowing the smart contract to execute additional code.

### Support Us
Let me know if you can help with our project in any way. Please consider donating to help us develop this, and other Tezos related tools: Bitcoin: 1KSiyfgs5XwTZjaLpmCTHxonsyXMx383P1
