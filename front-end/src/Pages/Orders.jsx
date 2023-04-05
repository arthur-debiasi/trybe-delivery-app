import React, { useCallback, useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { getToken } from '../utils/localStorage';
import OrdersCard from '../Components/OrdersCard';
import api from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);

  const getOrders = useCallback(async () => {
    try {
      const { id } = getToken();
      const { data } = await api.post('/sales/orders/', { userId: id });
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);
  return (
    <div>
      <NavBar />
      {
        orders.map(({ id, status, saleDate, totalPrice }) => (
          <OrdersCard
            key={ id }
            id={ id }
            status={ status }
            saleDate={ saleDate }
            totalPrice={ totalPrice }
          />
        ))
      }
      {}
    </div>
  );
}
export default Orders;