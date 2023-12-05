import React from "react";
import { Container, Row, Text, Link, Col } from "@nextui-org/react";

function Footer(){
    return(
        <Container fluid >
            <Col>
                <Row      
                css={{
                    jc: 'center',
                    textAlign: 'center',
                    alignItems: 'center',
                    borderStyle: 'solid',
                    borderColor: '#faf7ea',
                    borderWidth: '0px 0px 0px 0px'
                }}>
                    <Text hideIn={'xs'}
                    css={{
                        padding: '1% 0.35%',
                        fontSize: '$normal',
                        color: '#BE3144'
                    }}>
                        Made with ❤️ by
                    </Text>
                    <Text showIn={'xs'}
                    css={{
                        padding: '1%',
                        color: '#BE3144'
                    }}>
                        By
                    </Text>
                    <Link
                    css={{
                        color: '#3694ff'
                    }} target='_blank' href="https://aryanyadav.com/"
                    >
                        Aryan Yadav
                    </Link>
                    <Text hideIn={'xs'}
                    css={{
                        padding: '1% 0.35%',
                        color: '#BE3144'
                    }}>
                        and 
                    </Text>
                    <Text showIn={'xs'}
                    css={{
                        padding: '1%',
                        color: '#BE3144'
                    }}>
                        and 
                    </Text>
                    <Link 
                    css={{
                        color: '#3694ff'
                    }} target='_blank' href="https://github.com/sjd9021"
                    >
                        Samvit Jatia
                    </Link>
                </Row>
                <Text
                css={{
                    color: '$gray700',
                    jc: 'center',
                    textAlign: 'center',
                    padding: '4px 0px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(135, 35, 65, 0.5)',
                    borderWidth: '2px 0px 0px 0px',
                    '@xsMax':{
                        fontSize: '$xs'
                    }
                }}>
                    © 2023 AshokaCoin. All Rights Reserved
                </Text>
            </Col>
        </Container>
    )
}

export default Footer;