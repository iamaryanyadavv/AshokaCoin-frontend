import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Button, Grid, Loading, Table, Text } from "@nextui-org/react";
import { Web3 } from 'web3'
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Holders(props) {
    const [userBalanceETH, setUserBalanceETH] = useState();
    const [userBalanceASHONK, setUserBalanceASHONK] = useState();
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [holders, setHolders] = useState({})
    const [holdersArray, setHoldersArray] = useState([])
    const [pieChartLabels, setPieChartLabels] = useState(null)
    const [pieChartData, setPieChartData] = useState(null)
    const [loader, setLoader] = useState(true)

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
              display: false,
            },
          },
        // You can add more options here
    };

    const pieChartConfig = {
        labels: pieChartLabels,
        datasets: [{
            label: 'AshokaCoin Holdings',
            data: pieChartData,
            backgroundColor: [
                // Pastel colors complementing your website palette
                '#F8B88B', // Light Coral
                '#FAE3D9', // Blush Pink
                '#BFD8D2', // Powder Blue
                '#F5CAC3', // Peach Puff
                '#F6BD60', // Mellow Yellow
                '#84A59D', // Faded Jade
                '#F28482'  // Light Red
            ],
        }],
    };


    // console.log(process.env.REACT_APP_ETEHRSCAN_APIKEY)
    const API_key = process.env.REACT_APP_ETEHRSCAN_APIKEY
    const SaleAddress = process.env.REACT_APP_SALE_CONTRACT_ADDRESS

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

            // Extract data for pie chart
            let pieChartLs = holdersArr.map(account => account[0]);
            setPieChartLabels(pieChartLs)

            let pieChartD = holdersArr.map(account => account[1]);
            setPieChartData(pieChartD)

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
            jc: 'center',
            alignItems: 'start',
            height: '80vh'
        }}>
            <Text css={{
                fontSize: '$2xl',
                fontWeight: '$semibold',
                color: '#BE3144',
                padding: '24px 0px',
                width: '100vw',
                textAlign: 'center'
            }}>
                All ASHONK Holders
            </Text>

            {loader ?
                <Grid css={{
                    jc: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    display: 'flex',
                }}>
                    <Loading size="lg" color={'error'} />
                </Grid>
                :
                <>
                    {pieChartData !== null && pieChartLabels !== null &&
                        <Grid css={{
                            jc: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px 36px',
                        }}>
                            <Text css={{
                                fontSize: '$lg',
                                fontWeight: '$semibold',
                                color: '#BE3144',
                                padding: '12px 0px'
                            }}>
                                Pie Chart
                            </Text>
                            <Pie data={pieChartConfig} options={pieChartOptions} />
                        </Grid>
                    }

                    {holdersArray.length > 0 &&
                        <Grid css={{
                            jc: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px 36px'
                        }}>
                            <Text css={{
                                fontSize: '$lg',
                                fontWeight: '$semibold',
                                color: '#BE3144',
                                padding: '12px 0px'
                            }}>
                                Listings
                            </Text>
                            <Table bordered={true}
                                aria-label="Players Leaderboard"
                                lined
                                css={{
                                    height: "auto",
                                    minWidth: "100%",
                                }}>
                                <Table.Header>
                                    <Table.Column css={{ paddingRight: '8px', textAlign: 'start' }}>Rank</Table.Column>
                                    <Table.Column css={{ paddingRight: '8px', textAlign: 'center' }}>Address</Table.Column>
                                    <Table.Column css={{ paddingRight: '8px', textAlign: 'center' }}>AshokaCoin</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {holdersArray.map((account, index) => {
                                        if (index < 5) { // Assuming you want to display the top 10
                                            return (
                                                <Table.Row key={account[0]}>
                                                    <Table.Cell css={{ textAlign: 'center', }}>
                                                        <Text>
                                                            {index + 1}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell css={{ textAlign: 'center', }}>
                                                        <Text css={{
                                                            width: '200px',
                                                            whiteSpace: 'nowrap',
                                                            textOverflow: 'ellipsis',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {account[0]}
                                                        </Text>
                                                    </Table.Cell>
                                                    <Table.Cell css={{ textAlign: 'center' }}>
                                                        <Text>
                                                            {account[1].toFixed(0)}
                                                        </Text>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        }
                                        return null; // Important to return null for elements you don't want to render
                                    })}
                                </Table.Body>
                            </Table>
                        </Grid>
                    }
                </>
            }



        </Grid.Container>
    )
}