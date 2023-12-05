import Web3 from 'web3'
import AshokaCoin_Build from 'contracts/AshokaCoin.json'
import AshokaCoinSale_Build from 'contracts/AshokaCoinSale.json'
import { ethers } from 'ethers'

let selectedAccount
let AshokaCoin_Contract
let AshokaCoin_Address
let AshokaCoinSale_Contract
let AshokaCoinSale_Address

export const init = async () => {
    let provider = new ethers.BrowserProvider(window.ethereum)
    let provider0 = window.ethereum

    if (typeof provider0 !== 'undefined') {
        // metamask is installed
        provider0
            .request({ method: 'eth_requestAccounts' })
            .then((accounts) => {
                selectedAccount = accounts[0]
                console.log(`Selected account is ${selectedAccount}`)
            })
            .catch((error) => {
                console.log(error)
            })

        window.ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0]
            console.log(`Selected account changed to ${selectedAccount}`)
            if (typeof selectedAccount === 'undefined') {
                return Promise.resolve(false)
            }
        })

    }
    else {
        console.log('Metamask not there dog')
        return Promise.resolve(false)
    }

    const web3 = new Web3(provider0)

    const networkID = await web3.eth.net.getId()

    AshokaCoin_Address = AshokaCoin_Build.networks[networkID].address
    let AshokaCoin_ABI = AshokaCoin_Build.abi

    // AshokaCoin_Contract = new ethers.Contract(AshokaCoin_Address, AshokaCoin_ABI, provider)

    AshokaCoin_Contract = new web3.eth.Contract(
        AshokaCoin_ABI,
        AshokaCoin_Address
    )

    AshokaCoinSale_Address = AshokaCoinSale_Build.networks[networkID].address
    let AshokaCoinSale_ABI = AshokaCoinSale_Build.abi

    // AshokaCoinSale_Contract = new ethers.Contract(AshokaCoinSale_Address, AshokaCoinSale_ABI, provider)

    AshokaCoinSale_Contract = new web3.eth.Contract(
        AshokaCoinSale_ABI,
        AshokaCoinSale_Address
    )
    // Now we have the contract as an object in our react.js files 
    // and so we can access the method and variables from that contract here like name() or symbol() for example

    let userBalance = await Promise.resolve(web3.eth.getBalance(selectedAccount))
    // console.log('balance: ', userBalance, 'wei')
    // console.log('balance: ', web3.utils.fromWei(userBalance, 'ether'), 'ether')
    let userBalanceETH = web3.utils.fromWei(userBalance, 'ether')

    let userBalanceASHONK = await Promise.resolve(AshokaCoin_Contract.methods.balanceOf(selectedAccount).call())

    // console.log(Promise.resolve(AshokaCoin_Contract.methods))

    // let tokenName = await AshokaCoin_Contract.name()
    // console.log(tokenName)

    // let balance = await AshokaCoin_Contract.balanceOf(selectedAccount)
    // console.log(balance)

    return Promise.resolve([selectedAccount, userBalanceETH, userBalanceASHONK])
}


// export const buyToken = async (no_of_tokens) => {

//     // let bal1 = await Promise.resolve(AshokaCoin_Contract.methods.balanceOf(AshokaCoinSale_Address).call())
//     // let bal2 = await Promise.resolve(AshokaCoin_Contract.methods.balanceOf(selectedAccount).call())
//     // console.log('sale AC balance before', bal1)
//     // console.log('my AC balance before', bal2)

//     const web3 = new Web3(window.ethereum)

//     const tokensToBuy = web3.utils.toBigInt(parseFloat(no_of_tokens)); // Convert to BigNumber
//     console.log('tokenstobuy: ', tokensToBuy)
//     const tokenPrice = await AshokaCoinSale_Contract.methods.tokenPrice().call();
//     console.log('token price: ', tokenPrice)
//     const tokenPriceBN = web3.utils.toBigInt(tokenPrice)
//     const priceInWei = tokenPriceBN * tokensToBuy

//     AshokaCoinSale_Contract.methods.buyTokens(tokensToBuy.toString()).send({
//         from: selectedAccount,
//         value: priceInWei.toString(),
//         gas: 500000
//     }).then((receipt)=>{
//         console.log('receipt: ',receipt)
//         console.log('receipt typeof: ', typeof receipt)
//         return receipt
//     }).catch((error)=>{
//         console.log(error)
//         return 'failed'
//     })

//     // let bal3 = await Promise.resolve(AshokaCoin_Contract.methods.balanceOf(AshokaCoinSale_Address).call())
//     // let bal4 = await Promise.resolve(AshokaCoin_Contract.methods.balanceOf(selectedAccount).call())
//     // console.log('sale AC balance after', bal3)
//     // console.log('my AC balance after', bal4)
// }

export const buyToken = async (no_of_tokens) => {
    try {
        const web3 = new Web3(window.ethereum);

        const tokensToBuy = web3.utils.toBigInt(parseFloat(no_of_tokens)); // Convert to BigNumber
        console.log('tokenstobuy: ', tokensToBuy)

        const tokenPrice = await AshokaCoinSale_Contract.methods.tokenPrice().call();
        console.log('token price: ', tokenPrice)
        const tokenPriceBN = web3.utils.toBigInt(tokenPrice)

        const priceInWei = tokenPriceBN * tokensToBuy

        // Return the Promise from the send method
        return AshokaCoinSale_Contract.methods.buyTokens(tokensToBuy.toString()).send({
            from: selectedAccount,
            value: priceInWei.toString(),
            gas: 500000
        });

    } catch (error) {
        console.error('Error in buyToken: ', error);
        // Re-throw the error to be handled by the caller
        return 'failed'
    }
}
