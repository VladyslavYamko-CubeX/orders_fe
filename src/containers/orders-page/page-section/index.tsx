'use client';

import { AppProvider, Button, Page } from '@shopify/polaris';
import { FC } from 'react';
import en from '@shopify/polaris/locales/en.json';

interface OrdersPageSectionProps {
	children: React.ReactNode;
	action: () => Promise<void>;
}

const OrdersPageSection: FC<OrdersPageSectionProps> = ({
	children,
	action,
}) => {
	return (
		<AppProvider i18n={en}>
			<Page
				backAction={{ content: 'Settings', url: '..' }}
				title='Orders'
				primaryAction={
					<Button variant='primary' onClick={action}>
						Sync
					</Button>
				}
			>
				{children}
			</Page>
		</AppProvider>
	);
};

export default OrdersPageSection;
