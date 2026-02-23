import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { AppModule } from '../src/app.module';
import { AppSubscriptionModel } from '../src/modules/appBilling/appBilling.schema';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const subModel = app.get<Model<AppSubscriptionModel>>(
    getModelToken(AppSubscriptionModel.name),
  );

  let output = '--- All Subscriptions ---\n';
  const subs = await subModel.find().lean().exec();
  subs.forEach((s) => {
    output += `User: ${s.userId}, Plan: ${s.planId}, Status: ${s.status}, Created: ${s.createdAt}\n`;
  });

  fs.writeFileSync('scripts/debug-output.txt', output);
  console.log('Results written to scripts/debug-output.txt');

  await app.close();
}

run().catch(console.error);
