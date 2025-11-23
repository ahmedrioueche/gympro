import { Building2, Clock, DollarSign, Globe, Image, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from '../../../../../components/ui/InputField';

interface FormField {
  value: string;
  required: boolean;
}

interface FormData {
  gymName: FormField;
  address: FormField;
  city: FormField;
  state: FormField;
  country: FormField;
  phoneNumber: FormField;
  email: FormField;
  website: FormField;
  timezone: FormField;
  logoUrl: FormField;
  slogan: FormField;
  defaultCurrency: FormField;
}

const initialData: FormData = {
  // Essential fields (required)
  gymName: { value: '', required: true },
  address: { value: '', required: true },
  city: { value: '', required: true },
  phoneNumber: { value: '', required: true },
  email: { value: '', required: true },

  // Non-essential fields (optional)
  state: { value: '', required: false },
  country: { value: '', required: false },
  website: { value: '', required: false },
  timezone: { value: '', required: false },
  logoUrl: { value: '', required: false },
  slogan: { value: '', required: false },
  defaultCurrency: { value: '', required: false },
};

interface OwnerDetailsFormProps {
  onSubmit?: (data: Record<string, string>) => void;
}

export function OwnerDetailsForm({ onSubmit }: OwnerDetailsFormProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define form steps
  const basicInfoFields = [
    {
      key: 'gymName' as keyof FormData,
      icon: <Building2 className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'organization',
    },
    {
      key: 'address' as keyof FormData,
      icon: <MapPin className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'street-address',
    },
    {
      key: 'city' as keyof FormData,
      icon: <MapPin className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'address-level2',
    },
  ];

  const contactFields = [
    {
      key: 'phoneNumber' as keyof FormData,
      icon: <Phone className='w-5 h-5' />,
      type: 'tel',
      autoComplete: 'tel',
    },
    {
      key: 'email' as keyof FormData,
      icon: <Mail className='w-5 h-5' />,
      type: 'email',
      autoComplete: 'email',
    },
    {
      key: 'website' as keyof FormData,
      icon: <Globe className='w-5 h-5' />,
      type: 'url',
      autoComplete: 'url',
    },
  ];

  const additionalFields = [
    {
      key: 'state' as keyof FormData,
      icon: <MapPin className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'address-level1',
    },
    {
      key: 'country' as keyof FormData,
      icon: <Globe className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'country-name',
    },
    {
      key: 'timezone' as keyof FormData,
      icon: <Clock className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'off',
    },
    {
      key: 'defaultCurrency' as keyof FormData,
      icon: <DollarSign className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'off',
    },
  ];

  const brandingFields = [
    {
      key: 'logoUrl' as keyof FormData,
      icon: <Image className='w-5 h-5' />,
      type: 'url',
      autoComplete: 'off',
    },
    {
      key: 'slogan' as keyof FormData,
      icon: <Building2 className='w-5 h-5' />,
      type: 'text',
      autoComplete: 'off',
    },
  ];

  const allSteps = [basicInfoFields, contactFields, additionalFields, brandingFields];
  const isLastStep = step === allSteps.length - 1;

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
    // Clear error when user types
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const currentFields = allSteps[step];
    const newErrors: Record<string, string> = {};

    currentFields.forEach(({ key }) => {
      const field = formData[key];
      if (field.required && !field.value.trim()) {
        newErrors[key] = t('onboarding.form.errors.required');
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, allSteps.length - 1));
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    if (isLastStep && onSubmit) {
      // Convert to simple object
      const submitData = Object.entries(formData).reduce(
        (acc, [key, field]) => {
          acc[key] = field.value;
          return acc;
        },
        {} as Record<string, string>
      );
      onSubmit(submitData);
    } else {
      handleNext();
    }
  };

  const stepTitles = [
    t('onboarding.form.steps.basicInfo'),
    t('onboarding.form.steps.contactInfo'),
    t('onboarding.form.steps.additionalInfo'),
    t('onboarding.form.steps.branding'),
  ];

  return (
    <div className='flex flex-col items-center justify-center w-full px-4 md:px-8 py-8'>
      <form
        className='w-full max-w-2xl mx-auto p-6 md:p-8 rounded-2xl bg-surface border border-border shadow-lg'
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className='mb-6'>
          <h2 className='text-2xl md:text-3xl font-bold text-text-primary mb-2'>
            {t('onboarding.ownerDetails')}
          </h2>
          <p className='text-sm text-text-secondary'>{stepTitles[step]}</p>

          {/* Step indicator */}
          <div className='flex items-center gap-2 mt-4'>
            <span className='text-xs font-medium text-text-secondary'>
              {t('onboarding.form.step')} {step + 1} {t('onboarding.form.of')} {allSteps.length}
            </span>
            <div className='flex gap-1'>
              {allSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                    index === step ? 'bg-primary' : index < step ? 'bg-primary/50' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className='space-y-4 mb-6'>
          {allSteps[step].map(({ key, icon, type, autoComplete }) => (
            <InputField
              key={key}
              label={`${t(`onboarding.form.fields.${key}`)}${formData[key].required ? ' *' : ''}`}
              type={type}
              value={formData[key].value}
              onChange={(e) => handleChange(key, e.target.value)}
              leftIcon={icon}
              error={errors[key]}
              autoComplete={autoComplete}
              placeholder={t(`onboarding.form.placeholders.${key}`)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-between items-center gap-3 pt-4 border-t border-border'>
          {step > 0 ? (
            <button
              type='button'
              onClick={handlePrev}
              className='px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-background text-text-primary'
            >
              {t('onboarding.previous')}
            </button>
          ) : (
            <div />
          )}

          <button
            type='submit'
            className='px-8 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105'
          >
            {isLastStep ? t('onboarding.finish') : t('onboarding.next')}
          </button>
        </div>
      </form>
    </div>
  );
}
