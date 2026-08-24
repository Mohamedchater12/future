import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface ClientsDictionary {
  pageTitle: string;
  pageSubtitle: string;
  searchPlaceholder: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  pagination: string;
  table: {
    client: string;
    contact: string;
    project: string;
    status: string;
    empty: string;
    editAria: string;
    deleteAria: string;
  };
  form: {
    editTitle: string;
    addTitle: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    project: string;
    status: string;
    notes: string;
    cancel: string;
    save: string;
    create: string;
  };
  toast: {
    updated: string;
    created: string;
    saveError: string;
    notFound: string;
    deleted: string;
    deleteError: string;
  };
  confirmDelete: {
    title: string;
    description: string;
  };
  status: {
    active: string;
    archived: string;
  };
}

export const clientsTranslations: Record<AdminLanguage, ClientsDictionary> = {
  en: {
    pageTitle: "Clients",
    pageSubtitle: "Manage your client portfolio.",
    searchPlaceholder: "Search by name, email…",
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load clients.",
    retry: "Retry",
    pagination: "Page {page} / {total}",
    table: {
      client: "Client",
      contact: "Contact",
      project: "Project",
      status: "Status",
      empty: "No clients found.",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit client",
      addTitle: "Add client",
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      project: "Associated project",
      status: "Status",
      notes: "Notes",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Client updated",
      created: "Client created",
      saveError: "Unable to save client",
      notFound: "Client not found",
      deleted: "Client deleted",
      deleteError: "Unable to delete this client",
    },
    confirmDelete: {
      title: "Delete this client?",
      description: "This action is irreversible. Linked requests will be kept but unlinked.",
    },
    status: {
      active: "Active",
      archived: "Archived",
    },
  },
  ar: {
    pageTitle: "العملاء",
    pageSubtitle: "إدارة محفظة عملائك.",
    searchPlaceholder: "البحث بالاسم أو البريد الإلكتروني…",
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل العملاء.",
    retry: "إعادة المحاولة",
    pagination: "صفحة {page} من {total}",
    table: {
      client: "العميل",
      contact: "التواصل",
      project: "المشروع",
      status: "الحالة",
      empty: "لا يوجد عملاء.",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل العميل",
      addTitle: "إضافة عميل",
      name: "الاسم",
      company: "الشركة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      project: "المشروع المرتبط",
      status: "الحالة",
      notes: "ملاحظات",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث العميل",
      created: "تم إنشاء العميل",
      saveError: "تعذّر حفظ العميل",
      notFound: "العميل غير موجود",
      deleted: "تم حذف العميل",
      deleteError: "تعذّر حذف هذا العميل",
    },
    confirmDelete: {
      title: "هل تريد حذف هذا العميل؟",
      description:
        "هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم الاحتفاظ بالطلبات المرتبطة دون ربطها بعميل.",
    },
    status: {
      active: "نشط",
      archived: "مؤرشف",
    },
  },
};
