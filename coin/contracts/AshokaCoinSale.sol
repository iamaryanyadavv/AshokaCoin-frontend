// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./AshokaCoin.sol";

contract AshokaCoinSale {
    address admin;
    AshokaCoin public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer, 
        uint256 _amount
    );

    constructor(AshokaCoin _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
    
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint _numberOfTokens) public payable {

        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        //require that a transfer is succesful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;
        
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        // require only an admin
        require(msg.sender == admin);

        // // trasnfer remaining ashokacoin tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        address payable adrPayable = payable(admin);
        adrPayable.transfer(address(this).balance);
    }
}