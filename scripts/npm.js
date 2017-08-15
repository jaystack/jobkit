module.exports = async ({ git, npm, shell }) => {
  await git.clone('https://github.com/jaystack/repatch.git', '.');

  /* await npm.config.set('a[]', 'hello');
  await npm.config.set('a[]', 'hali');
  console.log(await npm.config.get('a'));
  console.log(await npm.config.list());
  await npm.config.delete('a');
  console.log(await npm.config.list()); */

  //console.log(await npm.bin())

  //console.log(await npm.build())

  //await npm.dedupe();

  //console.log(await npm.owner.list())

  //console.log(await npm.search('repatch'));

  //await npm.stars()

  /* await npm.install('repatch', { save: true });
  await shell('ls -la')
  await shell('ls -la node_modules');
  await shell('cat package.json') */

  /* await git.addConfig('user.name', 'Béla')
  await git.addConfig('user.email', 'bela@bela.hu')
  await npm.version('major') */

  console.log(await npm.whoAmI());
};
