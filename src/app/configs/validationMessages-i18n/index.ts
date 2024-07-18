import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import faValidations from './fa';

export const validationMessages = (type: keyof typeof faValidations, vars?: Record<string, number | string>) => {
	return i18next.t(`${i18nNamespaces.validationMessages}:${type}`, vars);
};
