/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { Feature2 } from '../biz/feature-2/Feature2';
import { feature2Meta } from '../biz/feature-2/meta';
import { injector } from '../biz/injector';

import Feature2Page from './Feature2Page';

describe('Feature2Page', () => {
  beforeAll(() => {
    injector.register(feature2Meta, () => new Feature2('a', 'b'));
  });

  afterAll(() => {
    injector.restore(feature2Meta);
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(
      <Feature2Page />
    );

    expect(getByText(/a_and_b/i)).toBeTruthy();
  });
});
