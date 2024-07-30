'use client';

import {
	TextField,
	IndexTable,
	LegacyCard,
	IndexFilters,
	useSetIndexFiltersMode,
	useIndexResourceState,
	Text,
	ChoiceList,
	RangeSlider,
	Badge,
	IndexFiltersMode,
	useBreakpoints,
	AppProvider,
	Card,
	DatePicker,
} from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import type { IndexFiltersProps, Range, TabProps } from '@shopify/polaris';
import { useState, useCallback, FC, useEffect } from 'react';
import '@shopify/polaris/build/esm/styles.css';
import useGetAllOrders from '@/app/hooks/orders/getAll';
import getAllOrders, { Order } from '@/app/api/orders/getAll/route';

interface OrdersTableSectionProps {
	orders: Order[];
}

const OrdersTableSection: FC<OrdersTableSectionProps> = ({ orders }) => {
	const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

	useEffect(() => {
		setFilteredOrders(orders);

		return () => {
			setFilteredOrders([]);
		};
	}, [orders]);

	console.log({ filteredOrders, orders });

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	const [itemStrings, setItemStrings] = useState([
		'All',
		'Unpaid',
		'Open',
		'Closed',
		'Local delivery',
		'Local pickup',
	]);
	const deleteView = (index: number) => {
		const newItemStrings = [...itemStrings];
		newItemStrings.splice(index, 1);
		setItemStrings(newItemStrings);
		setSelected(0);
	};

	const duplicateView = async (name: string) => {
		setItemStrings([...itemStrings, name]);
		setSelected(itemStrings.length);
		await sleep(1);
		return true;
	};

	const tabs: TabProps[] = itemStrings.map((item, index) => ({
		content: item,
		index,
		onAction: () => {},
		id: `${item}-${index}`,
		isLocked: index === 0,
		actions:
			index === 0
				? []
				: [
						{
							type: 'rename',
							onAction: () => {},
							onPrimaryAction: async (
								value: string
							): Promise<boolean> => {
								const newItemsStrings = tabs.map(
									(item, idx) => {
										if (idx === index) {
											return value;
										}
										return item.content;
									}
								);
								await sleep(1);
								setItemStrings(newItemsStrings);
								return true;
							},
						},
						{
							type: 'duplicate',
							onPrimaryAction: async (
								value: string
							): Promise<boolean> => {
								await sleep(1);
								duplicateView(value);
								return true;
							},
						},
						{
							type: 'edit',
						},
						{
							type: 'delete',
							onPrimaryAction: async () => {
								await sleep(1);
								deleteView(index);
								return true;
							},
						},
				  ],
	}));
	const [selected, setSelected] = useState(0);
	const onCreateNewView = async (value: string) => {
		await sleep(500);
		setItemStrings([...itemStrings, value]);
		setSelected(itemStrings.length);
		return true;
	};

	const { mode, setMode } = useSetIndexFiltersMode(
		IndexFiltersMode.Filtering
	);
	const onHandleCancel = () => {};

	const onHandleSave = async () => {
		await sleep(1);
		return true;
	};

	const primaryAction: IndexFiltersProps['primaryAction'] =
		selected === 0
			? {
					type: 'save-as',
					onAction: onCreateNewView,
					disabled: false,
					loading: false,
			  }
			: {
					type: 'save',
					onAction: onHandleSave,
					disabled: false,
					loading: false,
			  };
	const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
		undefined
	);

	const [dateRange, setDateRange] = useState<Range | undefined>(undefined);
	const [attributedStaffName, setAttributedStaffName] = useState<
		string | undefined
	>('');
	const [customerName, setCustomerName] = useState<string | undefined>('');

	const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

	const handleMoneySpentChange = useCallback(
		(value: [number, number]) => setMoneySpent(value),
		[]
	);
	const handleDateRangeChange = useCallback(
		(value: Range) => setDateRange(value),
		[]
	);

	const handleAttributedStaffNameChange = useCallback(
		(value: string) => setAttributedStaffName(value),
		[]
	);
	const handleCustomerNameChange = useCallback(
		(value: string) => setCustomerName(value),
		[]
	);
	const handleQueryValueChange = useCallback(
		(value: string) => setQueryValue(value),
		[]
	);

	const handleMoneySpentRemove = useCallback(
		() => setMoneySpent(undefined),
		[]
	);
	const handleAttributedStaffNameRemove = useCallback(
		() => setAttributedStaffName(''),
		[]
	);
	const handleCustomerNameRemove = useCallback(() => setCustomerName(''), []);
	const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
	const handleFiltersClearAll = useCallback(() => {
		handleMoneySpentRemove();
		handleQueryValueRemove();
		handleAttributedStaffNameRemove();
		handleCustomerNameRemove();
	}, [
		handleQueryValueRemove,
		handleMoneySpentRemove,
		handleAttributedStaffNameRemove,
		handleCustomerNameRemove,
	]);
	const [{ month, year }, setDate] = useState({ month: 6, year: 2024 });

	const handleMonthChange = useCallback(
		(month: number, year: number) => setDate({ month, year }),
		[]
	);
	const filters = [
		{
			key: 'total',
			label: 'Money spent',
			filter: (
				<RangeSlider
					label='Money spent is between'
					labelHidden
					value={moneySpent || [0, 500]}
					prefix='$'
					output
					min={0}
					max={2000}
					step={1}
					onChange={handleMoneySpentChange}
				/>
			),
		},
		{
			key: 'date',
			label: 'Date Range',
			filter: (
				<DatePicker
					year={year}
					month={month}
					selected={dateRange}
					onChange={handleDateRangeChange}
					allowRange
					onMonthChange={handleMonthChange}
				/>
			),
		},
		{
			key: 'attributedStaffName',
			label: 'Attributed with',
			filter: (
				<TextField
					label='Attributed with'
					value={attributedStaffName}
					onChange={handleAttributedStaffNameChange}
					autoComplete='off'
					labelHidden
				/>
			),
			shortcut: true,
		},
		{
			key: 'customer',
			label: 'Customer name',
			filter: (
				<TextField
					label='Customer name'
					value={customerName}
					onChange={handleCustomerNameChange}
					autoComplete='off'
					labelHidden
				/>
			),
			shortcut: true,
		},
	];

	const appliedFilters =
		customerName && !isEmpty(customerName)
			? [
					{
						key: 'customer',
						label: disambiguateLabel('customer', customerName),
						onRemove: handleCustomerNameRemove,
					},
			  ]
			: [];

	const resourceName = {
		singular: 'order',
		plural: 'orders',
	};

	const { selectedResources, allResourcesSelected, handleSelectionChange } =
		useIndexResourceState(filteredOrders as any);

	const rowMarkup = filteredOrders.map(
		(
			{
				id,
				order,
				date,
				customer,
				total,
				attributedStaffName,
				commission,
			},
			index
		) => (
			<IndexTable.Row
				id={id}
				key={id}
				selected={selectedResources.includes(id)}
				position={index}
			>
				<IndexTable.Cell>
					<Text variant='bodyMd' fontWeight='bold' as='span'>
						{order}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>{date.toDateString()}</IndexTable.Cell>
				<IndexTable.Cell>{customer}</IndexTable.Cell>
				<IndexTable.Cell>
					<Text as='span' alignment='end' numeric>
						{total}
					</Text>
				</IndexTable.Cell>
				<IndexTable.Cell>{attributedStaffName}</IndexTable.Cell>
				<IndexTable.Cell>{commission}</IndexTable.Cell>
			</IndexTable.Row>
		)
	);

	useEffect(() => {
		console.log('attributedStaffName', { attributedStaffName });

		setFilteredOrders((prev) =>
			prev
				.filter((order) => {
					if (!dateRange) {
						return true;
					}
					return (
						order.date >= dateRange?.start &&
						order.date <= dateRange?.end
					);
				})
				.filter((order) => {
					if (!attributedStaffName?.length) {
						return true;
					}
					return order.attributedStaffName
						.toLowerCase()
						.includes(attributedStaffName.toLowerCase());
				})
				.filter((order) => {
					if (!customerName?.length) {
						return true;
					}
					return order.customer
						.toLowerCase()
						.includes(customerName.toLowerCase());
				})
		);

		return () => {
			setFilteredOrders(orders);
		};
	}, [attributedStaffName, customerName, dateRange, moneySpent, orders]);

	return (
		<AppProvider i18n={en}>
			<Card>
				<IndexFilters
					queryValue={queryValue}
					queryPlaceholder='Searching in all'
					onQueryChange={handleQueryValueChange}
					onQueryClear={() => setQueryValue('')}
					primaryAction={primaryAction}
					cancelAction={{
						onAction: onHandleCancel,
						disabled: false,
						loading: false,
					}}
					tabs={tabs}
					selected={selected}
					onSelect={setSelected}
					canCreateNewView
					onCreateNewView={onCreateNewView}
					filters={filters}
					appliedFilters={appliedFilters}
					onClearAll={handleFiltersClearAll}
					mode={mode}
					setMode={setMode}
				/>
				<IndexTable
					condensed={useBreakpoints().smDown}
					resourceName={resourceName}
					itemCount={filteredOrders.length}
					selectedItemsCount={
						allResourcesSelected ? 'All' : selectedResources.length
					}
					onSelectionChange={handleSelectionChange}
					headings={[
						{ title: 'Order' },
						{ title: 'Date' },
						{ title: 'Customer' },
						{ title: 'Total', alignment: 'end' },
						{ title: 'Attributed Staff Name' },
						{ title: 'Commission' },
					]}
				>
					{rowMarkup}
				</IndexTable>
			</Card>
		</AppProvider>
	);

	function disambiguateLabel(key: string, value: string | string[]): string {
		switch (key) {
			case 'moneySpent':
				return `Money spent is between $${value[0]} and $${value[1]}`;
			case 'dateRange':
				return `Order made between ${value[0]} and ${value[1]}`;
			case 'attributedStaffName':
				return `Attributed with ${value}`;
			case 'customer':
				return `Name: ${value}`;
			default:
				return value as string;
		}
	}

	function isEmpty(value: string): boolean {
		if (Array.isArray(value)) {
			return value.length === 0;
		} else {
			return value === '' || value == null;
		}
	}
};

export default OrdersTableSection;
