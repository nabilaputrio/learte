import supabase from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (
      !req.headers["x-callback-token"] ||
      req.headers["x-callback-token"] !== process.env.XENDIT_CALLBACK_TOKEN
    ) {
      res.status(403).json({
        message: "Forbidden",
      });
    }

    const { external_id, status } = req.body;

    const { data, error } = await supabase
      .from("purchases")
      .update({
        status,
      })
      .eq("id", external_id)
      .select("*");

    if (data) {
      res.status(200).json({ message: "success" });
    }

    if (error) {
      res.status(500).json({
        message: "Failed",
      });
    }
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
}
