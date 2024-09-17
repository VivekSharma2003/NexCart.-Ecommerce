import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { Add, Remove } from '@material-ui/icons';
import { mobile } from '../responsive';
import { useLocation } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { addProduct } from '../redux/cartRedux';
import { useDispatch } from 'react-redux';

const primaryColor = '#e91e63';
const secondaryColor = '#333';
const lightGray = '#f5f5f5';
const darkGray = '#555';

const Container = styled.div`
  background: linear-gradient(135deg, ${lightGray} 25%, #ffffff 100%);
  min-height: 100vh;
`;

const Wrapper = styled.div`
  padding: 30px;
  display: flex;
  background-color: #fff;
  ${mobile({ padding: "20px", flexDirection: "column" })}
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const ImgContainer = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  max-width: 450px;
  height: 70vh;
  object-fit: contain;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border-radius: 8px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(233, 30, 99, 0.2);
  }

  ${mobile({ maxWidth: "100%", height: "auto" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${mobile({ padding: "20px 0px" })}
`;

const Title = styled.h1`
  font-weight: 400;
  font-size: 32px;
  margin-bottom: 15px;
  color: ${secondaryColor};
`;

const Desc = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${darkGray};
  margin-bottom: 25px;
`;

const Price = styled.span`
  font-weight: 500;
  font-size: 30px;
  color: ${primaryColor};
  margin-bottom: 25px;
`;

const FilterContainer = styled.div`
  width: 100%;
  margin: 25px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const FilterTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${secondaryColor};
  margin-right: 12px;
`;

const FilterColor = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
  cursor: pointer;
  border: ${props => (props.isSelected ? `3px solid ${primaryColor}` : '2px solid #ddd')};
  transition: border 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    border: 3px solid ${primaryColor};
  }
`;

const FilterSize = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 16px;
  transition: border 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: ${primaryColor};
    box-shadow: 0 0 5px rgba(233, 30, 99, 0.5);
  }
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Amount = styled.span`
  width: 45px;
  height: 45px;
  border-radius: 10px;
  border: 2px solid ${primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 12px;
  font-size: 20px;
  font-weight: 600;
  color: ${secondaryColor};
  background-color: #fafafa;
`;

const Button = styled.button`
  padding: 14px 36px;
  border: none;
  background-color: ${primaryColor};
  color: white;
  cursor: pointer;
  font-weight: 600;
  border-radius: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #d81b60;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
`;

const Product = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await publicRequest.get("/products/find/" + id);
                setProduct(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getProduct();
    }, [id]);

    const handleQuantity = (type) => {
        if (type === "dec") {
            quantity > 1 && setQuantity(quantity - 1);
        } else {
            setQuantity(quantity + 1);
        }
    };

    const handleClick = () => {
        if (color && size) {
            dispatch(addProduct({ ...product, quantity, color, size }));
        } else {
            alert("Please select color and size.");
        }
    }

    return (
        <Container>
            <Navbar />
            <Announcement />
            <Wrapper>
                <ImgContainer>
                    <Image src={product.img} alt={product.title} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Desc>{product.desc}</Desc>
                    <Price>Rs. {product.price}</Price>
                    <FilterContainer>
                        <Filter>
                            <FilterTitle>Color:</FilterTitle>
                            {product.color?.map((c) => (
                                <FilterColor
                                    color={c}
                                    key={c}
                                    isSelected={color === c}
                                    onClick={() => setColor(c)}
                                    title={c}
                                />
                            ))}
                        </Filter>
                        <Filter>
                            <FilterTitle>Size:</FilterTitle>
                            <FilterSize onChange={(e) => setSize(e.target.value)} value={size}>
                                <FilterSizeOption disabled value="">
                                    Select Size
                                </FilterSizeOption>
                                {product.size?.map((s) => (
                                    <FilterSizeOption key={s} value={s}>{s}</FilterSizeOption>
                                ))}
                            </FilterSize>
                        </Filter>
                    </FilterContainer>
                    <AddContainer>
                        <AmountContainer>
                            <Remove
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleQuantity("dec")}
                            />
                            <Amount>{quantity}</Amount>
                            <Add
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleQuantity("inc")}
                            />
                        </AmountContainer>
                        <Button onClick={handleClick}>
                            ADD TO CART
                        </Button>
                    </AddContainer>
                </InfoContainer>
            </Wrapper>
            <Newsletter />
            <Footer />
        </Container>
    )
}

export default Product;
