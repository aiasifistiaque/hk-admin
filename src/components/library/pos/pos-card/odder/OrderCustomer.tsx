import { ReactNode } from 'react';
import { Text } from '@chakra-ui/react';

const OrderCustomer = ({ data }: { data: any }) => {
	return (
		<Text
			mt={2}
			fontSize='.9rem'
			fontWeight='500'>
			<b>Customer:</b> {data?.name} {data?.email && `, Email: ${data?.email}`}
			<strong>{data?.phone && `, Phone: ${data?.phone}`}</strong>
		</Text>
	);
};

export default OrderCustomer;
