/***
Initialisation
Connect needs try catch in case user no metamask
***/
CHAIN = 97;
CA = '0xBA020394f6d1D7810B3eA2B731aC4b5b5114AE43';
CA2 = '0xc6369abCa42d3fD38ecb316E4C2C46015d64550b';
USDT = '0x0174Df7DFc9398D6A30E5269D942DEEfF793e17E';
SWAP = '0x67d068df42Fa68AD9Dec643adEbC0d0318CEF08E';
u0 = '[]';
ua = 'uint256';
u1 = { internalType: ua, name: '', type: ua };
u2 = { internalType: ua + u0, name: '', type: ua + u0 };
ub = 'address';
u3 = { internalType: ub, name: '', type: ub };
u4 = { internalType: ub + u0, name: '', type: ub + u0 };
uc = 'string';
u5 = { internalType: uc, name: '', type: uc };
u6 = { internalType: uc + u0, name: '', type: uc + u0 };
try {
  window.ethereum.on('accountsChanged', function (accounts) {
    connect();
  });
} catch (e) {}
/***
Deposit (stake in function)
***/
async function deposit() {
  oamt = $('#samt').val() * $('#num').val() * 1e18;
  amt = oamt.toLocaleString('fullwide', { useGrouping: false });
  if (oamt > balUSDT) {
    $('#stakeBtn').html('Minting...');
    await contract3.methods.MINT(acct).send({ from: acct });
    disUSDT();
    $('#stakeBtn').html(
      'Minted'
    ); /*REMOVE THIS IN DEPLOYMENT AND UNCOMMENT 2 LINES BELOW*/
    //$(this).html('Insufficient USDT');
    //return;
  }
  $('#stakeBtn').html('Approving...');
  appr = await contract3.methods.allowance(acct, CA).call();
  if (appr < amt) await contract3.methods.approve(CA, amt).send({ from: acct });
  $('#stakeBtn').html('Staking...');
  await contract.methods
    .Deposit(_R(), amt, $('#months').val())
    .send({ from: acct });
  $('#stakeBtn').html('Staked Successfully');
  disUSDT();
}
/***
Update payment status
***/
async function disUSDT() {
  balUSDT = await contract3.methods.balanceOf(acct).call();
  $('#txtUSDT').html((balUSDT / 1e18).toLocaleString('en-US'));
  $('#txt93N').html((await LB()).toLocaleString('en-US'));
}
/***
Display User
Show the list of downlines
***/
async function disUser(_acct, _lv) {
  pa = await contract.methods.getUserPackages(_acct).call({ from: acct });
  dl = await contract.methods.getDownlines(_acct).call({ from: acct });
  nl = _lv + 1;
  str = '';
  for (i = 0; i < pa.length; i++)
    str += `<a id='p${pa[i]}'onclick='disPack(${pa[i]})'>[${pa[i]}]</a><br>`;
  str +=
    _acct == acct
      ? ''
      : `<a onclick='loadEarnings("history","${_acct}")'>[Earnings from this downline]</a>`;
  for (i = 0; i < dl[0].length; i++) {
    s = `<li>${dl[0][i]}</li>`;
    str +=
      _lv < 4
        ? `<a onclick='disUser("${dl[0][i]}",${nl})'>${s}</a><ol id="lv${
            nl + dl[0][i]
          }"></ol>`
        : s;
  }
  $('#lv' + _lv + (_acct == acct ? '' : _acct)).html(str);
}
/***
Display Package
Show the packages owned by downlines
***/
async function disPack(_pa) {
  pa = await contract.methods.Pack(_pa).call();
  $('#p' + _pa).html(
    `[Deposited: ${(pa[1] / 1e18).toLocaleString('en-US')}, Expiry: ${moment
      .unix(pa[4])
      .add(pa[5], 'M')
      .format('D-MMM-YY')}] `
  );
  $('#p' + _pa).addClass('text');
}
/***
Display all user's earning history
***/
async function loadEarnings(p1, p2) {
  f = p2 == '' ? { to: acct } : { to: acct, from: p2 };
  arr = [0, 0, 0];
  await contract
    .getPastEvents('Payout', {
      filter: f,
      fromBlock: (await web3.eth.getBlockNumber()) - 4999,
      toBlock: 'latest',
    })
    .then((events) => {
      str = '';
      events.forEach((event) => {
        e = event.returnValues;
        if (p2 == '')
          str += `${e.from.toUpperCase()} - ${
            e.status > 1
              ? '93N Bonus'
              : e.status > 0
              ? '93N Staking'
              : 'USDT deposit'
          }: ${e.amount / 1e18}&#10;`;
        else arr[e.status] += Number(e.amount);
      });
      if (p2 != '')
        for (i = 0; i < arr.length; i++)
          str += `${e.from.toUpperCase()} - ${
            i > 1 ? '93N Bonus' : i > 0 ? '93N Staking' : 'USDT deposit'
          }: ${arr[i] / 1e18}&#10;`;
      $('#' + p1).html(str);
    });
}
/***
Stake to credit in all profit
Anyone can active for everyone
***/
async function stake() {
  $('#withBtn').html('Withdrawing...');
  await contract.methods.Staking().send({ from: acct });
  $('#withBtn').html('Withdrawn');
}
/***
SWAP FUNCTION
Update the live price per key up
***/
async function getPrice(p1, p2, p3) {
  $('#xc' + p3).html(
    (await contract4.methods
      .getAmountsOut(
        ($('#amt' + p3).val() * 1e18).toLocaleString('fullwide', {
          useGrouping: false,
        }),
        p1,
        p2
      )
      .call()) / 1e18
  );
}
/***
SWAP FUNCTION
Exchange based on the accepted price
***/
async function xc(p1, p2, p3, p4) {
  $('#status').html('Approving...');
  amt = $('#amt' + p3).val() * 1e18;
  apv = await p4.methods.allowance(acct, SWAP).call();
  amt = amt.toLocaleString('fullwide', {
    useGrouping: false,
  });
  if (apv < amt) await p4.methods.approve(SWAP, amt).send({ from: acct });
  $('#status').html('Swaping...');
  await contract4.methods.exchange(amt, p1, p2).send({ from: acct });
  $('#status').html('Swapped');
  $('#amt' + p3).val('');
  $('#xc' + p3).html('0');
  disUSDT();
}
/***
Get referral link
***/
function _R() {
  _s = location.hash.substring(1).toLowerCase();
  return _s.length > 1 && _s != acct.toLowerCase()
    ? _s
    : '0x0000000000000000000000000000000000000000';
}
/***
Get 93N token
***/
async function LB() {
  return (await contract2.methods.balanceOf(acct).call()) / 1e18;
}
/***
Base wallet function
With ABI
***/
async function connect() {
  if (typeof ethereum != 'undefined') {
    web3 = new Web3(ethereum);
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    acct = acct[0];
    if ((await web3.eth.net.getId()) != CHAIN) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CHAIN.toString(16) }],
      });
    }
    contract = new web3.eth.Contract(
      [
        {
          inputs: [u3, u1, u1],
          name: 'Deposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'status',
              type: 'uint256',
            },
          ],
          name: 'Payout',
          type: 'event',
        },
        {
          inputs: [],
          name: 'Staking',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [u3],
          name: 'getDownlines',
          outputs: [u4, u1, u1],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [u3],
          name: 'getUserPackages',
          outputs: [u2],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [u1],
          name: 'Pack',
          outputs: [u1, u1, u1, u1, u1, u1, u3],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      CA
    );
  } else {
    alert('Please install Metamask');
    window.location.href = 'https://metamask.io/download/';
  }
  contract2 = new web3.eth.Contract(
    [
      {
        inputs: [u3],
        name: 'balanceOf',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [u3, u1],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [u3, u3],
        name: 'allowance',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    CA2
  );
  contract3 = new web3.eth.Contract(
    [
      {
        inputs: [u3],
        name: 'balanceOf',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [u3, u1],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [u3],
        name: 'MINT',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [u3, u3],
        name: 'allowance',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    USDT
  );
  contract4 = new web3.eth.Contract(
    [
      {
        inputs: [u1, u3, u3],
        name: 'exchange',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [u1, u3, u3],
        name: 'getAmountsOut',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    SWAP
  );
  await disUSDT();
  $('#txtRB').html(_R());
}
