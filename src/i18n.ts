import * as RNLocalize from 'react-native-localize';
import { I18n } from 'i18n-js';

import en from './translations/en.json';
import tr from './translations/tr.json';

const i18n = new I18n({ en, tr });

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  i18n.locale = locales[0].languageTag;
}

i18n.enableFallback = true; // Enable fallback translations

export default i18n;