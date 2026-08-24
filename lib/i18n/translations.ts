export type Language = "en" | "ar";

export interface Dictionary {
  nav: {
    home: string;
    about: string;
    services: string;
    projects: string;
    tech: string;
    testimonials: string;
    contact: string;
    talk: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    scroll: string;
  };
  about: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
  };
  whyUs: {
    badge: string;
    title: string;
    highlight: string;
    reasons: { title: string; description: string }[];
  };
  services: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    whatsappTemplate: string;
    items: { title: string; points: string[] }[];
  };
  projects: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    resultLabel: string;
    items: { name: string; category: string; stat: string }[];
  };
  techStack: {
    label: string;
  };
  clients: {
    label: string;
  };
  testimonials: {
    badge: string;
    title: string;
    highlight: string;
    items: { name: string; role: string; quote: string; rating: number }[];
  };
  contact: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    address: string;
    whatsappCta: string;
    whatsappDefaultMessage: string;
    formTitle: string;
    successMessage: string;
    labels: {
      lastName: string;
      firstName: string;
      email: string;
      phone: string;
      phonePlaceholder: string;
      company: string;
      service: string;
      servicePlaceholder: string;
      message: string;
      submit: string;
    };
    errors: {
      lastName: string;
      firstName: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
      service: string;
      message: string;
      submitFailed: string;
    };
  };
  footer: {
    description: string;
    navTitle: string;
    legalTitle: string;
    contactTitle: string;
    navLinks: { label: string; href: string }[];
    legalLinks: { label: string; href: string }[];
    copyright: string;
    rc: string;
  };
}

export const translations: Record<Language, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Projects",
      tech: "Technologies",
      testimonials: "Testimonials",
      contact: "Contact",
      talk: "Let's Talk",
    },
    hero: {
      headline: "We Build Digital Experiences That Inspire.",
      subtitle:
        "We create powerful digital products combining creativity, technology, and innovation.",
      cta1: "Start Your Project",
      cta2: "Explore Our Work",
      scroll: "Scroll",
    },
    about: {
      badge: "Who we are",
      title: "About",
      highlight: "Future",
      description:
        "Future is a digital agency crafting bold, forward-looking experiences. We blend design, code and storytelling to help brands leap into what comes next.",
    },
    whyUs: {
      badge: "Why us",
      title: "A method that",
      highlight: "makes the difference",
      reasons: [
        {
          title: "Scalable goals",
          description:
            "We build real growth, tailored to each client's ambition.",
        },
        {
          title: "Precise analysis",
          description:
            "Market and competitor analysis, and a sharp understanding of client needs.",
        },
        {
          title: "A constructive partnership",
          description:
            "Our client's success is part of our own — a relationship built for the long run.",
        },
      ],
    },
    services: {
      badge: "What we do",
      title: "Our",
      highlight: "services",
      subtitle:
        "Nine complementary areas of expertise to build, grow and elevate your brand.",
      whatsappTemplate:
        'Hello, I\'m interested in your "{service}" service. Could you tell me more?',
      items: [
        {
          title: "Branding",
          points: [
            "Building a strong visual identity",
            "Creating a distinctive logo and color palette",
            "Unifying your brand image",
          ],
        },
        {
          title: "Marketing",
          points: [
            "Effective marketing plans",
            "Market and competitor analysis",
            "Increased brand awareness",
          ],
        },
        {
          title: "Social Media Management",
          points: [
            "Day-to-day content management",
            "Creating and publishing posts",
            "Monitoring interactions and messages",
          ],
        },
        {
          title: "Influencer Marketing",
          points: [
            "Partnering with the right influencers",
            "Wider-reaching campaigns",
            "Building trust and driving sales",
          ],
        },
        {
          title: "SEO — Search Engine Optimization",
          points: [
            "Improving site visibility",
            "Writing SEO-optimized content",
            "Improving search rankings",
          ],
        },
        {
          title: "Paid Advertising",
          points: [
            "Targeted ad campaigns",
            "Ad budget management",
            "Optimizing results and conversions",
          ],
        },
        {
          title: "UI/UX Design",
          points: [
            "Simple, attractive interfaces",
            "Improving the user experience",
            "Building the digital customer journey",
          ],
        },
        {
          title: "Web Development",
          points: [
            "Fast, high-performing websites and apps",
            "Custom development with modern technologies",
            "Scalable, secure and SEO-optimized sites",
          ],
        },
        {
          title: "Media Production",
          points: [
            "Professional visual content production",
            "Filming and directing ads and marketing videos",
            "Product, food and service photography",
            "Editing, motion graphics and color grading",
            "Event coverage and visual storytelling",
          ],
        },
      ],
    },
    projects: {
      badge: "Case studies",
      title: "Our",
      highlight: "projects",
      subtitle:
        "A conceptual preview of our collaborations — your real projects will take this place.",
      resultLabel: "Result",
      items: [
        {
          name: "Nova Skincare",
          category: "Identity + launch campaign",
          stat: "+42% reach",
        },
        {
          name: "Atlas Real Estate",
          category: "Brand overhaul + website",
          stat: "2.1x engagement",
        },
        {
          name: "Lumen Café",
          category: "Social media + content",
          stat: "3 markets",
        },
        {
          name: "Vertex Fitness",
          category: "Paid ads + UI/UX",
          stat: "+68% conversions",
        },
      ],
    },
    techStack: {
      label: "Our tools",
    },
    clients: {
      label: "Trusted by",
    },
    testimonials: {
      badge: "Testimonials",
      title: "What",
      highlight: "our clients say",
      items: [
        {
          name: "Sarah Amrani",
          role: "Founder, Nova Skincare",
          quote:
            "A responsive team that turned our vision into a strong identity, from the logo to the campaigns.",
          rating: 5,
        },
        {
          name: "Yassine Bennani",
          role: "Director, Atlas Real Estate",
          quote:
            "The follow-up is constant and the results speak for themselves — our online visibility has changed dimension.",
          rating: 5,
        },
        {
          name: "Lina Chraibi",
          role: "Co-founder, Lumen Café",
          quote:
            "Our social media is finally consistent and alive. The content truly feels like our brand.",
          rating: 5,
        },
        {
          name: "Karim Idrissi",
          role: "CEO, Vertex Fitness",
          quote:
            "A real partnership: they understand our goals and offer concrete solutions, not just ideas.",
          rating: 4,
        },
        {
          name: "Nadia Ouazzani",
          role: "Marketing Manager, Meridian",
          quote:
            "Fast, professional, and honest about what works and what doesn't. Exactly what we needed.",
          rating: 5,
        },
        {
          name: "Omar El Fassi",
          role: "Founder, Solace Home",
          quote:
            "Our website and brand image took a huge leap forward. Inbound inquiries have clearly increased.",
          rating: 5,
        },
      ],
    },
    contact: {
      badge: "Contact",
      title: "Let's talk about",
      highlight: "your project",
      subtitle:
        "Have a question or a project in mind? Message us directly on WhatsApp or fill out the form — we'll get back to you quickly.",
      address: "123 El Gomhouria Street, Mansoura, Egypt",
      whatsappCta: "Chat on WhatsApp",
      whatsappDefaultMessage: "Hello, I'd like to discuss a project with you.",
      formTitle: "Let's start the conversation",
      successMessage: "Message sent — we'll get back to you shortly!",
      labels: {
        lastName: "Last name",
        firstName: "First name",
        email: "Email address",
        phone: "Phone number",
        phonePlaceholder: "+20 10 000 0000",
        company: "Company (optional)",
        service: "Service you're interested in",
        servicePlaceholder: "Select a service",
        message: "Tell us about your project",
        submit: "Send",
      },
      errors: {
        lastName: "Last name is required.",
        firstName: "First name is required.",
        emailRequired: "Email address is required.",
        emailInvalid: "Invalid email address.",
        phoneRequired: "Phone number is required.",
        phoneInvalid: "Invalid phone number format.",
        service: "Please select a service.",
        message: "Tell us a bit more about your project.",
        submitFailed: "Something went wrong. Please try again.",
      },
    },
    footer: {
      description:
        "Digital agency — branding, marketing and media production for brands ready to move forward.",
      navTitle: "Navigation",
      legalTitle: "Legal",
      contactTitle: "Contact",
      navLinks: [
        { label: "Home", href: "#home" },
        { label: "Services", href: "#services" },
        { label: "Projects", href: "#projects" },
        { label: "About", href: "#about" },
      ],
      legalLinks: [
        { label: "Terms & Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
      copyright: "© {year} Future Agency. All rights reserved.",
      rc: "CR 000000 — Mansoura, Egypt",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      projects: "مشاريعنا",
      tech: "التقنيات",
      testimonials: "آراء العملاء",
      contact: "تواصل معنا",
      talk: "لنتحدث",
    },
    hero: {
      headline: "نصنع تجارب رقمية ملهمة.",
      subtitle:
        "نبتكر منتجات رقمية قوية تجمع بين الإبداع والتقنية والابتكار.",
      cta1: "ابدأ مشروعك",
      cta2: "استكشف أعمالنا",
      scroll: "مرر للأسفل",
    },
    about: {
      badge: "من نحن",
      title: "نبذة عن",
      highlight: "Future",
      description:
        "Future وكالة رقمية تصمم تجارب جريئة تستشرف المستقبل. نمزج بين التصميم والبرمجة وسرد القصص لمساعدة العلامات التجارية على القفز نحو الغد.",
    },
    whyUs: {
      badge: "لماذا نحن",
      title: "منهجية",
      highlight: "تصنع الفرق",
      reasons: [
        {
          title: "أهداف قابلة للتطور",
          description: "نبني نموًا حقيقيًا يتناسب مع طموح كل عميل.",
        },
        {
          title: "تحليل دقيق",
          description:
            "تحليل للسوق والمنافسين، وفهم عميق لاحتياجات العملاء.",
        },
        {
          title: "شراكة بنّاءة",
          description:
            "نجاح عميلنا جزء من نجاحنا — علاقة مبنية على المدى الطويل.",
        },
      ],
    },
    services: {
      badge: "ماذا نفعل",
      title: "",
      highlight: "خدماتنا",
      subtitle: "تسع خبرات متكاملة لبناء علامتك التجارية وتنميتها وإبرازها.",
      whatsappTemplate:
        'مرحبًا، أنا مهتم بخدمة "{service}". هل يمكنكم إخباري بالمزيد؟',
      items: [
        {
          title: "الهوية البصرية (Branding)",
          points: [
            "بناء هوية بصرية قوية",
            "تصميم شعار وألوان مميزة",
            "توحيد صورة العلامة التجارية",
          ],
        },
        {
          title: "التسويق",
          points: [
            "خطط تسويقية فعالة",
            "تحليل السوق والمنافسين",
            "زيادة الوعي بالعلامة التجارية",
          ],
        },
        {
          title: "إدارة وسائل التواصل الاجتماعي",
          points: [
            "إدارة المحتوى اليومي",
            "إنشاء المنشورات ونشرها",
            "متابعة التفاعلات والرسائل",
          ],
        },
        {
          title: "التسويق عبر المؤثرين",
          points: [
            "التعاون مع المؤثرين المناسبين",
            "حملات أوسع انتشارًا",
            "تعزيز الثقة والمبيعات",
          ],
        },
        {
          title: "تحسين محركات البحث (SEO)",
          points: [
            "تحسين ظهور الموقع",
            "كتابة محتوى محسّن لمحركات البحث",
            "تحسين الترتيب في نتائج البحث",
          ],
        },
        {
          title: "الإعلانات المدفوعة",
          points: [
            "حملات إعلانية مستهدفة",
            "إدارة الميزانية الإعلانية",
            "تحسين النتائج والتحويلات",
          ],
        },
        {
          title: "تصميم UI/UX",
          points: [
            "واجهات بسيطة وجذابة",
            "تحسين تجربة المستخدم",
            "تطوير رحلة العميل الرقمية",
          ],
        },
        {
          title: "تطوير المواقع",
          points: [
            "مواقع وتطبيقات سريعة وعالية الأداء",
            "تطوير مخصص بأحدث التقنيات",
            "مواقع قابلة للتوسع وآمنة ومحسّنة لمحركات البحث",
          ],
        },
        {
          title: "الإنتاج الإعلامي",
          points: [
            "إنتاج محتوى مرئي احترافي",
            "تصوير وإخراج إعلانات وفيديوهات تسويقية",
            "تصوير المنتجات والأطعمة والخدمات",
            "المونتاج والموشن غرافيك وتصحيح الألوان",
            "تغطية الفعاليات والسرد البصري",
          ],
        },
      ],
    },
    projects: {
      badge: "دراسات حالة",
      title: "",
      highlight: "مشاريعنا",
      subtitle:
        "لمحة تصورية عن تعاوناتنا — مشاريعكم الحقيقية ستأخذ هذا المكان.",
      resultLabel: "النتيجة",
      items: [
        {
          name: "نوفا سكين كير",
          category: "هوية بصرية + حملة إطلاق",
          stat: "‎+42% وصول",
        },
        {
          name: "أطلس العقارية",
          category: "إعادة تصميم العلامة + موقع إلكتروني",
          stat: "2.1x تفاعل",
        },
        {
          name: "لومن كافيه",
          category: "وسائل التواصل + المحتوى",
          stat: "3 أسواق",
        },
        {
          name: "فيرتكس فيتنس",
          category: "إعلانات مدفوعة + UI/UX",
          stat: "‎+68% تحويلات",
        },
      ],
    },
    techStack: {
      label: "أدواتنا",
    },
    clients: {
      label: "يثقون بنا",
    },
    testimonials: {
      badge: "آراء العملاء",
      title: "",
      highlight: "ماذا يقول عملاؤنا",
      items: [
        {
          name: "سارة العمراني",
          role: "مؤسِّسة، نوفا سكين كير",
          quote:
            "فريق متجاوب استطاع ترجمة رؤيتنا إلى هوية قوية، من الشعار وصولاً إلى الحملات.",
          rating: 5,
        },
        {
          name: "ياسين بناني",
          role: "مدير، أطلس العقارية",
          quote:
            "المتابعة مستمرة والنتائج تتحدث عن نفسها — ظهورنا الرقمي تغيّر بشكل كبير.",
          rating: 5,
        },
        {
          name: "لينا الشرايبي",
          role: "شريكة مؤسِّسة، لومن كافيه",
          quote:
            "أصبحت شبكاتنا الاجتماعية أخيرًا متناسقة وحيّة. المحتوى يعكس علامتنا التجارية فعلاً.",
          rating: 5,
        },
        {
          name: "كريم الإدريسي",
          role: "الرئيس التنفيذي، فيرتكس فيتنس",
          quote:
            "شراكة حقيقية: يفهمون أهدافنا ويقترحون حلولاً ملموسة، لا مجرد أفكار.",
          rating: 4,
        },
        {
          name: "نادية الوزاني",
          role: "مسؤولة التسويق، ميريديان",
          quote:
            "سريعون، محترفون، وصادقون بشأن ما ينجح وما لا ينجح. بالضبط ما كنا نحتاجه.",
          rating: 5,
        },
        {
          name: "عمر الفاسي",
          role: "مؤسِّس، سولاس هوم",
          quote:
            "موقعنا وصورة علامتنا التجارية قفزا إلى الأمام. الطلبات الواردة ازدادت بشكل واضح.",
          rating: 5,
        },
      ],
    },
    contact: {
      badge: "تواصل معنا",
      title: "لنتحدث عن",
      highlight: "مشروعك",
      subtitle:
        "لديك سؤال أو مشروع في ذهنك؟ راسلنا مباشرة عبر واتساب أو املأ النموذج — سنرد عليك بسرعة.",
      address: "123 شارع الجمهورية، المنصورة، مصر",
      whatsappCta: "تواصل عبر واتساب",
      whatsappDefaultMessage: "مرحبًا، أرغب في مناقشة مشروع معكم.",
      formTitle: "لنبدأ الحديث",
      successMessage: "تم إرسال رسالتك، سنتواصل معك قريبًا!",
      labels: {
        lastName: "الاسم العائلي",
        firstName: "الاسم الشخصي",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        phonePlaceholder: "+20 10 000 0000",
        company: "الشركة (اختياري)",
        service: "الخدمة المطلوبة",
        servicePlaceholder: "اختر خدمة",
        message: "أخبرنا المزيد عن مشروعك",
        submit: "إرسال",
      },
      errors: {
        lastName: "الاسم العائلي مطلوب.",
        firstName: "الاسم الشخصي مطلوب.",
        emailRequired: "البريد الإلكتروني مطلوب.",
        emailInvalid: "البريد الإلكتروني غير صحيح.",
        phoneRequired: "رقم الهاتف مطلوب.",
        phoneInvalid: "صيغة رقم الهاتف غير صحيحة.",
        service: "يرجى اختيار خدمة.",
        message: "أخبرنا بمزيد من التفاصيل عن مشروعك.",
        submitFailed: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      },
    },
    footer: {
      description:
        "وكالة رقمية — هوية بصرية، تسويق وإنتاج إعلامي للعلامات التجارية المستعدة للمضي قدمًا.",
      navTitle: "التنقل",
      legalTitle: "قانوني",
      contactTitle: "تواصل",
      navLinks: [
        { label: "الرئيسية", href: "#home" },
        { label: "خدماتنا", href: "#services" },
        { label: "مشاريعنا", href: "#projects" },
        { label: "من نحن", href: "#about" },
      ],
      legalLinks: [
        { label: "الشروط والأحكام", href: "#" },
        { label: "سياسة الخصوصية", href: "#" },
      ],
      copyright: "© {year} وكالة Future. جميع الحقوق محفوظة.",
      rc: "السجل التجاري 000000 — المنصورة، مصر",
    },
  },
};
