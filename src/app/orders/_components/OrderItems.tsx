'use client';
import { useGetAllQuery, ShowSum, Count, applyFilters } from '@/components/library';
import React from 'react';
import { Grid } from '@chakra-ui/react';
import { useAppDispatch } from '@/hooks';

const OrderItems = () => {
	const dispatch = useAppDispatch();
	return (
		<Grid
			w='full'
			templateColumns={{ base: '1fr 1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }}
			gap={2}>
			<Count
				onClick={() =>
					dispatch(
						applyFilters({
							key: 'status_in',
							value: 'completed',
						})
					)
				}
				title='Completed'
				path='orders'
				filters={{ status: 'completed' }}
			/>
			<Count
				title='Confirmed'
				path='orders'
				filters={{ status: 'confirmed' }}
				onClick={() =>
					dispatch(
						applyFilters({
							key: 'status_in',
							value: 'confirmed',
						})
					)
				}
			/>
			<Count
				title='Pending'
				path='orders'
				filters={{ status: 'pending' }}
				onClick={() =>
					dispatch(
						applyFilters({
							key: 'status_in',
							value: 'pending',
						})
					)
				}
			/>
			<Count
				title='Cancelled'
				path='orders'
				filters={{ status: 'cancelled' }}
				onClick={() =>
					dispatch(
						applyFilters({
							key: 'status_in',
							value: 'cancelled',
						})
					)
				}
			/>
		</Grid>
	);
};

export default OrderItems;
