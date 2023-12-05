import React, { useEffect, useState } from "react";
import './buyToken.css'
import { Grid, Text, Loading, Col, Row, Input, Button, Modal, Tooltip, Collapse, Table } from "@nextui-org/react";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { FaWallet } from "react-icons/fa";
import { buyToken } from "../web3Client";
import { BsFillQuestionDiamondFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BuyToken(props) {
    const [userBalanceETH, setUserBalanceETH] = useState();
    const [userBalanceASHONK, setUserBalanceASHONK] = useState();
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [word, setWord] = useState('Wherever');
    const [no_of_tokens, setNo_Of_Tokens] = useState('')
    const [ETH_inputStatus, setETH_inputStatus] = useState('default')
    const [showFaucetModal, setShowFaucetModal] = useState(false)
    const [enableFaucetBTN, setEnableFaucetBTN] = useState(false)
    const [tx_processing, setTx_processing] = useState(false)
    const [faucet_tx_processing, setFaucet_tx_processing] = useState(false)

    useEffect(() => {
        if (typeof props.initData !== 'undefined') {
            setSelectedAccount(props.initData[0])
            // setUserBalanceETH(props.initData[1])
            // console.log('userBalanceETH: ', props.initData[1])
            setUserBalanceETH(props.initData[1] == '0.' ? 0 : props.initData[1])
            setUserBalanceASHONK(props.initData[2])
        }
    }, [props.initData])

    const invokeBuyToken = async (no_of_tokens) => {
        try {
            setTx_processing(true);
            const res = await buyToken(no_of_tokens * 1000);
            console.log('tx_res: ', res);
            console.log('tx_res type: ', typeof res)
            if (res && typeof res === 'object' && !Array.isArray(res)) {
                console.log('successs dogggg')
                toast.success(`Transaction Successful! Transaction Hash: ${res.transactionHash}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
            }
            else {
                console.log('errorrrr dogggg')
                toast.error(`Transaction Failed! Please try again.`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error('Error in transaction: ', error);
            toast.error(`Transaction Failed! Error: ${error}`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        } finally {
            setTx_processing(false);
            setNo_Of_Tokens('0')
            props.onActionComplete()
        }
    }

    const backendIP = process.env.REACT_APP_BACKEND

    const sendEthFromFaucet = async (toAddress) => {
        try {
            const response = await fetch(`https://ashokacoin-faucet.onrender.com/sendEth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ toAddress }),
            });
            const data = await response.json();
            if (data.success) {
                console.log('Transaction Hash:', data.transactionHash);
                setShowFaucetModal(false)
                toast.success(`Transaction Successful! Transaction Hash: ${data.transactionHash}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                console.error('Error:', data.error);
                setShowFaucetModal(false)
                toast.error(`Transaction Failed! Please try again.`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Transaction Failed! Error: ${error}.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        } finally {
            setFaucet_tx_processing(false)
            setNo_Of_Tokens('0')
            props.onActionComplete()
        }
    };


    useEffect(() => {
        const wordArray = [' Wherever', ' Whoever', ' Whenever']
        let i = 0

        const interval = setInterval(() => {
            setWord(wordArray[i])
            i = (i + 1) % wordArray.length
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {(typeof props.initData === 'undefined' && selectedAccount === null) ? (
                <Grid.Container css={{
                    jc: 'center',
                    alignItems: 'center',
                    width: '100vw',
                    height: '80vh'
                }}>
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Loading size="md" color="error" />
                        <Text css={{
                            fontSize: '$2xl',
                            fontWeight: '$semibold',
                            color: '#BE3144',
                            marginTop: '12px'
                        }}>
                            Getting your balance from your connected wallet
                        </Text>
                    </Col>
                </Grid.Container>
            ) : (
                <>
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: 'max-content'
                    }}>
                        <Text css={{
                            fontWeight: '$medium',
                            fontSize: '$md',
                            color: '#872341',
                            paddingTop: '48px'
                        }}>
                            Connected Account
                        </Text>
                        <Text css={{
                            fontWeight: '$semibold',
                            fontSize: '$xl',
                            color: '#F05941',
                            '@smMax':{
                                width: '300px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }
                        }}>
                            {selectedAccount}
                        </Text>
                        {!Number.isInteger(Math.floor(userBalanceETH*1000)) || Math.floor(userBalanceETH*1000)==0 ?
                            <Button flat color={'error'} css={{
                                background: 'rgba(240, 89, 65, 0.25)',
                                color: 'rgba(240, 89, 65, 1)',
                                margin: '8px 0px 48px 0px'
                            }}
                                onClick={() => {
                                    setShowFaucetModal(true)
                                }}>
                                ETH Faucet
                            </Button>
                            :
                            <Row css={{
                                width: 'max-content',
                                alignItems: 'start'
                            }}>
                                <Button flat color={'error'} css={{
                                    margin: '8px 8px 36px 0px'
                                }}
                                    disabled>
                                    ETH Faucet
                                </Button>
                                <Tooltip
                                    content="You already have some ETH in your account to be able to exchange for some ASHONK"
                                >
                                    <BsFillQuestionDiamondFill color="#872341" size={'16px'} />
                                </Tooltip>
                            </Row>
                        }

                        <Modal
                            closeButton
                            blur
                            aria-labelledby="faucet-modal"
                            open={showFaucetModal}
                            onClose={() => {
                                setShowFaucetModal(false)
                            }}
                        >
                            <Modal.Header>
                                <Text css={{
                                    fontSize: '$2xl',
                                    fontWeight: '$semibold',
                                    color: '#BE3144',
                                    borderWidth: '0px 0px 2px 0px',
                                    borderStyle: 'solid',
                                    borderColor: '#872341'
                                }}>
                                    ETH Faucet
                                </Text>
                            </Modal.Header>
                            <Modal.Body>
                                <Text css={{
                                    fontSize: '$md',
                                    fontWeight: '$medium',
                                    color: '#fff',
                                }}>
                                    We noticed you do not have any ETH in this account
                                    (<span style={{ color: '#BE3144' }}>
                                        {selectedAccount}
                                    </span>),
                                    so we decided to give you some free ETH for you to be able to exchange it for some ASHONK.
                                </Text>
                                <Text css={{
                                    fontSize: '$xs',
                                    fontWeight: '$medium',
                                    color: '#fff',
                                }}>
                                    Paste your public key below for the exchange.
                                </Text>
                                <Input
                                    aria-label='faucet-input'
                                    underlined
                                    labelLeft="Pkey"
                                    placeholder="0x00"
                                    css={{
                                        minWidth: '300px'
                                    }}
                                    onChange={(event) => {
                                        setEnableFaucetBTN(
                                            event.target.value == selectedAccount ? true : false
                                        )
                                    }}
                                />
                                {!faucet_tx_processing &&
                                    <>
                                        {enableFaucetBTN == false ?
                                            <Button flat color={'error'} css={{
                                                marginTop: '12px'
                                            }}
                                                disabled>
                                                Get 0.01 ETH
                                            </Button>
                                            :
                                            <Button flat color={'error'} css={{
                                                marginTop: '12px',
                                                background: 'rgba(240, 89, 65, 0.25)',
                                                color: 'rgba(240, 89, 65, 1)'
                                            }}
                                                onClick={() => {
                                                    // transfer some eth from one of our accounts to this account
                                                    setFaucet_tx_processing(true)
                                                    sendEthFromFaucet(selectedAccount, 0.01)
                                                }}>
                                                Get 0.01 ETH
                                            </Button>
                                        }

                                    </>
                                }
                                {faucet_tx_processing && 
                                    <Button flat color={'error'} css={{
                                        marginTop: '12px',
                                        background: 'rgba(240, 89, 65, 0.1)',
                                    }}>
                                        <Text css={{
                                            color: 'rgba(240, 89, 65, 1)',
                                            fontWeight: '$medium',
                                            paddingRight: '8px',
                                            fontSize: '$sm'
                                        }}>
                                            Transaction Processing...
                                        </Text>
                                        <Loading color={'error'} size="sm" />
                                    </Button>
                                }
                            </Modal.Body>
                        </Modal>

                        <Grid.Container css={{
                            width: '100vw',
                            jc: 'space-evenly',
                            alignItems: 'center',
                            paddingBottom: '48px'
                        }}>

                            {/* Left Side Text */}
                            <Grid css={{
                                maxW: '500px',
                                minWidth: '300px',
                                padding: '8px'
                            }}>
                                <Text css={{
                                    fontSize: '$3xl',
                                    fontWeight: '$bold',
                                    lineHeight: '1.25'
                                }}>
                                    Buy And Sell Ashoka University's Cryptocurrency Instantly.
                                    <span style={{ color: '#F05941' }}>{word}</span>
                                </Text>

                                <Text css={{
                                    paddingTop: '20px',
                                    paddingRight: '8px',
                                    fontWeight: '$semibold',
                                    fontSize: '$lg',
                                    color: '$gray600'
                                }}>
                                    Unlock the world of cryptocurrency trading.<br></br>
                                    Where better to start then in your own university? Get AshokaCoin for insane rewards all around campus.
                                </Text>
                            </Grid>

                            {/* Right Side Text */}
                            <Grid css={{
                                maxW: '500px',
                                minWidth: '300px',
                                padding: '8px'
                            }}>

                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                    <Text css={{
                                        fontSize: '$4xl',
                                        fontWeight: '$bold',
                                        lineHeight: '1.3'
                                    }}>
                                        Trade
                                    </Text>
                                    <Row css={{
                                        alignItems: 'center',
                                        paddingBottom: '4px'
                                    }}>
                                        <HiArrowTrendingUp color="#F05941" size={'20px'} />
                                        <Text css={{
                                            color: '#F05941',
                                            fontWeight: '$bold',
                                            paddingLeft: '8px',
                                            fontSize: '$sm'
                                        }}>
                                            1 ASHONK = 0.001 ETH
                                        </Text>
                                    </Row>

                                    <Col css={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Grid css={{
                                            backgroundColor: 'rgba(135, 35, 65, 0.1)',
                                            borderRadius: '8px',
                                            padding: '4px 8px 12px 8px',
                                        }}
                                            className="ex-box">
                                            <Row css={{
                                                padding: '0px 0px',
                                            }}>
                                                <Input
                                                    value={no_of_tokens}
                                                    aria-label='eth input'
                                                    underlined
                                                    labelLeft="ETH"
                                                    placeholder="0.00"
                                                    css={{
                                                        minWidth: '300px'
                                                    }}
                                                    status={ETH_inputStatus}
                                                    onChange={(event) => {

                                                        if (event.target.value < userBalanceETH && Number.isInteger(Number(event.target.value) * 1000) && (Number(event.target.value) * 1000) != 0) {
                                                            setETH_inputStatus('default')
                                                        }
                                                        else {
                                                            setETH_inputStatus('error')
                                                        }
                                                        if (event.target.value == '') {
                                                            setETH_inputStatus('defualt')
                                                        }
                                                        setNo_Of_Tokens(event.target.value)
                                                    }}
                                                />
                                            </Row>
                                            <Col css={{
                                                minWidth: '276px',
                                                maxW: '500px',
                                                padding: '8px 8px 0px 8px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Row css={{
                                                    alignItems: 'center',
                                                }}>
                                                    <Text css={{
                                                        fontWeight: '$semibold',
                                                        paddingRight: '4px',
                                                        color: '#F05941'
                                                    }}>
                                                        ETH in your wallet:
                                                    </Text>
                                                    <Text css={{
                                                        fontWeight: '$semibold',
                                                    }}>
                                                        {userBalanceETH}
                                                    </Text>
                                                    <FaWallet color="#fff" size={'16px'} style={{ margin: '0px 8px' }} />
                                                </Row>
                                            </Col>
                                        </Grid>

                                        <Text css={{
                                            padding: '6px 0px 6px 8px',
                                            fontWeight: '$semibold',
                                            fontSize: '$xs'
                                        }}>
                                            You will receive...
                                        </Text>

                                        <Grid css={{
                                            backgroundColor: 'rgba(135, 35, 65, 0.1)',
                                            borderRadius: '8px',
                                            padding: '4px 8px 12px 8px',
                                        }}
                                            className="ex-box">
                                            <Row css={{
                                                padding: '0px 0px 0px 0px'
                                            }}>
                                                <Input
                                                    aria-label="ashonk rate"
                                                    disabled
                                                    underlined
                                                    labelLeft="ASHONK"
                                                    placeholder={no_of_tokens === '' ? '0.00' : no_of_tokens * 1000} //dynamically update based on the amount of ETH they have entered
                                                    style={{}}
                                                    css={{
                                                        minWidth: '300px'
                                                    }}
                                                />
                                            </Row>
                                            <Col css={{
                                                minWidth: '276px',
                                                maxW: '500px',
                                                padding: '8px 8px 0px 8px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Row css={{
                                                    alignItems: 'center',
                                                }}>
                                                    <Text css={{
                                                        fontWeight: '$semibold',
                                                        paddingRight: '4px',
                                                        color: '#F05941'
                                                    }}>
                                                        ASHONK in your wallet:
                                                    </Text>
                                                    <Text css={{
                                                        fontWeight: '$semibold',
                                                    }}>
                                                        {/* {console.log('ba;ance her: ', String(userBalanceASHONK))} */}
                                                        {String(userBalanceASHONK)}
                                                    </Text>
                                                    <FaWallet color="#fff" size={'16px'} style={{ margin: '0px 8px' }} />
                                                </Row>
                                            </Col>
                                        </Grid>
                                    </Col>

                                    {!tx_processing &&
                                        <>
                                            {(no_of_tokens === '' || ETH_inputStatus === 'error' || (no_of_tokens * 1000) === '0') ?
                                                <Button flat color={'error'} css={{
                                                    marginTop: '24px'
                                                }}
                                                    disabled>
                                                    Buy
                                                </Button>
                                                :
                                                <Button flat color={'error'} css={{
                                                    marginTop: '24px',
                                                    background: 'rgba(240, 89, 65, 0.25)',
                                                    color: 'rgba(240, 89, 65, 1)'
                                                }}
                                                    onClick={() => {
                                                        invokeBuyToken(no_of_tokens)
                                                    }}>
                                                    Buy
                                                </Button>
                                            }
                                        </>
                                    }

                                    {tx_processing &&
                                        <Button flat color={'error'} css={{
                                            marginTop: '24px',
                                            background: 'rgba(240, 89, 65, 0.1)',
                                        }}>
                                            <Text css={{
                                                color: 'rgba(240, 89, 65, 1)',
                                                fontWeight: '$medium',
                                                paddingRight: '8px',
                                                fontSize: '$sm'
                                            }}>
                                                Transaction Processing...
                                            </Text>
                                            <Loading color={'error'} size="sm" />
                                        </Button>
                                    }


                                </Col>
                            </Grid>
                        </Grid.Container>

                        <Grid.Container css={{
                            width: '100vw',
                            jc: 'space-evenly',
                            alignItems: 'start',
                            paddingTop: '24px',
                            paddingBottom: '48px'
                        }}>

                            <Grid>
                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    jc: 'center'
                                }}>
                                    <Text css={{
                                        fontSize: '$2xl',
                                        fontWeight: '$semibold',
                                        color: '#F05941',
                                        lineHeight: '0.75'
                                    }}>
                                        $1 M
                                    </Text>
                                    <Text css={{
                                        fontSize: '$sm',
                                        fontWeight: '$semibold',
                                        color: '$gray600'
                                    }}>
                                        TOTAL VOLUME
                                    </Text>
                                </Col>
                            </Grid>

                            <Grid >
                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    jc: 'center'
                                }}>
                                    <Text css={{
                                        fontSize: '$2xl',
                                        fontWeight: '$semibold',
                                        color: '#F05941',
                                        lineHeight: '0.75'
                                    }}>
                                        $2.21
                                    </Text>
                                    <Text css={{
                                        fontSize: '$sm',
                                        fontWeight: '$semibold',
                                        color: '$gray600'
                                    }}>
                                        PRICE
                                    </Text>
                                </Col>
                            </Grid>

                            <Grid>
                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    jc: 'center'
                                }}>
                                    <Text css={{
                                        fontSize: '$2xl',
                                        fontWeight: '$semibold',
                                        color: '#F05941',
                                        lineHeight: '0.75'
                                    }}>
                                        $750 K
                                    </Text>
                                    <Text css={{
                                        fontSize: '$sm',
                                        fontWeight: '$semibold',
                                        color: '$gray600'
                                    }}>
                                        TOTAL LIQUIDITY
                                    </Text>
                                </Col>
                            </Grid>

                        </Grid.Container>

                        <Grid.Container css={{
                            jc: 'center',
                            paddingBottom: '48px'
                        }}>

                            <Grid css={{
                                maxW: '500px',
                                padding: '8px'
                            }}>
                                <Collapse.Group splitted>
                                    <Collapse title="My wallet doesn't show ASHONK...?">
                                        <Col css={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <Text css={{
                                                padding: '8px 0px'
                                            }}>
                                                Since AshokaCoin is currently deployed on the Goerli Test Network, token detection is not available which is you will not see it on your wallet even if you have ASHONK. So now?
                                            </Text>

                                            <Text css={{
                                                padding: '8px 0px'
                                            }}>
                                                Open your wallet, select "Import tokens". Now enter "0x2258691a58df1CeEa254b09E706CE854E22e5A43" as the "Token contract address", it should automatically detect "Token Symbol" as "ASHONK".
                                            </Text>

                                            <Text css={{
                                                padding: '8px 0px'
                                            }}>
                                                Enter "0.1" as the "Token decimal" and voila! You have ASHONK cryptocurrency in your crypto wallet.
                                            </Text>

                                        </Col>
                                    </Collapse>
                                </Collapse.Group>
                            </Grid>

                            <Grid css={{
                                maxW: '500px',
                                padding: '8px'
                            }}>
                                <Collapse.Group splitted>
                                    <Collapse title="How do I buy ASHONK?">
                                        <Text>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                            enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                            nisi ut aliquip ex ea commodo consequat.
                                        </Text>
                                    </Collapse>
                                </Collapse.Group>
                            </Grid>

                        </Grid.Container>

                        <ToastContainer />

                    </Col>
                </>
            )}
        </>
    );
}
