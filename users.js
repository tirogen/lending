const ethers = require('ethers');
const fs = require('fs');

const abi = require('./abi.json');
const factoryLogInterface = new ethers.utils.Interface(abi);

const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');

const getUsers = async () => {
  const users = new Set();

  const range = 10000;
  let block = 25826028;
  const maxBlock = 34825862;
  let text = '';

  while (true) {
    const logsRaw = await provider.getLogs({
      address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      fromBlock: block,
      toBlock: Math.min(block + range, maxBlock),
      topics: [[factoryLogInterface.getEventTopic('Borrow')]],
    });

    for (const log of logsRaw) {
      const logData = factoryLogInterface.parseLog(log);
      if (!users.has(logData.args.user)) {
        users.add(logData.args.user);
        text += `${logData.args.user}\n`;
      }
    }

    block += range + 1;
    if (block >= maxBlock) {
      break;
    }
  }

  fs.writeFileSync('users', text);
  console.log('users.length', users.size);
};

getUsers();
