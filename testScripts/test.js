module.exports = async function({ cwd, buildNumber, exec, git }) {
  console.log('I know the cwd:', cwd)
  console.log('I know the build number:', buildNumber)
  await exec('ls -la')
  console.log(await git.log())
}
