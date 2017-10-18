# Draft Token Standard for Tezos

The following Smart Contract is built with fi, and provides an initial specification for a Tezos Token Standard. You can view the compiled [Michelson code here](https://raw.githubusercontent.com/stephenandrews/fi/master/token_standard.tz).

```javascript
const nat total_supply "100";
const nat decimals "100";
const string name "Tezos Test Token";
const string symbol "TTT";

storage map(address => nat) balances;

@balanceOf(address user) returns (nat balance){
  if (storage.balances.in(input.user)){
    return.balance = storage.balances.get(input.user);
  } else {
    return.balance = nat 0;
  }
}
@transfer(address toUser, nat amount){
  if (!storage.balances.in(SENDER)) throw;
  if (storage.balances.in(input.toUser)) {
    let nat toBal = storage.balances.get(input.toUser);    
  } else {
    let nat toBal = nat 0;    
  }
  let nat fromBal = storage.balances.get(SENDER);
  if (fromBal < input.amount) throw;
  toBal.add(input.amount);
  fromBal.sub(input.amount);
  storage.balances.push(SENDER, abs(fromBal));
  storage.balances.push(input.toUser, toBal);
}
```

## Testing

I've run tests on alphanet using the Tezos utility tools - you can too. You need to add the program to your alphanet client 
#### (NOTE: replace ./alphanet client with tezos-client if you are not using the docker version): 
```
./alphanet client remember program 'tts' 'SRC'
```
Use the compiled Michelson code as SRC (either as a text, or store the contract as a file and reference it that way). Once you've run the above, you can then reference the contract using 'tts'

You can then run tests using:
```
./alphanet client run program 'tts' on storage 'STORAGE' and input 'INPUT'
```
Where STORAGE and INPUT are described below.

#### Alternatively, you can also [test here](https://try-michelson.com/)

### Storage
Use the following string for storage
```
(Map (Item "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 1000))
```
Replace "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" with the key of the contract your are making requests from - essentially if you want to mimic the result of the SOURCE call, giving yourself access to all tokens.

We use to include the token details as a contract call, however to save on GAS we've moved this to a constant, which we can pull from using the new JSON header line.

#### Input: Get Balance
```
Pair 0 (Left "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs")
```
This will return the balance for tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs, 0 if no balance exists. You can change this to any valid tezos PKH/tz1 address

##### Example
```
./alphanet client run program 'tts' on storage '(Map (Item "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 1000))' and input 'Pair 0 (Left "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs")'

# Returns
storage
  (Map (Item "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 1000))
output
  (Some 1000)
```

#### Input: Transfer To
```
Pair 1 (Right (Pair "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 100))
```
This will initiate a transfer to the indicated PKH address of the inputed amount.

##### Example
```
./alphanet client run program 'tts' on storage '(Map (Item "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 1000))' and input 'Pair 1 (Right (Pair "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 100))'

# Returns
storage
  (Map (Item "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 100)
     (Item "tz1L2deDTsmbHek73DsQb1ynxvZn3ZFThZTs" 900))
output
  None
```

## Allowances/Approve
We're working on the ability to approve an allowance, similar to ERC20 tokens.

## JSON Header Line
We've started to implement a standard where we take a JSON object which contains additional meta data to aid in interfacing with fi compiled smart contracts. We place a gzipped + base64encodes JSON string on the first line of every contract, preceeded by a hashbang (#!). This is ignored within Michelson, but can be accessed via the RPC client and converted back into the original JSON object.

```
#!H4sIAAAAAAAAA12OOw7DMAxD76LZJ8glOnUyPKi2DARo5MKip8B3r/oL2o4E+R640ybgwmBaYgpUh2asTY2WnS58Zc1yqo+w6m3AR5GGSadAXEoXM0qOdcHo+mzfkA+U4eUMhM5q1aEfDdr5TxQi8daG4oC/zGm6KfszsMJebz+/5x0/boBjxwAAAA==
```

Which decodes to:

```javascript
{
  "metadata": [
    
  ],
  "functions": {
    "balanceOf": {
      "input": [
        [
          "user",
          "address"
        ]
      ],
      "return": [
        [
          "balance",
          "nat"
        ]
      ]
    },
    "transfer": {
      "input": [
        [
          "toUser",
          "address"
        ],
        [
          "amount",
          "nat"
        ]
      ],
      "return": [
        
      ]
    }
  },
  "constants": [
    
  ],
  "data": [
    
  ]
}
```
This is currently a work in progress, but the aim is to provide information on the contract making it easier for 3rd party apps to easily interface with the contract.

We are currently working on a script which would take in a JSON object representing a contract call, and utilising the above JSON header, return a valid Michelson input to be sent to a smart contract. We'll have the same scripts setup for reading a contracts storage (as JSON) and the return/output.

## Live Testing
A contract will be added to the alphanet in the near future, with a faucet feature to allow users to better test token standards on the alphanet.

## Future Development
We are looking into streamlining the return response, hoping to use some sort of union like we do with the input parameter. We will the look to include other features suggested by the wider community.

We also want to look into how viable this contract is in relation to security.

In general, our fi compiler is still a work in progress, so this contract could change as we further develop and modify fi.

### Support Us
Let me know if you can help with our project in any way. Please consider donating to help us develop this, and other Tezos related tools: Bitcoin: 1KSiyfgs5XwTZjaLpmCTHxonsyXMx383P1
