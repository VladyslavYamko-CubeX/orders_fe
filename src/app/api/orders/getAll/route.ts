export interface Order {
	id: string;
	order: string;
	date: Date;
	customer: string;
	total: string;
	attributedStaffName: string;
	commission: string;
}

const orders = [
	{
		id: '1020',
		order: '#1020',
		date: new Date(2024, 6, 29),
		customer: 'Jaydon Stanton',
		total: '$969.44',
		attributedStaffName: 'Jaydon Westerfelt',
		commission: '$8.24',
	},
	{
		id: '1019',
		order: '#1019',
		date: new Date(2024, 6, 30),
		customer: 'Ruben Westerfelt',
		total: '$701.19',
		attributedStaffName: 'Leo Westerfelt',
		commission: '$8.24',
	},
	{
		id: '1018',
		order: '#1018',
		date: new Date(2024, 6, 31),
		customer: 'Leo Carder',
		total: '$798.24',
		attributedStaffName: 'Ruben Carder',
		commission: '$8.24',
	},
];
export default async function getAllOrders(): Promise<Order[]> {
	return orders;
	const res = await fetch('http://localhost:8080/order');
	return res.json();
}
