import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  async parse(): Promise<string> {
    return 'Template';
  }
}
