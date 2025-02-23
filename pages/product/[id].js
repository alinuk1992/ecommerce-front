/* eslint-disable @next/next/no-img-element */
import Button from '@/components/Button';
import { CartContext } from '@/components/CartContext';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductImages from '@/components/ProductImages';
import Title from '@/components/Title';
import WhiteBox from '@/components/WhiteBox';
import CartIcon from '@/components/icons/CartIcon';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { useContext } from 'react';
import styled from 'styled-components';

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Price = styled.span`
  font-size: 1.4rem;
`;

const ProductPage = ({ product }) => {
  const { addProduct } = useContext(CartContext);

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <Price>${product?.price}</Price>
              <div>
                <Button primary onClick={() => addProduct(product._id)}>
                  <CartIcon />
                  Add to cart
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  const { id } = context.query;
  await mongooseConnect();
  const product = await Product.findById(id);
  return {
    props: { product: JSON.parse(JSON.stringify(product)) },
  };
}
