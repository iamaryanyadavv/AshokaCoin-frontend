// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AshokaCoin {

    string public name = "AshokaCoin";
    string public symbol = "Ashonk";
    string public standard = "AshokaCoin v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    //Constructor
    constructor(uint256 _initialSupply) public {

        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply; // 5 million
        // allocate the initial supply
    }

    //Set total tokens
    //Read total tokens

    // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // exception if account doesn't have enough
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value; //deducting from account
        balanceOf[_to] += _value; //adding to other's account
        // transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // Approve
    function approve(address _spender, uint256 _value) public returns (bool success){
        // allownace
        allowance[msg.sender][_spender] = _value;
        
        // approval event
        emit Approval(msg.sender, _spender, _value);
        
        return true;
    }

    // Transfer From
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        // Require _from has enough tokens
        require(_value <= balanceOf[_from] );

        // Require allownace is big enough 
        require(_value <= allowance[_from][msg.sender]);

        // Change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update the balance
        allowance[_from][msg.sender] -= _value;

        // Transfer event
        emit Transfer(_from, _to, _value);
        
        // return a boolean
        return true;
    }

}