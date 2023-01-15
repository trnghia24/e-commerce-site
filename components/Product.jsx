import Link from "next/link";
import React from "react";
import { urlFor } from "../lib/client";

const Product = ({ product: { image, name, price, slug } }) => {
	return (
		<div className="product-box">
			<Link href={`/product/${slug.current}`}>
				<div className="product-card">
					<img
						/* a product can have multiple images  */
						src={urlFor(image && image[0])}
						width={250}
						height={250}
						className="product-image"
					/>
					<p className="product-name">{name}</p>
					<p className="product-price">${price}</p>
				</div>
			</Link>
		</div>
	);
};

export default Product;
