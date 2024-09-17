import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userRequest } from '../requestMethods';
import { FaTrash, FaPlus, FaDownload, FaFilePdf, FaEdit, FaTimes, FaUser } from 'react-icons/fa';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { saveAs } from 'file-saver'; // For exporting CSV
import jsPDF from 'jspdf'; // For exporting PDF
import 'jspdf-autotable'; // For table in PDF

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

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
    text-transform: uppercase;

    @media (max-width: 768px) {
        font-size: 24px;
    }
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

const Select = styled.select`
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    transition: border-color 0.3s ease;
    background-color: white;

    &:focus {
        border-color: #4caf50;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const Button = styled.button`
    padding: 12px 20px;
    background-color: ${(props) => (props.active ? '#4caf50' : '#2c3e50')};
    color: ${(props) => (props.active ? 'white' : '#fff')};
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 16px;
    margin: 10px;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
        background-color: ${(props) => (props.active ? '#45a049' : '#34495e')};
    }

    svg {
        margin-left: 8px;
    }

    @media (max-width: 768px) {
        padding: 10px 16px;
        font-size: 14px;
    }
`;

const ExportButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    gap: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-end;
    }
`;

const ExportButton = styled.button`
    padding: 8px 16px;
    background-color: #2196f3;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #1976d2;
    }

    svg {
        margin-right: 8px;
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
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

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const ProductInfo = styled.div`
    flex: 1;

    h3 {
        margin: 0 0 10px 0;
        font-size: 20px;
        color: #333;
    }

    p {
        margin: 4px 0;
        color: #666;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ProductActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const DeleteButton = styled(Button)`
    background-color: #f44336;

    &:hover {
        background-color: #e53935;
    }

    @media (max-width: 768px) {
        flex: 1;
    }
`;

const EditButton = styled(Button)`
    background-color: #ff9800;

    &:hover {
        background-color: #fb8c00;
    }

    @media (max-width: 768px) {
        flex: 1;
    }
`;

const UserStatsContainer = styled.div`
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 20px;
    animation: ${fadeIn} 0.5s ease-in-out;

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

const Popup = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${(props) => (props.error ? '#f44336' : '#4caf50')};
    color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: ${fadeIn} 0.5s ease-in-out;

    @media (max-width: 768px) {
        width: calc(100% - 40px);
        right: 10px;
        left: 10px;
    }
`;

const OrderList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const OrderItem = styled.li`
    margin-bottom: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const OrderTitle = styled.h3`
    font-size: 20px;
    color: #333;
    display: flex;
    align-items: center;

    svg {
        margin-right: 8px;
        color: #4caf50;
    }
`;

const OrderDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
        margin: 0;
        color: #555;
        font-size: 14px;

        strong {
            color: #333;
        }
    }

    span {
        color: #007bff;
        cursor: pointer;
        text-decoration: underline;
    }

    select {
        width: 200px;
    }
`;

const UserDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
        margin: 0;
        color: #555;
        font-size: 14px;

        strong {
            color: #333;
        }
    }
`;

const TooltipContainer = styled.div`
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    color: #333;

    .label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .intro {
        color: #4caf50;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: ${(props) => (props.isOpen ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    z-index: 1001;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;

    &:hover {
        color: #333;
    }
`;

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#e91e63', '#00bcd4'];

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'];

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
    const [income, setIncome] = useState([]);
    const [activeOption, setActiveOption] = useState('ADD_PRODUCT');
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupError, setPopupError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [usersMap, setUsersMap] = useState({});
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

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
                setUserStats(res.data);
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

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const res = await userRequest.get('/orders/income');
                setIncome(res.data);
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        if (activeOption === 'INCOME') {
            fetchIncome();
        }
    }, [activeOption]);

    useEffect(() => {
        const fetchUsersForOrders = async () => {
            const uniqueUserIds = [...new Set(orders.map(order => order.userId))];
            try {
                const userPromises = uniqueUserIds.map(id => userRequest.get(`/users/find/${id}`));
                const usersResponses = await Promise.all(userPromises);
                const usersData = {};
                usersResponses.forEach(res => {
                    usersData[res.data._id] = res.data;
                });
                setUsersMap(usersData);
            } catch (error) {
                console.error('Error fetching user details for orders:', error);
            }
        };

        if (activeOption === 'ORDERS' && orders.length > 0) {
            fetchUsersForOrders();
        }
    }, [activeOption, orders]);

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
            setPopupMessage('Product added successfully!');
            setPopupError(false);
            setPopupVisible(true);

            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Error adding product:', error);
            setPopupMessage('Error adding product.');
            setPopupError(true);
            setPopupVisible(true);
            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await userRequest.delete(`/products/${productId}`);
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== productId)
            );
            console.log(`Product with ID ${productId} deleted successfully.`);
            setPopupMessage('Product deleted successfully!');
            setPopupError(false);
            setPopupVisible(true);

            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting product:', error);
            setPopupMessage('Error deleting product.');
            setPopupError(true);
            setPopupVisible(true);
            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        }
    };

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    const exportCSV = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            ['Month,Total Income']
                .concat(income.map((item) => `${item.month},${item.total}`))
                .join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'monthly_income.csv');
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Monthly Income Report', 14, 22);

        doc.setFontSize(12);
        const tableColumn = ['Month', 'Total Income'];
        const tableRows = [];

        income.forEach((item) => {
            const rowData = [`${item.month}`, `Rs.${item.total}`];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save('monthly_income.pdf');
    };

    const exportUserStatsCSV = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            ['Month,Total Users']
                .concat(
                    userStats.map((item) => {
                        const monthName = getMonthName(item._id);
                        return `${monthName},${item.total}`;
                    })
                )
                .join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'user_stats.csv');
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };

    const exportUserStatsPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('User Statistics Report', 14, 22);

        doc.setFontSize(12);
        const tableColumn = ['Month', 'Total Users'];
        const tableRows = [];

        userStats.forEach((item) => {
            const rowData = [getMonthName(item._id), item.total];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save('user_stats.pdf');
    };

    const getMonthName = (monthNumberOrName) => {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        if (typeof monthNumberOrName === 'number') {
            return monthNames[monthNumberOrName - 1] || 'Unknown';
        }

        if (typeof monthNumberOrName === 'string') {
            const parsed = Number(monthNumberOrName);
            if (!isNaN(parsed)) {
                return monthNames[parsed - 1] || 'Unknown';
            }
            return monthNumberOrName;
        }

        return 'Unknown';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let monthName;

            if (typeof label === 'string') {
                const parsedLabel = Number(label);
                if (!isNaN(parsedLabel)) {
                    monthName = getMonthName(parsedLabel);
                } else {
                    monthName = getMonthName(label);
                }
            } else {
                monthName = getMonthName(label);
            }

            const metricName = payload[0].name;
            const value = payload[0].value;

            let introText;
            if (metricName === 'Total Users') {
                introText = `Total Users: ${value}`;
            } else if (metricName === 'Total Income') {
                introText = `Total Income: Rs.${value}`;
            } else {
                introText = `Total: ${value}`;
            }

            return (
                <TooltipContainer>
                    <p className="label">{monthName}</p>
                    <p className="intro">{introText}</p>
                </TooltipContainer>
            );
        }

        return null;
    };

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedProduct = {
                title: currentProduct.title,
                desc: currentProduct.desc,
                img: currentProduct.img,
                categories: currentProduct.categories,
                size: currentProduct.size,
                color: currentProduct.color,
                price: Number(currentProduct.price),
            };

            const res = await userRequest.put(`/products/${currentProduct._id}`, updatedProduct);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === currentProduct._id ? res.data : product
                )
            );
            setIsEditing(false);
            setCurrentProduct(null);
            setPopupMessage('Product updated successfully!');
            setPopupError(false);
            setPopupVisible(true);

            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Error updating product:', error);
            setPopupMessage('Error updating product.');
            setPopupError(true);
            setPopupVisible(true);
            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setCurrentProduct(null);
    };

    const handleUserClick = async (userId) => {
        try {
            const res = await userRequest.get(`/users/find/${userId}`);
            setSelectedUser(res.data);
            setIsUserModalOpen(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleCloseUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUser(null);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);

        try {
            const res = await userRequest.put(`/orders/${orderId}`, { status: newStatus });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: res.data.status } : order
                )
            );
            setPopupMessage('Order status updated successfully!');
            setPopupError(false);
            setPopupVisible(true);
        } catch (error) {
            console.error('Error updating order status:', error);
            setPopupMessage('Error updating order status.');
            setPopupError(true);
            setPopupVisible(true);
        } finally {
            setUpdatingOrderId(null);
            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        }
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
                                        <p>
                                            <strong>Price:</strong> Rs.{product.price}
                                        </p>
                                        <p>
                                            <strong>Categories:</strong> {product.categories.join(', ')}
                                        </p>
                                        <p>
                                            <strong>Sizes:</strong> {product.size.join(', ')}
                                        </p>
                                        <p>
                                            <strong>Colors:</strong> {product.color.join(', ')}
                                        </p>
                                    </ProductInfo>
                                    <ProductActions>
                                        <EditButton onClick={() => handleEditClick(product)}>
                                            <FaEdit /> Edit
                                        </EditButton>
                                        <DeleteButton onClick={() => handleDelete(product._id)}>
                                            <FaTrash /> Delete
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
                        <ExportButtonsContainer>
                            <ExportButton onClick={exportUserStatsCSV}>
                                <FaDownload /> Export CSV
                            </ExportButton>
                            <ExportButton onClick={exportUserStatsPDF}>
                                <FaFilePdf /> Export PDF
                            </ExportButton>
                        </ExportButtonsContainer>
                        <UserStatsContainer>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={userStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="_id"
                                        tick={{ fontSize: 12, fill: '#555' }}
                                        tickFormatter={(month) => getMonthName(month)}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#555' }}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        name="Total Users"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        activeDot={{ r: 8 }}
                                    >
                                        <LabelList dataKey="total" position="top" formatter={(value) => `${value}`} />
                                        {userStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} stroke="#8884d8" />
                                        ))}
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>
                        </UserStatsContainer>
                    </Section>
                );
            case 'ORDERS':
                return (
                    <Section>
                        <Title>Orders</Title>
                        <OrderList>
                            {orders.map((order) => {
                                const user = usersMap[order.userId];
                                return (
                                    <OrderItem key={order._id}>
                                        <OrderHeader>
                                            <OrderTitle>
                                                <FaUser /> Order ID: {order._id}
                                            </OrderTitle>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </OrderHeader>
                                        <OrderDetails>
                                            <p>
                                                <strong>Total Price:</strong> Rs.{order.amount}
                                            </p>
                                            <p>
                                                <strong>User:</strong>{' '}
                                                {user ? (
                                                    <span onClick={() => handleUserClick(user._id)}>
                                                        {user.username} <FaUser />
                                                    </span>
                                                ) : (
                                                    'Loading...'
                                                )}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {updatingOrderId === order._id ? (
                                                    <span>Updating...</span>
                                                ) : (
                                                    <Select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    >
                                                        {STATUS_OPTIONS.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                )}
                                            </p>
                                        </OrderDetails>
                                    </OrderItem>
                                );
                            })}
                        </OrderList>
                    </Section>
                );
            case 'INCOME':
                return (
                    <Section>
                        <Title>Monthly Income</Title>
                        <ExportButtonsContainer>
                            <ExportButton onClick={exportCSV}>
                                <FaDownload /> Export CSV
                            </ExportButton>
                            <ExportButton onClick={exportPDF}>
                                <FaFilePdf /> Export PDF
                            </ExportButton>
                        </ExportButtonsContainer>
                        <UserStatsContainer>
                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart
                                    data={income}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12, fill: '#555' }}
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                        height={80}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#555' }}
                                        tickFormatter={(value) => `Rs.${value}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar dataKey="total" name="Total Income" fill="#4caf50" barSize={50}>
                                        <LabelList dataKey="total" position="top" formatter={(value) => `Rs.${value}`} />
                                        {income.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </UserStatsContainer>
                    </Section>
                );
            default:
                return null;
        }
    };

    return (
        <Container>
            <Navbar />
            {popupVisible && <Popup error={popupError}>{popupMessage}</Popup>}
            <Content>
                <ButtonContainer>
                    <Button
                        active={activeOption === 'ADD_PRODUCT'}
                        onClick={() => handleOptionClick('ADD_PRODUCT')}
                    >
                        Add Product <FaPlus />
                    </Button>
                    <Button
                        active={activeOption === 'PRODUCTS'}
                        onClick={() => handleOptionClick('PRODUCTS')}
                    >
                        Products
                    </Button>
                    <Button
                        active={activeOption === 'USER_STATS'}
                        onClick={() => handleOptionClick('USER_STATS')}
                    >
                        User Stats
                    </Button>
                    <Button
                        active={activeOption === 'ORDERS'}
                        onClick={() => handleOptionClick('ORDERS')}
                    >
                        Orders
                    </Button>
                    <Button
                        active={activeOption === 'INCOME'}
                        onClick={() => handleOptionClick('INCOME')}
                    >
                        Monthly Income
                    </Button>
                </ButtonContainer>
                {renderActiveOption()}
            </Content>

            {isEditing && currentProduct && (
                <ModalOverlay isOpen={isEditing}>
                    <ModalContent>
                        <CloseButton onClick={handleCloseModal}>
                            <FaTimes />
                        </CloseButton>
                        <Title>Edit Product</Title>
                        <Form onSubmit={handleEditSubmit}>
                            <FormGroup>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    value={currentProduct.title}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, title: e.target.value })
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    value={currentProduct.desc}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, desc: e.target.value })
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Image URL</Label>
                                <Input
                                    type="text"
                                    value={currentProduct.img}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, img: e.target.value })
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Categories (comma-separated)</Label>
                                <Input
                                    type="text"
                                    value={currentProduct.categories.join(', ')}
                                    onChange={(e) =>
                                        setCurrentProduct({
                                            ...currentProduct,
                                            categories: e.target.value.split(',').map((c) => c.trim()),
                                        })
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Sizes (comma-separated)</Label>
                                <Input
                                    type="text"
                                    value={currentProduct.size.join(', ')}
                                    onChange={(e) =>
                                        setCurrentProduct({
                                            ...currentProduct,
                                            size: e.target.value.split(',').map((s) => s.trim()),
                                        })
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Colors (comma-separated)</Label>
                                <Input
                                    type="text"
                                    value={currentProduct.color.join(', ')}
                                    onChange={(e) =>
                                        setCurrentProduct({
                                            ...currentProduct,
                                            color: e.target.value.split(',').map((c) => c.trim()),
                                        })
                                    }
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    value={currentProduct.price}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, price: e.target.value })
                                    }
                                    required
                                />
                            </FormGroup>
                            <ButtonContainer>
                                <Button type="submit" active={true}>
                                    Update Product <FaPlus />
                                </Button>
                            </ButtonContainer>
                        </Form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {isUserModalOpen && selectedUser && (
                <ModalOverlay isOpen={isUserModalOpen}>
                    <ModalContent>
                        <CloseButton onClick={handleCloseUserModal}>
                            <FaTimes />
                        </CloseButton>
                        <Title>User Details</Title>
                        <UserDetailsContainer>
                            <p>
                                <strong>Username:</strong> {selectedUser.username}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedUser.email}
                            </p>
                            <p>
                                <strong>Created At:</strong>{' '}
                                {new Date(selectedUser.createdAt).toLocaleDateString()}
                            </p>
                        </UserDetailsContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
            <Footer />
        </Container>
    );
};    

    export default AdminDashboard;
