import { z } from "zod";
import { optionalText } from "@/lib/validations/common";
import { clientSpaceTranslations, type ClientSpaceLanguage } from "@/lib/i18n/clientSpace/translations";

function messages(lang: ClientSpaceLanguage) {
  return clientSpaceTranslations[lang].validation;
}

export function getClientRegisterSchema(lang: ClientSpaceLanguage = "en") {
  const m = messages(lang);
  return z.object({
    name: z.string().trim().min(2, m.nameMin).max(150),
    email: z.string().trim().min(1, m.emailRequired).email(m.emailInvalid).max(200),
    password: z.string().min(6, m.passwordMin),
    company: optionalText(150),
    phone: optionalText(30),
  });
}

export const clientRegisterSchema = getClientRegisterSchema();
export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;

export function getClientProfileSchema(lang: ClientSpaceLanguage = "en") {
  const m = messages(lang);
  return z.object({
    name: z.string().trim().min(2, m.nameMin).max(150),
    email: z.string().trim().min(1, m.emailRequired).email(m.emailInvalid).max(200),
    company: optionalText(150),
    phone: optionalText(30),
  });
}

export const clientProfileSchema = getClientProfileSchema();
export type ClientProfileInput = z.infer<typeof clientProfileSchema>;

export function getClientChangePasswordSchema(lang: ClientSpaceLanguage = "en") {
  const m = messages(lang);
  return z.object({
    currentPassword: z.string().min(1, m.currentPasswordRequired),
    newPassword: z.string().min(6, m.passwordMin),
  });
}

export const clientChangePasswordSchema = getClientChangePasswordSchema();
export type ClientChangePasswordInput = z.infer<typeof clientChangePasswordSchema>;
