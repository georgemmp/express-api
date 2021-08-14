import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHsh(payload: string, hashed: string): Promise<boolean> {
    const compared = payload === hashed;
    return compared;
  }
}

export default FakeHashProvider;
