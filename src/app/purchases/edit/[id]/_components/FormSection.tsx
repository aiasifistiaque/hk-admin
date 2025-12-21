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
import { useToast } from '@chakra-ui/react';

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
	handleChange: (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => void;
	formData: {
		shippingCost: number;
		paidAmount: number;
		date: string;
		customer: string;
		discount: number;
		paymentMethod: string;
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
				name: value?.name,
				price: value?.price,
				cost: value?.cost,
				vat: value?.vat,
				subTotal: value?.price,
				qty: 1,
				variations: value?.variations || [],
			};

			setItems((prevData: any) => [...prevData, newItem]);
		}
	};

	const formattedValue = formData.date ? new Date(formData.date).toISOString().split('T')[0] : '';

	return (
		<>
			<Row cols='1fr 1fr 1fr'>
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
				<VInput
					{...formFields.subTotal}
					value={invoice.subTotal}
					onChange={handleChange}
				/>
			</Row>
			<Row cols='1fr 1fr 1fr 1fr'>
				<VInput
					{...formFields.vat}
					value={invoice.vat}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.discount}
					value={formData.discount}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.shippingCost}
					value={formData.shippingCost}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.paidAmount}
					value={formData.paidAmount}
					onChange={handleChange}
				/>
			</Row>
			<Row gridTemplateColumns='1fr 1fr 1fr'>
				<VInput
					{...formFields.dueAmount}
					value={
						invoice.subTotal +
						Number(invoice.shipping) +
						Number(invoice.vat) -
						Number(invoice.discount)
					}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.total}
					value={invoice.total}
					onChange={handleChange}
				/>
				<VSelect
					{...formFields.paymentMethod}
					value={formData.paymentMethod}
					onChange={handleChange}>
					<option value='cod'>COD</option>
					<option value='cash'>Cash</option>
					<option value='card'>Card</option>
					<option value='cheque'>Cheque</option>
					<option value='bkash'>bKash</option>
					<option value='nagad'>Nagad</option>
					<option value='other'>other</option>
				</VSelect>
			</Row>
			<Row gridTemplateColumns='1fr'>
				<VDataMenu
					label='Add product'
					model='products'
					type='object'
					value={''}
					unselect={false}
					onChange={handleSelectProduct}
				/>
			</Row>
		</>
	);
};

export default FormSection;
