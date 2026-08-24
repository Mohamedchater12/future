import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface AvisDictionary {
  pageTitle: string;
  pageSubtitle: string;
  statusAll: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  table: {
    client: string;
    review: string;
    status: string;
    featured: string;
    empty: string;
    portalClient: string;
    featuredLabel: string;
    standardLabel: string;
    editAria: string;
    deleteAria: string;
  };
  form: {
    editTitle: string;
    addTitle: string;
    clientName: string;
    company: string;
    photo: string;
    rating: string;
    reviewText: string;
    status: string;
    featureThisReview: string;
    cancel: string;
    save: string;
    create: string;
  };
  toast: {
    updated: string;
    created: string;
    saveError: string;
    toggleFeaturedError: string;
    deleted: string;
    deleteError: string;
  };
  confirmDelete: {
    title: string;
    description: string;
  };
  status: {
    published: string;
    pending: string;
    hidden: string;
  };
}

export const avisTranslations: Record<AdminLanguage, AvisDictionary> = {
  en: {
    pageTitle: "Client reviews",
    pageSubtitle: "Testimonials displayed on the landing page.",
    statusAll: "All statuses",
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load reviews.",
    retry: "Retry",
    table: {
      client: "Client",
      review: "Review",
      status: "Status",
      featured: "Featured",
      empty: "No reviews match this filter.",
      portalClient: "Portal client",
      featuredLabel: "Featured",
      standardLabel: "Standard",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit review",
      addTitle: "Add review",
      clientName: "Client name",
      company: "Company",
      photo: "Photo (optional)",
      rating: "Rating",
      reviewText: "Review text",
      status: "Status",
      featureThisReview: "Feature this review",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Review updated",
      created: "Review added",
      saveError: "Unable to save this review",
      toggleFeaturedError: "Unable to update the review",
      deleted: "Review deleted",
      deleteError: "Unable to delete this review",
    },
    confirmDelete: {
      title: "Delete this review?",
      description: "This review will disappear from the landing page immediately.",
    },
    status: {
      published: "Published",
      pending: "Pending",
      hidden: "Hidden",
    },
  },
  ar: {
    pageTitle: "آراء العملاء",
    pageSubtitle: "الشهادات التي تُعرض في الصفحة الرئيسية.",
    statusAll: "جميع الحالات",
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل التقييمات.",
    retry: "إعادة المحاولة",
    table: {
      client: "العميل",
      review: "المراجعة",
      status: "الحالة",
      featured: "مميز",
      empty: "لا توجد تقييمات مطابقة لهذا الفلتر.",
      portalClient: "عميل البوابة",
      featuredLabel: "مميز",
      standardLabel: "عادي",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل المراجعة",
      addTitle: "إضافة مراجعة",
      clientName: "اسم العميل",
      company: "الشركة",
      photo: "الصورة (اختياري)",
      rating: "التقييم",
      reviewText: "نص المراجعة",
      status: "الحالة",
      featureThisReview: "تمييز هذه المراجعة",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث المراجعة",
      created: "تمت إضافة المراجعة",
      saveError: "تعذّر حفظ هذه المراجعة",
      toggleFeaturedError: "تعذّر تحديث المراجعة",
      deleted: "تم حذف المراجعة",
      deleteError: "تعذّر حذف هذه المراجعة",
    },
    confirmDelete: {
      title: "هل تريد حذف هذه المراجعة؟",
      description: "ستختفي هذه المراجعة من الصفحة الرئيسية فورًا.",
    },
    status: {
      published: "منشور",
      pending: "قيد الانتظار",
      hidden: "مخفي",
    },
  },
};

export function getStarAriaLabel(lang: AdminLanguage, n: number): string {
  return lang === "ar" ? `${n} نجمة` : `${n} star${n > 1 ? "s" : ""}`;
}
