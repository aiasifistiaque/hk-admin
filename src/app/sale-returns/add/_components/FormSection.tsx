'use client';

import React from 'react';
import {
	VInput,
	InputRow as Row,
	VDataMenu,
	Section,
	VSelect,
	VTextarea,
} from '@/components/library';
import { formFields, reasonOptions, conditionOptions, refundMethodOptions } from '.';
import { Box, Text, Badge, HStack, Divider } from '@chakra-ui/react';

type FormSectionProps = {
	handleChange: (e: any) => void;
	formData: {
		returnDate: string;
		reason: string;
		condition: string;
		refundMethod: string;
		account: string;
		restockingFee: number;
		reasonNote: string;
		note: string;
		warehouse: string;
	};
	returnTotals: {
		subTotal: number;
		total: number;
		refundAmount: number;
		totalItems: number;
	};
	saleData: any;
};

const FormSection: React.FC<FormSectionProps> = ({
	handleChange,
	formData,
	returnTotals,
	saleData,
}) => {
	const formattedDate = formData.returnDate
		? new Date(formData.returnDate).toISOString().split('T')[0]
		: '';

	return (
		<>
			{/* Sale Info Summary */}
			{saleData && (
				<Section heading='Original Sale Info'>
					<Box
						p={4}
						bg='gray.50'
						_dark={{ bg: 'gray.700' }}
						borderRadius='md'
						mb={4}>
						<HStack
							justify='space-between'
							mb={2}>
							<Text fontWeight='bold'>Invoice: #{saleData.invoice}</Text>
							<Badge colorScheme='blue'>{new Date(saleData.orderDate).toLocaleDateString()}</Badge>
						</HStack>
						<HStack justify='space-between'>
							<Text fontSize='sm'>Customer: {saleData.customer?.name || 'Guest'}</Text>
							<Text fontSize='sm'>Phone: {saleData.phone || 'N/A'}</Text>
						</HStack>
						<HStack
							justify='space-between'
							mt={2}>
							<Text fontSize='sm'>Original Total: ৳{saleData.total?.toLocaleString()}</Text>
							<Text fontSize='sm'>Paid: ৳{saleData.paidAmount?.toLocaleString()}</Text>
						</HStack>
					</Box>
				</Section>
			)}

			{/* Return Details */}
			<Section heading='Return Details'>
				<Row cols='1fr 1fr 1fr'>
					<VDataMenu
						{...formFields.warehouse}
						onChange={handleChange}
						value={formData.warehouse}
					/>
					<VInput
						{...formFields.returnDate}
						value={formattedDate}
						onChange={handleChange}
					/>
					<VSelect
						{...formFields.reason}
						value={formData.reason}
						onChange={handleChange}>
						<option value=''>Select Reason</option>
						{reasonOptions.map((opt: { label: string; value: string }) => (
							<option
								key={opt.value}
								value={opt.value}>
								{opt.label}
							</option>
						))}
					</VSelect>
				</Row>

				<Row cols='1fr 1fr 1fr'>
					<VSelect
						{...formFields.condition}
						value={formData.condition}
						onChange={handleChange}>
						<option value=''>Select Condition</option>
						{conditionOptions.map((opt: { label: string; value: string }) => (
							<option
								key={opt.value}
								value={opt.value}>
								{opt.label}
							</option>
						))}
					</VSelect>
					<VSelect
						{...formFields.refundMethod}
						value={formData.refundMethod}
						onChange={handleChange}>
						<option value=''>Select Refund Method</option>
						{refundMethodOptions.map((opt: { label: string; value: string }) => (
							<option
								key={opt.value}
								value={opt.value}>
								{opt.label}
							</option>
						))}
					</VSelect>
					<VDataMenu
						{...formFields.account}
						onChange={handleChange}
						value={formData.account}
					/>
				</Row>
			</Section>

			{/* Return Summary */}
			<Section heading='Return Summary'>
				<Row cols='1fr 1fr 1fr 1fr'>
					<VInput
						{...formFields.subTotal}
						value={returnTotals.subTotal}
						onChange={handleChange}
					/>
					<VInput
						{...formFields.restockingFee}
						value={formData.restockingFee}
						onChange={handleChange}
					/>
					<VInput
						{...formFields.total}
						value={returnTotals.total}
						onChange={handleChange}
					/>
					<VInput
						{...formFields.refundAmount}
						value={returnTotals.refundAmount}
						onChange={handleChange}
					/>
				</Row>
			</Section>

			{/* Notes */}
			<Section heading='Notes'>
				<Row cols='1fr 1fr'>
					<VTextarea
						{...formFields.reasonNote}
						value={formData.reasonNote}
						onChange={handleChange}
					/>
					<VTextarea
						{...formFields.note}
						value={formData.note}
						onChange={handleChange}
					/>
				</Row>
			</Section>
		</>
	);
};

export default FormSection;
