import Dockerode = require('dockerode');

export type Callback<T> = (error?: any, result?: T) => void;

export default class Docker extends Dockerode {
  pull(image: string, options?: object): Promise<void>;
  pull(image: string, options: object, callback?: Callback<void>): any;
  pull(image: string, callback?: Callback<void>): any;
  pull(image, ...otherArgs): Promise<void> {
    const options = otherArgs.find(arg => arg && arg.constructor === Object) || {};
    const callback = otherArgs.find(arg => arg && typeof arg === 'function');
    const [ name, tag = 'latest' ] = image.split(':');
    const pull = (img: string, opt: object, cb: Callback<void>) => {
      super.pull(img, opt, (err, stream) => {
        if (err) return cb(err);
        stream.on('data', printPullProgress);
        stream.on('error', error => cb(error));
        stream.on('end', () => cb(null));
      });
    };
    if (callback) {
      pull(`${name}:${tag}`, options, callback);
    } else {
      return new Promise((resolve, reject) => {
        pull(`${name}:${tag}`, options, (error, result) => (error ? reject(error) : resolve(result)));
      });
    }
  }

  create(image: string, options?: Dockerode.ContainerCreateOptions): Promise<Dockerode.Container> {
    let extendedOptions = options ? { ...options, Image: image } : { Image: image };
    return this.createContainer(extendedOptions);
  }

  createContainer(options: Dockerode.ContainerCreateOptions, callback: Callback<Dockerode.Container>): void;
  createContainer(options: Dockerode.ContainerCreateOptions): Promise<Dockerode.Container>;
  createContainer(options, callback?): any {
    const { Image: imageName } = options;
    if (callback) {
      this.ensureImage(imageName, options, err => (err ? callback(err) : super.createContainer(options, callback)));
    } else {
      return this.ensureImage(imageName, options).then(() => super.createContainer(options));
    }
  }

  hasImage(imageName: string, callback: Callback<boolean>): void;
  hasImage(imageName: string): Promise<boolean>;
  hasImage(imageName, callback?) {
    const exp = new RegExp(imageName);
    const test = images => images.some(imageInfo => imageInfo.RepoTags.some(repoTag => exp.test(repoTag)));
    if (callback) {
      this.listImages({}, (err, images) => (err ? callback(err) : callback(test(images))));
    } else {
      return this.listImages().then(test);
    }
  }

  ensureImage(imageName: string, options?: object): Promise<void>;
  ensureImage(imageName: string, options: object, callback: Callback<void>): void;
  ensureImage(imageName: string, callback: Callback<void>): void;
  ensureImage(imageName, ...otherArgs) {
    const options = otherArgs.find(arg => arg && arg.constructor === Object) || {};
    const callback = otherArgs.find(arg => arg && typeof arg === 'function');
    if (callback) {
      this.hasImage(imageName, (err, has) => {
        if (err) return callback(err);
        if (has) {
          super.createContainer(options, callback);
        } else {
          this.pull(imageName, {}, err => {
            err ? callback(err) : callback(null);
          });
        }
      });
    } else {
      return this.hasImage(imageName).then(has => (has ? Promise.resolve() : this.pull(imageName)));
    }
  }
}

const printPullProgress = (chunk: string) => {
  const lines = chunk.toString().split('\n').filter(_ => _);
  lines.forEach(line => {
    const { id, status = '', progress = '' } = JSON.parse(line);
    console.log(`${id}: ${status} ${progress}`);
  });
};
