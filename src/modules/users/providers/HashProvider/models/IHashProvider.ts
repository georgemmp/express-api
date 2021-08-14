export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHsh(payload: string, hashed: string): Promise<boolean>;
}
