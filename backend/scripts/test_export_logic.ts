import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import { GymService } from '../src/modules/gym/gym.service';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const gymService = app.get(GymService);

  // Find an owner
  const gyms = await gymService.findAll({ limit: 1 });
  if (gyms.data.length === 0) {
    console.log('No gyms found');
    await app.close();
    return;
  }

  const gym = gyms.data[0];
  const ownerId =
    typeof gym.owner === 'object'
      ? (gym.owner as any)._id?.toString()
      : gym.owner?.toString();

  console.log(`Testing export for user ${ownerId} (Owner of ${gym.name})`);

  // Mock Response to capture the stream
  let buffer = Buffer.alloc(0);
  const mockRes = {
    setHeader: (k: string, v: string) => console.log(`Header: ${k} = ${v}`),
    write: (chunk: any) => {
      buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
    },
    end: () => {
      fs.writeFileSync('test_export.xlsx', buffer);
      console.log(`Saved test_export.xlsx, size: ${buffer.length} bytes`);
    },
  } as any;

  await gymService.exportManagerData(ownerId, mockRes);

  await app.close();
}

run();
