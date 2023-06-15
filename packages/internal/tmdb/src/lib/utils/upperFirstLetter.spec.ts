import { upperFirstLetter } from './upperFirstLetter';

describe('upperFirstLetter', () => {
  it('Should transform the first letter of the string to uppercase', () => {
    expect(upperFirstLetter('word1 word2')).toEqual('Word1 word2');
    expect(upperFirstLetter('WORD1 WoRD2')).toEqual('Word1 word2');
  });
});
