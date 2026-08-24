import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface ServicesDictionary {
  pageTitle: string;
  pageSubtitle: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  table: {
    order: string;
    service: string;
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
    titleLabel: string;
    descriptionLabel: string;
    iconLabel: string;
    imageLabel: string;
    orderLabel: string;
    visibleLabel: string;
    previewLabel: string;
    previewTitleFallback: string;
    previewDescriptionFallback: string;
    cancel: string;
    save: string;
    create: string;
  };
  toast: {
    updated: string;
    created: string;
    saveError: string;
    deleted: string;
    deleteError: string;
    visibilityError: string;
    reorderError: string;
  };
  confirmDelete: {
    title: string;
    description: string;
  };
}

export const servicesTranslations: Record<AdminLanguage, ServicesDictionary> = {
  en: {
    pageTitle: "Services",
    pageSubtitle: "Manage the services displayed on the landing page.",
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load services.",
    retry: "Retry",
    table: {
      order: "Order",
      service: "Service",
      status: "Status",
      empty: "No services yet.",
      moveUpAria: "Move up",
      moveDownAria: "Move down",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit service",
      addTitle: "Add service",
      titleLabel: "Title",
      descriptionLabel: "Description",
      iconLabel: "Icon",
      imageLabel: "Image (optional)",
      orderLabel: "Order",
      visibleLabel: "Visible on the landing page",
      previewLabel: "Preview on the landing page",
      previewTitleFallback: "Service title",
      previewDescriptionFallback: "Service description…",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Service updated",
      created: "Service created",
      saveError: "Unable to save service",
      deleted: "Service deleted",
      deleteError: "Unable to delete this service",
      visibilityError: "Unable to update visibility",
      reorderError: "Unable to reorder services",
    },
    confirmDelete: {
      title: "Delete this service?",
      description: "This service will disappear from the landing page immediately.",
    },
  },
  ar: {
    pageTitle: "الخدمات",
    pageSubtitle: "إدارة الخدمات المعروضة على الصفحة الرئيسية.",
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل الخدمات.",
    retry: "إعادة المحاولة",
    table: {
      order: "الترتيب",
      service: "الخدمة",
      status: "الحالة",
      empty: "لا توجد خدمات حتى الآن.",
      moveUpAria: "نقل للأعلى",
      moveDownAria: "نقل للأسفل",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل الخدمة",
      addTitle: "إضافة خدمة",
      titleLabel: "العنوان",
      descriptionLabel: "الوصف",
      iconLabel: "الأيقونة",
      imageLabel: "الصورة (اختياري)",
      orderLabel: "الترتيب",
      visibleLabel: "ظاهر على الصفحة الرئيسية",
      previewLabel: "معاينة على الصفحة الرئيسية",
      previewTitleFallback: "عنوان الخدمة",
      previewDescriptionFallback: "وصف الخدمة…",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث الخدمة",
      created: "تم إنشاء الخدمة",
      saveError: "تعذّر حفظ الخدمة",
      deleted: "تم حذف الخدمة",
      deleteError: "تعذّر حذف هذه الخدمة",
      visibilityError: "تعذّر تحديث حالة الظهور",
      reorderError: "تعذّر إعادة ترتيب الخدمات",
    },
    confirmDelete: {
      title: "هل تريد حذف هذه الخدمة؟",
      description: "ستختفي هذه الخدمة من الصفحة الرئيسية فورًا.",
    },
  },
};
