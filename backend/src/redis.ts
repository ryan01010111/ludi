import { createClient } from 'redis';
import config from 'config';

const client = createClient({
  url: config.get('redis.url'),
});

client.on('error', err => console.log('Redis Client Error:::', err));

client.connect()
  .then(() => console.log('>>> Connected to Redis'));

export default client;
