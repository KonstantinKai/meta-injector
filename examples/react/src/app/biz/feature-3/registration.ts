import { injector } from '../injector';
import { feature1Meta } from '../feature-1/meta';
import { Feature3 } from './Feature3';
import { feature3Meta } from './meta';

import '../feature-1/registration';

export const registerFeture3 = () => {
  injector.register(feature3Meta,
    () => new Feature3(...injector.retrieve(feature1Meta)),
    (feature3) => feature3?.dispose(),
  );
};
