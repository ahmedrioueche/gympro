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
    // Free plan - Generous trial to hook users
    {
      planId: 'subscription-free',
      version: 1,
      order: 0,
      type: 'subscription',
      level: 'free',
      name: 'plan.free.name',
      description: 'plan.free.description',
      pricing: {
        EUR: { monthly: 0, yearly: 0 },
        USD: { monthly: 0, yearly: 0 },
        DZD: { monthly: 0, yearly: 0 },
      },
      trialDays: 30,
      limits: { maxGyms: 1, maxMembers: 100, maxGems: 0 },
      features: [
        'plan.free.feature.full_dashboard',
        'plan.free.feature.member_management',
        'plan.free.feature.basic_reports',
        'plan.free.feature.mobile_app',
      ],
      createdAt: new Date(),
    },

    // Starter subscription
    {
      planId: 'subscription-starter',
      version: 1,
      order: 1,
      type: 'subscription',
      level: 'starter',
      name: 'plan.starter.name',
      description: 'plan.starter.description',
      pricing: {
        EUR: { monthly: 15, yearly: 150 },
        USD: { monthly: 16, yearly: 160 },
        DZD: { monthly: 2250, yearly: 22500 },
      },
      limits: { maxGyms: 1, maxMembers: 300, maxGems: 100 },
      features: [
        'plan.starter.feature.everything_free',
        'plan.starter.feature.advanced_reports',
        'plan.starter.feature.email_notifications',
        'plan.starter.feature.attendance_tracking',
        'plan.starter.feature.payment_processing',
      ],
      createdAt: new Date(),
    },

    // Pro subscription
    {
      planId: 'subscription-pro',
      version: 1,
      order: 2,
      type: 'subscription',
      level: 'pro',
      name: 'plan.pro.name',
      description: 'plan.pro.description',
      pricing: {
        EUR: { monthly: 30, yearly: 300 },
        USD: { monthly: 32, yearly: 320 },
        DZD: { monthly: 4500, yearly: 45000 },
      },
      limits: { maxGyms: 3, maxMembers: 1000, maxGems: 500 },
      features: [
        'plan.pro.feature.everything_starter',
        'plan.pro.feature.sms_notifications',
        'plan.pro.feature.custom_workflows',
        'plan.pro.feature.advanced_analytics',
        'plan.pro.feature.priority_support',
        'plan.pro.feature.api_access',
      ],
      createdAt: new Date(),
    },

    // Premium subscription
    {
      planId: 'subscription-premium',
      version: 1,
      order: 3,
      type: 'subscription',
      level: 'premium',
      name: 'plan.premium.name',
      description: 'plan.premium.description',
      pricing: {
        EUR: { monthly: 60, yearly: 600 },
        USD: { monthly: 64, yearly: 640 },
        DZD: { monthly: 9000, yearly: 90000 },
      },
      limits: { maxGyms: 10, maxMembers: 2000, maxGems: 2000 },
      features: [
        'plan.premium.feature.everything_pro',
        'plan.premium.feature.multi_location',
        'plan.premium.feature.white_label',
        'plan.premium.feature.custom_integrations',
        'plan.premium.feature.dedicated_manager',
        'plan.premium.feature.training_onboarding',
      ],
      createdAt: new Date(),
    },

    // One-time purchase plans
    {
      planId: 'onetime-starter',
      version: 1,
      order: 1,
      type: 'oneTime',
      level: 'starter',
      name: 'plan.starter_onetime.name',
      description: 'plan.starter_onetime.description',
      pricing: {
        EUR: { oneTime: 300 },
        USD: { oneTime: 320 },
        DZD: { oneTime: 45000 },
      },
      limits: { maxGyms: 1, maxMembers: 300, maxGems: 100 },
      features: [
        'plan.starter.feature.everything_free',
        'plan.starter.feature.advanced_reports',
        'plan.starter.feature.email_notifications',
        'plan.starter.feature.attendance_tracking',
        'plan.starter.feature.payment_processing',
      ],
      createdAt: new Date(),
    },
    {
      planId: 'onetime-pro',
      version: 1,
      order: 2,
      type: 'oneTime',
      level: 'pro',
      name: 'plan.pro_onetime.name',
      description: 'plan.pro_onetime.description',
      pricing: {
        EUR: { oneTime: 600 },
        USD: { oneTime: 640 },
        DZD: { oneTime: 90000 },
      },
      limits: { maxGyms: 3, maxMembers: 1000, maxGems: 500 },
      features: [
        'plan.pro.feature.everything_starter',
        'plan.pro.feature.sms_notifications',
        'plan.pro.feature.custom_workflows',
        'plan.pro.feature.advanced_analytics',
        'plan.pro.feature.priority_support',
        'plan.pro.feature.api_access',
      ],
      createdAt: new Date(),
    },
    {
      planId: 'onetime-premium',
      version: 1,
      order: 3,
      type: 'oneTime',
      level: 'premium',
      name: 'plan.premium_onetime.name',
      description: 'plan.premium_onetime.description',
      pricing: {
        EUR: { oneTime: 1200 },
        USD: { oneTime: 1280 },
        DZD: { oneTime: 180000 },
      },
      limits: { maxGyms: 10, maxMembers: 2000, maxGems: 2000 },
      features: [
        'plan.premium.feature.everything_pro',
        'plan.premium.feature.multi_location',
        'plan.premium.feature.white_label',
        'plan.premium.feature.custom_integrations',
        'plan.premium.feature.dedicated_manager',
        'plan.premium.feature.training_onboarding',
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
