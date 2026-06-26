import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json()

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("RESEND_FROM_EMAIL") || "portfolio@pratik-chaudhary.com.np",
      to: Deno.env.get("RESEND_TO_EMAIL") || "prtkcha980@gmail.com",
      subject: `New message from ${record.name}: ${record.subject || "No subject"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Subject:</strong> ${record.subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${record.message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from your portfolio contact form.</p>
      `,
    }),
  })

  if (!res.ok) {
    console.error("Resend error:", await res.text())
    return new Response("error", { status: 500 })
  }

  return new Response("ok")
})
