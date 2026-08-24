"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  IconBrandWhatsapp,
  IconMapPin,
  IconMail,
  IconPhone,
  IconCheck,
} from "@tabler/icons-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/contactInfo";
import Starfield from "@/components/Starfield";

const PHONE_PATTERN = /^\+?[0-9\s().-]{8,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

const inputClasses =
  "w-full rounded-lg border border-portal-border bg-portal-card px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-portal-accent focus:ring-2 focus:ring-portal-accent/40";

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Contact() {
  const { dict } = useLanguage();
  const { contact } = dict;
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.lastName.trim()) next.lastName = contact.errors.lastName;
    if (!form.firstName.trim()) next.firstName = contact.errors.firstName;
    if (!form.email.trim()) {
      next.email = contact.errors.emailRequired;
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = contact.errors.emailInvalid;
    }
    if (!form.phone.trim()) {
      next.phone = contact.errors.phoneRequired;
    } else if (!PHONE_PATTERN.test(form.phone.trim())) {
      next.phone = contact.errors.phoneInvalid;
    }
    if (!form.service) next.service = contact.errors.service;
    if (!form.message.trim()) next.message = contact.errors.message;
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("submission_failed");

      setSubmitted(true);
      setForm(INITIAL_STATE);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-portal-bg py-28 sm:py-36"
    >
      <Starfield />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-portal-accent/10 blur-[140px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Intro + direct contact */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeUp}
        >
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-portal-border">
            {contact.badge}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            {contact.title} <span className="text-gradient">{contact.highlight}</span>
          </h2>
          <p className="mt-6 max-w-md text-base text-base-gray sm:text-lg">
            {contact.subtitle}
          </p>

          <a
            href={getWhatsAppLink(contact.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
          >
            <IconBrandWhatsapp size={20} />
            {contact.whatsappCta}
          </a>

          <ul className="mt-10 space-y-4 text-sm text-base-gray">
            <li className="flex items-center gap-3">
              <IconMapPin size={18} className="shrink-0 text-portal-accent" />
              {contact.address}
            </li>
            <li className="flex items-center gap-3">
              <IconMail size={18} className="shrink-0 text-portal-accent" />
              <a href={`mailto:${CONTACT_EMAIL}`} data-cursor-hover className="hover:text-white">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconPhone size={18} className="shrink-0 text-portal-accent" />
              <a href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}`} data-cursor-hover className="hover:text-white">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Form */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={1}
          variants={fadeUp}
          className="rounded-xl border border-portal-border bg-portal-card/60 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.15)] transition-colors duration-300 focus-within:border-portal-accent/60 sm:p-8"
        >
          <h3 className="font-heading text-xl font-semibold text-white">
            {contact.formTitle}
          </h3>

          {submitted && (
            <div
              role="status"
              className="mt-6 flex items-center gap-2 rounded-lg border border-portal-accent/40 bg-portal-accent/10 px-4 py-3 text-sm text-white"
            >
              <IconCheck size={18} className="shrink-0 text-portal-accent" />
              {contact.successMessage}
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              className="mt-6 flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-white"
            >
              {contact.errors.submitFailed}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-white">
                  {contact.labels.lastName}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  className={inputClasses}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1.5 text-xs text-red-400">
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-white">
                  {contact.labels.firstName}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  className={inputClasses}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1.5 text-xs text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
                {contact.labels.email}
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClasses}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white">
                  {contact.labels.phone}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder={contact.labels.phonePlaceholder}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={inputClasses}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1.5 text-xs text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-white">
                  {contact.labels.company}
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-white">
                {contact.labels.service}
              </label>
              <select
                id="service"
                value={form.service}
                onChange={(e) => update("service", e.target.value)}
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? "service-error" : undefined}
                className={inputClasses}
              >
                <option value="" disabled>
                  {contact.labels.servicePlaceholder}
                </option>
                {dict.services.items.map((service) => (
                  <option key={service.title} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p id="service-error" className="mt-1.5 text-xs text-red-400">
                  {errors.service}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white">
                {contact.labels.message}
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`${inputClasses} resize-none`}
              />
              {errors.message && (
                <p id="message-error" className="mt-1.5 text-xs text-red-400">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              data-cursor-hover
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {contact.labels.submit}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
