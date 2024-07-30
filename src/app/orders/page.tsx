'use client';

import React, { FC, useEffect, useState } from 'react';

import OrdersTableSection from '@/containers/orders-page/table-section';
import OrdersPageSection from '@/containers/orders-page/page-section';
import getAllOrders, { Order } from '../api/orders/getAll/route';

interface OrdersPageProps {}

const OrdersPage: FC<OrdersPageProps> = ({}) => {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		const res = await getAllOrders();
		res.map((order) => (order.date = new Date(order.date)));
		setOrders(res);
	};

	return (
		<main>
			<OrdersPageSection action={fetchOrders}>
				<OrdersTableSection orders={orders} />
			</OrdersPageSection>
		</main>
	);
};

export default OrdersPage;
