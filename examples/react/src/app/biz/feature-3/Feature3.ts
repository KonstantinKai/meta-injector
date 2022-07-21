import type { Feature1 } from '../feature-1/Feature1';

export class Feature3 {
  constructor(public readonly feature1: Feature1) { }

  subscribe(): void {
    this.feature1.method1();
    console.log('subscribing');
  }

  dispose(): void {
    this.feature1.method1();
    console.log('disposing');
  }
}
