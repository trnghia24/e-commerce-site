import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	if (req.method === "POST") {
		console.log(req.body);
		try {
			const params = {
				submit_type: "pay",
				mode: "payment",
				payment_method_types: ["card"],
				billing_address_collection: "auto",
				shipping_options: [
					{ shipping_rate: "shr_1MOCvfLz3ka7t1HMPuzD0wg7" },
					{ shipping_rate: "shr_1MOCwQLz3ka7t1HMSMPtrpn0" },
				],
				line_items: req.body.map((item) => {
					const img = item.image[0].asset._ref;
					const newImage = img
						.replace(
							"image-",
							"https://cd.sanity.io/images/35pvktv5/production"
						)
						.replace("-webp", ".webp");

					return {
						price_data: {
							currency: "cad",
							product_data: {
								name: item.name,
								images: [newImage],
							},
							unit_amount: item.price * 100, //has to be in cents
						},
						adjustable_quantity: {
							enabled: true,
							minimum: 1,
						},
						quantity: item.quantity,
					};
				}),
				success_url: `${req.headers.origin}/?success=true`,
				cancel_url: `${req.headers.origin}/?canceled=true`,
			};

			// Create Checkout Sessions from body params
			const session = await stripe.checkout.sessions.create(params);

			res.status(200).json(session);
		} catch (err) {
			res.status(err.statusCode || 500).json(err.message);
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}

// {
//   line_items: [
//     {
//       // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//       price: "{{PRICE_ID}}",
//       quantity: 1,
//     },
//   ],
//   mode: "payment",
//   success_url: `${req.headers.origin}/?success=true`,
//   cancel_url: `${req.headers.origin}/?canceled=true`,
// }
