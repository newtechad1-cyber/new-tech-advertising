import Stripe from "npm:stripe";

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2023-10-16",
    });

    const { lead_id, payment_plan, amount } = await req.json();

    if (!amount) {
      return Response.json({ error: "Missing amount" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                payment_plan === "split"
                  ? "ADA Compliance – Split Payment (50%)"
                  : "ADA Compliance – Full Payment",
            },
            unit_amount:
              payment_plan === "split"
                ? Math.round(amount * 100 * 0.5)
                : Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url:
        "https://newtechadvertising.com/ada/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://newtechadvertising.com/ada/cancel",
      metadata: {
        lead_id,
        payment_plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
