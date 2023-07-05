import x from "../../lib/xendit";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabase";

const { Invoice } = x;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { payload } = req.body.data;
    const i = new Invoice();

    const { amount, items, userId, productId, description, customer } = payload;

    const purchaseId = uuidv4();
    
    const resp = await i.createInvoice({
      externalID: purchaseId,
      currency: "IDR",
      success_redirect_url: "https://learte-kappa.vercel.app/cart",
      failure_redirect_url: "https://learte-kappa.vercel.app/cart",
      invoiceDuration: 86400,
      amount,
      items,
      description,
      customer,
    });

    if (resp) {
      const { status, amount, invoice_url, id } = resp;
      const purchase = await supabase
        .from("purchases")
        .insert([
          {
            id: purchaseId,
            user_id: userId,
            product_id: productId,
            status: status,
            total: amount,
            invoice_id: id,
            email: customer.email,
            avatar: customer.avatar,
            name: customer.surname,
          },
        ])
        .select();
      res.status(200).json({
        message: "Order created",
        data: purchase,
        invoiceUrl: invoice_url,
      });
      return;
    }

    res.status(500).json({ message: "Failed to create order" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
