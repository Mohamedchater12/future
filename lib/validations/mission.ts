import { z } from "zod";

export const missionStatusValues = ["EN_ATTENTE", "EN_COURS", "TERMINE"] as const;

// Statut par étape (MissionStep) — distinct du statut global de la Mission
// ci-dessus : une mission "EN_COURS" peut avoir des étapes encore À_FAIRE.
export const stepStatusValues = ["A_FAIRE", "EN_COURS", "TERMINE"] as const;

export const missionStepInputSchema = z.object({
  label: z.string().trim().min(1, "Le libellé est requis").max(150),
});

export const missionSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  title: z.string().trim().min(1, "Le titre est requis").max(150),
  service: z.string().trim().min(1, "Le service est requis").max(150),
  description: z.string().trim().min(1, "La description est requise").max(3000),
  status: z.enum(missionStatusValues),
  progress: z.coerce.number().int().min(0).max(100),
  steps: z.array(missionStepInputSchema).min(1, "Ajoutez au moins une étape"),
});

export type MissionInput = z.infer<typeof missionSchema>;

export const updateMissionSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  service: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().min(1).max(3000).optional(),
  status: z.enum(missionStatusValues).optional(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
});

export type UpdateMissionInput = z.infer<typeof updateMissionSchema>;

export const addMissionStepSchema = z.object({
  label: z.string().trim().min(1, "Le libellé est requis").max(150),
});

export type AddMissionStepInput = z.infer<typeof addMissionStepSchema>;

export const updateMissionStepSchema = z.object({
  status: z.enum(stepStatusValues).optional(),
  note: z.string().trim().max(2000).nullable().optional(),
  imageUrl: z.string().trim().max(2000).nullable().optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export type UpdateMissionStepInput = z.infer<typeof updateMissionStepSchema>;

export const missionFileSchema = z.object({
  name: z.string().trim().min(1, "Nom de fichier requis").max(200),
  url: z.string().trim().min(1, "URL requise"),
});

export type MissionFileInput = z.infer<typeof missionFileSchema>;
