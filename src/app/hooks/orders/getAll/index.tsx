import { useEffect, useState } from 'react';

interface Order {
	id: string;
	order: string;
	date: Date;
	customer: string;
	total: string;
	attributedStaffName: string;
	commission: string;
}

const GET_ORDERS_URL = 'http://localhost:8080/order';
const useGetAllOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const response = await fetch(GET_ORDERS_URL);
			const data: Order[] = await response.json();
			setOrders(data);
		};

		fetchOrders();
	}, []);

	return {
		orders,
	};
};

export default useGetAllOrders;
