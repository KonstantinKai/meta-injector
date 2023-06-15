import { toCamelCase } from './toCamelCase';

describe('toCamelCase', () => {
  it('Should transform input string to camelcase', () => {
    expect(toCamelCase('word1_word2')).toEqual('word1Word2');
    expect(toCamelCase('word1_word2 WORD3')).toEqual('word1Word2Word3');
    expect(toCamelCase('word1_word2 WORD3-WoRd4')).toEqual('word1Word2Word3Word4');
  });
});
