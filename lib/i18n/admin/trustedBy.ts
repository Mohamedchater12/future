import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface TrustedByDictionary {
  pageTitle: string;
  pageSubtitle: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  table: {
    order: string;
    brand: string;
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
    logo: string;
    brandName: string;
    externalLink: string;
    externalLinkPlaceholder: string;
    order: string;
    visibleOnLandingPage: string;
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

export const trustedByTranslations: Record<AdminLanguage, TrustedByDictionary> = {
  en: {
    pageTitle: "Trusted By",
    pageSubtitle: 'Logos displayed in the "Trusted By" section.',
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load brands.",
    retry: "Retry",
    table: {
      order: "Order",
      brand: "Brand",
      status: "Status",
      empty: "No brands yet.",
      moveUpAria: "Move up",
      moveDownAria: "Move down",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit brand",
      addTitle: "Add brand",
      logo: "Logo",
      brandName: "Brand name",
      externalLink: "External link (optional)",
      externalLinkPlaceholder: "https://…",
      order: "Order",
      visibleOnLandingPage: "Visible on the landing page",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Brand updated",
      created: "Brand added",
      saveError: "Unable to save this brand",
      visibilityError: "Unable to update visibility",
      reorderError: "Unable to reorder",
      deleted: "Brand deleted",
      deleteError: "Unable to delete this brand",
    },
    confirmDelete: {
      title: "Delete this brand?",
      description: "This logo will disappear from the landing page immediately.",
    },
  },
  ar: {
    pageTitle: "الجهات الموثوقة",
    pageSubtitle: 'الشعارات المعروضة في قسم "الجهات الموثوقة".',
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل العلامات التجارية.",
    retry: "إعادة المحاولة",
    table: {
      order: "الترتيب",
      brand: "العلامة التجارية",
      status: "الحالة",
      empty: "لا توجد علامات تجارية بعد.",
      moveUpAria: "تحريك للأعلى",
      moveDownAria: "تحريك للأسفل",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل العلامة التجارية",
      addTitle: "إضافة علامة تجارية",
      logo: "الشعار",
      brandName: "اسم العلامة التجارية",
      externalLink: "رابط خارجي (اختياري)",
      externalLinkPlaceholder: "https://…",
      order: "الترتيب",
      visibleOnLandingPage: "ظاهر في الصفحة الرئيسية",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث العلامة التجارية",
      created: "تمت إضافة العلامة التجارية",
      saveError: "تعذّر حفظ هذه العلامة التجارية",
      visibilityError: "تعذّر تحديث الظهور",
      reorderError: "تعذّر إعادة الترتيب",
      deleted: "تم حذف العلامة التجارية",
      deleteError: "تعذّر حذف هذه العلامة التجارية",
    },
    confirmDelete: {
      title: "هل تريد حذف هذه العلامة التجارية؟",
      description: "سيختفي هذا الشعار من الصفحة الرئيسية فورًا.",
    },
  },
};
