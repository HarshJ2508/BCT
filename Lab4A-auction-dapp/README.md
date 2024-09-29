### Install truffle globally

```
npm install -g truffle
```

Check truffle version
```
truffle --version
```

### Init Dapp to use truffle
```
truffle init
```

### Compile all smart contracts using solc compiler
```
truffle compile
```
A build folder will be created containing json file/s = abi + byte code (artifacts)


### If you are facing below error: 
```
Error:  *** Deployment Failed ***

"SimpleStorage" hit an invalid opcode while deploying. Try: 
```

Lower your version of solc compiler to 0.8.19 in truffle-config.js file

### Deploy smart contract on 
1. Ganache-cli

**Step-1:** Install ganache-cli and run
```
ganache-cli
```
This will run private eth blockchain on your system by creating 10 wallet addresses

**Step-2:** Execute 
```
truffle migrate --reset
```


