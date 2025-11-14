import { ReactNode } from 'react';
import { Text } from '@chakra-ui/react';

const OrderAddress = ({ address }: { address: any }) => {
	return (
		<Text
			mt={2}
			fontSize='.9rem'
			fontWeight='500'>
			<b>Delivery Address: </b>
			{address?.address}
		</Text>
	);
};

export default OrderAddress;
