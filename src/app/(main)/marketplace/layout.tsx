import CompanyCard from "@/components/aside/company-card";
import ProductsFiltration from "@/components/aside/product-filtration";
import VerticalNav from "@/components/aside/vertical-nav";
import Footer from "@/components/footer";
import Header from "@/components/header/header";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <main className="container mt-28 px-4">
        <div className="mt-6 flex items-start justify-between gap-4">
          <aside className="sticky top-28 w-1/5 flex flex-col items-start justify-center gap-4">
            <CompanyCard />
            <VerticalNav />
          </aside>
          <section className="w-1/2 flex-1 ">{children}</section>
          <aside className="sticky top-28 w-1/5">
            <ProductsFiltration />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
