import './App.css';
import React, { useEffect, useState } from 'react';
import { init } from './web3Client';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import BuyToken from './pages/buyToken';
import Raffle from './pages/raffle';
import Holders from './pages/holders'
import ConnectWallet from './pages/connectWallet';
import { FaAlgolia, FaLeaf } from 'react-icons/fa';

function App() {
    const [walletInitRes, setWalletInitRes] = useState()
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    const onTxComplete = () => {
        setRefreshTrigger(prev => !prev); // Toggle to trigger useEffect
    };

    useEffect(() => {
        const fetchWalletData = async () => {
            let initRes 
            initRes = await init()//initialising web3client
            setWalletInitRes(initRes)
        }
        const test = window.setTimeout(()=>{
            fetchWalletData()
        },1000)
    },[refreshTrigger])

    if(window.ethereum){
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log(`Selected account changed to ${accounts[0]}`)
            if(typeof accounts[0]==='undefined'){
                setWalletInitRes(false)
            }
            else{
                const fetchWalletData = async () => {
                    let initRes 
                    initRes = await init()//initialising web3client
                    setWalletInitRes(initRes)
                }
                fetchWalletData()
            }
        })
    }

    const theme = createTheme({
        type: 'dark',
        theme: {
            colors: {
                white: '#ffffff',
                black: '#22092C',
            }
        }
    })

    return (
        <NextUIProvider theme={theme}>
            {walletInitRes === false ?
                <>
                    <ConnectWallet/>3
                </>
                :
                <>
                    <Header />
                    <div className='container'>
                        <Router>
                            <Routes>
                                <Route exact path="/" element={<BuyToken initData={walletInitRes} onActionComplete={onTxComplete}/>} />
                                <Route exact path="/raffle" element={<Raffle initData={walletInitRes} />} />
                                <Route exact path="/holders" element={<Holders initData={walletInitRes} />} />
                            </Routes>
                        </Router>
                    </div>
                    <Footer />
                </>
            }
        </NextUIProvider>
    );
}

export default App;
