import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyInfo from "./company-info";
import ProductsServices from "./products-services";
import Posts from "./posts";
import Performance from "./performance";
import OrderFulfillment from "./order-fulfillment";
import CustomerSatisfaction from "./customer-satisfaction";
function ProfileTabs() {
  return (
    <div>
      <Tabs defaultValue="company-info" className="w-full mt-6">
        <TabsList className="w-full p-1.5 h-14 bg-white rounded-lg">
          <TabsTrigger
            value="company-info"
            className="rounded-md text-primary data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
          >
            Company Info
          </TabsTrigger>
          <Separator orientation="vertical" className="!h-7 !mx-4" />
          <TabsTrigger
            value="products-services"
            className="rounded-md text-primary data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
          >
            Products / Services
          </TabsTrigger>
          <Separator orientation="vertical" className="!h-7 !mx-4" />
          <TabsTrigger
            value="posts"
            className="rounded-md text-primary data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
          >
            Posts
          </TabsTrigger>
          <Separator orientation="vertical" className="!h-7 !mx-4" />
          <TabsTrigger
            value="performance"
            className="rounded-md text-primary data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:drop-shadow-[0px 0px 40px 10px rgba(142, 142, 142, 0.25)]"
          >
            Performance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="company-info">
          <CompanyInfo slug={"sm"} />
        </TabsContent>
        <TabsContent value="products-services">
          <ProductsServices />
        </TabsContent>
        <TabsContent value="posts">
          <Posts />
        </TabsContent>
        <TabsContent value="performance">
          <Performance />
          <OrderFulfillment />
          <CustomerSatisfaction />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfileTabs;
