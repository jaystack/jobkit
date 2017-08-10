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
      this.listImages({}, (err, images) => {
        if (err) return callback(err);
        if (hasImage(images, imageName)) {
          super.createContainer(options, callback);
        } else {
          this.pull(imageName, {}, err => {
            if (err) return callback(err);
            super.createContainer(options, callback);
          });
        }
      });
    } else {
      return this.listImages().then(
        images =>
          hasImage(images, imageName)
            ? super.createContainer(options)
            : this.pull(imageName).then(() => super.createContainer(options))
      );
    }
  }
}

function hasImage(imageList: Dockerode.ImageInfo[], imageName: string) {
  const exp = new RegExp(imageName);
  return imageList.some(imageInfo => imageInfo.RepoTags.some(repoTag => exp.test(repoTag)));
}

function printPullProgress(chunk: string) {
  const { id, status = '', progress = '' } = JSON.parse(chunk);
  console.log(`${id}: ${status} ${progress}`);
}
