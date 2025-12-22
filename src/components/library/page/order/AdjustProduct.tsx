import { FC, useEffect } from 'react';
import { useState } from 'react';

import { CustomTd as Td, RowContainerBase, Icon } from '../..';
import { Box, Tr, Td as TD } from '@chakra-ui/react';
import InputElement from '../../utils/inputs/input-components/InputElement';

type PurchaseProductProps = {
	item: any;
	i: number;
	setItem: any;
	deleteItem: any;
	viewOnly?: boolean;
	isMobile?: boolean;
};

const AdjustProduct: FC<PurchaseProductProps> = ({ item, i, setItem, isMobile, deleteItem }) => {
	const [qty, setQty] = useState(1);
	const [adjustmentQty, setAdjustmentQty] = useState(0);
	const [adjustedQty, setAdjustedQty] = useState(0);

	useEffect(() => {
		setQty(item?.qty);
		setAdjustmentQty(item?.adjustmentQty);
		setAdjustedQty(item?.adjustedQty);
	}, []);

	const handleQty = (e: any) => {
		setAdjustmentQty(e.target.value);
		setAdjustedQty(parseInt(e.target.value) - parseInt(item?.qty));
		setItem({
			adjustmentQty: e.target.value,
			adjustedQty: parseInt(e.target.value) - parseInt(item?.qty),
			item: item,
		});
	};

	if (isMobile)
		return (
			<RowContainerBase>
				<Td heading='#'>{i + 1}</Td>
				<Td heading='Product Name'>{item?.name}</Td>
				<Td heading='In Hand'>{item?.qty}</Td>

				<Td heading='New In Hand'>
					<InputElement
						size='xs'
						type='number'
						value={adjustmentQty}
						onChange={handleQty}
						w='100px'
					/>
				</Td>
				<Td
					isNumeric
					heading='Adjusted Qty'>
					{adjustedQty}
				</Td>

				<Td>
					<Box
						cursor='pointer'
						onClick={() => deleteItem(item?._id)}>
						<Icon name='delete' />
					</Box>
				</Td>
			</RowContainerBase>
		);
	return (
		<Tr h='2.5rem'>
			<TD>{i + 1}</TD>
			<TD>{item?.name}</TD>

			<TD>{item?.qty}</TD>

			<TD>
				<InputElement
					size='xs'
					type='number'
					value={adjustmentQty}
					onChange={handleQty}
					w='100px'
				/>
			</TD>
			<TD isNumeric>{adjustedQty}</TD>

			<TD>
				<Box
					cursor='pointer'
					onClick={() => deleteItem(item?._id)}>
					<Icon name='delete' />
				</Box>
			</TD>
		</Tr>
	);
};

export default AdjustProduct;
