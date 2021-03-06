module.exports = async ({ buildNumber, params, sleep, shell, git, npm, Docker, fs, docker }) => {
  console.log('build number:', buildNumber);
  console.log('params:', params);
  console.log('env', process.env);

  const mongo = await docker.create('mongo');

  console.log('start mongo', mongo.id);
  await mongo.start();

  console.log('sleep 500 ms');
  await sleep(500);

  console.log('git clone');
  await git.clone('https://github.com/jaystack/repatch.git', '.');
  const { version } = await fs.readJson('package.json');
  console.log(version);
  await npm.install();
  await shell('ls -la');
  await npm.run('build');
  await shell('ls -la');
  await npm.test();

  console.log('stop and remove mongo');
  await mongo.stop();
  await mongo.remove();
};
