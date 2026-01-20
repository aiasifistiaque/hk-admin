import { FC, useEffect, useState } from 'react';

import { FormControl, Image, Stack, Flex, Heading, Input } from '@chakra-ui/react';
import { HelperText, Label, Column, radius, useGetAllQuery, JsonView } from '../../';
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

const VStock: FC<FormDataType> = ({
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
	const [variants, setVariants] = useState(value || []);
	const [initialized, setInitialized] = useState(false);
	const { data: warehouses } = useGetAllQuery({ path: 'warehouses', limit: '999' });

	// Initialize stock data when warehouses are loaded
	useEffect(() => {
		if (!warehouses?.doc) return;

		if (form?.hasVariant) {
			// Initialize variant stocks with all warehouses
			// const updatedVariants = form?.variant?.map((variant: any) => {
			// 	// If openingStock doesn't exist or is empty, initialize with all warehouses
			// 	if (!variant.openingStock || variant.openingStock.length === 0) {
			// 		return {
			// 			...variant,
			// 			openingStock: warehouses.doc.map((warehouse: any) => ({
			// 				warehouse: warehouse._id,
			// 				stock: 0,
			// 			})),
			// 		};
			// 	}
			// 	// If openingStock exists, check if all warehouses are present
			// 	const existingWarehouseIds = variant.openingStock.map((s: any) => s.warehouse);
			// 	const missingWarehouses = warehouses.doc.filter(
			// 		(warehouse: any) => !existingWarehouseIds.includes(warehouse._id)
			// 	);
			// 	// Add missing warehouses with stock 0
			// 	if (missingWarehouses.length > 0) {
			// 		const additionalStock = missingWarehouses.map((warehouse: any) => ({
			// 			warehouse: warehouse._id,
			// 			stock: 0,
			// 		}));
			// 		return {
			// 			...variant,
			// 			openingStock: [...variant.openingStock, ...additionalStock],
			// 		};
			// 	}
			// 	return variant;
			// });
			// if (updatedVariants) {
			// 	onChange({
			// 		target: {
			// 			name: 'variant',
			// 			value: updatedVariants,
			// 		},
			// 	});
			// }
		} else {
			// Initialize primary stock with all warehouses
			if (!form?.primaryStock || form?.primaryStock?.length === 0) {
				const initialPrimaryStock = warehouses.doc.map((warehouse: any) => ({
					hasVariant: false,
					warehouse: warehouse._id,
					stock: 0,
				}));

				onChange({
					target: {
						name: 'primaryStock',
						value: initialPrimaryStock,
					},
				});
			} else {
				if (initialized) return;
				// Check if all warehouses are present in primaryStock
				const existingWarehouseIds = form.primaryStock.map((s: any) => s.warehouse);
				const missingWarehouses = warehouses.doc.filter(
					(warehouse: any) => !existingWarehouseIds.includes(warehouse._id)
				);

				// Add missing warehouses with stock 0
				if (missingWarehouses.length > 0) {
					const additionalStock = missingWarehouses.map((warehouse: any) => ({
						hasVariant: false,
						warehouse: warehouse._id,
						stock: 0,
					}));

					onChange({
						target: {
							name: 'primaryStock',
							value: [...form.primaryStock, ...additionalStock],
						},
					});
				}
			}
		}

		setInitialized(true);
	}, [warehouses, initialized, form.variant]);

	useEffect(() => {
		let variantArr: any = [];

		if (Array.isArray(variants) && Array.isArray(variants)) {
			variants.forEach((item: any) => {
				const existingVariant = value.find(
					(v: any) => v?.name?.toLowerCase() === item?.name?.toLowerCase()
				);
				if (existingVariant) {
					variantArr.push(existingVariant);
				} else {
					variantArr.push({
						name: item?.name,
						stock: 0,
					});
				}
			});
		}
		setVariants(variantArr);
		onChange({
			target: {
				name,
				value: variantArr,
			},
		});
	}, [form?.colors, form?.sizes]);

	const onVariantValueChange = (variantName: string, warehouseId: string, stockValue: any) => {
		// Get current variants array
		const currentVariants = form?.variant || [];
		const updatedVariants = [...currentVariants];

		// Find the variant by name
		const variant = updatedVariants.find((v: any) => v.name === variantName);
		if (!variant) return;

		// Initialize openingStock array if it doesn't exist
		if (!variant.openingStock) {
			variant.openingStock = [];
		}

		// Create stock entry
		const stockEntry = {
			warehouse: warehouseId,
			stock: Number(stockValue) || 0,
		};

		// Find existing stock entry for this warehouse
		const existingIndex = variant.openingStock.findIndex((s: any) => s.warehouse === warehouseId);

		if (existingIndex !== -1) {
			// Update existing entry
			variant.openingStock[existingIndex] = stockEntry;
		} else {
			// Add new entry
			variant.openingStock.push(stockEntry);
		}

		onChange({
			target: {
				name: 'variant',
				value: updatedVariants,
			},
		});
	};

	const onPrimaryValueChange = (warehouseId: string, stockValue: any) => {
		// Get current stock array or initialize empty
		const currentStock = form?.primaryStock || [];

		// Create stock entry
		const stockEntry = {
			productId: form?._id,
			hasVariant: false,
			warehouse: warehouseId,
			stock: Number(stockValue) || 0,
		};

		// Check if warehouse already exists
		const warehouseExists = currentStock.some((s: any) => s.warehouse === warehouseId);

		// Create new array - either map to update existing or spread and add new
		const updatedStock = warehouseExists
			? currentStock.map((s: any) => (s.warehouse === warehouseId ? stockEntry : s))
			: [...currentStock, stockEntry];

		onChange({
			target: {
				name: 'primaryStock',
				value: updatedStock,
			},
		});
	};

	return (
		<FormControl isRequired={isRequired}>
			<Stack w='full'>
				{/* <JsonView data={form} /> */}
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
							<Heading size='sm'>Manage Product Stock Accross Warehouses</Heading>
							<Flex gap={1}>
								<TableContainer>
									<Table
										variant='simple'
										borderRadius={radius?.MODAL}
										borderWidth={1}>
										<Thead>
											<Tr>
												<Th>Name</Th>
												{warehouses?.doc?.map((warehouse: any) => (
													<Th
														key={warehouse?._id}
														isNumeric>
														{warehouse?.name}
													</Th>
												))}
											</Tr>
										</Thead>
										{/* <JsonView data={form} /> */}

										<Tbody>
											{form?.hasVariant ? (
												form?.variant?.map((item: any, i: number) => (
													<Tr key={i}>
														<Td fontWeight='600'>{item?.name}:</Td>
														{warehouses?.doc?.map((warehouse: any) => {
															const stockEntry = item?.openingStock?.find(
																(s: any) => s.warehouse === warehouse?._id
															);

															return (
																<Td key={warehouse?._id}>
																	<Input
																		size='sm'
																		value={stockEntry?.stock || 0}
																		name='stock'
																		onChange={e =>
																			onVariantValueChange(
																				item?.name,
																				warehouse?._id,
																				e.target.value
																			)
																		}
																	/>
																</Td>
															);
														})}
													</Tr>
												))
											) : (
												<Tr>
													<Td fontWeight='600'>Stock</Td>
													{warehouses?.doc?.map((warehouse: any) => {
														const stockEntry = form?.primaryStock?.find(
															(s: any) => s.warehouse === warehouse?._id
														);

														return (
															<Td key={warehouse?._id}>
																<Input
																	size='sm'
																	value={stockEntry?.stock || 0}
																	name='openingStock'
																	onChange={e =>
																		onPrimaryValueChange(warehouse?._id, e.target.value)
																	}
																/>
															</Td>
														);
													})}
												</Tr>
											)}
										</Tbody>
									</Table>
								</TableContainer>
								{/* <JsonView data={form} /> */}
							</Flex>
						</Column>
					</Flex>
				</Column>

				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VStock;
