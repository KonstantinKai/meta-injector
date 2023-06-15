import { Requester } from '@internal/tmdb';
import { FetchHttpClient } from '../common/FetchHttpClient';
import { injector } from '../injector';
import { services } from './services';

injector.register(services.fetchRequester, () => new Requester(
  process.env.NX_TMDB_TOKEN,
  new FetchHttpClient('https://api.themoviedb.org/4'),
));
