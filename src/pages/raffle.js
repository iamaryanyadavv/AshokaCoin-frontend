import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import axios from 'axios'
import { Web3 } from 'web3'
import { Grid, Col, Text, Button, Collapse, Loading, Card, Row } from '@nextui-org/react';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Coffee from '../assets/coffee.jpg'
import Bagel from '../assets/bagel.jpg'
import Falafel from '../assets/falafel.jpg'
import Cake from '../assets/cake.jpg'


export default function Raffle(props) {
    const [userBalanceETH, setUserBalanceETH] = useState();
    const [userBalanceASHONK, setUserBalanceASHONK] = useState();
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [selectedHolders, setSelectedHolders] = useState([]);
    const [holders, setHolders] = useState({})
    const [holdersArray, setHoldersArray] = useState([])
    const [loader, setLoader] = useState(true)

    // console.log(process.env.REACT_APP_ETEHRSCAN_APIKEY)
    const API_key = process.env.REACT_APP_ETEHRSCAN_APIKEY
    const SaleAddress = process.env.REACT_APP_SALE_CONTRACT_ADDRESS

    const colors = ['#F8B88B', '#FAE3D9', '#BFD8D2', '#F5CAC3', '#F6BD60', '#84A59D', '#F28482', '#FDFD96', '#A6E7FF', '#FFC0CB'];

    useEffect(() => {
        // Select 10 unique random holders
        if (holders.length >= 10) {
            const shuffled = [...holders].sort(() => 0.5 - Math.random());
            setSelectedHolders(shuffled.slice(0, 10));
        }
    }, [holders]);

    const truncateAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    const data = selectedHolders.map((holder, index) => {
        return ({
            option: truncateAddress(holder[0]),
            style: { backgroundColor: colors[index], textColor: 'black' }
        });
    });


    const handleSpinClick = () => {
        const newPrizeNumber = Math.floor(Math.random() * selectedHolders.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
    };

    const select10Holders = (holders) => {
        if (holders.length >= 10) {
            const shuffled = [...holders].sort(() => 0.5 - Math.random());
            setSelectedHolders(shuffled.slice(0, 10));
        }
    }

    const runConfetti = () => {
        confetti({
            angle: 60,
            spread: 55,
            particleCount: 100,
            origin: { y: 0.6, x: 0 },
        });
        confetti({
            angle: 120,
            spread: 55,
            particleCount: 100,
            origin: { y: 0.6, x: 1 },
        });
    };

    const prizes = [
        [
            Coffee,
            'Cold Coffee',
            '$3',
            '1st December, 2023',
            'Fuelzone'
        ],
        [
            Bagel,
            'Chicken Bagel',
            '$4',
            '24th November, 2023',
            'Fuelzone'
        ],
        [
            Cake,
            'Chocolate Cake',
            '$3.5',
            '17th November, 2023',
            'Loco Moco'
        ],
        [
            Falafel,
            'Falafel Wrap',
            '$4.5',
            '10th November, 2023',
            'Loco Moco'
        ]
    ]



    useEffect(() => {
        if (typeof props.initData !== 'undefined') {
            setSelectedAccount(props.initData[0])
            // setUserBalanceETH(props.initData[1])
            // console.log('userBalanceETH: ', props.initData[1])
            setUserBalanceETH(props.initData[1] == '0.' ? 0 : props.initData[1])
            setUserBalanceASHONK(props.initData[2])
        }
        window.setTimeout(() => {
            getTransactions('0x4FbD1Ed20eB4B997Fc8cac477c7E15Cb326554dE')
        }, 1000)
    }, [props.initData])


    async function getTransactions(address) {
        const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${API_key}`;

        try {
            const response = await axios.get(url);
            setHolders(aggregateSentValues(response.data.result))

            let holdersArr = Object.entries(aggregateSentValues(response.data.result))
            setHoldersArray(holdersArr)

            select10Holders(holdersArr)

        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false)
        }
    }

    function aggregateSentValues(transactionsObject) {
        const aggregatedData = {};
        Object.values(transactionsObject).forEach(tx => {
            if (tx && tx.value) {
                // Convert value from wei to ETH, then to AshokaCoin
                const valueInEth = Web3.utils.fromWei(tx.value, 'ether');
                const valueInAshokaCoin = parseFloat(valueInEth) / 0.001; // 1 AshokaCoin = 0.001 ETH

                if (aggregatedData[tx.from]) {
                    // Add to existing total for this address
                    aggregatedData[tx.from] += valueInAshokaCoin;
                } else {
                    // Initialize total for this address
                    aggregatedData[tx.from] = valueInAshokaCoin;
                }
            }
        })
        return sortAccountsByAshokaCoin(aggregatedData);
    }

    function sortAccountsByAshokaCoin(transactionsObject) {
        // Convert the object into an array of [key, value] pairs
        let accountsArray = Object.entries(transactionsObject);

        // Sort the array based on the AshokaCoin balance
        accountsArray.sort((a, b) => b[1] - a[1]);

        // If you need the result as an object, convert it back
        let sortedTransactionsObject = {};
        accountsArray.forEach(item => {
            sortedTransactionsObject[item[0]] = item[1];
        });

        return sortedTransactionsObject;
    }

    return (
        <Grid.Container css={{
            jc: 'center'
        }}>
            <Col css={{
                display: 'flex',
                flexDirection: 'column',
                jc: 'center',
                alignItems: 'center',
                width: '100vw'
            }}>
                <Text css={{
                    fontSize: '$2xl',
                    fontWeight: '$semibold',
                    color: '#BE3144',
                    padding: '24px 0px 4px 0px',
                }}>
                    Spin The Wheel!
                </Text>

                <Text css={{
                    fontSize: '$base',
                    fontWeight: '$medium',
                    color: '$gray600',
                    padding: '4px 0px 24px 0px'
                }}>
                    Spin the wheel and get a chance to win amazin prizes around campus - if you hold an AshokaCoin that is!
                </Text>

            </Col>

            {loader ?
                <Grid css={{
                    jc: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    display: 'flex',
                    width: '100vw'
                }}>
                    <Loading size="lg" color={'error'} />
                </Grid>
                :
                <>
                    <Grid css={{
                        jc: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0px 24px'
                    }}>
                        {selectedHolders.length > 0 &&
                            <Wheel
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                data={data}
                                backgroundColors={['#3e3e3e', '#df3428']}
                                textColors={['#ffffff']}
                                onStopSpinning={() => {
                                    setMustSpin(false);
                                    // Handle the end of spin (e.g., announce the winner)
                                    console.log(prizeNumber)
                                    console.log(selectedHolders[prizeNumber])
                                    runConfetti()
                                    toast(`And the winner is ${truncateAddress(selectedHolders[prizeNumber][0])} 🎉`, {
                                        position: "bottom-center",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: false,
                                        pauseOnHover: false,
                                        draggable: false,
                                        progress: undefined,
                                        theme: "dark",
                                    });
                                }}
                            />

                        }
                        <Button flat color={'error'} css={{
                            background: 'rgba(240, 89, 65, 0.25)',
                            color: 'rgba(240, 89, 65, 1)',
                            margin: '8px 0px 48px 0px'
                        }}
                            onClick={() => {
                                handleSpinClick()
                            }}>
                            SPIN!!!
                        </Button>

                    </Grid>

                    <Grid css={{
                        jc: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '400px',
                        padding: '0px 24px'
                    }}>
                        <Collapse.Group splitted>
                            <Collapse title="How do I win?">
                                <Col>
                                    <Text css={{
                                        padding: '4px',
                                        fontWeight: '$medium'
                                    }}>
                                        1. We randomly choose 10 of our holders.
                                    </Text>
                                    <Text css={{
                                        padding: '4px',
                                        fontWeight: '$medium'
                                    }}>
                                        2. Spin the wheel
                                    </Text>
                                    <Text css={{
                                        padding: '4px',
                                        fontWeight: '$medium'
                                    }}>
                                        3. Whichever holder the wheel stops on wins!
                                    </Text>
                                    <Text css={{
                                        padding: '12px 4px',
                                        fontWeight: '$medium',
                                        textAlign: 'center'
                                    }}>
                                        It's that easy!
                                    </Text>

                                </Col>
                            </Collapse>
                        </Collapse.Group>
                    </Grid>
                </>
            }

            <ToastContainer />

            <Text css={{
                fontSize: '$2xl',
                fontWeight: '$semibold',
                color: '#BE3144',
                padding: '0px 0px 16px 0px',
                width: '100vw',
                textAlign: 'center'
            }}>
                Previous Prizes
            </Text>
            {prizes &&
                <Grid.Container css={{
                    jc: 'center',
                    alignItems: 'center',
                    paddingBottom: '36px'
                }}>
                    {prizes.map((prize, index) => (
                        <Grid css={{
                            padding: '24px'
                        }}>
                            <Card css={{ w: "300px", h: "400px" }}>
                                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                                    <Col>
                                        <Text size={12} weight="bold" transform="uppercase" css={{
                                            color: '$gray600'
                                        }}>
                                            Date
                                        </Text>
                                        <Text h4 color="black">
                                            {prize[3]}
                                        </Text>
                                    </Col>
                                </Card.Header>
                                <Card.Body css={{ p: 0 }}>
                                    <Card.Image
                                        src={prize[0]}
                                        width="100%"
                                        height="100%"
                                        objectFit="cover"
                                        alt="Card example background"
                                    />
                                </Card.Body>
                                <Card.Footer
                                    isBlurred
                                    css={{
                                        position: "absolute",
                                        bgBlur: "#ffffff66",
                                        borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                                        bottom: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <Row>
                                        <Col>
                                            <Text color="#000" size={16} css={{
                                                fontWeight: '$semibold'
                                            }}>
                                                {prize[1]}
                                            </Text>
                                            <Text color="#000" size={12}>
                                                {prize[4]}
                                            </Text>
                                        </Col>
                                        <Col>
                                            <Row justify="flex-end">
                                                <Button flat auto rounded color="error" >
                                                    <Text
                                                        css={{ color: "inherit" }}
                                                        size={12}
                                                        weight="bold"
                                                        transform="uppercase"
                                                    >
                                                        {prize[2]}
                                                    </Text>
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Grid>
                    ))}
                </Grid.Container>
            }

        </Grid.Container>
    );
}
