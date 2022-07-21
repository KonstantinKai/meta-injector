import { FC, memo, useState } from 'react';
import { feature2Meta } from '../biz/feature-2/meta';
import { useInjector } from '../hooks/useInjector';

import '../biz/feature-2/registration';

const Element: FC = () => {
  const [feature2] = useInjector(
    feature2Meta.withParams(Math.random().toString(), Math.random().toString())
  );

  return (
    <div>
      <div>{feature2.aAndB}</div>
      <Counter />
    </div>
  );
};

Element.displayName = 'Feature2Page';
const Feature2Page = memo(Element);

export default Feature2Page;

const Counter: FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <div>counter: {counter}</div>
      <button onClick={() => setCounter((prev) => prev + 1)}>+1</button>
    </>
  );
}
