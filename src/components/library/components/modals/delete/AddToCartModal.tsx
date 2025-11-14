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
import { ReactNode, useState, FC, useRef } from 'react';

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
import CardContainer from '../../../pos/pos-card/CardContainer';

type DeleteItemModalProps = {
	item: any;
	children: ReactNode;
};

const AddToCartModal: FC<DeleteItemModalProps> = ({ children, item }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

	const [qty, setQty] = useState<number>();
	const dispatch = useAppDispatch();

	const [selectedVariant, setSelectedVariant] = useState<string>();

	const inCart = useQtyInCart(selectedVariant || '');

	const closeItem = () => {
		setQty(undefined);
		onClose();
	};

	const outOfStock = () => {
		if (!selectedVariant) {
			return true;
		}
		const stockItem = item?.variations?.find((v: any) => v?._id === selectedVariant);
		if (stockItem?.stock < 1) {
			return true;
		}
		if (stockItem?.stock < Number(inCart) + (Number(qty) || 1)) {
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

	const onModalOpen = () => {
		onOpen();
		setTimeout(() => {
			inputRef?.current?.focus();
		}, 100);
	};

	return (
		<>
			<CardContainer onClick={onModalOpen}>{children}</CardContainer>

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
									<Heading size='xs'>Select Variant</Heading>
									<Wrap gap={2}>
										{item?.variations?.map((variation: any, i: number) => (
											<Center
												onClick={e => setSelectedVariant(variation?._id)}
												key={i}
												px={2}
												py={1}
												fontSize='14px'
												border='1px solid'
												bg={selectedVariant === variation?._id ? 'brand.500' : 'transparent'}
												color={selectedVariant === variation?._id ? 'white' : 'inherit'}
												cursor='pointer'
												borderColor={{ _light: 'gray.300', _dark: 'gray.600' }}>
												{variation?.name}
											</Center>
										))}
									</Wrap>
									<Text fontSize='.8rem'>
										Stock:{' '}
										{selectedVariant
											? item?.variations?.find((v: any) => v?._id === selectedVariant)?.stock
											: 'Please Select Variant'}
									</Text>
									<Text fontSize='.8rem'>In Cart: {inCart}</Text>
									<Heading size='xs'>Qty: {qty}</Heading>
									{/* <JsonView data={item?.variations[0]} /> */}

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

export default AddToCartModal;
