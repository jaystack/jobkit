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

  /* const stream = await docker.pull('mongo:latest')
  stream.pipe(process.stdout)
  await docker.run('mongo') */

  console.log('sleep 500 ms')
  await sleep(500)

  console.log('git clone')
  await git.clone('https://github.com/jaystack/repatch.git', '.')

  await npm.install()
  await shell('ls -la')
  await npm.run('build')
  await shell('ls -la')
  await npm.test()
}
