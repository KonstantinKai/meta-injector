import type { Requester } from '@internal/tmdb';
import { injector } from '../injector';

export const services = {
  fetchRequester: injector.createMeta<Requester>('fetchRequester'),
} as const;
