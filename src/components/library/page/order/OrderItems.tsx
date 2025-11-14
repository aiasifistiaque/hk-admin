import {
	OrderRightSectionContainer,
	OrderItemHeading,
	OrderItemsContainer,
	OrderPriceDetails,
	Flex,
} from '../..';
import SingleOrderItem from './SingleOrderItem';

const OrderItems = ({ data }: { data: any }) => {
	return (
		<>
			<OrderRightSectionContainer>
				<OrderItemHeading>Description</OrderItemHeading>
				<OrderItemHeading textAlign='center'>Price</OrderItemHeading>
				<OrderItemHeading textAlign='center'>Qty</OrderItemHeading>

				<OrderItemHeading textAlign='right'>Amount</OrderItemHeading>
			</OrderRightSectionContainer>
			<OrderItemsContainer>
				{data?.items?.map((item: any, i: number) => (
					<SingleOrderItem
						index={i}
						item={item}
						key={i}
					/>
				))}
			</OrderItemsContainer>
			<Flex
				flex={1}
				align='flex-end'
				w='full'>
				<OrderPriceDetails
					total={data?.total}
					subTotal={data?.subTotal}
					discount={data?.discount}
					shipping={data?.shippingCharge}
					vat={data?.vat}
				/>
			</Flex>
		</>
	);
};

export default OrderItems;
