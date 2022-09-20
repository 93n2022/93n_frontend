/******************************************************
Initialisation
Connect needs try catch in case user no metamask
*/
packs = {
  0: [100, 'Red Club', 'bTNY7QpRPVqXa1t5274jwheJoSpLdyLtsXvxmFjqYj8Z'],
  1: [100, 'Green Club', 'U71emqLVtMWFEzwF4Y8qrs3NGkppHEUmzvfQdq6RJbAp'],
  2: [100, 'Blue Club', 'e81vMnLTDjmZdk56coC7GzjbvfYFbjhsYYzPFXuMfwC5'],
  3: [1000, 'Super', 'RoT9FfySEH9oZSbW6G5ARMnm1oBPPPa56TxVZvby9Cxe'],
  4: [5000, 'Asset', 'fAB1aLQbVx1vxo9mnaCF3GSEbYQZ25kDwt1dsWYJNDfq'],
};
CHAIN = 97;
CA = '0x57A1A22E31D2bc98B373885D2F73C459D9899172';
CA2 = '0x9B882c3fFCb41Ca2Fe1e1F2F63a58D333B81eB03';
USDT = '0x8389DC8Cc460198703ee461160Acb51d36a25e63';
SWAP = '0x53F1F064473eA19012FdF577D30b77c880473328';
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
uf = 'function';
un = 'nonpayable';
uv = 'view';
ubo = {
  inputs: [u3],
  name: 'balanceOf',
  outputs: [u1],
  stateMutability: uv,
  type: uf,
};
uap = {
  inputs: [u3, u1],
  name: 'approve',
  outputs: [],
  stateMutability: un,
  type: uf,
};
ual = {
  inputs: [u3, u3],
  name: 'allowance',
  outputs: [u1],
  stateMutability: uv,
  type: uf,
};
try {
  window.ethereum.on('accountsChanged', function (accounts) {
    connect();
  });
} catch (e) {}
/******************************************************
Deposit (stake in function)
*/
async function deposit() {
  v = $('#dNode').val();
  w = $('#dNum').val();
  oamt = packs[v][0] * w * 1e18;
  amt = oamt.toLocaleString('fullwide', { useGrouping: false });
  if (oamt > balUSDT) {
    $('#stakeBtn').html('Minting...');
    await contract3.methods.MINT(acct).send(FA);
    disUSDT();
    $('#stakeBtn').html(
      'Minted'
    ); /*REMOVE THIS IN DEPLOYMENT AND UNCOMMENT 2 LINES BELOW*/
    //$(this).html('Insufficient USDT');
    //return;
  }
  $('#stakeBtn').html('Approving...');
  appr = await contract3.methods.allowance(acct, CA).call();
  if (appr < amt) await contract3.methods.approve(CA, amt).send(FA);
  $('#stakeBtn').html('Minting...');
  await contract.methods.Purchase(_R(), v, w).send(FA);
  $('#stakeBtn').html('Minted Successfully');
  disUSDT();
}
/******************************************************
Update payment status
*/
async function disUSDT() {
  balUSDT = await contract3.methods.balanceOf(acct).call();
  $('#txtUSDT').html((balUSDT / 1e18).toLocaleString('en-US'));
  $('#txt93N').html((await LB()).toLocaleString('en-US'));
}
/******************************************************
Display User
Show the list of downlines
*/
async function disUser(_acct, _lv) {
  pa = await contract.methods.getNodes(_acct).call();
  dl = await contract.methods.getDownlines(_acct).call();
  nl = _lv + 1;
  str = '';
  for (i = 0; i < pa[0].length; i++) {
    if (pa[1][i] < 3)
      str += `<input type="checkbox" id="cb" value="pa[0][i]"> `;
    str += `<a id='p${pa[0][i]}'onclick='disPack(${pa[0][i]})'>[${pa[0][i]}]</a><br>`;
  }
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
/******************************************************
Display Package
Show the packages owned by downlines
*/
async function disPack(_pa) {
  pa = await contract.methods.pack(_pa).call();
  str = `93N (Staked): ` + (pa[1] / 1e18).toLocaleString('en-US');
  if (pa[0] > 2)
    str += `, Expiry: ${moment
      .unix(pa[3])
      .add(pa[0] < 4 ? 180 : 360, 'd')
      .format('D-MMM-YY')}`;
  $('#p' + _pa).html(str);
}
/******************************************************
Display all user's earning history
*/
async function loadEarnings(p1, p2) {
  p1 = '#' + p1;
  $(p1).html('Fetching...');
  f = p2 == '' ? { to: acct } : { to: acct, from: p2 };
  arr = [0, 0, 0];
  await contract
    .getPastEvents('Payout', {
      filter: f,
      fromBlock: /*'earliest'*/ (await web3.eth.getBlockNumber()) - 4999,
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
      $(p1).html(str);
    });
}
/******************************************************
Stake to credit in all profit
Anyone can active for everyone
*/
async function stake() {
  $('#withBtn').html('Withdrawing...');
  await contract.methods.Withdraw().send(FA);
  $('#withBtn').html('Withdrawn');
}
/******************************************************
SWAP FUNCTION
Update the live price per key up
*/
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
/******************************************************
SWAP FUNCTION
Exchange based on the accepted price
*/
async function xc(p1, p2, p3, p4) {
  $('#status').html('Approving...');
  amt = $('#amt' + p3).val() * 1e18;
  apv = await p4.methods.allowance(acct, SWAP).call();
  amt = amt.toLocaleString('fullwide', {
    useGrouping: false,
  });
  if (apv < amt) await p4.methods.approve(SWAP, amt).send(FA);
  $('#status').html('Swaping...');
  await contract4.methods.exchange(amt, p1, p2).send(FA);
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
/******************************************************
Get 93N token
*/
async function LB() {
  return (await contract2.methods.balanceOf(acct).call()) / 1e18;
}
/******************************************************
Base wallet function
With ABI
*/
async function connect() {
  if (typeof ethereum != 'undefined') {
    web3 = new Web3(ethereum);
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    acct = acct[0];
    FA = { from: acct };
    if ((await web3.eth.net.getId()) != CHAIN) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CHAIN.toString(16) }],
      });
    }
    contract = new web3.eth.Contract(
      [
        {
          inputs: [u2],
          name: 'Merging',
          outputs: [],
          stateMutability: un,
          type: uf,
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: ub,
              name: 'from',
              type: ub,
            },
            {
              indexed: true,
              internalType: ub,
              name: 'to',
              type: ub,
            },
            {
              indexed: false,
              internalType: ua,
              name: 'amount',
              type: ua,
            },
            {
              indexed: true,
              internalType: ua,
              name: 'status',
              type: ua,
            },
          ],
          name: 'Payout',
          type: 'event',
        },
        {
          inputs: [u3, u1, u1],
          name: 'Purchase',
          outputs: [],
          stateMutability: un,
          type: uf,
        },
        {
          inputs: [u1],
          name: 'RenewSuperNode',
          outputs: [],
          stateMutability: un,
          type: uf,
        },
        {
          inputs: [],
          name: 'Withdraw',
          outputs: [],
          stateMutability: un,
          type: uf,
        },
        {
          inputs: [u3],
          name: 'getDownlines',
          outputs: [u4, u1, u1],
          stateMutability: uv,
          type: uf,
        },
        {
          inputs: [u3],
          name: 'getNodes',
          outputs: [u2, u2],
          stateMutability: uv,
          type: 'function',
        },
        {
          inputs: [u1],
          name: 'pack',
          outputs: [u1, u1, u1, u1, u3],
          stateMutability: uv,
          type: uf,
        },
      ],
      CA
    );
  } else {
    alert('Please install Metamask');
    window.location.href = 'https://metamask.io/download/';
  }
  contract2 = new web3.eth.Contract([ubo, uap, ual], CA2);
  contract3 = new web3.eth.Contract(
    [
      ubo,
      uap,
      ual,
      {
        inputs: [u3],
        name: 'MINT',
        outputs: [],
        stateMutability: un,
        type: uf,
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
        stateMutability: un,
        type: uf,
      },
      {
        inputs: [u1, u3, u3],
        name: 'getAmountsOut',
        outputs: [u1],
        stateMutability: uv,
        type: uf,
      },
    ],
    SWAP
  );
  await disUSDT();
  $('#txtRB').html(_R());
}
