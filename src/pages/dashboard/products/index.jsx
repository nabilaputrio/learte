import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import DashboardLayout from "@/layout/DashboardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DashboardProducts = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl">Products</div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>List New Product</DialogTitle>
                <DialogDescription>
                  Add new product yo your listing to start selling and gain
                  revenue
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="name" className="text-left">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    value=""
                    placeholder="Insert your product name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="name" className="text-left">
                    Price
                  </Label>
                  <Input
                    id="name"
                    type="number"
                    value=""
                    placeholder="Insert your product price"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Publish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProducts;
