import { FC, useEffect } from 'react';
import { useState } from 'react';

import { CustomTd as Td, RowContainerBase, Icon, useGetAllQuery, JsonView } from '../..';
import { Box, Tr, Td as TD, Select, useColorModeValue } from '@chakra-ui/react';
import InputElement from '../../utils/inputs/input-components/InputElement';

type PurchaseProductProps = {
	item: any;
	i: number;
	setItem: any;
	deleteItem: any;
	viewOnly?: boolean;
	isMobile?: boolean;
};

const PackProduct: FC<PurchaseProductProps> = ({ item, i, setItem, isMobile, deleteItem }) => {
	const [qty, setQty] = useState(1);
	const [batch, setBatch] = useState('');

	const { data } = useGetAllQuery({ path: 'batches', filters: { product: item?._id?._id } });

	useEffect(() => {
		setQty(item?.qty);
		setBatch(item?.batch);
	}, []);

	const handleBatch = (e: any) => {
		setBatch(e.target.value);
		setItem({ batch: e.target.value, item, qty, index: i });
	};

	const handleReturnQty = (e: any) => {
		if (e.target.value < 0) {
			return;
		}
		setQty(e.target.value);
		setItem({ batch: batch, item, qty: e.target.value, index: i });
	};

	const borderColor = useColorModeValue('brand.500', 'brand.200');

	if (isMobile)
		return (
			<RowContainerBase>
				<Td heading='#'>{i + 1}</Td>
				<Td heading='Product Name'>{item?.name}</Td>

				<Td heading='Qty'>
					<InputElement
						size='xs'
						type='number'
						value={qty}
						onChange={handleReturnQty}
						w='100px'
					/>
				</Td>

				<Td heading='Price'>
					<InputElement
						size='xs'
						type='text'
						value={item?.batch}
						onChange={handleBatch}
						w='100px'
					/>
				</Td>
				<Td
					isNumeric
					heading='SubTotal'>
					{item?.price * item?.qty}
				</Td>

				<Td>
					<Box
						cursor='pointer'
						onClick={() => deleteItem(i)}>
						<Icon name='delete' />
					</Box>
				</Td>
			</RowContainerBase>
		);
	return (
		<Tr h='2.5rem'>
			<TD>{i + 1}</TD>
			<TD>{item?.name}</TD>

			<TD>
				<InputElement
					size='xs'
					type='number'
					value={qty}
					onChange={handleReturnQty}
					w='100px'
				/>
			</TD>

			<TD>
				<Select
					value={data?._id}
					onChange={handleBatch}
					placeholder='Select Batch'
					size='xs'
					px={3}
					borderRadius='lg'
					focusBorderColor={borderColor}
					color='text.500'
					_dark={{
						color: 'gray.300',
					}}
					_placeholder={{ fontSize: 14, fontWeight: '500' }}>
					{data?.doc?.map((variant: any) => (
						<option
							key={variant?._id}
							value={variant?._id}>
							{variant?.code}
						</option>
					))}
				</Select>
				{/* <InputElement
					size='xs'
					type='text'
					value={batch}
					onChange={handleBatch}
					w='100px'
				/> */}
			</TD>
			<TD isNumeric>{item?.price * item?.qty}</TD>

			<TD>
				<Box
					cursor='pointer'
					onClick={() => deleteItem(i)}>
					<Icon name='delete' />
				</Box>
			</TD>
		</Tr>
	);
};

export default PackProduct;
