import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface MissionsDictionary {
  page: {
    title: string;
    subtitle: string;
    newTracker: string;
  };
  filters: {
    allStatuses: string;
  };
  status: {
    pending: string;
    inProgress: string;
    completed: string;
  };
  stepStatus: {
    todo: string;
    inProgress: string;
    done: string;
  };
  table: {
    columnClient: string;
    columnTitle: string;
    columnStatus: string;
    columnProgress: string;
    empty: string;
  };
  list: {
    loading: string;
    loadError: string;
    retry: string;
  };
  clientPicker: {
    searchPlaceholder: string;
    noClientFound: string;
  };
  form: {
    modalTitle: string;
    clientLabel: string;
    titleLabel: string;
    serviceLabel: string;
    selectPlaceholder: string;
    descriptionLabel: string;
    stepsLabel: string;
    stepsHint: string;
    selectClientError: string;
    addStepError: string;
    cancel: string;
    create: string;
  };
  detail: {
    closeAriaLabel: string;
    progressComplete: string;
    statusLabel: string;
    descriptionLabel: string;
    save: string;
    stepsTitle: string;
    stepsSubtitle: string;
    newStepPlaceholder: string;
    filesTitle: string;
    uploadedByYou: string;
    uploadedByClient: string;
    fileNamePlaceholder: string;
    fileUrlPlaceholder: string;
    deleteTracker: string;
  };
  step: {
    moveUpAriaLabel: string;
    moveDownAriaLabel: string;
    deleteAriaLabel: string;
    notePlaceholder: string;
    saving: string;
    removeImageAriaLabel: string;
    addImage: string;
  };
  deleteDialog: {
    title: string;
    description: string;
  };
  toasts: {
    statusUpdated: string;
    statusUpdateFailed: string;
    descriptionSaved: string;
    descriptionSaveFailed: string;
    reorderFailed: string;
    addStepFailed: string;
    fileAdded: string;
    addFileFailed: string;
    trackerCreated: string;
    createFailed: string;
    stepStatusUpdated: string;
    stepUpdateFailed: string;
    noteSaveFailed: string;
    imageAdded: string;
    imageUploadFailed: string;
    imageRemoveFailed: string;
    stepRemoved: string;
    stepRemoveFailed: string;
    trackerDeleted: string;
    deleteFailed: string;
  };
}

export const missionsTranslations: Record<AdminLanguage, MissionsDictionary> = {
  en: {
    page: {
      title: "Client work",
      subtitle: "What clients see in their portal: project status and progress.",
      newTracker: "New tracker",
    },
    filters: {
      allStatuses: "All statuses",
    },
    status: {
      pending: "Pending",
      inProgress: "In progress",
      completed: "Completed",
    },
    stepStatus: {
      todo: "To do",
      inProgress: "In progress",
      done: "Done",
    },
    table: {
      columnClient: "Client",
      columnTitle: "Title",
      columnStatus: "Status",
      columnProgress: "Progress",
      empty: "No work trackers yet.",
    },
    list: {
      loading: "Loading…",
      loadError: "Unable to load work trackers.",
      retry: "Retry",
    },
    clientPicker: {
      searchPlaceholder: "Search for a client…",
      noClientFound: "No client found.",
    },
    form: {
      modalTitle: "New work tracker",
      clientLabel: "Client",
      titleLabel: "Title",
      serviceLabel: "Service",
      selectPlaceholder: "Select…",
      descriptionLabel: "Description",
      stepsLabel: "Steps (one per line)",
      stepsHint: "The client's progress bar is calculated automatically from completed steps.",
      selectClientError: "Select a client.",
      addStepError: "Add at least one step.",
      cancel: "Cancel",
      create: "Create",
    },
    detail: {
      closeAriaLabel: "Close",
      progressComplete: "{percent}% complete",
      statusLabel: "Status (client-visible)",
      descriptionLabel: "Description",
      save: "Save",
      stepsTitle: "Steps",
      stepsSubtitle: "(status, note, image, order)",
      newStepPlaceholder: "New step name",
      filesTitle: "Shared files",
      uploadedByYou: "You",
      uploadedByClient: "Client",
      fileNamePlaceholder: "File name",
      fileUrlPlaceholder: "URL (existing upload or Drive/Figma link)",
      deleteTracker: "Delete this tracker",
    },
    step: {
      moveUpAriaLabel: "Move up",
      moveDownAriaLabel: "Move down",
      deleteAriaLabel: "Delete step",
      notePlaceholder: "Note visible by the client…",
      saving: "Saving…",
      removeImageAriaLabel: "Remove image",
      addImage: "Add image",
    },
    deleteDialog: {
      title: "Delete this tracker?",
      description: "The client will no longer see this work item. This action is irreversible.",
    },
    toasts: {
      statusUpdated: "Status updated — visible to the client",
      statusUpdateFailed: "Unable to update the status",
      descriptionSaved: "Description saved",
      descriptionSaveFailed: "Unable to save the description",
      reorderFailed: "Unable to reorder steps",
      addStepFailed: "Unable to add this step",
      fileAdded: "File added",
      addFileFailed: "Unable to add this file",
      trackerCreated: "Work tracker created",
      createFailed: "Unable to create this tracker",
      stepStatusUpdated: "Step status updated — visible to the client",
      stepUpdateFailed: "Unable to update this step",
      noteSaveFailed: "Unable to save this note",
      imageAdded: "Image added",
      imageUploadFailed: "Unable to upload this image",
      imageRemoveFailed: "Unable to remove this image",
      stepRemoved: "Step removed",
      stepRemoveFailed: "Unable to remove this step",
      trackerDeleted: "Tracker deleted",
      deleteFailed: "Unable to delete this tracker",
    },
  },
  ar: {
    page: {
      title: "أعمال العملاء",
      subtitle: "ما يراه العملاء في بوابتهم: حالة المشروع ونسبة التقدم.",
      newTracker: "متتبع جديد",
    },
    filters: {
      allStatuses: "جميع الحالات",
    },
    status: {
      pending: "قيد الانتظار",
      inProgress: "قيد التنفيذ",
      completed: "مكتمل",
    },
    stepStatus: {
      todo: "لم يبدأ",
      inProgress: "قيد التنفيذ",
      done: "تم",
    },
    table: {
      columnClient: "العميل",
      columnTitle: "العنوان",
      columnStatus: "الحالة",
      columnProgress: "التقدم",
      empty: "لا توجد متتبعات عمل حتى الآن.",
    },
    list: {
      loading: "جارٍ التحميل…",
      loadError: "تعذّر تحميل متتبعات العمل.",
      retry: "إعادة المحاولة",
    },
    clientPicker: {
      searchPlaceholder: "البحث عن عميل…",
      noClientFound: "لم يتم العثور على عميل.",
    },
    form: {
      modalTitle: "متتبع عمل جديد",
      clientLabel: "العميل",
      titleLabel: "العنوان",
      serviceLabel: "الخدمة",
      selectPlaceholder: "اختر…",
      descriptionLabel: "الوصف",
      stepsLabel: "الخطوات (خطوة في كل سطر)",
      stepsHint: "يُحسب شريط تقدم العميل تلقائيًا بناءً على الخطوات المكتملة.",
      selectClientError: "اختر عميلاً.",
      addStepError: "أضف خطوة واحدة على الأقل.",
      cancel: "إلغاء",
      create: "إنشاء",
    },
    detail: {
      closeAriaLabel: "إغلاق",
      progressComplete: "اكتمال {percent}%",
      statusLabel: "الحالة (مرئية للعميل)",
      descriptionLabel: "الوصف",
      save: "حفظ",
      stepsTitle: "الخطوات",
      stepsSubtitle: "(الحالة، الملاحظة، الصورة، الترتيب)",
      newStepPlaceholder: "اسم الخطوة الجديدة",
      filesTitle: "الملفات المشتركة",
      uploadedByYou: "أنت",
      uploadedByClient: "العميل",
      fileNamePlaceholder: "اسم الملف",
      fileUrlPlaceholder: "الرابط (رفع حالي أو رابط Drive/Figma)",
      deleteTracker: "حذف هذا المتتبع",
    },
    step: {
      moveUpAriaLabel: "نقل للأعلى",
      moveDownAriaLabel: "نقل للأسفل",
      deleteAriaLabel: "حذف الخطوة",
      notePlaceholder: "ملاحظة يراها العميل…",
      saving: "جارٍ الحفظ…",
      removeImageAriaLabel: "إزالة الصورة",
      addImage: "إضافة صورة",
    },
    deleteDialog: {
      title: "حذف هذا المتتبع؟",
      description: "لن يتمكن العميل من رؤية هذا العنصر بعد الآن. لا يمكن التراجع عن هذا الإجراء.",
    },
    toasts: {
      statusUpdated: "تم تحديث الحالة — مرئية للعميل",
      statusUpdateFailed: "تعذّر تحديث الحالة",
      descriptionSaved: "تم حفظ الوصف",
      descriptionSaveFailed: "تعذّر حفظ الوصف",
      reorderFailed: "تعذّر إعادة ترتيب الخطوات",
      addStepFailed: "تعذّر إضافة هذه الخطوة",
      fileAdded: "تمت إضافة الملف",
      addFileFailed: "تعذّر إضافة هذا الملف",
      trackerCreated: "تم إنشاء متتبع العمل",
      createFailed: "تعذّر إنشاء هذا المتتبع",
      stepStatusUpdated: "تم تحديث حالة الخطوة — مرئية للعميل",
      stepUpdateFailed: "تعذّر تحديث هذه الخطوة",
      noteSaveFailed: "تعذّر حفظ هذه الملاحظة",
      imageAdded: "تمت إضافة الصورة",
      imageUploadFailed: "تعذّر رفع هذه الصورة",
      imageRemoveFailed: "تعذّر إزالة هذه الصورة",
      stepRemoved: "تمت إزالة الخطوة",
      stepRemoveFailed: "تعذّر إزالة هذه الخطوة",
      trackerDeleted: "تم حذف المتتبع",
      deleteFailed: "تعذّر حذف هذا المتتبع",
    },
  },
};
