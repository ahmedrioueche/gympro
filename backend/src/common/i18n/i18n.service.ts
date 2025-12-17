import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '@ahmedrioueche/gympro-client';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService {
  private translations: Record<AppLanguage, any> = {} as Record<
    AppLanguage,
    any
  >;

  constructor() {
    this.loadTranslations();
  }

  /**
   * Load all translation files from locales directory
   */
  private loadTranslations() {
    const localesPath = path.join(__dirname, 'locales');

    for (const lang of SUPPORTED_LANGUAGES) {
      try {
        const filePath = path.join(localesPath, `${lang}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        this.translations[lang] = JSON.parse(fileContent);
      } catch (error) {
        console.warn(`Warning: Could not load translation file for ${lang}`);
        // If a language file is missing, it will fallback to English
      }
    }
  }

  /**
   * Get nested value from object using dot notation
   * e.g., 'email.verify_subject' -> translations.email.verify_subject
   */
  private getNestedValue(obj: any, key: string): string | undefined {
    return key.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  /**
   * Get translated text with variable substitution
   * @param key - Translation key (e.g., 'email.verify_subject')
   * @param language - Language code
   * @param vars - Variables to substitute in the text
   */
  t(
    key: string,
    language: AppLanguage = DEFAULT_LANGUAGE,
    vars: Record<string, string> = {},
  ): string {
    // Get translation for the language, fallback to English, then to key itself
    let text =
      this.getNestedValue(this.translations[language], key) ||
      this.getNestedValue(this.translations.en, key) ||
      key;

    // Replace all variables in the format {{variableName}}
    for (const [varKey, varValue] of Object.entries(vars)) {
      const regex = new RegExp(`{{${varKey}}}`, 'g');
      text = text.replace(regex, varValue);
    }

    return text;
  }

  /**
   * Check if a translation key exists
   */
  exists(key: string, language: AppLanguage = DEFAULT_LANGUAGE): boolean {
    return !!(
      this.getNestedValue(this.translations[language], key) ||
      this.getNestedValue(this.translations.en, key)
    );
  }

  /**
   * Get all translations for a language
   */
  getAll(language: AppLanguage = DEFAULT_LANGUAGE): any {
    return this.translations[language] || this.translations.en;
  }
}
