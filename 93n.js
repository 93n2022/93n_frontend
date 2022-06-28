CHAIN = 4;
CA = '0xb7b68363e329e56a5159C978B899c86B3d7303EA';
CA2 = '0x3Dd793f919bf90c4B449DCdEdc650B970F8d9719';
USDT = '0x8600D030567d4dfA34bB18F650675Df86dC41993';
SWAP = '0xeDE87e8D824aFb897d01B8e40D9A24Df4Db60efB';
_LJS(0);
async function display() {
  $('#txtRB').html(_R());
  $('#txtRef').val(acct);
  $('#root').show();
  $('#connect').hide();
}
async function deposit() {
  oamt = $('#num').val() * 1e22;
  amt = oamt.toLocaleString('fullwide', { useGrouping: false });
  if (oamt > balUSDT) {
    claim(); /*REMOVE THIS IN DEPLOYMENT*/
    //$('#status').html('Insufficient USDT');
    //return;
  }
  $('#status').html('Approving...');
  await contract3.methods.approve(CA, amt).send(FA);
  $('#status').html('Depositing...');
  await contract.methods.Deposit(_R(), amt, $('#months').val()).send(FA);
  $('#status').html('Deposited Successfully');
  disUSDT();
}
async function claim() {
  $('#status').html('Minting...');
  await contract3.methods.MINT(acct).send(FA);
  disUSDT();
  $('#status').html('Minted');
}
async function disUSDT() {
  $('#txtUSDT').html(
    ((await contract3.methods.balanceOf(acct).call()) / 1e18).toLocaleString(
      'en-US'
    )
  );
  $('#txt93N').html((await LB()).toLocaleString('en-US'));
}
async function disUser(_acct, _lv) {
  pa = await contract.methods.getUserPackages(_acct).call();
  dl = await contract.methods.getDownlines(_acct).call();
  nl = _lv + 1;
  str = '';
  for (i = 0; i < pa.length; i++)
    str += `<a id='p${pa[i]}'onclick='disPack(${pa[i]})'>[${pa[i]}]</a> `;
  str +=
    _acct == acct
      ? ''
      : `<a onclick='loadEarnings("history","${_acct}")'>[Load earnings]</a>`;
  for (i = 0; i < dl[0].length; i++) {
    s = `<li>${dl[0][i].toUpperCase()}</li>`;
    str +=
      _lv < 4
        ? `<a onclick='disUser("${dl[0][i]}",${nl})'>${s}</a><ol id="lv${
            nl + dl[0][i]
          }"></ol>`
        : s;
  }
  $('#lv' + _lv + (_acct == acct ? '' : _acct)).html(str);
}
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
async function loadEarnings(p1, p2) {
  f = p2 == '' ? { to: acct } : { to: acct, from: p2 };
  arr = [0, 0, 0];
  await contract
    .getPastEvents('Payout', {
      filter: f,
      fromBlock: 0,
      toBlock: 'latest',
    })
    .then((events) => {
      str = '';
      events.forEach((event) => {
        e = event.returnValues;
        if (p2 == '')
          str += `<li>${e.from.toUpperCase()} - ${
            e.status > 1
              ? '93N Bonus'
              : e.status > 0
              ? '93N Staking'
              : 'USDT deposit'
          }: ${(e.amount / 1e18).toLocaleString('en-US')}</li>`;
        else arr[e.status] += Number(e.amount);
      });
      if (p2 != '')
        for (i = 0; i < arr.length; i++)
          str += `<li>${e.from.toUpperCase()} - ${
            i > 1 ? '93N Bonus' : i > 0 ? '93N Staking' : 'USDT deposit'
          }: ${(arr[i] / 1e18).toLocaleString('en-US')}</li>`;
      $('#' + p1).html(str);
    });
}
async function stake() {
  $('#status').html('Staking...');
  await contract.methods.Staking().send(FA);
  $('#status').html('Done');
}
async function getPrice(p1, p2, p3) {
  $('#xc' + p3).html(
    (await contract4.methods
      .getPrice(
        p1,
        p2,
        ($('#amt' + p3).val() * 1e18).toLocaleString('fullwide', {
          useGrouping: false,
        })
      )
      .call()) / 1e18
  );
}
async function xc(p1, p2, p3, p4) {
  $('#status').html('Approving...');
  amt = $('#amt' + p3).val() * 1e18;
  apv = await p4.methods.allowance(acct, SWAP).call();
  amt = amt.toLocaleString('fullwide', {
    useGrouping: false,
  });
  if (apv < amt) await p4.methods.approve(SWAP, amt).send(FA);
  $('#status').html('Swaping...');
  await contract4.methods.exchange(p1, p2, amt).send(FA);
  $('#status').html('Swapped');
  $('#amt' + p3).val('');
  $('#xc' + p3).html('0');
  disUSDT();
}
window.ethereum.on('accountsChanged', function (accounts) {
  connect();
});

async function connect() {
  await load(
    [
      {
        inputs: [],
        name: 'Cleanup',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
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
        inputs: [u1],
        name: 'SetSplit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
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
  await load2();
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
        inputs: [u3, u3, u1],
        name: 'exchange',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [u3, u3, u1],
        name: 'getPrice',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [u3, u3, u1],
        name: 'pairs',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    SWAP
  );
  await disUSDT();
  display();
}
