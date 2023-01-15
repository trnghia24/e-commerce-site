import Link from "next/link";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import {
	AiOutlineLeft,
	AiOutlineShopping,
	AiOutlineMinus,
	AiOutlinePlus,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import getStripe from "../lib/getStripe";

const Cart = () => {
	const cartRef = useRef();

	const {
		totalPrice,
		totalQuantities,
		cartItems,
		setShowCart,
		qty,
		incQty,
		decQty,
		onAddInsideCart,
		onRemoveInsideCart,
		clearCart,
	} = useStateContext();

	const handleCheckout = async () => {
		const stripe = await getStripe();

		// Next JS handles backend calls as well, feel free to use Axios
		const response = await fetch("/api/stripe", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(cartItems),
		});

		if (response.statusCode === 500) return;

		const data = await response.json();

		toast.loading("Redirecting...");

		stripe.redirectToCheckout({ sessionId: data.id });
	};

	return (
		<div className="cart-wrapper" ref={cartRef}>
			<div className="cart-container">
				<button
					type="button"
					className="cart-heading"
					onClick={() => setShowCart(false)}>
					<AiOutlineLeft />
					<span className="heading">Your Cart</span>
					<span className="cart-num-items">({totalQuantities} items)</span>
				</button>

				{cartItems.length < 1 && (
					<div className="empty-cart">
						<AiOutlineShopping size={150} />
						<h3>Your shopping bag is empty</h3>
						<Link href="/">
							<button
								type="button"
								onClick={() => {
									setShowCart(false);
								}}
								className="btn">
								Continue Shopping
							</button>
						</Link>
					</div>
				)}

				<div className="product-container">
					{cartItems.length >= 1 &&
						cartItems.map((item) => (
							<div className="product" key={item._id}>
								<img
									src={urlFor(item?.image[0])}
									className="cart-product-image"
								/>

								<div className="item-desc">
									<div className="flex top">
										<h5>{item.name}</h5>
										<h4>${item.price}</h4>
									</div>

									<div className="flex bottom">
										<div>
											<p className="quantity-desc">
												<span
													className="minus"
													onClick={() => {
														onAddInsideCart(item, "dec");
													}}>
													<AiOutlineMinus />
												</span>

												<span className="num">{item.quantity}</span>

												<span
													className="plus"
													onClick={() => {
														onAddInsideCart(item, "inc");
													}}>
													<AiOutlinePlus />
												</span>
											</p>
										</div>

										<button
											type="button"
											className="remove-item"
											onClick={() => {
												onRemoveInsideCart(item, item.quantity);
											}}>
											<TiDeleteOutline />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>

				{cartItems.length >= 1 && (
					<div className="cart-bottom">
						<div className="total">
							<h3>Subtotal:</h3>
							<h3>${totalPrice}</h3>
						</div>
						<button type="button" onClick={handleCheckout} className="btn">
							Pay With Stripe
						</button>

						<button
							type="button"
							onClick={() => {
								clearCart();
							}}
							className="btn">
							Clear Cart
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
