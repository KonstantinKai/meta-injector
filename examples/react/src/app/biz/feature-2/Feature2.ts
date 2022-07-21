export class Feature2 {
  constructor(
    public readonly a: string,
    public readonly b: string,
  ) { }

  get aAndB(): string {
    return `${this.a}_and_${this.b}`;
  }
}
