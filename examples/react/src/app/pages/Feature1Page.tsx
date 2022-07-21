import { FC, memo, useEffect } from 'react';
import { feature1Meta } from '../biz/feature-1/meta';
import { useInjector } from '../hooks/useInjector';

import '../biz/feature-1/registration';

const Element: FC = () => {
  const [feature1] = useInjector(feature1Meta);

  useEffect(
    () => {
      feature1.method1();
    },
    [],
  );

  return (
    <div>
      Feature 1 (open dev tool console)
    </div>
  );
};

Element.displayName = 'Feature1Page';
const Feature1Page = memo(Element);

export default Feature1Page;
