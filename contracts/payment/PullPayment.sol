pragma solidity ^0.4.11;


import '../SafeMath.sol';


/**
 * @title PullPayment
 * @dev Base contract supporting async send for pull payments. Inherit from this
 * contract and use asyncSend instead of send.
 */
contract PullPayment {
  using SafeMath for uint;

  mapping(address => uint) public payments;
  uint public totalPayments;

  /**
  * @dev Called by the payer to store the sent amount as credit to be pulled.
  * @param dest The destination address of the funds.
  * @param amount The amount to transfer.
  */
  function asyncSend(address dest, uint amount) internal {
    payments[dest] = payments[dest].add(amount);
    totalPayments = totalPayments.add(amount);
  }

  /**
  * @dev withdraw accumulated balance, called by payee.
  */
  function withdrawPayments() {
    address payee = msg.sender;
    uint payment = payments[payee];

    if (payment == 0) {
      throw;
    }

    if (this.balance < payment) {
      throw;
    }

    totalPayments = totalPayments.sub(payment);
    payments[payee] = 0;

    if (!payee.send(payment)) {
      throw;
    }
  }
}
