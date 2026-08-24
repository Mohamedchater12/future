import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface DashboardDictionary {
  title: string;
  welcome: string;
  stats: {
    requestsReceived: string;
    unhandled: string;
    clients: string;
    activeServices: string;
    publishedReviews: string;
  };
  chart: {
    title: string;
    seriesName: string;
  };
  activity: {
    title: string;
    empty: string;
    newRequestFrom: string;
    newClient: string;
  };
}

export const dashboardTranslations: Record<AdminLanguage, DashboardDictionary> = {
  en: {
    title: "Dashboard",
    welcome: "Welcome, {name}",
    stats: {
      requestsReceived: "Requests received",
      unhandled: "{count} unhandled",
      clients: "Clients",
      activeServices: "Active services",
      publishedReviews: "Published reviews",
    },
    chart: {
      title: "Requests received per week",
      seriesName: "Requests",
    },
    activity: {
      title: "Recent activity",
      empty: "No activity yet.",
      newRequestFrom: "New request from {name}",
      newClient: "New client: {name}",
    },
  },
  ar: {
    title: "الرئيسية",
    welcome: "مرحبًا، {name}",
    stats: {
      requestsReceived: "الطلبات المستلمة",
      unhandled: "{count} غير معالج",
      clients: "العملاء",
      activeServices: "الخدمات النشطة",
      publishedReviews: "التقييمات المنشورة",
    },
    chart: {
      title: "الطلبات المستلمة أسبوعيًا",
      seriesName: "الطلبات",
    },
    activity: {
      title: "النشاط الأخير",
      empty: "لا يوجد نشاط حتى الآن.",
      newRequestFrom: "طلب جديد من {name}",
      newClient: "عميل جديد: {name}",
    },
  },
};
