import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Initialize Stripe with a dummy key if not provided (for testing)
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";
const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-02-25.clover",
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_dummy";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Webhook endpoint MUST use raw body parser to verify signatures
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // If we have a real secret and signature, verify it. 
      // Otherwise, just parse the body (for our local simulation).
      if (sig && endpointSecret !== "whsec_dummy") {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        // Fallback for local simulation without real signatures
        event = JSON.parse(req.body.toString());
      }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`💰 PaymentIntent for ${paymentIntent.amount} was successful!`);
        // TODO: Fulfill the purchase (e.g., update Firestore user document)
        break;
      case "checkout.session.completed":
        const session = event.data.object;
        console.log(`✅ Checkout Session completed for ${session.customer_email}`);
        // TODO: Provision subscription or one-time purchase
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        console.log(`🔄 Subscription ${subscription.id} status is ${subscription.status}`);
        // TODO: Update user's subscription status in database
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  });

  // GitHub API Integration
  app.post("/api/github/create-repo", async (req, res) => {
    const { token, repoName, description, files } = req.body;

    if (!token || !repoName) {
      return res.status(400).json({ error: "Token and repoName are required" });
    }

    try {
      // 1. Create the repository
      const createRepoRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "Openclaw-Agent"
        },
        body: JSON.stringify({
          name: repoName,
          description: description || "Created by Openclaw Autonomous Agent",
          private: true,
          auto_init: true
        })
      });

      if (!createRepoRes.ok) {
        const error = await createRepoRes.json();
        throw new Error(`GitHub Create Repo Error: ${error.message}`);
      }

      const repoData = await createRepoRes.json();
      const owner = repoData.owner.login;

      // 2. Push files (one by one for simplicity in this demo)
      // In a real app, you'd use a more efficient way or a git library
      for (const file of files) {
        const { path: filePath, content } = file;
        
        // Get the SHA if the file exists (it shouldn't since it's a new repo, but auto_init creates README)
        let sha;
        const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`, {
          headers: {
            "Authorization": `token ${token}`,
            "User-Agent": "Openclaw-Agent"
          }
        });
        
        if (getFileRes.ok) {
          const existingFile = await getFileRes.json();
          sha = existingFile.sha;
        }

        const pushFileRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`, {
          method: "PUT",
          headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "Openclaw-Agent"
          },
          body: JSON.stringify({
            message: `Add ${filePath} via Openclaw`,
            content: Buffer.from(content).toString("base64"),
            sha
          })
        });

        if (!pushFileRes.ok) {
          const error = await pushFileRes.json();
          console.error(`Error pushing ${filePath}:`, error);
        }
      }

      res.json({ 
        success: true, 
        repoUrl: repoData.html_url,
        message: "Repository created and files pushed successfully" 
      });

    } catch (error: any) {
      console.error("GitHub Integration Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Standard JSON parser for other API routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Stripe Webhook endpoint ready at http://localhost:${PORT}/api/webhooks/stripe`);
  });
}

startServer();
