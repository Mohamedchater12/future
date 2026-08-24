export type ClientSpaceLanguage = "en" | "ar";

export interface ClientSpaceDictionary {
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    dashboard: string;
    requests: string;
    messaging: string;
    reviews: string;
    profile: string;
    closeMenu: string;
    openMenu: string;
  };
  logout: string;
  notifications: {
    ariaLabel: string;
    title: string;
    markAllRead: string;
    empty: string;
    missionPending: string;
    missionInProgress: string;
    missionDone: string;
    newMessage: string;
    reviewPublished: string;
    reviewRejected: string;
  };
  requestStatus: {
    pending: string;
    inProgress: string;
    done: string;
  };
  reviewStatus: {
    pending: string;
    published: string;
    hidden: string;
  };
  relativeTime: {
    now: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  dashboard: {
    greeting: string;
    subtitle: string;
    stats: {
      activeRequests: string;
      completedRequests: string;
      unreadMessages: string;
      reviewsGiven: string;
      newBadge: string;
    };
    activeRequestsTitle: string;
    noActiveRequests: string;
    percentComplete: string;
    updatedAt: string;
    recentNotificationsTitle: string;
    noNotifications: string;
  };
  requests: {
    title: string;
    subtitle: string;
    filters: {
      all: string;
      pending: string;
      inProgress: string;
      done: string;
    };
    empty: string;
    detail: {
      close: string;
      description: string;
      steps: string;
      inProgress: string;
      filesExchanged: string;
      noFiles: string;
      you: string;
      team: string;
      uploadCta: string;
      progressUpdated: string;
      footerNote: string;
      errors: {
        invalidFileType: string;
        fileTooLarge: string;
        uploadFailed: string;
      };
      success: {
        fileSent: string;
      };
    };
  };
  messaging: {
    title: string;
    subtitle: string;
    teamName: string;
    teamRole: string;
    inputPlaceholder: string;
    sendAriaLabel: string;
    sendError: string;
  };
  reviews: {
    title: string;
    subtitle: string;
    formTitle: string;
    ratingLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    submit: string;
    yourReviewsTitle: string;
    noReviews: string;
    errors: {
      ratingRequired: string;
      commentTooShort: string;
      submitFailed: string;
    };
    success: string;
  };
  profile: {
    title: string;
    subtitle: string;
    photoTitle: string;
    changePhoto: string;
    addPhoto: string;
    removePhotoAria: string;
    personalInfoTitle: string;
    passwordTitle: string;
    fields: {
      fullName: string;
      email: string;
      company: string;
      phone: string;
      currentPassword: string;
      newPassword: string;
    };
    save: string;
    changePassword: string;
    errors: {
      invalidImage: string;
      imageReadFailed: string;
      avatarUpdateFailed: string;
      emailTaken: string;
      updateFailed: string;
      currentPasswordIncorrect: string;
      passwordUpdateFailed: string;
    };
    success: {
      infoUpdated: string;
      passwordUpdated: string;
    };
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      submit: string;
      error: string;
      noAccount: string;
      createAccount: string;
      demoNote: string;
    };
    signup: {
      title: string;
      subtitle: string;
      fullName: string;
      email: string;
      company: string;
      phone: string;
      password: string;
      submit: string;
      alreadyAccount: string;
      login: string;
      welcomeToast: string;
      errors: {
        emailTaken: string;
        createFailed: string;
        autoLoginFailed: string;
      };
    };
  };
  validation: {
    nameMin: string;
    emailRequired: string;
    emailInvalid: string;
    passwordMin: string;
    currentPasswordRequired: string;
  };
}

export const clientSpaceTranslations: Record<ClientSpaceLanguage, ClientSpaceDictionary> = {
  en: {
    brand: {
      name: "Future",
      tagline: "Client area",
    },
    nav: {
      dashboard: "Dashboard",
      requests: "My requests",
      messaging: "Messaging",
      reviews: "Reviews",
      profile: "Profile",
      closeMenu: "Close menu",
      openMenu: "Open menu",
    },
    logout: "Log out",
    notifications: {
      ariaLabel: "Notifications",
      title: "Notifications",
      markAllRead: "Mark all as read",
      empty: "No notifications yet.",
      missionPending: '"{title}" is pending',
      missionInProgress: '"{title}" is in progress',
      missionDone: '"{title}" is complete',
      newMessage: "New message from the Future team",
      reviewPublished: "Your review has been published, thank you!",
      reviewRejected: "Your review was not selected for publication",
    },
    requestStatus: {
      pending: "Pending",
      inProgress: "In progress",
      done: "Done",
    },
    reviewStatus: {
      pending: "Pending review",
      published: "Published on site",
      hidden: "Not selected",
    },
    relativeTime: {
      now: "just now",
      minutesAgo: "{value} min ago",
      hoursAgo: "{value} h ago",
      daysAgo: "{value} d ago",
    },
    dashboard: {
      greeting: "Hello, {name}",
      subtitle: "Here's an overview of your projects with Future.",
      stats: {
        activeRequests: "Requests in progress",
        completedRequests: "Completed requests",
        unreadMessages: "Unread messages",
        reviewsGiven: "Reviews left",
        newBadge: "New",
      },
      activeRequestsTitle: "Active requests",
      noActiveRequests: "You don't have any request in progress yet.",
      percentComplete: "{value}% complete",
      updatedAt: "Updated {time}",
      recentNotificationsTitle: "Recent notifications",
      noNotifications: "No notifications for now.",
    },
    requests: {
      title: "My requests",
      subtitle: "Track the progress of your projects. Status is updated by our team.",
      filters: {
        all: "All",
        pending: "Pending",
        inProgress: "In progress",
        done: "Done",
      },
      empty: "No requests in this category.",
      detail: {
        close: "Close",
        description: "Description",
        steps: "Steps",
        inProgress: "In progress",
        filesExchanged: "Files exchanged",
        noFiles: "No files yet.",
        you: "You",
        team: "Future Team",
        uploadCta: "Send a brief (PDF, Word)",
        progressUpdated: "{value}% complete · updated {time}",
        footerNote:
          "Your request status is updated by our team as the project progresses.",
        errors: {
          invalidFileType: "Please send a PDF or Word file.",
          fileTooLarge: "This file exceeds 10 MB.",
          uploadFailed: "Couldn't send this file.",
        },
        success: {
          fileSent: "Brief sent to the Future team.",
        },
      },
    },
    messaging: {
      title: "Messaging",
      subtitle: "Chat directly with the Future team.",
      teamName: "Future Team",
      teamRole: "Project support",
      inputPlaceholder: "Write your message… (Enter to send)",
      sendAriaLabel: "Send message",
      sendError: "Couldn't send this message.",
    },
    reviews: {
      title: "Reviews",
      subtitle:
        "Your review is sent to our team, who publishes it on the site after validation.",
      formTitle: "Leave a review",
      ratingLabel: "Your rating",
      commentLabel: "Your comment",
      commentPlaceholder: "Share your experience with the Future team…",
      submit: "Send my review",
      yourReviewsTitle: "Your reviews",
      noReviews: "You haven't left a review yet.",
      errors: {
        ratingRequired: "Please select a rating.",
        commentTooShort: "Your comment is a bit short.",
        submitFailed: "Couldn't send your review right now.",
      },
      success:
        "Thanks! Your review has been sent and will be published after validation by our team.",
    },
    profile: {
      title: "Profile",
      subtitle: "Manage your personal information.",
      photoTitle: "Profile photo",
      changePhoto: "Change photo",
      addPhoto: "Add a photo",
      removePhotoAria: "Remove photo",
      personalInfoTitle: "Personal information",
      passwordTitle: "Password",
      fields: {
        fullName: "Full name",
        email: "Email",
        company: "Company",
        phone: "Phone",
        currentPassword: "Current password",
        newPassword: "New password",
      },
      save: "Save",
      changePassword: "Change password",
      errors: {
        invalidImage: "Please choose an image.",
        imageReadFailed: "Couldn't read this image.",
        avatarUpdateFailed: "Couldn't update the photo.",
        emailTaken: "An account with this email already exists.",
        updateFailed: "Couldn't update your information.",
        currentPasswordIncorrect: "Current password is incorrect.",
        passwordUpdateFailed: "Couldn't change the password.",
      },
      success: {
        infoUpdated: "Your information has been updated.",
        passwordUpdated: "Your password has been updated.",
      },
    },
    auth: {
      login: {
        title: "Login",
        subtitle: "Access your requests and messaging.",
        email: "Email",
        password: "Password",
        submit: "Log in",
        error: "Incorrect email or password.",
        noAccount: "Don't have an account yet?",
        createAccount: "Create an account",
        demoNote: "Demo: client@demo.future.agency / demo1234",
      },
      signup: {
        title: "Create an account",
        subtitle: "Join the client area to track your projects with Future.",
        fullName: "Full name",
        email: "Email",
        company: "Company",
        phone: "Phone",
        password: "Password",
        submit: "Create my account",
        alreadyAccount: "Already have an account?",
        login: "Log in",
        welcomeToast: "Welcome to Future!",
        errors: {
          emailTaken: "An account with this email already exists.",
          createFailed: "Couldn't create your account.",
          autoLoginFailed: "Account created, but automatic login failed. Try logging in.",
        },
      },
    },
    validation: {
      nameMin: "Name must be at least 2 characters",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      passwordMin: "6 characters minimum",
      currentPasswordRequired: "Current password is required",
    },
  },
  ar: {
    brand: {
      name: "Future",
      tagline: "منطقة العملاء",
    },
    nav: {
      dashboard: "الرئيسية",
      requests: "طلباتي",
      messaging: "الرسائل",
      reviews: "التقييمات",
      profile: "الملف الشخصي",
      closeMenu: "إغلاق القائمة",
      openMenu: "فتح القائمة",
    },
    logout: "تسجيل الخروج",
    notifications: {
      ariaLabel: "الإشعارات",
      title: "الإشعارات",
      markAllRead: "تمييز الكل كمقروء",
      empty: "لا توجد إشعارات حاليًا.",
      missionPending: '"{title}" قيد الانتظار',
      missionInProgress: '"{title}" قيد التنفيذ',
      missionDone: '"{title}" مكتمل',
      newMessage: "رسالة جديدة من فريق Future",
      reviewPublished: "تم نشر تقييمك، شكرًا لك!",
      reviewRejected: "لم يتم اعتماد تقييمك للنشر",
    },
    requestStatus: {
      pending: "قيد الانتظار",
      inProgress: "قيد التنفيذ",
      done: "مكتمل",
    },
    reviewStatus: {
      pending: "في انتظار المراجعة",
      published: "منشور على الموقع",
      hidden: "غير معتمد",
    },
    relativeTime: {
      now: "الآن",
      minutesAgo: "منذ {value} دقيقة",
      hoursAgo: "منذ {value} ساعة",
      daysAgo: "منذ {value} يوم",
    },
    dashboard: {
      greeting: "مرحبًا، {name}",
      subtitle: "هذه نظرة عامة على مشاريعك مع Future.",
      stats: {
        activeRequests: "الطلبات قيد التنفيذ",
        completedRequests: "الطلبات المكتملة",
        unreadMessages: "الرسائل غير المقروءة",
        reviewsGiven: "التقييمات المُرسلة",
        newBadge: "جديد",
      },
      activeRequestsTitle: "الطلبات النشطة",
      noActiveRequests: "لا توجد لديك طلبات قيد التنفيذ حاليًا.",
      percentComplete: "{value}% مكتمل",
      updatedAt: "تم التحديث {time}",
      recentNotificationsTitle: "الإشعارات الأخيرة",
      noNotifications: "لا توجد إشعارات في الوقت الحالي.",
    },
    requests: {
      title: "طلباتي",
      subtitle: "تابع تقدّم مشاريعك. يقوم فريقنا بتحديث الحالة.",
      filters: {
        all: "الكل",
        pending: "قيد الانتظار",
        inProgress: "قيد التنفيذ",
        done: "مكتمل",
      },
      empty: "لا توجد طلبات في هذه الفئة.",
      detail: {
        close: "إغلاق",
        description: "الوصف",
        steps: "المراحل",
        inProgress: "قيد التنفيذ",
        filesExchanged: "الملفات المتبادلة",
        noFiles: "لا توجد ملفات حتى الآن.",
        you: "أنت",
        team: "فريق Future",
        uploadCta: "إرسال كراسة الشروط (PDF أو Word)",
        progressUpdated: "{value}% مكتمل · تم التحديث {time}",
        footerNote: "يقوم فريقنا بتحديث حالة طلبك مع تقدّم المشروع.",
        errors: {
          invalidFileType: "يرجى إرسال ملف PDF أو Word.",
          fileTooLarge: "حجم هذا الملف يتجاوز 10 ميغابايت.",
          uploadFailed: "تعذّر إرسال هذا الملف.",
        },
        success: {
          fileSent: "تم إرسال الملف إلى فريق Future.",
        },
      },
    },
    messaging: {
      title: "الرسائل",
      subtitle: "تحدّث مباشرة مع فريق Future.",
      teamName: "فريق Future",
      teamRole: "دعم المشروع",
      inputPlaceholder: "اكتب رسالتك… (اضغط Enter للإرسال)",
      sendAriaLabel: "إرسال الرسالة",
      sendError: "تعذّر إرسال هذه الرسالة.",
    },
    reviews: {
      title: "التقييمات",
      subtitle: "يُرسل تقييمك إلى فريقنا، ويُنشر على الموقع بعد الموافقة عليه.",
      formTitle: "أضف تقييمًا",
      ratingLabel: "تقييمك",
      commentLabel: "تعليقك",
      commentPlaceholder: "شاركنا تجربتك مع فريق Future…",
      submit: "إرسال تقييمي",
      yourReviewsTitle: "تقييماتك",
      noReviews: "لم تقم بإضافة أي تقييم حتى الآن.",
      errors: {
        ratingRequired: "يرجى اختيار تقييم.",
        commentTooShort: "تعليقك قصير جدًا.",
        submitFailed: "تعذّر إرسال تقييمك حاليًا.",
      },
      success: "شكرًا لك! تم إرسال تقييمك وسيُنشر بعد موافقة فريقنا.",
    },
    profile: {
      title: "الملف الشخصي",
      subtitle: "إدارة معلوماتك الشخصية.",
      photoTitle: "الصورة الشخصية",
      changePhoto: "تغيير الصورة",
      addPhoto: "إضافة صورة",
      removePhotoAria: "حذف الصورة",
      personalInfoTitle: "المعلومات الشخصية",
      passwordTitle: "كلمة المرور",
      fields: {
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        company: "الشركة",
        phone: "رقم الهاتف",
        currentPassword: "كلمة المرور الحالية",
        newPassword: "كلمة المرور الجديدة",
      },
      save: "حفظ",
      changePassword: "تغيير كلمة المرور",
      errors: {
        invalidImage: "يرجى اختيار صورة.",
        imageReadFailed: "تعذّر قراءة هذه الصورة.",
        avatarUpdateFailed: "تعذّر تحديث الصورة.",
        emailTaken: "يوجد حساب بهذا البريد الإلكتروني مسبقًا.",
        updateFailed: "تعذّر تحديث معلوماتك.",
        currentPasswordIncorrect: "كلمة المرور الحالية غير صحيحة.",
        passwordUpdateFailed: "تعذّر تغيير كلمة المرور.",
      },
      success: {
        infoUpdated: "تم تحديث معلوماتك.",
        passwordUpdated: "تم تحديث كلمة المرور.",
      },
    },
    auth: {
      login: {
        title: "تسجيل الدخول",
        subtitle: "تابع طلباتك ورسائلك.",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        submit: "تسجيل الدخول",
        error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        noAccount: "ليس لديك حساب؟",
        createAccount: "إنشاء حساب",
        demoNote: "تجريبي: client@demo.future.agency / demo1234",
      },
      signup: {
        title: "إنشاء حساب",
        subtitle: "انضم إلى منطقة العملاء لتتابع مشاريعك مع Future.",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        company: "الشركة",
        phone: "رقم الهاتف",
        password: "كلمة المرور",
        submit: "إنشاء حسابي",
        alreadyAccount: "لديك حساب بالفعل؟",
        login: "تسجيل الدخول",
        welcomeToast: "مرحبًا بك في Future!",
        errors: {
          emailTaken: "يوجد حساب بهذا البريد الإلكتروني مسبقًا.",
          createFailed: "تعذّر إنشاء حسابك.",
          autoLoginFailed: "تم إنشاء الحساب، ولكن تعذّر تسجيل الدخول التلقائي. حاول تسجيل الدخول.",
        },
      },
    },
    validation: {
      nameMin: "يجب أن يتكون الاسم من حرفين على الأقل",
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "بريد إلكتروني غير صالح",
      passwordMin: "6 أحرف على الأقل",
      currentPasswordRequired: "كلمة المرور الحالية مطلوبة",
    },
  },
};

export function formatMessage(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}
