'use client';
import {
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Flex,
	Heading,
	Text,
	Badge,
	Image,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	useColorModeValue,
	Drawer,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	Box,
	Skeleton,
	SkeletonText,
} from '@chakra-ui/react';

import {
	ModalContainer,
	Column,
	useGetByIdQuery,
	Align,
	MenuItem,
	useIsMobile,
	useGetAllQuery,
} from '..';

const ViewStockModal = ({ id }: { id: string }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Fetch item details
	const {
		data: item,
		isFetching: itemFetching,
		refetch: refetchItem,
	} = useGetByIdQuery({
		id,
		path: 'items',
	});

	// Fetch stock list filtered by item id
	const {
		data: stockData,
		isFetching: stockFetching,
		refetch: refetchStock,
	} = useGetAllQuery({
		path: 'stocks',
		limit: 32,
		filters: {
			item: id,
		},
	});

	console.log('sd', stockData);

const stocks = Array.isArray(stockData?.doc)
	? stockData.doc
	: Array.isArray(stockData)
		? stockData
		: [];
    
	const onModalOpen = () => {
		onOpen();
		refetchItem();
		refetchStock();
	};

	const isLoading = itemFetching || stockFetching;
	const isSmallScreen = useIsMobile();

	const borderColor = useColorModeValue('#bbb', 'stroke.deepD');
	const theadBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const rowHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');

	const Container = isSmallScreen ? Drawer : Modal;
	const Overlay = isSmallScreen ? DrawerOverlay : ModalOverlay;
	const CloseButton = isSmallScreen ? DrawerCloseButton : ModalCloseButton;
	const Header = isSmallScreen ? DrawerHeader : ModalHeader;
	const Body = isSmallScreen ? DrawerBody : ModalBody;

	const totalStock = stocks.reduce(
		(sum: number, s: any) => sum + (s.quantity ?? 0),
		0,
	);
	const totalValue = stocks.reduce(
		(sum: number, s: any) => sum + (s.sellingStockValue ?? 0),
		0,
	);

	const renderItemHeader = (
		<Flex align='center' gap={3} mt={2}>
			{item?.image && (
				<Image
					src={item.image}
					alt={item.name}
					boxSize='48px'
					objectFit='cover'
					borderRadius='md'
					border='1px solid'
					borderColor={borderColor}
					flexShrink={0}
				/>
			)}
			<Box>
				<Heading size='sm'>{item?.name}</Heading>
				<Flex gap={2} mt={1} flexWrap='wrap'>
					{item?.code && (
						<Badge colorScheme='blue' fontSize='xs'>
							#{item.code}
						</Badge>
					)}
					{item?.unit?.symbol && (
						<Badge colorScheme='gray' fontSize='xs'>
							{item.unit.symbol}
						</Badge>
					)}
					{item?.status && (
						<Badge
							colorScheme={item.status === 'published' ? 'green' : 'yellow'}
							fontSize='xs'
						>
							{item.status}
						</Badge>
					)}
					{item?.categories?.map((cat: any) => (
						<Badge key={cat._id} colorScheme='purple' fontSize='xs'>
							{cat.name}
						</Badge>
					))}
				</Flex>
			</Box>
		</Flex>
	);

	const renderSummaryRow = (
		<Flex
			gap={6}
			py={3}
			px={1}
			borderBottom='1px dashed'
			borderTop='1px dashed'
			borderColor={borderColor}
			flexWrap='wrap'
		>
			<Box>
				<Text fontSize='xs' color='gray.700' mb={0.5}>
					Total Stock
				</Text>
				<Heading size='sm'>{totalStock.toLocaleString()}</Heading>
			</Box>
			<Box>
				<Text fontSize='xs' color='gray.700' mb={0.5}>
					Selling Value
				</Text>
				<Heading size='sm'>৳{totalValue.toLocaleString()}</Heading>
			</Box>
			{item?.buyPrice && (
				<Box>
					<Text fontSize='xs' color='gray.700' mb={0.5}>
						Buy Price
					</Text>
					<Heading size='sm'>৳{item.buyPrice.toLocaleString()}</Heading>
				</Box>
			)}
			{item?.price && (
				<Box>
					<Text fontSize='xs' color='gray.700' mb={0.5}>
						Sell Price
					</Text>
					<Heading size='sm'>৳{item.price.toLocaleString()}</Heading>
				</Box>
			)}
		</Flex>
	);

	const renderStockTable = (
		<TableContainer>
			<Table size='sm' variant='simple'>
				<Thead bg={theadBg}>
					<Tr>
						<Th>Stock Code</Th>
						<Th>Warehouse</Th>
						<Th>Variant</Th>
						<Th isNumeric>Price</Th>
						<Th isNumeric>Qty</Th>
						<Th isNumeric>Sell Value</Th>
					</Tr>
				</Thead>
				<Tbody>
					{isLoading
						? Array.from({ length: 3 }).map((_, i) => (
								<Tr key={i}>
									{Array.from({ length: 6 }).map((__, j) => (
										<Td key={j}>
											<Skeleton height='14px' />
										</Td>
									))}
								</Tr>
							))
						: stocks.map((stock: any) => (
								<Tr
									key={stock._id}
									_hover={{ bg: rowHoverBg }}
									transition='background 0.15s'
								>
									<Td>
										<Text fontSize='xs' fontFamily='mono' color='blue.400'>
											{stock.code}
										</Text>
									</Td>
									<Td>
										<Text fontSize='sm' fontWeight='medium'>
											{stock.warehouse?.name ?? '—'}
										</Text>
										{stock.warehouse?.code && (
											<Text fontSize='xs' color='gray.700'>
												{stock.warehouse.code}
											</Text>
										)}
									</Td>
									<Td>
										<Text fontSize='sm'>{stock.variantName ?? '—'}</Text>
										{stock.variantShortName && (
											<Badge fontSize='xs' colorScheme='teal' mt={0.5}>
												{stock.variantShortName}
											</Badge>
										)}
									</Td>
									<Td isNumeric>
										<Text fontSize='sm'>
											৳{stock.variantPrice?.toLocaleString() ?? '—'}
										</Text>
									</Td>
									<Td isNumeric>
										<Badge
											colorScheme={stock.quantity > 0 ? 'green' : 'red'}
											fontSize='sm'
											px={2}
										>
											{stock.quantity?.toLocaleString() ?? 0}
										</Badge>
									</Td>
									<Td isNumeric>
										<Text fontSize='sm' fontWeight='medium'>
											৳{stock.sellingStockValue?.toLocaleString() ?? '—'}
										</Text>
									</Td>
								</Tr>
							))}
					{!isLoading && stocks.length === 0 && (
						<Tr>
							<Td colSpan={6}>
								<Align py={6}>
									<Text color='gray.400' fontSize='sm'>
										No stock records found for this item.
									</Text>
								</Align>
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</TableContainer>
	);

	return (
		<>
			<MenuItem onClick={onModalOpen}>View Stock</MenuItem>

			<Container
				{...(!isSmallScreen && { isCentered: true })}
				{...(isSmallScreen && { placement: 'bottom' })}
				closeOnOverlayClick={false}
				size='4xl'
				isOpen={isOpen}
				onClose={onClose}
			>
				<Overlay />
				<ModalContainer isSmallScreen={isSmallScreen}>
					<Header>
						<Text fontSize='md' fontWeight='bold'>
							Stock Details
						</Text>
						{isLoading ? (
							<SkeletonText
								mt={2}
								noOfLines={2}
								spacing={2}
								skeletonHeight='3'
							/>
						) : (
							renderItemHeader
						)}
					</Header>
					<CloseButton />
					<Body>
						<Column gap={4}>
							{isLoading ? (
								<Skeleton height='48px' borderRadius='md' />
							) : (
								renderSummaryRow
							)}
							{renderStockTable}
						</Column>
					</Body>
				</ModalContainer>
			</Container>
		</>
	);
};

export default ViewStockModal;
