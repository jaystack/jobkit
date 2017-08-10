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
    let extendedOptions = { ...options || {}, Image: image };
    return this.createContainer(extendedOptions);
  }

  createContainer(options: Dockerode.ContainerCreateOptions, callback: Callback<Dockerode.Container>): void;
  createContainer(options: Dockerode.ContainerCreateOptions): Promise<Dockerode.Container>;
  createContainer(options, callback?): any {
    if (callback) {
      return super.createContainer(options, callback);
    } else {
      return super.createContainer(options);
    }
  }
}
