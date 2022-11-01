const ethers = require('ethers');
const fs = require('fs');

const users = fs.readFileSync('users').toString().split('\n');

const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');
const abi = require('./abi.json');
const poolSC = new ethers.Contract('0x794a61358D6845594F94dc1DB02A252b5b4814aD', abi, provider);

const getHF = async (user) => {
  for (let i = 0; i < 5; i++) {
    try {
      const data = await poolSC.getUserAccountData(user);
      return data.healthFactor;
    } catch (e) {}
  }
  throw new Error(user);
};

const getHFs = async () => {
  for (const user of users) {
    const hf = await getHF(user);
    if (hf.lt(ethers.utils.parseEther('1')) && hf.gt(ethers.utils.parseEther('0'))) {
      console.log(user, ethers.utils.formatEther(hf));
    }
  }
};

getHFs();
