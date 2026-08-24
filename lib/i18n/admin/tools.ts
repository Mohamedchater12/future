import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface ToolsDictionary {
  pageTitle: string;
  pageSubtitle: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  table: {
    order: string;
    tool: string;
    category: string;
    status: string;
    empty: string;
    moveUpAria: string;
    moveDownAria: string;
    editAria: string;
    deleteAria: string;
  };
  form: {
    editTitle: string;
    addTitle: string;
    name: string;
    icon: string;
    category: string;
    order: string;
    visible: string;
    cancel: string;
    save: string;
    create: string;
  };
  toast: {
    updated: string;
    created: string;
    saveError: string;
    visibilityError: string;
    reorderError: string;
    deleted: string;
    deleteError: string;
  };
  confirmDelete: {
    title: string;
    description: string;
  };
  categories: {
    design: string;
    development: string;
    marketing: string;
    other: string;
  };
}

export const toolsTranslations: Record<AdminLanguage, ToolsDictionary> = {
  en: {
    pageTitle: "Tools",
    pageSubtitle: "Tools and technologies displayed on the landing page.",
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load tools.",
    retry: "Retry",
    table: {
      order: "Order",
      tool: "Tool",
      category: "Category",
      status: "Status",
      empty: "No tools yet.",
      moveUpAria: "Move up",
      moveDownAria: "Move down",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit tool",
      addTitle: "Add tool",
      name: "Name",
      icon: "Icon / logo",
      category: "Category",
      order: "Order",
      visible: "Visible on the landing page",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Tool updated",
      created: "Tool added",
      saveError: "Unable to save this tool",
      visibilityError: "Unable to update visibility",
      reorderError: "Unable to reorder",
      deleted: "Tool deleted",
      deleteError: "Unable to delete this tool",
    },
    confirmDelete: {
      title: "Delete this tool?",
      description: "This tool will disappear from the landing page immediately.",
    },
    categories: {
      design: "Design",
      development: "Development",
      marketing: "Marketing",
      other: "Other",
    },
  },
  ar: {
    pageTitle: "الأدوات",
    pageSubtitle: "الأدوات والتقنيات المعروضة على الصفحة الرئيسية.",
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل الأدوات.",
    retry: "إعادة المحاولة",
    table: {
      order: "الترتيب",
      tool: "الأداة",
      category: "الفئة",
      status: "الحالة",
      empty: "لا توجد أدوات حتى الآن.",
      moveUpAria: "تحريك للأعلى",
      moveDownAria: "تحريك للأسفل",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل الأداة",
      addTitle: "إضافة أداة",
      name: "الاسم",
      icon: "الأيقونة / الشعار",
      category: "الفئة",
      order: "الترتيب",
      visible: "ظاهر على الصفحة الرئيسية",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث الأداة",
      created: "تمت إضافة الأداة",
      saveError: "تعذّر حفظ هذه الأداة",
      visibilityError: "تعذّر تحديث حالة الظهور",
      reorderError: "تعذّر إعادة الترتيب",
      deleted: "تم حذف الأداة",
      deleteError: "تعذّر حذف هذه الأداة",
    },
    confirmDelete: {
      title: "هل تريد حذف هذه الأداة؟",
      description: "ستختفي هذه الأداة فورًا من الصفحة الرئيسية.",
    },
    categories: {
      design: "تصميم",
      development: "تطوير",
      marketing: "تسويق",
      other: "أخرى",
    },
  },
};
