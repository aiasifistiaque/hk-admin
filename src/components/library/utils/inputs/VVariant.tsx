import { FC, useEffect, useState } from 'react';

import { FormControl, Image, Stack, Flex, Heading, Input, Grid } from '@chakra-ui/react';
import { HelperText, Label, ImageContainer, Column, radius, JsonView, VTags } from '../../';
import { Table, Tr, Th, Td, TableContainer, Tbody, Thead } from '@chakra-ui/react';

type FormDataType = {
	value: any;
	onChange: any;
	isRequired?: boolean;
	label?: string;
	helper?: string;
	isDisabled?: boolean;
	name: any;
	hasImage?: boolean;
	limit?: number;
	section?: any;
	form?: any;
};

const VVariant: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	isDisabled = false,
	name,
	limit = 999,
	form,
	section,
	...props
}) => {
	const { colors, sizes, attributes: formAttributes, customAttributes } = form || {};
	const [variants, setVariants] = useState(value || []);
	const [attributes, setAttributes] = useState<any>([]);

	// Generate all combinations of attribute values
	const generateVariantCombinations = (attrs: string[], customAttrs: any) => {
		if (!attrs || attrs.length === 0) return [];

		const attrValues = attrs.map(attr => ({
			label: attr,
			values: customAttrs?.[attr] || [],
		}));

		// Filter out attributes with no values
		const validAttrs = attrValues.filter(attr => attr.values.length > 0);
		if (validAttrs.length === 0) return [];

		// Generate all combinations
		const combinations: any[] = [];

		const generateCombos = (index: number, current: any[]) => {
			if (index === validAttrs.length) {
				combinations.push([...current]);
				return;
			}

			const attr = validAttrs[index];
			for (const val of attr.values) {
				current.push({ label: attr.label, value: val });
				generateCombos(index + 1, current);
				current.pop();
			}
		};

		generateCombos(0, []);
		return combinations;
	};

	useEffect(() => {
		let variantArr: any = [];

		// Use new attribute-based system if attributes are defined
		if (formAttributes && Array.isArray(formAttributes) && formAttributes.length > 0) {
			const combinations = generateVariantCombinations(formAttributes, customAttributes);

			combinations.forEach((combo: any[]) => {
				const variantName = combo.map(attr => `${attr.label}-${attr.value}`).join(',');
				const prodName = combo
					.map(attr => `${attr.label.charAt(0).toUpperCase() + attr.label.slice(1)}=${attr.value}`)
					.join(', ');
				const existingVariant = value?.find(
					(v: any) => v.name?.toLowerCase() === variantName.toLowerCase()
				);

				if (existingVariant) {
					variantArr.push(existingVariant);
				} else {
					variantArr.push({
						name: variantName,
						price: form?.price,
						buyPrice: form?.buyPrice,
						prodName: form?.name + ' ' + prodName,
						stock: 0,
						sku: form?.sku,
						barcode: form?.barcode,
						images: [...(form?.images ? [form?.images] : [])],
						attributes: combo,
					});
				}
			});
		} else {
			// Keep existing variants if no attributes
			variantArr = value || [];
		}

		setVariants(variantArr);
		onChange({
			target: {
				name,
				value: variantArr,
			},
		});
	}, [form?.attributes, form?.customAttributes, form?.colors, form?.sizes]);

	const onVariantValueChange = (index: number, field: string, fieldValue: any) => {
		const updatedVariants = [...value];
		updatedVariants[index] = {
			...updatedVariants[index],
			[field]: fieldValue,
		};
		setVariants(updatedVariants);
		onChange({
			target: {
				name,
				value: updatedVariants,
			},
		});
	};

	const onAttributesChange = (newAttributes: any) => {
		setAttributes(newAttributes);

		// Update customAttributes to only include current attributes
		const updatedCustomAttributes: any = {};
		newAttributes.forEach((attr: string) => {
			// Keep existing values if attribute still exists, otherwise initialize empty array
			updatedCustomAttributes[attr] = customAttributes?.[attr] || [];
		});

		// Update the form with cleaned customAttributes
		onChange({
			target: {
				name: 'customAttributes',
				value: updatedCustomAttributes,
			},
		});
	};

	return (
		<FormControl isRequired={isRequired}>
			<VTags
				value={form?.attributes || []}
				label='Attributes'
				name='attributes'
				onChange={e => {
					onAttributesChange(e.target.value);
					onChange({
						target: {
							name: 'attributes',
							value: e.target.value,
						},
					});
				}}
			/>
			{/* <JsonView data={form} /> */}
			<Grid
				gap={4}
				my={4}
				gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
				{form?.attributes &&
					form?.attributes.length > 0 &&
					form?.attributes?.map((attr: string, i: number) => (
						<VTags
							key={i}
							value={customAttributes?.[attr] || []}
							label={`Values for ${attr}`}
							name={`customAttributes.${attr}`}
							onChange={e => {
								const updatedCustomAttributes = {
									...(customAttributes || {}),
									[attr]: e.target.value,
								};
								onChange({
									target: {
										name: 'customAttributes',
										value: updatedCustomAttributes,
									},
								});
							}}
						/>
					))}
			</Grid>

			<Stack w='full'>
				<Label fontSize='22px'>{label}</Label>
				<Column
					gap={4}
					my={4}>
					<Flex
						w='full'
						align='center'
						gap={6}>
						<Column
							gap={4}
							w='full'>
							<Heading size='sm'>Manage Product Variations</Heading>
							<Flex gap={1}>
								<TableContainer>
									<Table
										variant='simple'
										borderRadius={radius?.MODAL}
										borderWidth={1}>
										<Thead>
											<Tr>
												<Th>Name</Th>
												<Th isNumeric>Cost Price</Th>
												<Th isNumeric>Sell Price</Th>
												<Th isNumeric>Barcode</Th>
												<Th isNumeric>SKU</Th>
											</Tr>
										</Thead>
										<Tbody>
											{value?.map((item: any, i: number) => (
												<Tr key={i}>
													<Td fontWeight='600'>{item?.name}:</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.buyPrice}
															name='buyPrice'
															onChange={e => onVariantValueChange(i, 'cost', e.target.value)}
														/>
													</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.price}
															name='price'
															onChange={e => onVariantValueChange(i, 'price', e.target.value)}
														/>
													</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.barcode}
															name='barcode'
															onChange={e => onVariantValueChange(i, 'barcode', e.target.value)}
														/>
													</Td>
													<Td isNumeric>
														<Input
															size='sm'
															value={item?.sku}
															name='sku'
															onChange={e => onVariantValueChange(i, 'sku', e.target.value)}
														/>
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</Flex>
						</Column>
					</Flex>
				</Column>

				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VVariant;
