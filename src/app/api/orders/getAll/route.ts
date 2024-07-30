export interface Order {
	id: string;
	order: string;
	date: Date;
	customer: string;
	total: string;
	attributedStaffName: string;
	commission: string;
}

export default async function getAllOrders(): Promise<Order[]> {
	const res = await fetch('http://localhost:8080/orders');

	return res.json();
}
