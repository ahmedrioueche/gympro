import {
  CreateAppPlanDto,
  DEFAULT_TRIAL_DAYS_NUMBER,
  GymManagerFeature,
} from '@ahmedrioueche/gympro-client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AppPlansService } from '../src/modules/appBilling/plan/plan.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const plansService = app.get(AppPlansService);

  console.log('🗑️  Deleting old plans...\n');

  // Delete all existing plans
  const existingPlans = await plansService.getAllPlans();
  for (const plan of existingPlans) {
    try {
      await plansService.deletePlan(plan._id);
      console.log(`🗑️  Deleted ${plan.level}`);
    } catch (error) {
      console.log(`⚠️  Could not delete ${plan.level} - ${error}`);
    }
  }

  console.log('\n🌱 Creating new plans...\n');
  const plans: CreateAppPlanDto[] = [
    {
      planId: 'subscription-free',
      version: 1,
      order: 0,
      level: 'free',
      name: 'Free',
      description: 'plan.free.description',
      pricing: {
        EUR: { monthly: 0, yearly: 0 },
        USD: { monthly: 0, yearly: 0 },
        DZD: { monthly: 0, yearly: 0 },
      },
      trialDays: DEFAULT_TRIAL_DAYS_NUMBER,
      limits: { maxGyms: 1, maxMembers: 100, maxGems: 0 },
      features: [
        GymManagerFeature.MEMBERS,
        GymManagerFeature.SERVICES_PRICING,
        GymManagerFeature.SUBSCRIPTIONS,
      ],
      publicFeatures: [
        GymManagerFeature.MEMBERS,
        GymManagerFeature.SUBSCRIPTIONS,
      ],
      createdAt: new Date(),
    },

    // Starter subscription
    {
      planId: 'subscription-starter',
      version: 1,
      order: 1,
      level: 'starter',
      name: 'Basic',
      description: 'plan.starter.description',
      pricing: {
        EUR: { monthly: 15, yearly: 150 },
        USD: { monthly: 16, yearly: 160 },
        DZD: { monthly: 2500, yearly: 25000 },
      },
      paddleProductId: 'pro_01kcmb7nfehz9cggs5r8cvc6tf',
      paddlePriceIds: {
        monthly: 'pri_01kcmbm4wfpqwwegz0m8tg6hfq',
        yearly: 'pri_01kcmc2fbgxq1znpas7mpt2ckk',
      },
      limits: { maxGyms: 1, maxMembers: 500, maxGems: 100 },
      features: [
        GymManagerFeature.MEMBERS,
        GymManagerFeature.SERVICES_PRICING,
        GymManagerFeature.SUBSCRIPTIONS,
        GymManagerFeature.ACCESS_CONTROL_QR,
        GymManagerFeature.ATTENDANCE,
        GymManagerFeature.COACHING,
        GymManagerFeature.CLASSES,
      ],
      publicFeatures: [
        GymManagerFeature.MEMBERS,
        GymManagerFeature.ACCESS_CONTROL_QR,
        GymManagerFeature.COACHING,
      ],
      createdAt: new Date(),
    },

    // Pro subscription
    {
      planId: 'subscription-pro',
      version: 1,
      order: 2,
      level: 'pro',
      name: 'Pro',
      description: 'plan.pro.description',
      pricing: {
        EUR: { monthly: 30, yearly: 300 },
        USD: { monthly: 32, yearly: 320 },
        DZD: { monthly: 4500, yearly: 45000 },
      },
      paddleProductId: 'pro_01kcmc9wqxgmkpqgdcd0zneemk',
      paddlePriceIds: {
        monthly: 'pri_01kcmcdqp97degdvapfgvagjhk',
        yearly: 'pri_01kcmcgaj9pm5px8thx21d9kv9',
      },
      limits: { maxGyms: 3, maxMembers: 2000, maxGems: 500 },
      features: [
        GymManagerFeature.MEMBERS,
        GymManagerFeature.SERVICES_PRICING,
        GymManagerFeature.SUBSCRIPTIONS,
        GymManagerFeature.ACCESS_CONTROL_QR,
        GymManagerFeature.ATTENDANCE,
        GymManagerFeature.COACHING,
        GymManagerFeature.CLASSES,
        GymManagerFeature.MARKETING,
        GymManagerFeature.INVENTORY,
        GymManagerFeature.STORE,
        GymManagerFeature.ANALYTICS,
        GymManagerFeature.ANNOUNCEMENTS,
        GymManagerFeature.STAFF,
      ],
      publicFeatures: [
        GymManagerFeature.MEMBERS,
        GymManagerFeature.ACCESS_CONTROL_QR,
        GymManagerFeature.COACHING,
        GymManagerFeature.MARKETING,
        GymManagerFeature.ANALYTICS,
        GymManagerFeature.ANNOUNCEMENTS,
      ],
      createdAt: new Date(),
    },
  ];

  for (const plan of plans) {
    try {
      await plansService.createPlan(plan);
    } catch (error) {
      console.log(`❌ ${plan.level} - ${error}`);
    }
  }

  console.log('\n✨ Done! Plans are up to date.\n');
  await app.close();
}

run();
