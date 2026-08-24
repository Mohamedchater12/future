"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import ClientPicker from "@/components/admin/missions/ClientPicker";
import { SERVICE_TITLES } from "@/lib/services";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { missionsTranslations } from "@/lib/i18n/admin/missions";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function MissionFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = missionsTranslations[lang];
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [stepsText, setStepsText] = useState("Brief validated\nProduction\nDelivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label) => ({ label }));

    if (!clientId) {
      setError(dict.form.selectClientError);
      return;
    }
    if (steps.length === 0) {
      setError(dict.form.addStepError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          title,
          service,
          description,
          status: "EN_ATTENTE",
          progress: 0,
          steps,
        }),
      });
      if (!response.ok) throw new Error("create_failed");

      toast.success(dict.toasts.trackerCreated);
      onCreated();
    } catch {
      toast.error(dict.toasts.createFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={dict.form.modalTitle} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.clientLabel}</label>
          <ClientPicker value={clientId} onChange={setClientId} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.titleLabel}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.serviceLabel}</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className={inputClasses}
          >
            <option value="" className="bg-base-black">
              {dict.form.selectPlaceholder}
            </option>
            {SERVICE_TITLES.map((s) => (
              <option key={s} value={s} className="bg-base-black">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.descriptionLabel}</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            {dict.form.stepsLabel}
          </label>
          <textarea
            rows={4}
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            className={`${inputClasses} resize-none`}
          />
          <p className="mt-1 text-xs text-base-gray">
            {dict.form.stepsHint}
          </p>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
          >
            {dict.form.cancel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-full bg-purple px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <IconLoader2 size={14} className="animate-spin" />}
            {dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}
