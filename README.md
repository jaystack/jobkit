# JobKit
JavaScript Job Runner
---

JobKit allows you to write job scripts in javascript and run it via `jobkit` cli or using [jobkit-server]() triggered by git poll.

JobKit runs your job scripts in a docker container and remove it after it ends.

## Installation

Globally:

```
npm install -g jobkit
```

Locally:

```
npm install --save-dev jobkit
```

## Job file

Create a job file such as `test.js`:

```javascript
module.exports = async ({ sleep, shell, git, npm, docker }) => {
  const mongo = await docker.create('mongo')
  await mongo.start()
  await sleep(500)
  await git.clone('https://github.com/jaystack/repatch.git', '.')
  await npm.install()
  await shell('ls -la')
  await npm.run('build')
  await shell('ls -la')
  await npm.test()
  await mongo.stop()
  await mongo.remove()
}

```

## Running

```
jobkit test.js
```

## Add parameters

```
jobkit test.js -p foo=1 -p bar=hello
```

You can read these parameters in your job file via `params` attribute:

```javascript
module.exports = ({ params }) => console.log(params.foo, params.bar)
```

## Set environment variables

```
jobkit test.js -e FOO=1 -e BAR=hello
```

That will set these environment variables to the job process:

```javascript
module.exports = () => console.log(process.env.FOO, process.env.BAR)
```