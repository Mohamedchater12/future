import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface StatsDictionary {
  pageTitle: string;
  pageSubtitle: string;
  addButton: string;
  loading: string;
  loadError: string;
  retry: string;
  table: {
    order: string;
    value: string;
    label: string;
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
    labelLabel: string;
    labelPlaceholder: string;
    valueLabel: string;
    suffixLabel: string;
    suffixPlaceholder: string;
    iconLabel: string;
    noIconOption: string;
    orderLabel: string;
    visibleLabel: string;
    previewLabel: string;
    previewLabelFallback: string;
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
  iconOptions: {
    IconRocket: string;
    IconUsers: string;
    IconCalendarStats: string;
    IconHeadset: string;
    IconTrendingUp: string;
    IconStarFilled: string;
    IconWorld: string;
    IconClock: string;
    IconChartBar: string;
    IconBriefcase: string;
  };
}

export const statsTranslations: Record<AdminLanguage, StatsDictionary> = {
  en: {
    pageTitle: "Stats",
    pageSubtitle: "Key numbers shown in the About section.",
    addButton: "Add",
    loading: "Loading…",
    loadError: "Unable to load stats.",
    retry: "Retry",
    table: {
      order: "Order",
      value: "Value",
      label: "Label",
      status: "Status",
      empty: "No stats yet.",
      moveUpAria: "Move up",
      moveDownAria: "Move down",
      editAria: "Edit",
      deleteAria: "Delete",
    },
    form: {
      editTitle: "Edit stat",
      addTitle: "Add stat",
      labelLabel: "Label",
      labelPlaceholder: "Projects delivered",
      valueLabel: "Value",
      suffixLabel: "Suffix (optional)",
      suffixPlaceholder: "+, %, /7…",
      iconLabel: "Icon (optional)",
      noIconOption: "— No icon —",
      orderLabel: "Order",
      visibleLabel: "Visible on the landing page",
      previewLabel: "Preview on the landing page",
      previewLabelFallback: "Stat label",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
    },
    toast: {
      updated: "Stat updated",
      created: "Stat created",
      saveError: "Unable to save this stat",
      deleted: "Stat deleted",
      deleteError: "Unable to delete this stat",
      visibilityError: "Unable to update visibility",
      reorderError: "Unable to reorder",
    },
    confirmDelete: {
      title: "Delete this stat?",
      description: "This number will disappear from the landing page immediately.",
    },
    iconOptions: {
      IconRocket: "Rocket",
      IconUsers: "Users",
      IconCalendarStats: "Experience",
      IconHeadset: "Support",
      IconTrendingUp: "Growth",
      IconStarFilled: "Rating",
      IconWorld: "Global",
      IconClock: "Time",
      IconChartBar: "Stats",
      IconBriefcase: "Business",
    },
  },
  ar: {
    pageTitle: "الإحصائيات",
    pageSubtitle: "الأرقام الرئيسية المعروضة في قسم نبذة عنا.",
    addButton: "إضافة",
    loading: "جارٍ التحميل…",
    loadError: "تعذّر تحميل الإحصائيات.",
    retry: "إعادة المحاولة",
    table: {
      order: "الترتيب",
      value: "القيمة",
      label: "التسمية",
      status: "الحالة",
      empty: "لا توجد إحصائيات حتى الآن.",
      moveUpAria: "نقل للأعلى",
      moveDownAria: "نقل للأسفل",
      editAria: "تعديل",
      deleteAria: "حذف",
    },
    form: {
      editTitle: "تعديل الإحصائية",
      addTitle: "إضافة إحصائية",
      labelLabel: "التسمية",
      labelPlaceholder: "مشاريع منجزة",
      valueLabel: "القيمة",
      suffixLabel: "اللاحقة (اختياري)",
      suffixPlaceholder: "+، %، /7…",
      iconLabel: "الأيقونة (اختياري)",
      noIconOption: "— بدون أيقونة —",
      orderLabel: "الترتيب",
      visibleLabel: "ظاهر على الصفحة الرئيسية",
      previewLabel: "معاينة على الصفحة الرئيسية",
      previewLabelFallback: "تسمية الإحصائية",
      cancel: "إلغاء",
      save: "حفظ",
      create: "إنشاء",
    },
    toast: {
      updated: "تم تحديث الإحصائية",
      created: "تم إنشاء الإحصائية",
      saveError: "تعذّر حفظ هذه الإحصائية",
      deleted: "تم حذف الإحصائية",
      deleteError: "تعذّر حذف هذه الإحصائية",
      visibilityError: "تعذّر تحديث حالة الظهور",
      reorderError: "تعذّر إعادة الترتيب",
    },
    confirmDelete: {
      title: "هل تريد حذف هذه الإحصائية؟",
      description: "سيختفي هذا الرقم من الصفحة الرئيسية فورًا.",
    },
    iconOptions: {
      IconRocket: "صاروخ",
      IconUsers: "المستخدمون",
      IconCalendarStats: "الخبرة",
      IconHeadset: "الدعم",
      IconTrendingUp: "النمو",
      IconStarFilled: "التقييم",
      IconWorld: "عالمي",
      IconClock: "الوقت",
      IconChartBar: "إحصائيات",
      IconBriefcase: "الأعمال",
    },
  },
};
