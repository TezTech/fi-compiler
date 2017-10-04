# Draft Token Standard for Tezos

The following Smart Contract is built with fi, and provides an initial specification for a Tezos Token Standard. You can view the compiled Michelson code here.

```javascript
{(map key_hash nat)} storage.balances;
nat storage.total_supply;
int storage.decimals;
string storage.name;
string storage.symbol;

# Token Info
@(){
    nat return.total_supply = storage.total_supply;
    int return.decimals = storage.decimals;
    string return.name = storage.name;
    string return.symbol = storage.symbol;
}
# Get Balance
@(key_hash user){
    if (in(storage.balances, input.user) != bool True) throw;
    nat return.balance = val(storage.balances, input.user);
}
# Transfer To
@(key_hash toAddress, nat amount){
    key_hash var.me = manager(SOURCE);
    if (in(storage.balances, var.me) != bool True) throw;
    if (in(storage.balances, input.toAddress) != bool True) {
        storage.balances.update(input.toAddress, nat 0);
    }
    nat var.bal = val(storage.balances, var.me);
    if (var.bal < input.amount) throw;
    nat var.balTo = val(storage.balances, input.toAddress);
    storage.balances.update(var.me, _nat(sub(var.bal, input.amount)));
    storage.balances.update(input.toAddress, add(var.balTo, input.amount));
    bool return.success = bool True;
}
```

## Testing

I've run tests on alphanet using the Tezos utility tools - you can too. You need to add the program to your alphanet client (NOTE: replace ./alphanet client with tezos-client if you are not using he docker version): 
```
./alphanet client remember program 'tts' 'SRC'
```
Use the compiled Michelson code as SRC.

You can then run tests using:
```
./alphanet client run program 'tts' on storage 'STORAGE' and input 'INPUT'
```
Where STORAGE and INPUT are described below.

### Storage
Use the following string for storage
```
Pair (Map (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 10000)) (Pair 10000 (Pair 8 (Pair "Test" "TST")))
```
Replace "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" with the key of the contract your are making requests from - essentially you want to mimic the result of the SOURCE call, giving yourself access to all tokens. Note the right side of the main pair is the token details:
```
(Pair 10000 (Pair 8 (Pair "Test" "TST")))

WHERE
total_supply = 10000;
decimals = 8;
name = "Test";
symbol = "TST"
```


#### Input: Get Token Details
```
Left Unit
```
This will return the stored token detals

#### Input: Get Balance
```
Right (Left "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
```
This will return the balance for tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx - fails if no balance. You can change this to any valid tezos PKH

#### Input: Transfer To
```
Right (Right (Pair "tz1bq4LvntnGei8YqERbnBnk9u32KFEupJb5" 1000))
```
This will initiate a transfer to the indicated PKH address of the inputed amount. Returns bool true on success

## Examples
```
# Get Token Details
./alphanet client run program 'tts' on storage 'Pair (Map (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 10000)) (Pair 10000 (Pair 8 (Pair "Test" "TST")))' and input 'LEFT UNIT'

# Returns
storage
  (Pair
     (Map (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 10000))
     (Pair 10000 (Pair 8 (Pair "Test" "TST"))))
output
  (Pair (Some 10000)
     (Pair (Some 8) (Pair (Some "Test") (Pair (Some "TST") (Pair None None)))))
     
# Get Balance
./alphanet client run program 'tts' on storage 'Pair (Map (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 10000)) (Pair 10000 (Pair 8 (Pair "Test" "TST")))' and input 'Right (Left "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")'

# Returns
storage
  (Pair (Map (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 10000))
     (Pair 10000 (Pair 8 (Pair "Test" "TST"))))
output
  (Pair None (Pair None (Pair None (Pair None (Pair (Some 10000) None)))))
  
# Transfer To
./alphanet client run program 'tts' on storage 'Pair (Map (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 10000)) (Pair 10000 (Pair 8 (Pair "Test" "TST")))' and input 'Right (Right (Pair "tz1bq4LvntnGei8YqERbnBnk9u32KFEupJb5" 1000))'

# Returns
storage
  (Pair
     (Map (Item "tz1bq4LvntnGei8YqERbnBnk9u32KFEupJb5" 1000)
        (Item "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" 9000))
     (Pair 10000 (Pair 8 (Pair "Test" "TST"))))
output
  (Pair None (Pair None (Pair None (Pair None (Pair None (Some True))))))
```

## Live Testing
A contract will be added to the alphanet in the near future, with a faucet feature to allow users to better test token standards on the alphanet
