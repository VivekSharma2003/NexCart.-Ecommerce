import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { userRequest } from '../requestMethods';
import { clearCart } from '../redux/cartRedux';

const Success = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.stripeData;
  const cart = location.state?.cart;
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        if (!currentUser || !cart || !data) {
          setError('Missing required data. Please try again.');
          return;
        }

        const orderData = {
          userId: currentUser._id,
          products: cart.products.map((item) => ({
            productId: item._id,
            quantity: item._quantity,
          })),
          amount: cart.total,
          address: data.billing_details?.address,
        };

        const res = await userRequest.post('/orders', orderData);
        if (res.data && res.data._id) {
          setOrderId(res.data._id);
          dispatch(clearCart());
        } else {
          setError('Failed to create order. Please try again.');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        setError('Failed to create order. Please try again.');
      }
    };

    createOrder();
  }, [cart, data, currentUser, dispatch]);

  const goToHomepage = () => {
    navigate('/'); 
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {orderId ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#4CAF50' }}>Order Created Successfully!</h2>
          <p>Your order number is <strong>{orderId}</strong></p>
          <button style={{ padding: '10px 20px', marginTop: 20, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }} onClick={goToHomepage}>
            Go to Homepage
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>Processing...</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Success;
