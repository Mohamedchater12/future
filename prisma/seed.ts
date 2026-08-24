import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@future.agency";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash },
  });

  console.log(`Admin prêt : ${admin.email}`);
}

// Client.email isn't a unique DB constraint (legacy leads can share an
// address before conversion), so upsert-by-email isn't available — this
// does a manual find-then-create/claim instead.
async function seedDemoClient() {
  const email = "client@demo.future.agency";
  const password = "demo1234";

  let client = await prisma.client.findFirst({ where: { email } });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: "Sarah Nguyen",
        email,
        phone: "+33 6 12 34 56 78",
        company: "Nguyen Studio",
        status: "ACTIF",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
  } else if (!client.passwordHash) {
    client = await prisma.client.update({
      where: { id: client.id },
      data: { passwordHash: await bcrypt.hash(password, 12) },
    });
  }

  const existingMissions = await prisma.mission.count({ where: { clientId: client.id } });
  if (existingMissions === 0) {
    await prisma.mission.create({
      data: {
        clientId: client.id,
        title: "Refonte du site vitrine",
        service: "Développement Web",
        description:
          "Refonte complète du site vitrine : nouveau design, animations et optimisation SEO.",
        status: "EN_COURS",
        progress: 40,
        steps: {
          create: [
            { label: "Brief validé", order: 0, status: "TERMINE" },
            { label: "Design UI/UX", order: 1, status: "TERMINE" },
            { label: "Développement", order: 2, status: "EN_COURS" },
            { label: "Tests & recette", order: 3, status: "A_FAIRE" },
            { label: "Mise en ligne", order: 4, status: "A_FAIRE" },
          ],
        },
        files: {
          create: [
            { name: "cahier-des-charges.pdf", url: "#", uploadedBy: "CLIENT" },
            { name: "maquette-v2.fig", url: "#", uploadedBy: "ADMIN" },
          ],
        },
      },
    });

    await prisma.mission.create({
      data: {
        clientId: client.id,
        title: "Identité visuelle — Logo & Charte",
        service: "Identité visuelle",
        description:
          "Création du logo, de la charte graphique et des déclinaisons print/web.",
        status: "TERMINE",
        progress: 100,
        steps: {
          create: [
            { label: "Brief validé", order: 0, status: "TERMINE" },
            { label: "Recherche & moodboard", order: 1, status: "TERMINE" },
            { label: "Propositions de logo", order: 2, status: "TERMINE" },
            { label: "Charte graphique finale", order: 3, status: "TERMINE" },
            { label: "Livraison des fichiers", order: 4, status: "TERMINE" },
          ],
        },
      },
    });

    await prisma.mission.create({
      data: {
        clientId: client.id,
        title: "Campagne Ads Instagram",
        service: "Publicité & Ads",
        description: "Lancement d'une campagne publicitaire Instagram/Meta pour la rentrée.",
        status: "EN_ATTENTE",
        progress: 0,
        steps: {
          create: [
            { label: "Brief reçu", order: 0, status: "TERMINE" },
            { label: "Stratégie & budget", order: 1, status: "A_FAIRE" },
            { label: "Création des visuels", order: 2, status: "A_FAIRE" },
            { label: "Mise en ligne", order: 3, status: "A_FAIRE" },
          ],
        },
      },
    });
  }

  const existingMessages = await prisma.message.count({ where: { clientId: client.id } });
  if (existingMessages === 0) {
    await prisma.message.createMany({
      data: [
        {
          clientId: client.id,
          sender: "ADMIN",
          content:
            "Bonjour Sarah, merci pour l'envoi du cahier des charges ! On revient vers vous sous 48h.",
          read: true,
        },
        {
          clientId: client.id,
          sender: "CLIENT",
          content: "Parfait, merci ! N'hésitez pas si vous avez des questions sur le brief.",
          read: true,
        },
        {
          clientId: client.id,
          sender: "ADMIN",
          content:
            "Petite question : préférez-vous garder le violet comme couleur dominante du header, ou tester une variante plus sombre ?",
          read: false,
        },
      ],
    });
  }

  const existingAvis = await prisma.avis.count({ where: { clientId: client.id } });
  if (existingAvis === 0) {
    await prisma.avis.create({
      data: {
        clientId: client.id,
        name: client.name,
        company: client.company,
        rating: 5,
        quote:
          "Une équipe très professionnelle, à l'écoute et de bon conseil. Le résultat final dépasse nos attentes !",
        status: "PUBLIE",
        featured: true,
      },
    });
  }

  console.log(`Client démo prêt : ${client.email} / ${password}`);
}

// Stats affichées dans la section About du site. Seedées une seule fois
// (contrairement à TrustedBy/Tool/Service, gérés uniquement depuis l'admin
// dès le départ) car elles remplacent des valeurs qui étaient jusqu'ici
// codées en dur — sans ce seed, la section serait vide au premier déploiement.
async function seedStats() {
  const count = await prisma.stat.count();
  if (count > 0) return;

  await prisma.stat.createMany({
    data: [
      { label: "Projects delivered", value: 120, suffix: "+", icon: "IconRocket", order: 0 },
      { label: "Happy clients", value: 60, suffix: "+", icon: "IconUsers", order: 1 },
      { label: "Years of experience", value: 8, icon: "IconCalendarStats", order: 2 },
      { label: "Support", value: 24, suffix: "/7", icon: "IconHeadset", order: 3 },
    ],
  });

  console.log("Stats de départ créées");
}

async function main() {
  await seedAdmin();
  await seedDemoClient();
  await seedStats();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
