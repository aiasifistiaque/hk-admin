'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	Button,
	Flex,
	Heading,
	Text,
	useDisclosure,
	Input,
	FormControl,
	Stack,
	Wrap,
	Center,
} from '@chakra-ui/react';
import { ReactNode, useState, FC, useRef, useEffect } from 'react';

import {
	AlertDialogHeader,
	AlertDialogContent,
	Column,
	useAppDispatch,
	Label,
	Price,
	useQtyInCart,
	addToVariantCart,
} from '../../..';

type DeleteItemModalProps = {
	item: any;
	children?: ReactNode;
	isOpen: boolean;
	onClose: any;
	onOpen: () => void;
	selectedVariant: string;
};

const BarcodeModal: FC<DeleteItemModalProps> = ({
	children,
	item,
	isOpen,
	onOpen,
	onClose,
	selectedVariant,
}) => {
	const cancelRef = useRef<any>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

	const inCart = useQtyInCart(selectedVariant);

	const [qty, setQty] = useState<number>();
	const dispatch = useAppDispatch();

	const closeItem = () => {
		setQty(undefined);
		onClose();
	};

	const outOfStock = () => {
		if (!selectedVariant) {
			return true;
		}
		const itemStock = item?.variations?.find((v: any) => v?._id === selectedVariant)?.stock;
		if (itemStock < 1) {
			return true;
		}
		if (itemStock < Number(inCart) + (Number(qty) || 1)) {
			return true;
		}
	};

	const handleDelete = (e: any) => {
		e.preventDefault();
		if (outOfStock()) {
			return;
		} else {
			const getVariation = item?.variations?.find((v: any) => v?._id === selectedVariant);
			const selectedSize = getVariation?.attributes?.find(
				(attr: any) => attr?.label === 'size'
			)?.value;
			const selectedColor = getVariation?.attributes?.find(
				(attr: any) => attr?.label === 'color'
			)?.value;
			const product: any = {
				_id: String(item?._id),
				id: String(item?._id),
				name: item?.name,
				price: getVariation?.price || item.price,
				vat: getVariation?.vat || 0,
				image: item?.image,
				selectedSize,
				selectedColor,
				variationId: getVariation?._id,
				variantStock: getVariation?.stock,
				stock: getVariation?.stock,
				variantName: getVariation?.name,
				sku: item?.sku,
			};

			dispatch(addToVariantCart({ item: product, qty }));
			closeItem();
		}
	};

	useEffect(() => {
		if (!isOpen) return;
		setTimeout(() => {
			inputRef?.current?.focus();
		}, 500);
	}, [isOpen]);

	return (
		<>
			<AlertDialog
				closeOnOverlayClick={false}
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeItem}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Add Item To cart</AlertDialogHeader>
						<form onSubmit={handleDelete}>
							<AlertDialogBody>
								<Column
									pt={4}
									gap={2}>
									<Heading size='md'>{item?.name}</Heading>
									{item?.unitValue && (
										<Text>
											{item?.unitValue} {item?.unit}
										</Text>
									)}
									<Text fontSize='1rem'>
										SKU: <strong>{item?.sku}</strong>
									</Text>
									<Text fontSize='.8rem'>
										Barcode:{' '}
										{selectedVariant
											? item?.variations?.find((v: any) => v?._id === selectedVariant)?._id
											: item?.barcode}
									</Text>
									<Heading size='xs'>Variation</Heading>
									<Wrap gap={2}>
										{item?.variations?.map(
											(variation: any, i: number) =>
												variation?._id == selectedVariant && (
													<Center
														key={i}
														px={2}
														py={1}
														fontSize='14px'
														border='1px solid'
														bg='brand.500'
														color='white'
														borderColor={{ _light: 'gray.300', _dark: 'gray.600' }}>
														{variation?.name}
													</Center>
												)
										)}
									</Wrap>
									<Text fontSize='.8rem'>
										Stock:{' '}
										{selectedVariant
											? item?.variations?.find((v: any) => v?._id === selectedVariant)?.stock
											: 'Please Select Variant'}
									</Text>
									<Text fontSize='.8rem'>In Cart: {inCart}</Text>
									<Heading size='xs'>Qty: {qty}</Heading>

									<Heading size='sm'>
										Unit Price: <Price>{item?.price}</Price>
									</Heading>
									<Flex pt={4}>
										<FormControl gap={4}>
											<Stack
												spacing={2}
												w='full'>
												<Label>Enter Quantity</Label>
												<Stack
													spacing={1}
													w='full'>
													<Input
														value={qty}
														ref={inputRef}
														onChange={(e: any) => setQty(e.target.value)}
														type='number'
													/>
												</Stack>
											</Stack>
										</FormControl>
									</Flex>
								</Column>
							</AlertDialogBody>

							<AlertDialogFooter>
								<Button
									ref={cancelRef}
									onClick={closeItem}
									size='sm'
									colorScheme='gray'>
									Discard
								</Button>

								<Button
									isDisabled={!selectedVariant || outOfStock()}
									colorScheme={outOfStock() ? 'red' : 'brand'}
									type='submit'
									ml={2}
									size='sm'>
									{outOfStock() ? 'Out Of Stock' : 'Add To Cart'}
								</Button>
							</AlertDialogFooter>
						</form>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default BarcodeModal;
