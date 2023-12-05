import React from "react";
import { Col, Grid, Row, Text, Image } from "@nextui-org/react";
import Logo from '../assets/logo.png'

export default function ConnectWallet() {
    return (
        <Grid.Container css={{
            height: '100vh',
            backgroundColor: '#22092C',
            textAlign: 'center',
            jc: 'center',
            alignItems: 'center'
        }}>
            <Col css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Row css={{
                    width: 'max-content',
                    alignItems: 'center',
                    jc: 'center',
                    paddingBottom: '24px'
                }}>
                    <Text css={{
                        fontSize: '$4xl',
                        fontWeight: '$bold',
                        color: '#BE3144',
                        padding: '0px 12px'
                    }}>
                        Ashonk
                    </Text>
                    <Image css={{
                        width: '48px',
                        height: '48px'
                    }} src={Logo} />
                </Row>
                <Text css={{
                    fontSize: '$2xl',
                    fontWeight: '$semibold',
                    color: '#BE3144'
                }}>
                    Waiting for wallet connection...
                </Text>
                <Text css={{
                    fontWeight: '$semibold',
                    color: '#872341'
                }}>
                    Please install a Metamask wallet extension from your browser extensions market place.
                </Text>
                <Text css={{
                    fontWeight: '$semibold',
                    color: '#872341'
                }}>
                    And then reload website, connect wallet and viola!
                </Text>
            </Col>
        </Grid.Container>
    )
}