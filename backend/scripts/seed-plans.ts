import { CreateAppPlanDto } from '@ahmedrioueche/gympro-client';
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
    // Free plan for trial users
    {
      version: 1,
      order: 0,
      type: 'subscription',
      level: 'free',
      name: 'plan.free.name',
      description: 'plan.free.description',
      currency: 'EUR',
      pricing: {
        monthly: 0,
        yearly: 0,
      },
      trialDays: 14,
      limits: {
        maxGyms: 1,
        maxMembers: 50,
        maxGems: 0,
      },
      features: [
        'plan.free.feature.basic_dashboard',
        'plan.free.feature.limited_member_management',
      ],
      createdAt: new Date(),
    },

    // Starter subscription
    {
      version: 1,
      order: 1,
      type: 'subscription',
      level: 'starter',
      name: 'plan.starter.name',
      description: 'plan.starter.description',
      currency: 'EUR',
      pricing: { monthly: 10, yearly: 100 },
      limits: { maxGyms: 1, maxMembers: 100, maxGems: 50 },
      features: [
        'plan.starter.feature.dashboard',
        'plan.starter.feature.member_management',
        'plan.starter.feature.basic_reports',
      ],
      createdAt: new Date(),
    },

    // Standard subscription
    {
      version: 1,
      order: 2,
      type: 'subscription',
      level: 'standard',
      name: 'plan.standard.name',
      description: 'plan.standard.description',
      currency: 'EUR',
      pricing: { monthly: 20, yearly: 200 },
      limits: { maxGyms: 1, maxMembers: 250, maxGems: 200 },
      features: [
        'plan.standard.feature.dashboard',
        'plan.standard.feature.member_management',
        'plan.standard.feature.advanced_reports',
        'plan.standard.feature.notifications',
      ],
      createdAt: new Date(),
    },

    // Premium subscription
    {
      version: 1,
      order: 3,
      type: 'subscription',
      level: 'premium',
      name: 'plan.premium.name',
      description: 'plan.premium.description',
      currency: 'EUR',
      pricing: { monthly: 40, yearly: 400 },
      limits: { maxGyms: 3, maxMembers: 500, maxGems: 500 },
      features: [
        'plan.premium.feature.all_standard',
        'plan.premium.feature.multi_gym',
        'plan.premium.feature.custom_branding',
        'plan.premium.feature.api_access',
      ],
      createdAt: new Date(),
    },

    // One-time purchase plans
    {
      version: 1,
      order: 1,
      type: 'oneTime',
      level: 'starter',
      name: 'plan.starter_onetime.name',
      description: 'plan.starter_onetime.description',
      currency: 'EUR',
      pricing: { oneTime: 200 },
      limits: { maxGyms: 1, maxMembers: 100, maxGems: 50 },
      features: [
        'plan.starter.feature.dashboard',
        'plan.starter.feature.member_management',
        'plan.starter.feature.basic_reports',
      ],
      createdAt: new Date(),
    },
    {
      version: 1,
      order: 2,
      type: 'oneTime',
      level: 'standard',
      name: 'plan.standard_onetime.name',
      description: 'plan.standard_onetime.description',
      currency: 'EUR',
      pricing: { oneTime: 400 },
      limits: { maxGyms: 1, maxMembers: 250, maxGems: 200 },
      features: [
        'plan.standard.feature.dashboard',
        'plan.standard.feature.member_management',
        'plan.standard.feature.advanced_reports',
        'plan.standard.feature.notifications',
      ],
      createdAt: new Date(),
    },
    {
      version: 1,
      order: 3,
      type: 'oneTime',
      level: 'premium',
      name: 'plan.premium_onetime.name',
      description: 'plan.premium_onetime.description',
      currency: 'EUR',
      pricing: { oneTime: 800 },
      limits: { maxGyms: 3, maxMembers: 500, maxGems: 500 },
      features: [
        'plan.premium.feature.all_standard',
        'plan.premium.feature.multi_gym',
        'plan.premium.feature.custom_branding',
        'plan.premium.feature.api_access',
      ],
      createdAt: new Date(),
    },
  ];

  for (const plan of plans) {
    try {
      await plansService.createPlan(plan);
      console.log(`✅ ${plan.level} (${plan.type})`);
    } catch (error) {
      console.log(`❌ ${plan.level} - ${error}`);
    }
  }

  console.log('\n✨ Done! Plans are up to date.\n');
  await app.close();
}

run();
