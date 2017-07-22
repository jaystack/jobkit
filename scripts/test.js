module.exports = async function({
  cwd,
  buildNumber,
  params,
  sleep,
  shell,
  git,
  npm,
  docker
}) {
  console.log('I know the cwd:', cwd)
  console.log('I know the build number:', buildNumber)
  console.log('I know the params:', params)

  const mongo = await docker.create('mongo')

  console.log('start mongo', mongo.id)
  await mongo.start()

  console.log('sleep 500 ms')
  await sleep(500)

  console.log('git clone')
  await git.clone('https://github.com/jaystack/repatch.git', '.')
  await npm.install()
  await shell('ls -la')
  await npm.run('build')
  await shell('ls -la')
  await npm.test()

  console.log('stop and remove mongo')
  await mongo.stop()
  await mongo.remove()
}
