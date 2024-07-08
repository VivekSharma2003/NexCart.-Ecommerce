import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userRequest } from '../requestMethods';
import { FaTrash, FaPlus } from 'react-icons/fa';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f7f6;
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Section = styled.section`
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 30px;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
    text-transform: uppercase;
`;

const Form = styled.form`
    max-width: 600px;
    margin: 0 auto;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    font-size: 16px;
    margin-bottom: 8px;
    color: #555;
    display: block;
`;

const Input = styled.input`
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #4caf50;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const Button = styled.button`
    padding: 12px 20px;
    background-color: ${props => props.active ? '#4caf50' : '#2c3e50'};
    color: ${props => props.active ? 'white' : '#fff'};
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 16px;
    margin: 0 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${props => props.active ? '#45a049' : '#34495e'};
    }

    svg {
        margin-left: 8px;
    }
`;

const ProductList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ProductItem = styled.li`
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
    }
`;

const ProductInfo = styled.div`
    flex: 1;
`;

const ProductActions = styled.div`
    display: flex;
    align-items: center;
`;

const DeleteButton = styled(Button)`
    background-color: #f44336;

    &:hover {
        background-color: #e53935;
    }
`;

const UserStatsContainer = styled.div`
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 20px;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const UserStatItem = styled.div`
    margin-bottom: 10px;
`;

const Popup = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const OrderList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const OrderItem = styled.li`
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
    }
`;

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('');
    const [categories, setCategories] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');
    const [products, setProducts] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeOption, setActiveOption] = useState('ADD_PRODUCT');
    const [popupVisible, setPopupVisible] = useState(false);

    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await userRequest.get('/products');
                setProducts(res.data.reverse());
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const res = await userRequest.get('/users/stats');
                setUserStats(res.data.map(stat => ({
                    ...stat,
                    _id: monthNames[stat._id - 1]
                })));
            } catch (error) {
                console.error('Error fetching user statistics:', error);
            }
        };

        fetchUserStats();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await userRequest.get('/orders');
                setOrders(res.data.reverse());
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newProduct = {
                title,
                desc,
                img,
                categories: categories.split(',').map((category) => category.trim()),
                size: size.split(',').map((s) => s.trim()),
                color: color.split(',').map((c) => c.trim()),
                price: Number(price),
            };

            const res = await userRequest.post('/products', newProduct);
            setProducts([res.data, ...products]);
            setTitle('');
            setDesc('');
            setImg('');
            setCategories('');
            setSize('');
            setColor('');
            setPrice('');
            setPopupVisible(true);

            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await userRequest.delete(`/products/${productId}`);
            setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
            console.log(`Product with ID ${productId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    const renderActiveOption = () => {
        switch (activeOption) {
            case 'ADD_PRODUCT':
                return (
                    <Section>
                        <Title>Add Product</Title>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Image URL</Label>
                                <Input
                                    type="text"
                                    value={img}
                                    onChange={(e) => setImg(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Categories (comma-separated)</Label>
                                <Input
                                    type="text"
                                    value={categories}
                                    onChange={(e) => setCategories(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Sizes (comma-separated)</Label>
                                <Input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Colors (comma-separated)</Label>
                                <Input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <ButtonContainer>
                                <Button type="submit" active={true}>
                                    Add Product <FaPlus />
                                </Button>
                            </ButtonContainer>
                        </Form>
                    </Section>
                );
            case 'PRODUCTS':
                return (
                    <Section>
                        <Title>Products</Title>
                        <ProductList>
                            {products.map((product) => (
                                <ProductItem key={product._id}>
                                    <ProductInfo>
                                        <h3>{product.title}</h3>
                                        <p>{product.desc}</p>
                                        <p><strong>Price:</strong> Rs.{product.price}</p>
                                        <p><strong>Categories:</strong> {product.categories.join(', ')}</p>
                                        <p><strong>Sizes:</strong> {product.size.join(', ')}</p>
                                        <p><strong>Colors:</strong> {product.color.join(', ')}</p>
                                    </ProductInfo>
                                    <ProductActions>
                                        <DeleteButton onClick={() => handleDelete(product._id)}>
                                            Delete <FaTrash />
                                        </DeleteButton>
                                    </ProductActions>
                                </ProductItem>
                            ))}
                        </ProductList>
                    </Section>
                );
            case 'USER_STATS':
                return (
                    <Section>
                        <Title>User Statistics</Title>
                        <UserStatsContainer>
                        {userStats.map((stat) => (
                             <UserStatItem key={stat._id}>
                                 <p><strong>Month:</strong> {stat._id}</p>
                                 <p><strong>Total Users:</strong> {stat.total}</p>
                             </UserStatItem>
                         ))}
                    </UserStatsContainer>
                    </Section>
                );
            case 'ORDERS':
                return (
                    <Section>
                        <Title>Orders</Title>
                        <OrderList>
                            {orders.map(order => (
                                <OrderItem key={order._id}>
                                    <div>
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Total Price:</strong> Rs.{order.amount}</p>
                                    </div>
                                    <div>
                                        <p><strong>User:</strong> {order.userId}</p>
                                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </OrderItem>
                            ))}
                        </OrderList>
                    </Section>
                );
            default:
                return null;
        }
    };

    return (
        <Container>
            <Navbar />
            {popupVisible && <Popup>Product added successfully!</Popup>}
            <Content>
                <ButtonContainer>
                    <Button active={activeOption === 'ADD_PRODUCT'} onClick={() => handleOptionClick('ADD_PRODUCT')}>
                        Add Product <FaPlus />
                    </Button>
                    <Button active={activeOption === 'PRODUCTS'} onClick={() => handleOptionClick('PRODUCTS')}>
                        Products
                    </Button>
                    <Button active={activeOption === 'USER_STATS'} onClick={() => handleOptionClick('USER_STATS')}>
                        User Stats
                    </Button>
                    <Button active={activeOption === 'ORDERS'} onClick={() => handleOptionClick('ORDERS')}>
                        Orders
                    </Button>
                </ButtonContainer>
                {renderActiveOption()}
            </Content>
            <Footer />
        </Container>
    );
};

export default AdminDashboard;

