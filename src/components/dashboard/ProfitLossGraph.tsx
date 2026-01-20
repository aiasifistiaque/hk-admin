'use client';

import React from 'react';
import { Box, Text, Skeleton, Flex } from '@chakra-ui/react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useGetQuery } from '../library';

const ProfitLossGraph = () => {
	const { data, isLoading, isError } = useGetQuery({
		path: 'analytics/yearly-profit-loss',
	});

	if (isLoading) {
		return (
			<Box
				p={6}
				borderRadius='lg'
				bg='white'
				_dark={{ bg: 'container.dark' }}>
				<Skeleton height='300px' />
			</Box>
		);
	}

	if (isError || !data) {
		return (
			<Box
				pt={2}
				borderRadius='lg'
				bg='white'
				_dark={{ bg: 'container.dark' }}>
				<Text color='red.500'>Error loading profit & loss data</Text>
			</Box>
		);
	}

	const formatCurrency = (value: number) => {
		return `৳${value.toLocaleString()}`;
	};

	return (
		<Box
			w='full'
			p={6}
			borderRadius='lg'
			bg='white'
			_dark={{ bg: 'container.dark' }}>
			<Flex
				gap={4}
				mb={6}
				flexWrap='wrap'>
				<Box>
					<Text fontSize='sm'>Total Income</Text>
					<Text
						fontSize='lg'
						fontWeight='bold'
						color='green.500'>
						{formatCurrency(data?.totalIncome || 0)}
					</Text>
				</Box>
				<Box>
					<Text fontSize='sm'>Total Expense</Text>
					<Text
						fontSize='lg'
						fontWeight='bold'
						color='red.500'>
						{formatCurrency(data?.totalExpense || 0)}
					</Text>
				</Box>
				<Box>
					<Text fontSize='sm'>Net Profit/Loss</Text>
					<Text
						fontSize='lg'
						fontWeight='bold'
						color={data.totalProfit >= 0 ? 'green.500' : 'red.500'}>
						{formatCurrency(data?.totalProfit || 0)}
					</Text>
				</Box>
			</Flex>

			<ResponsiveContainer
				width='100%'
				height={400}>
				<BarChart
					data={data?.monthlyData}
					margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis
						dataKey='month'
						angle={-35}
						textAnchor='end'
						height={120}
						interval={0}
						tick={{ fontSize: 11 }}
					/>
					<YAxis
						tickFormatter={(value: number) => `৳${(value / 1000).toFixed(0)}k`}
						tick={{ fontSize: 12 }}
					/>
					<Tooltip
						formatter={(value: any) => formatCurrency(value)}
						contentStyle={{
							backgroundColor: 'rgba(255, 255, 255, 0.95)',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
					<Legend />
					<Bar
						dataKey='revenue'
						name='Revenue'
						fill='#38A169'
						radius={[4, 4, 0, 0]}
					/>
					<Bar
						dataKey='expense'
						name='Expense'
						fill='#E53E3E'
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default ProfitLossGraph;
