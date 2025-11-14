import React from 'react';
import { VInput, InputRow as Row, VTextarea } from '@/components/library';
import { addressFields } from '.';

type AddressSectionProps = {
	handleAddress: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => void;
	address: {
		name: string;
		email: string;
		phone: string;
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
		address: string;
	};
};

const AddressSection: React.FC<AddressSectionProps> = ({ handleAddress, address }) => {
	return (
		<>
			<Row cols='1fr 1fr 1fr'>
				<VInput
					{...addressFields.name}
					value={address.name}
					onChange={handleAddress}
				/>
				<VInput
					{...addressFields.email}
					value={address.email}
					onChange={handleAddress}
				/>
				<VInput
					{...addressFields.phone}
					value={address.phone}
					onChange={handleAddress}
				/>
			</Row>
			<Row cols='1fr'>
				<VTextarea
					{...addressFields.address}
					value={address.address}
					onChange={handleAddress}
				/>
			</Row>
			{/* <Row cols='1fr 1fr 1fr'>
				<VInput
					{...addressFields.city}
					value={address.city}
					onChange={handleAddress}
				/>
				<VInput
					{...addressFields.state}
					value={address.state}
					onChange={handleAddress}
				/>
				<VInput
					{...addressFields.postalCode}
					value={address.postalCode}
					onChange={handleAddress}
				/>
			</Row> */}
		</>
	);
};

export default AddressSection;
