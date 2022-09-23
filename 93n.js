/******************************************************
Initialisation
Connect needs try catch in case user no metamask
*/
packs = {
  0: [100, 'Red Club', 1, 'bTNY7QpRPVqXa1t5274jwheJoSpLdyLtsXvxmFjqYj8Z'],
  1: [100, 'Green Club', 2, 'U71emqLVtMWFEzwF4Y8qrs3NGkppHEUmzvfQdq6RJbAp'],
  2: [100, 'Blue Club', 3, 'e81vMnLTDjmZdk56coC7GzjbvfYFbjhsYYzPFXuMfwC5'],
  3: [1000, 'Super', 180, 'RoT9FfySEH9oZSbW6G5ARMnm1oBPPPa56TxVZvby9Cxe'],
  4: [5000, 'Asset', 360, 'fAB1aLQbVx1vxo9mnaCF3GSEbYQZ25kDwt1dsWYJNDfq'],
};
CHAIN = 97;
A = [
  '0x57A1A22E31D2bc98B373885D2F73C459D9899172',
  '0x9B882c3fFCb41Ca2Fe1e1F2F63a58D333B81eB03',
  '0x8389DC8Cc460198703ee461160Acb51d36a25e63',
  '0x53F1F064473eA19012FdF577D30b77c880473328',
]; //721, 20, U, XC
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
  appr = await contract3.methods.allowance(acct, A[0]).call();
  if (appr < amt) await contract3.methods.approve(A[0], amt).send(FA);
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
    if (pa[1][i] < 3 && _lv < 2)
      str += `<input type=checkbox id=cb value=${pa[0][i]} onchange=checkCB()> `;
    str += `<a id=p${pa[0][i]} onclick=disPack(${pa[0][i]})>[${
      packs[pa[1][i]][1]
    } Node] <img src=https://ipfs.io/ipfs/Qm${
      packs[pa[1][i]][3]
    } width=25 height=25></a><br>`;
  }
  str +=
    _acct == acct
      ? ''
      : `<a onclick=loadEarnings("history","${_acct}")>[Earnings from this downline]</a>`;
  for (i = 0; i < dl[0].length; i++) {
    s = `<li>${dl[0][i]}</li>`;
    str +=
      _lv < 4
        ? `<a onclick=disUser("${dl[0][i]}",${nl})>${s}</a><ol id=lv${
            nl + dl[0][i]
          }></ol>`
        : s;
  }
  $('#lv' + _lv + (_acct == acct ? '' : _acct)).html(str);
}
/******************************************************
Display Package
Show the packages owned by downlines
*/
async function disPack(_pa, t) {
  $('#p' + _pa)
    .prop('onclick', null)
    .off('click');
  pa = await contract.methods.pack(_pa).call();
  mo = moment.unix(pa[3]).add(packs[pa[0]][2], 'd').format('YYYY-MM-DD');
  str = '';
  if (pa[0] == 3 || moment(new Date()).isAfter(moment(mo)))
    str += ` <button onclick=renew(${_pa},this)>Renew</button>`;
  $('#p' + _pa).html(
    `93N (Staked): ${(pa[1] / 1e18).toLocaleString('en-US')}, ${
      pa[0] > 2 ? `Expiry: ${mo}` : `Share: ${packs[pa[0]][2]}`
    }` + str
  );
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
Enable merge if the check comes back 10 or 50
*/
function checkCB() {
  a = [];
  $('input:checked').each(function () {
    a.push($(this).val());
  });
  $('#dMerge').attr(
    'disabled',
    a.length == 10 || a.length == 50 ? false : true
  );
}
/******************************************************
Merge function to merge only when 10 or 50 club are selected
*/
async function merge() {
  $('#dMerge').html('Merging...');
  await contract.methods.Merging(a).send(FA);
  $('#dMerge').html('Merged');
  checkCB();
}
/******************************************************
Renew super or asset that is expired
*/
async function renew(n, t) {
  $(t).html('Renewing...');
  await contract.methods.RenewSuperNode(n).send(FA);
  $(t).html('Renewed');
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
  apv = await p4.methods.allowance(acct, A[3]).call();
  amt = amt.toLocaleString('fullwide', {
    useGrouping: false,
  });
  if (apv < amt) await p4.methods.approve(A[3], amt).send(FA);
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
      A[0]
    );
  } else {
    alert('Please install Metamask');
    window.location.href = 'https://metamask.io/download/';
  }
  contract2 = new web3.eth.Contract([ubo, uap, ual], A[1]);
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
    A[2]
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
    A[3]
  );
  await disUSDT();
  $('#txtRB').html(_R());
}
