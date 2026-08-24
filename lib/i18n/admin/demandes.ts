import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface DemandesDictionary {
  page: {
    title: string;
    subtitle: string;
  };
  filters: {
    allStatuses: string;
    newestFirst: string;
    oldestFirst: string;
  };
  status: {
    new: string;
    inProgress: string;
    processed: string;
    archived: string;
  };
  table: {
    columnContact: string;
    columnService: string;
    columnStatus: string;
    columnDate: string;
    deleteAriaLabel: string;
    empty: string;
  };
  list: {
    loading: string;
    loadError: string;
    retry: string;
  };
  deleteDialog: {
    title: string;
    description: string;
  };
  toasts: {
    requestDeleted: string;
    deleteFailed: string;
  };
  detail: {
    closeAriaLabel: string;
    requestedService: string;
    message: string;
    status: string;
    internalNote: string;
    saveNote: string;
    acceptedClientPrefix: string;
    acceptRequest: string;
    statusUpdated: string;
    statusUpdateFailed: string;
    noteSaved: string;
    noteSaveFailed: string;
    convertedToClient: string;
    convertFailed: string;
  };
}

export const demandesTranslations: Record<AdminLanguage, DemandesDictionary> = {
  en: {
    page: {
      title: "Requests",
      subtitle: "Requests received via the landing page contact form.",
    },
    filters: {
      allStatuses: "All statuses",
      newestFirst: "Newest first",
      oldestFirst: "Oldest first",
    },
    status: {
      new: "New",
      inProgress: "In progress",
      processed: "Processed",
      archived: "Archived",
    },
    table: {
      columnContact: "Contact",
      columnService: "Service",
      columnStatus: "Status",
      columnDate: "Date",
      deleteAriaLabel: "Delete",
      empty: "No requests match this filter.",
    },
    list: {
      loading: "Loading…",
      loadError: "Unable to load requests.",
      retry: "Retry",
    },
    deleteDialog: {
      title: "Delete this request?",
      description: "This action is irreversible. The request will be permanently deleted.",
    },
    toasts: {
      requestDeleted: "Request deleted",
      deleteFailed: "Unable to delete this request",
    },
    detail: {
      closeAriaLabel: "Close",
      requestedService: "Requested service",
      message: "Message",
      status: "Status",
      internalNote: "Internal note",
      saveNote: "Save note",
      acceptedClientPrefix: "Accepted — client: {name}",
      acceptRequest: "Accept request",
      statusUpdated: "Status updated",
      statusUpdateFailed: "Unable to update status",
      noteSaved: "Note saved",
      noteSaveFailed: "Unable to save note",
      convertedToClient: "Request converted to client",
      convertFailed: "Unable to convert this request",
    },
  },
  ar: {
    page: {
      title: "الطلبات",
      subtitle: "الطلبات المستلمة عبر نموذج الاتصال في الصفحة الرئيسية.",
    },
    filters: {
      allStatuses: "جميع الحالات",
      newestFirst: "الأحدث أولاً",
      oldestFirst: "الأقدم أولاً",
    },
    status: {
      new: "جديد",
      inProgress: "قيد المعالجة",
      processed: "تمت المعالجة",
      archived: "مؤرشف",
    },
    table: {
      columnContact: "جهة الاتصال",
      columnService: "الخدمة",
      columnStatus: "الحالة",
      columnDate: "التاريخ",
      deleteAriaLabel: "حذف",
      empty: "لا توجد طلبات مطابقة لهذا الفلتر.",
    },
    list: {
      loading: "جارٍ التحميل…",
      loadError: "تعذّر تحميل الطلبات.",
      retry: "إعادة المحاولة",
    },
    deleteDialog: {
      title: "حذف هذا الطلب؟",
      description: "لا يمكن التراجع عن هذا الإجراء. سيتم حذف الطلب بشكل نهائي.",
    },
    toasts: {
      requestDeleted: "تم حذف الطلب",
      deleteFailed: "تعذّر حذف هذا الطلب",
    },
    detail: {
      closeAriaLabel: "إغلاق",
      requestedService: "الخدمة المطلوبة",
      message: "الرسالة",
      status: "الحالة",
      internalNote: "ملاحظة داخلية",
      saveNote: "حفظ الملاحظة",
      acceptedClientPrefix: "مقبول — العميل: {name}",
      acceptRequest: "قبول الطلب",
      statusUpdated: "تم تحديث الحالة",
      statusUpdateFailed: "تعذّر تحديث الحالة",
      noteSaved: "تم حفظ الملاحظة",
      noteSaveFailed: "تعذّر حفظ الملاحظة",
      convertedToClient: "تم تحويل الطلب إلى عميل",
      convertFailed: "تعذّر تحويل هذا الطلب",
    },
  },
};
