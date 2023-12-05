import React from "react";
import "./header.css";
import { Navbar, Link, Image, Popover, Text } from "@nextui-org/react";
import Logo from '../../assets/logo.png'
import Bitcoin from '../../assets/bitcoin.png'
import Github from '../../assets/github.png'

function Header() {

    const items = [
        { name: 'Ashonk', href: '/' },
        { name: 'Raffle', href: '/raffle' },
        { name: 'Holders', href: '/holders' },
    ]

    var active = window.location.pathname

    return (
        <Navbar className="navbar" variant="static" shouldHideOnScroll={false}>
            <Navbar.Toggle color="inherit" showIn="sm" />
            <Navbar.Brand hideIn="sm" css={{ '&:hover': { transform: 'scale(1)' } }}>
                <Image css={{
                    width: '40px',
                    height: '40px',
                    transitionDuration: '0.5s',
                    transitionProperty: 'transform',
                    '&:hover': {
                        cursor: 'pointer',
                        transform: 'rotate(360deg)',
                    }
                }} src={Logo}
                    onClick={() => {
                        window.location.pathname = ''
                    }} />
                <Text css={{
                    color: '#BE3144',
                    fontWeight: '$bold',
                    fontSize: '$xl',
                    paddingLeft: '4px'
                }}>
                    AshokaCoin
                </Text>
            </Navbar.Brand>

            <Navbar.Content hideIn="sm" variant="highlight-rounded">
                {items.map((item, index) => {
                    return (
                        <Navbar.Link key={index} isActive={item.href === active.substring(0, item.href.length + 1)} href={item.href}
                            css={{
                                // fontFamily: 'MEregular'
                            }}>
                            {item.name}
                        </Navbar.Link>
                    )
                })}

            </Navbar.Content>

            <Navbar.Content showIn={'sm'}>
                <Image css={{
                    width: '40px',
                    height: '40px'
                }} src={Logo} />
            </Navbar.Content>

            <Navbar.Content hideIn={'sm'}>
                <Link target="_blank" href="https://bitcoin.org/en/">
                    <Image css={{
                        width: '40px',
                        height: '40px',
                        marginLeft: '43px'
                    }} src={Bitcoin} />
                </Link>
                <Link target="_blank" href="https://github.com/iamaryanyadavv/AshokaCoin/tree/main">
                    <Image css={{
                        width: '40px',
                        height: '40px',
                    }} src={Github} />
                </Link>
            </Navbar.Content>

            <Navbar.Content showIn={'sm'}>
                <Link target="_blank" href="https://github.com/iamaryanyadavv/AshokaCoin/tree/main">
                    <Image css={{
                        width: '40px',
                        height: '40px'
                    }} src={Github} />
                </Link>
            </Navbar.Content>


            <Navbar.Collapse showIn={"sm"}>
                {items.map((item, index) => {
                    return (
                        <Navbar.CollapseItem key={index} isActive={item.href === active.substring(0, item.href.length + 1)}>
                            <Link href={item.href}
                                css={{
                                    minWidth: "100%",
                                }}
                            >
                                {item.name}
                            </Link>
                        </Navbar.CollapseItem>)
                })}

            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;