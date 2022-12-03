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
  5: [1000, 'Aleo', 360, 'RgVwwnCQgDw7hyaffWAiycaaioV4117FmaiJCcUX5wfe']
};
CHAIN = 97;
A = [
  '0x6a1395154006ca473996506e4D7732273b23395e', 
  '0x03c0085c8f8Fcd05fC13a5813a87B8E4C1685e1f',
  '0x3bbD89f7c4E568404B98F5c131fC197A198A9Cc4',
  '0x6E58117CD17e38280822F22cA15E469b19Cb50ea'
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
node = 0;
na = '0x0000000000000000000000000000000000000000';
try {
  window.ethereum.on('accountsChanged', function (accounts) {
    connect();
  });
} catch (e) {}
/******************************************************
Click on the image and will become selected
*/
function setNode(n) {
  node = n < 1 || n > 5 ? 0 : n;
  for (i = 0; i < 6; i++) $('#n' + i).css('background-color', 'white');
  $('#n' + n).css('background-color', 'grey');
}
/******************************************************
Deposit (stake in function)
*/
async function deposit() {
  w = $('#dNum').val();
  oamt = packs[node][0] * w * 1e18;
  amt = oamt.toLocaleString('fullwide', { useGrouping: false });
  if (oamt > balUSDT) {
    $('#stakeBtn').html('Insufficient BUSD');
    return;
  }
  $('#stakeBtn').html('Approving...');
  appr = await contract3.methods.allowance(acct, A[0]).call();
  if (appr < oamt) await contract3.methods.approve(A[0], amt).send(FA);
  $('#stakeBtn').html('Minting...');
  await contract.methods.purchase(ref, node, w).send(FA);
  $('#stakeBtn').html('Minted Successfully');
  disUSDT();
  $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
  $.ajax({
    url: '/addwallet',
    type: 'post',
    data: {
        'amount': w,
        'node': node,
        'myrefaddress': ref,
        'check':1,
    }
  })
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
  bl = _lv - 1;      
  
  $('#rw'+_lv).remove(); 
  $('#rw'+nl).remove();

    if(_lv == 1){
          $('#alldownline').empty();  
          
            $('#alldownline').css('width', '100%');
            $('#alldownline').css('display', 'inline-table');
            $('#alldownline').css('width', '100%');
            
            $('#alldownline').append('<tr id="rh" style="background-color:#BF1D2D;color:white">');
            $('#rh').append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="hd1"');
            $('#rh').append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="hd2"');
            $('#rh').append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="hd3"');
            $('#rh').append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="hd4"');
            $('#hd1').html('Lv');
            $('#hd2').html('Node');
            $('#hd3').html('Address');
            $('#hd4').html('Earnings');
    
    }

    $('#alldownline').append('<tr id="rw'+_lv+'">');
    $('#rw'+_lv).append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="r'+_lv+'c1">');
    $('#rw'+_lv).append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="r'+_lv+'c2">');
    $('#rw'+_lv).append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="r'+_lv+'c3">');
    $('#rw'+_lv).append('<td style="border:solid 1px black;padding:10px 15px 10px 15px" id="r'+_lv+'c4">');
    
    $('#r'+_lv+'c1').html(_lv);
  
  str = '';
  for (i = 0; i < pa[0].length; i++) {
    if (pa[1][i] < 3 && _lv < 2)
      str += `<input type=checkbox id=cb value=${pa[0][i]} onchange=checkCB()> `;
    str += `<a id=p${pa[0][i]} onclick=disPack(${pa[0][i]})>[${
      packs[pa[1][i]][1]
    } Node] <img src=https://ipfs.io/ipfs/Qm${
      packs[pa[1][i]][3]
    } width=60 height=60></a><br>`;
    
  }
  
  $('#r'+_lv+'c2').html(str);
  
  str2 = '';
  str2 +=
    _acct == acct
      ? ''
      : `<a onclick=loadEarnings("history","${_acct}")>[Earnings from this downline]</a>`;
  $('#r'+bl+'c4').html(str2);   
  
  str3 = '';      
  for (i = 0; i < dl[0].length; i++) {
    s = `<li>${dl[0][i]}</li>`;
    str3 +=
      _lv < 4
        ? `<a onclick=disUser("${dl[0][i]}",${nl})>${s}</a>`
        : s;
  }
  $('#r'+_lv+'c3').html(str3);
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
              : 'BUSD deposit'
          }: ${e.amount / 1e18}&#10;`;
        else arr[e.status] += Number(e.amount);
      });
      if (p2 != '')
        for (i = 0; i < arr.length; i++)
          str += `${e.from.toUpperCase()} - ${
            i > 1 ? '93N Bonus' : i > 0 ? '93N Staking' : 'BUSD deposit'
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
  await contract.methods.withdraw().send(FA);
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
  await contract.methods.merging(a).send(FA);
  $('#dMerge').html('Merged');
  checkCB();
}
/******************************************************
Renew super or asset that is expired
*/
async function renew(n, t) {
  $(t).html('Renewing...');
  await contract.methods.renewSuperNode(n).send(FA);
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
  amt = ($('#amt' + p3).val() * 1e18).toLocaleString('fullwide', {
    useGrouping: false,
  });
  apv = await p4.methods.allowance(acct, A[3]).call();
  if (apv < amt) await p4.methods.approve(A[3], amt).send(FA);
  $('#status').html('Swaping...');
  await contract4.methods.exchange(amt, p1, p2).send(FA);
  $('#status').html('Swapped');
  $('#amt' + p3).val('');
  $('#xc' + p3).html('0');
  disUSDT();
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
    /*await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
      chainId: '0x38',
      chainName: 'Binance Smart Chain Mainnet',
      nativeCurrency: {
          name: 'Binance Coin',
          symbol: 'BNB',
          decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed1.binance.org'],
      blockExplorerUrls: ['https://bscscan.com']
      }]
    });*/
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    acct = acct[0];
    FA = { from: acct };
    /*if ((await web3.eth.net.getId()) != CHAIN) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CHAIN.toString(16) }],
      });
    }*/
    contract = new web3.eth.Contract(
      [
        {
          inputs: [u2],
          name: 'merging',
          outputs: [],
          stateMutability: un,
          type: uf
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: ub,
              name: 'from',
              type: ub
            },
            {
              indexed: true,
              internalType: ub,
              name: 'to',
              type: ub
            },
            {
              indexed: false,
              internalType: ua,
              name: 'amount',
              type: ua
            },
            {
              indexed: true,
              internalType: ua,
              name: 'status',
              type: ua
            },
          ],
          name: 'Payout',
          type: 'event'
        },
        {
          inputs: [u3, u1, u1],
          name: 'purchase',
          outputs: [],
          stateMutability: un,
          type: uf
        },
        {
          inputs: [u1],
          name: 'renew',
          outputs: [],
          stateMutability: un,
          type: uf
        },
        {
          inputs: [],
          name: 'withdraw',
          outputs: [],
          stateMutability: un,
          type: uf
        },
        {
          inputs: [u3],
          name: 'getDownlines',
          outputs: [u4, u1, u1],
          stateMutability: uv,
          type: uf
        },
        {
          inputs: [u3],
          name: 'getNodes',
          outputs: [u2, u2],
          stateMutability: uv,
          type: uf
        },
        {
          inputs: [u1],
          name: 'pack',
          outputs: [u1, u1, u1, u1, u3],
          stateMutability: uv,
          type: uf
        },
        {
          inputs: [u3],
          name: 'user',
          outputs: [u3],
          stateMutability: uv,
          type: uf
        }
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
        type: uf
      }
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
        type: uf
      },
      {
        inputs: [u1, u3, u3],
        name: 'getAmountsOut',
        outputs: [u1],
        stateMutability: uv,
        type: uf
      }
    ],
    A[3]
  );
  await disUSDT();
  _s = location.hash.substring(1).toLowerCase();
  _s2 = await contract.methods.user(acct).call();
  ref = _s2 != na ? _s2 : _s.length > 1 && _s != acct.toLowerCase() ? _s : na;
  $('#txtRB').html(ref);
  $('#ref').html(location.href.replace(location.hash,'')+'?#'+acct);

  pa = await contract.methods.getNodes(acct).call();
  cn_count = sn_count = an_count = msn_count = 0;
  for (i = 0; i < pa[0].length; i++) {
    if (pa[1][i] < 3) cn_count++;
    else if (pa[1][i] < 4) sn_count++;
    else if (pa[1][i] < 5) an_count++;
    else msn_count++;
    $('#alldownline tr:last').
      after(`<tr><td>${pa[0][i]}</td>
      <td>${packs[pa[1][i]][1]}</td>
      <td>${acct}</td>
      <td>1</td>
      <td>1</td>
      </tr>`);
  }
}
