import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import ServicesGrid from "@/components/ServicesGrid";
import ProjectsGrid from "@/components/ProjectsGrid";
import ClientsMarquee from "@/components/ClientsMarquee";
import TechStack from "@/components/TechStack";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, projects, trustedBy, tools, avis, stats] = await Promise.all([
    prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.trustedBy.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.tool.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.avis.findMany({
      where: { status: "PUBLIE" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.stat.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main className="relative bg-base-black">
      <Navbar />
      <Hero />
      <About stats={stats} />
      <ServicesGrid services={services} />
      <ProjectsGrid projects={projects} />
      <ClientsMarquee items={trustedBy} />
      <TechStack tools={tools} />
      <WhyUs />
      <Testimonials avis={avis} />
      <Contact />
    </main>
  );
}
