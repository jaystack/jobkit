module.exports = async function({ cwd, buildNumber, shell, git, npm, sleep, docker }) {
  console.log('I know the cwd:', cwd)
  console.log('I know the build number:', buildNumber)

  console.log('sleep 2000 ms')
  await sleep(2000)

  await git.clone('https://github.com/jaystack/repatch.git', '.')

  await npm.install()
  await shell('ls -la')
  await npm.run('build')
  await shell('ls -la')
  await npm.test()
}
