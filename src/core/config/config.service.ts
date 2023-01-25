import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: Record<string, string>;
  constructor(filePath: string) {
    if (filePath == 'development.env') {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } else {
      this.envConfig = process.env;
    }
  }

  get(key: string): string {
    console.log({
      service: ConfigService.name,
      method: 'get',
      message: key + ': ' + this.envConfig[key],
    });
    return this.envConfig[key];
  }
}
