import { validUsername } from './utils';

describe('utils', () => {
  it('should accept valid usernames', () => {
    const username = 'aomsething1234';
    expect(validUsername(username)).toBeTruthy();
  });

  it('should accept valid usernames', () => {
    const username = 'flad';
    expect(validUsername(username)).toBeTruthy();
  });

  it('should accept valid usernames', () => {
    const username = '234';
    expect(validUsername(username)).toBeTruthy();
  });

  it('should not accept valid usernames', () => {
    const username = 'aomset hing1234';
    expect(validUsername(username)).toBeFalsy();
  });

  it('should not accept valid usernames', () => {
    const username = 'aomset;hing1234';
    expect(validUsername(username)).toBeFalsy();
  });

  it('should not accept valid usernames', () => {
    const username = '; nullo ; g*';
    expect(validUsername(username)).toBeFalsy();
  });
});
