import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface ShellDictionary {
  brand: string;
  nav: {
    dashboard: string;
    requests: string;
    clients: string;
    clientWork: string;
    messages: string;
    services: string;
    stats: string;
    projects: string;
    trustedBy: string;
    tools: string;
    reviews: string;
    closeMenu: string;
    openMenu: string;
  };
  logout: string;
  notifications: {
    ariaLabel: string;
    title: string;
    markAllRead: string;
    markReadError: string;
    loading: string;
    empty: string;
  };
  common: {
    cancel: string;
    delete: string;
    close: string;
    removeImage: string;
    uploadImage: string;
    replaceImage: string;
    uploadFailed: string;
    visible: string;
    hidden: string;
  };
  login: {
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    error: string;
  };
}

export const shellTranslations: Record<AdminLanguage, ShellDictionary> = {
  en: {
    brand: "Future",
    nav: {
      dashboard: "Dashboard",
      requests: "Requests",
      clients: "Clients",
      clientWork: "Client work",
      messages: "Messages",
      services: "Services",
      stats: "Stats",
      projects: "Projects",
      trustedBy: "Trusted By",
      tools: "Tools",
      reviews: "Reviews",
      closeMenu: "Close menu",
      openMenu: "Open menu",
    },
    logout: "Logout",
    notifications: {
      ariaLabel: "Notifications",
      title: "Notifications",
      markAllRead: "Mark all as read",
      markReadError: "Unable to mark notifications as read",
      loading: "Loading…",
      empty: "No notifications.",
    },
    common: {
      cancel: "Cancel",
      delete: "Delete",
      close: "Close",
      removeImage: "Remove image",
      uploadImage: "Upload",
      replaceImage: "Replace",
      uploadFailed: "Failed to upload image",
      visible: "Visible",
      hidden: "Hidden",
    },
    login: {
      subtitle: "Sign in to the admin area",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      error: "Incorrect email or password",
    },
  },
  ar: {
    brand: "Future",
    nav: {
      dashboard: "الرئيسية",
      requests: "الطلبات",
      clients: "العملاء",
      clientWork: "أعمال العملاء",
      messages: "الرسائل",
      services: "الخدمات",
      stats: "الإحصائيات",
      projects: "المشاريع",
      trustedBy: "يثقون بنا",
      tools: "الأدوات",
      reviews: "التقييمات",
      closeMenu: "إغلاق القائمة",
      openMenu: "فتح القائمة",
    },
    logout: "تسجيل الخروج",
    notifications: {
      ariaLabel: "الإشعارات",
      title: "الإشعارات",
      markAllRead: "تمييز الكل كمقروء",
      markReadError: "تعذّر تمييز الإشعارات كمقروءة",
      loading: "جارٍ التحميل…",
      empty: "لا توجد إشعارات.",
    },
    common: {
      cancel: "إلغاء",
      delete: "حذف",
      close: "إغلاق",
      removeImage: "إزالة الصورة",
      uploadImage: "رفع",
      replaceImage: "استبدال",
      uploadFailed: "تعذّر رفع الصورة",
      visible: "ظاهر",
      hidden: "مخفي",
    },
    login: {
      subtitle: "سجّل الدخول إلى لوحة التحكم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    },
  },
};
