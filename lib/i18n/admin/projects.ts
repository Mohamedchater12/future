import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface ProjectsDictionary {
  pageTitle: string;
  pageSubtitle: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  table: {
    order: string;
    project: string;
    result: string;
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
    title: string;
    category: string;
    categoryPlaceholder: string;
    result: string;
    resultPlaceholder: string;
    description: string;
    descriptionHint: string;
    descriptionPlaceholder: string;
    coverImage: string;
    order: string;
    visible: string;
    previewHeading: string;
    previewCategoryFallback: string;
    previewTitleFallback: string;
    previewResultLabel: string;
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
}

export const projectsTranslations: Record<AdminLanguage, ProjectsDictionary> = {
  en: {
    pageTitle: "Projects",
    pageSubtitle: "Manage the case studies displayed on the landing page.",
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load projects.",
    retry: "Retry",
    table: {
      order: "Order",
      project: "Project",
      result: "Result",
      status: "Status",
      empty: "No projects yet.",
      moveUpAria: "Move up",
      moveDownAria: "Move down",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit project",
      addTitle: "Add project",
      title: "Title",
      category: "Category",
      categoryPlaceholder: "e.g. Identity + launch campaign",
      result: "Result",
      resultPlaceholder: "e.g. +42% reach",
      description: "Description",
      descriptionHint: "(shown when a visitor clicks the project)",
      descriptionPlaceholder: "What was the brief, the approach, the outcome…",
      coverImage: "Cover image (optional)",
      order: "Order",
      visible: "Visible on the landing page",
      previewHeading: "Preview on the landing page",
      previewCategoryFallback: "Category",
      previewTitleFallback: "Project title",
      previewResultLabel: "Result",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Project updated",
      created: "Project created",
      saveError: "Unable to save project",
      visibilityError: "Unable to update visibility",
      reorderError: "Unable to reorder projects",
      deleted: "Project deleted",
      deleteError: "Unable to delete this project",
    },
    confirmDelete: {
      title: "Delete this project?",
      description: "This project will disappear from the landing page immediately.",
    },
  },
  ar: {
    pageTitle: "المشاريع",
    pageSubtitle: "إدارة دراسات الحالة المعروضة على الصفحة الرئيسية.",
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل المشاريع.",
    retry: "إعادة المحاولة",
    table: {
      order: "الترتيب",
      project: "المشروع",
      result: "النتيجة",
      status: "الحالة",
      empty: "لا توجد مشاريع حتى الآن.",
      moveUpAria: "تحريك للأعلى",
      moveDownAria: "تحريك للأسفل",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل المشروع",
      addTitle: "إضافة مشروع",
      title: "العنوان",
      category: "الفئة",
      categoryPlaceholder: "مثال: الهوية + حملة الإطلاق",
      result: "النتيجة",
      resultPlaceholder: "مثال: +42% في الانتشار",
      description: "الوصف",
      descriptionHint: "(يظهر عند نقر الزائر على المشروع)",
      descriptionPlaceholder: "ما كان الموجز، والمنهجية، والنتيجة…",
      coverImage: "صورة الغلاف (اختياري)",
      order: "الترتيب",
      visible: "ظاهر على الصفحة الرئيسية",
      previewHeading: "معاينة على الصفحة الرئيسية",
      previewCategoryFallback: "الفئة",
      previewTitleFallback: "عنوان المشروع",
      previewResultLabel: "النتيجة",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث المشروع",
      created: "تم إنشاء المشروع",
      saveError: "تعذّر حفظ المشروع",
      visibilityError: "تعذّر تحديث حالة الظهور",
      reorderError: "تعذّر إعادة ترتيب المشاريع",
      deleted: "تم حذف المشروع",
      deleteError: "تعذّر حذف هذا المشروع",
    },
    confirmDelete: {
      title: "هل تريد حذف هذا المشروع؟",
      description: "سيختفي هذا المشروع فورًا من الصفحة الرئيسية.",
    },
  },
};
