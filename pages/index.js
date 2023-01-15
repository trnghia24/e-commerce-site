import React from 'react'

import {client} from '../lib/client';
import {Product, FooterBanner, HeroBanner} from '../components';

const Home = ({products, bannerData}) => {
  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>

      <div className ="products-heading">
        <h2>Best-selling Products</h2>
        <p>Sneakers of many variations</p>
      </div>

      <div className ="products-containter">
        {products?.map((product) => <Product key={product._id} product={product}/>)}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]}/>
    </div>
  )
}

export const getServerSideProps = async () => { // this works the same way as useEffect
  // fetch all items under product entry on sanity
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);
  
  // fetch all items under banner entry on sanity
  const bannerQuerry = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuerry);

  return {
    props: {products, bannerData}
  }
}

export default Home
