import React, { createContext, useContext, useState } from "react";

const Context = createContext();

const StateContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantities, setTotalQuantities] = useState(0);
	const [qty, setQty] = useState(1);

	const removeExistingProductInCart = (product, quantity) => {
		const updatedCartItems = cartItems.filter(
			(cartItem) => cartItem._id !== product._id
		);
		setCartItems(updatedCartItems);
		setTotalQuantities(totalQuantities + quantity);
		setTotalPrice(totalPrice + product.price * quantity);
	};

	const handleExistingProductInCart = (product, quantity) => {
		if (product.quantity + quantity <= 0) {
			removeExistingProductInCart(product, quantity);
			return;
		}

		const updatedCartItems = cartItems.map((cartItem) => {
			if (cartItem._id === product._id) {
				return {
					...cartItem,
					quantity: cartItem.quantity + quantity,
				};
			} else return cartItem;
		});
		setCartItems(updatedCartItems);

		setTotalQuantities(totalQuantities + quantity);
		setTotalPrice(totalPrice + product.price * quantity);
	};

	const onAdd = (product, quantity) => {
		const checkProductInCart = cartItems.find(
			(item) => item._id === product._id
		);

		if (checkProductInCart) {
			handleExistingProductInCart(product, quantity);
		} else {
			product.quantity = quantity;
			setCartItems([...cartItems, { ...product }]);

			setTotalQuantities(totalQuantities + quantity);
			setTotalPrice(totalPrice + product.price * quantity);
		}
	};

	const onAddInsideCart = (product, action) => {
		const quantity = action === "inc" ? 1 : -1;
		handleExistingProductInCart(product, quantity);
	};

	const onRemoveInsideCart = (product, quantity) => {
		removeExistingProductInCart(product, -quantity);
	};

	const clearCart = () => {
		setCartItems([]);
		setTotalPrice(0);
		setTotalQuantities(0);
	};

	const incQty = () => {
		setQty(qty + 1);
	};

	const decQty = () => {
		if (qty - 1 < 1) {
			setQty(1);
			return;
		}
		setQty(qty - 1);
	};

	return (
		<Context.Provider
			value={{
				showCart,
				cartItems,
				totalPrice,
				totalQuantities,
				qty,
				setShowCart,
				incQty,
				decQty,
				onAdd,
				onAddInsideCart,
				onRemoveInsideCart,
				removeExistingProductInCart,
				clearCart,
			}}>
			{children}
		</Context.Provider>
	);
};

export default StateContext;

export const useStateContext = () => useContext(Context);
