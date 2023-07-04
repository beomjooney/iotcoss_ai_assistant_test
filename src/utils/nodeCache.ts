import nodeCache from 'node-cache';

const cache = new nodeCache({ stdTTL: 0 });

function get(key: string) {
  if (cache.has(key)) {
    return JSON.parse(<string>cache.get(key));
  }
  return false;
}

function set(key: string, data: any) {
  cache.set(key, JSON.stringify(data));
}

function del() {
  const keys = cache.keys();
  if (keys.length) {
    cache.del(keys);
    return true;
  }
  return false;
}

export { get, set, del };
