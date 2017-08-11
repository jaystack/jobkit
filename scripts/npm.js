module.exports = async ({ npm }) => {
  console.log(await npm.bin());
};
