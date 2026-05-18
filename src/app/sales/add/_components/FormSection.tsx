import React from 'react';
import {
	VInput,
	InputRow as Row,
	VDataMenu,
	createFormFields,
	VSection,
	VSelect,
} from '@/components/library';
import { formFields } from '.';
import schema from '@/models/supplier/supplier.schema';
import { Text, useToast } from '@chakra-ui/react';

const addSupplierModel = createFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Customer Information',
			fields: ['name', 'email', 'phone'],
		},
	],
});

type FormSectionProps = {
	setItems: any;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>,
	) => void;
	formData: {
		shippingCost: number;
		paidAmount: number;
		date: string;
		customer: string;
		discount: number;
		paymentMethod: string;
		warehouse: string;
	};
	invoice: {
		subTotal: number;
		vat: number;
		total: number;
		shipping: number;
		discount: number;
	};
	items: any;
};

const FormSection: React.FC<FormSectionProps> = ({
	handleChange,
	formData,
	invoice,
	items,
	setItems,
}) => {
	const toast = useToast();

	const handleSelectProduct = (e: any) => {
		const { value } = e.target;
		const ifExists = items?.some((item: any) => item?._id === value?._id);
		// const ifExists = false;

		if (value?.quantity < 1) {
			toast({
				title: 'Error',
				description: 'Item is Out of stock',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		if (ifExists) {
			toast({
				title: 'Error',
				description: 'Item already added',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		} else {
			const newItem = {
				_id: value?._id,
				image: value?.image,
				name: value?.variantName,
				price: value?.variantPrice,
				cost: value?.variantBuyPrice,
				vat: value?.vat,
				subTotal: value?.variantPrice,
				qty: 1,
				totalStock: value?.quantity,
			};

			console.log(newItem);

			setItems((prevData: any) => [...prevData, newItem]);
		}
	};

	const formattedValue = formData.date
		? new Date(formData.date).toISOString().split('T')[0]
		: '';

	return (
		<>
			<Row cols='1fr 1fr 1fr 1fr'>
				<VDataMenu
					{...formFields.warehouse}
					// dataModel={addSupplierModel}
					onChange={handleChange}
					value={formData.warehouse}
				/>
				<VDataMenu
					{...formFields.customer}
					dataModel={addSupplierModel}
					onChange={handleChange}
					value={formData.customer}
				/>
				<VInput
					{...formFields.date}
					value={formattedValue}
					onChange={handleChange}
				/>
				{formData?.warehouse ? (
					<VDataMenu
						label='Add Product'
						menuKey='variantName'
						model={`stocks?warehouse=${formData.warehouse}`}
						type='object'
						subMenuChildren='- Stock: '
						subMenuKey='quantity'
						value={''}
						unselect={false}
						onChange={handleSelectProduct}
					/>
				) : (
					<Text color='red' fontWeight='600'>
						Please select warehouse first
					</Text>
				)}
			</Row>
			<Row gridTemplateColumns='1fr 1fr 1fr 1fr'>
				<VDataMenu
					{...formFields.paymentMethod}
					model='assets'
					value={formData.paymentMethod}
					unselect={false}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.subTotal}
					value={invoice.subTotal}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.shippingCost}
					value={formData.shippingCost}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.vat}
					value={invoice.vat}
					onChange={handleChange}
				/>
			</Row>
			<Row cols='1fr 1fr 1fr 1fr'>
				<VInput
					{...formFields.paidAmount}
					value={formData.paidAmount}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.discount}
					value={formData.discount}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.dueAmount}
					value={invoice.total - Number(formData.paidAmount || 0)}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.total}
					value={invoice.total}
					onChange={handleChange}
				/>
			</Row>
		</>
	);
};

export default FormSection;
