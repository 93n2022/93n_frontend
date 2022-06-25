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
IA = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };
JS = { 0: 'https://aloycwl.github.io/js/cdn/moment.min.js' };
function waitTxt(a, b) {
  $('#' + b).html(a > 0 ? 'Loading...' : '');
}
function formatURL(u) {
  if (u.includes('ipfs://') && u.length > 9)
    u = u.replace('ipfs://', 'https://ipfs.io/ipfs/');
  else if (
    /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/.test(
      u
    )
  );
  else u = '';
  return u;
}
function _R() {
  _s = location.hash.substring(1).toLowerCase();
  return _s.length > 1 && _s != acct.toLowerCase()
    ? _s
    : '0x0000000000000000000000000000000000000000';
}
async function LB() {
  return (await contract2.methods.balanceOf(acct).call()) / 1e18;
}
async function _LJS(a) {
  $.getScript(JS[a]);
}
async function load(a, b) {
  if (typeof CS != 'undefined')
    $('head').append(
      $(
        '<meta name="viewport"content="width=device-width,initial-scale=1.0"><link rel="stylesheet">'
      ).attr('href', CS)
    );
  if (typeof ethereum != 'undefined') {
    web3 = new Web3(ethereum);
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    acct = acct[0];
    FA = { from: acct };
    if ((await web3.eth.net.getId()) != CHAIN) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CHAIN }],
      });
    }
    contract = new web3.eth.Contract(a, b);
    if (typeof WB != 'undefined') {
      web3a = new Web3(WB);
      contracta = new web3a.eth.Contract(a, b);
    }
  }
}
async function load2() {
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
}
function ran(p) {
  return Math.floor(Math.random() * p);
}
async function uploadImg(i) {
  pro = await new Promise((d) => {
    b64 = atob(
      document.getElementById(`can${i}`).toDataURL('image/png').split(',')[1]
    );
    n = b64.length;
    u8 = new Uint8Array(n);
    reader = new FileReader();
    reader.onloadend = () => {
      ipfs.add(ipfs.Buffer.from(reader.result)).then((files) => {
        d(files);
      });
    };
    while (n--) u8[n] = b64.charCodeAt(n);
    reader.readAsArrayBuffer(new File([u8], ''));
  });
  return pro[0].hash;
}
async function uploadJson(p) {
  pro = await new Promise((d) => {
    reader = new FileReader();
    reader.onloadend = () => {
      ipfs.add(ipfs.Buffer.from(reader.result)).then((files) => {
        d(files);
      });
    };
    reader.readAsArrayBuffer(new File([p], 'application/json'));
  });
  return pro[0].hash;
}
