import Footer from "@/components/footer";
import Header from "@/components/header/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="container mt-28 min-h-svh flex">
        <section className="w-3/4 mt-6 flex items-start justify-between gap-4 px-4">
          {children}
        </section>
        <aside className="h-full"></aside>
      </main>
      <Footer />
    </div>
  );
}
