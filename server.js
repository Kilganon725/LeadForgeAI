const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const DEEPSEEK_API_KEY = String(process.env.DEEPSEEK_API_KEY || "").trim();
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const product = String(req.body.product || "").trim();
    const country = String(req.body.country || "").trim();
    const customerType = String(req.body.customerType || "").trim();
    const prospectName = String(req.body.prospectName || "").trim();
    const senderName = String(req.body.senderName || "").trim();
    const companyStrength = String(req.body.companyStrength || "").trim();

    if (!product || !country || !customerType) {
      return res.status(400).json({
        error: "Product, target country, and customer type are required.",
      });
    }

    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({
        error: "DEEPSEEK_API_KEY is not set in the environment.",
      });
    }

    const systemPrompt = [
      "You are a senior international sales expert with deep experience in export B2B outreach.",
      "Write outreach content that is professional, natural, and ready to send without editing.",
      "Avoid spammy language, exaggerated claims, and generic openings like 'Hope you are well'.",
      "Adapt tone to the target country business culture.",
      "Return valid JSON only with these keys:",
      "cold_email, cold_email_zh, whatsapp_message, whatsapp_message_zh, follow_up_1, follow_up_1_zh, follow_up_2, follow_up_2_zh, follow_up_3, follow_up_3_zh",
      "Requirements:",
      "- cold_email: 120 to 180 words, professional and persuasive, with a clear call-to-action.",
      "- cold_email_zh: Chinese version of the same email, natural and business-ready, placed under the English email for review.",
      "- whatsapp_message: 2 to 3 short sentences, natural and friendly.",
      "- whatsapp_message_zh: Chinese version of the WhatsApp message, placed directly under the English version for review.",
      "- follow_up_1: gentle reminder.",
      "- follow_up_1_zh: Chinese version of follow_up_1.",
      "- follow_up_2: value-focused, adding one product benefit or offer.",
      "- follow_up_2_zh: Chinese version of follow_up_2.",
      "- follow_up_3: urgency-based but polite.",
      "- follow_up_3_zh: Chinese version of follow_up_3.",
      "- Mention company strength only if it is provided.",
      "- Use the prospect name and sender name if they are provided.",
      "- Tailor wording for the target country and customer type.",
    ].join(" ");

    const userPrompt = JSON.stringify({
      product,
      country,
      customer_type: customerType,
      prospect_name: prospectName || null,
      sender_name: senderName || null,
      company_strength: companyStrength || null,
    });

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              "Generate outreach content for this prospecting brief.",
              userPrompt,
            ].join("\n"),
          },
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message =
        payload?.error?.message || "OpenAI request failed. Check server logs.";
      return res.status(response.status).json({ error: message });
    }

    const content = payload?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({
        error: "OpenAI returned an empty response.",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return res.status(502).json({
        error: "Could not parse JSON from the model response.",
      });
    }

    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while generating content." });
  }
});

app.listen(PORT, () => {
  console.log(`LeadForge AI running at http://localhost:${PORT}`);
  console.log(`DeepSeek config loaded: ${DEEPSEEK_API_KEY ? "yes" : "no"}`);
});
