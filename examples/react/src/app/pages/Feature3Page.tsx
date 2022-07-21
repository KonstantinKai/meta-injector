import { FC, memo, useEffect } from 'react';
import { injector } from '../biz/injector';
import { feature3Meta } from '../biz/feature-3/meta';
import { registerFeture3 } from '../biz/feature-3/registration';

const Element: FC = () => {
  useEffect(
    () => {
      registerFeture3();
      injector.retrieve(feature3Meta)[0].subscribe();
      return () => {
        injector.unregister(feature3Meta);
      }
    },
    [],
  );

  return (
    <div>Feature3 (open dev tool console)</div>
  );
};

Element.displayName = 'Feature3Page';
const Feature3Page = memo(Element);

export default Feature3Page;
