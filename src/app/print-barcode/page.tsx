'use client';

import {
	Column,
	Layout,
	VDataMenu,
	VInput,
	useGetAllQuery,
} from '@/components/library';
import {
	Button,
	Text,
	Box,
	SimpleGrid,
	Card,
	CardBody,
	CardHeader,
	Heading,
	Divider,
	Badge,
	HStack,
	VStack,
	Input,
	Center,
	Grid,
	Flex,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SelectedProduct {
	_id: string;
	quantity: number;
}

const PrintBarcodePage = () => {
	const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
	const [showPreview, setShowPreview] = useState(false);
	const [menuValue, setMenuValue] = useState('');
	const [isDownloading, setIsDownloading] = useState(false);
	const [isPrinting, setIsPrinting] = useState(false);
	const printRef = useRef<HTMLDivElement>(null);

	const { data: stocksData } = useGetAllQuery({
		path: 'stocks',
		limit: 9999,
	});

	const { data: shopData } = useGetAllQuery({
		path: 'shops',
	});
	const shopName = shopData?.doc?.[0]?.name || 'HK';

	const getProductDetails = (id: string) => {
		return stocksData?.doc?.find((stock: any) => stock._id === id);
	};

	const getBarcodeValue = (product: any) => {
		if (!product?.code) return '0000000000';
		const code = product.code.toUpperCase();
		return code.replace('STK-', '').replace(/[^0-9]/g, '');
	};

	const handleAddProduct = (productId: string) => {
		if (!productId) return;
		if (!selectedProducts.find(p => p._id === productId)) {
			setSelectedProducts([...selectedProducts, { _id: productId, quantity: 1 }]);
		}
		setShowPreview(false);
	};

	const handleQuantityChange = (productId: string, quantity: number) => {
		if (isNaN(quantity) || quantity < 1) quantity = 1;
		setSelectedProducts(
			selectedProducts.map(p => (p._id === productId ? { ...p, quantity } : p))
		);
		setShowPreview(false);
	};

	const handleRemoveProduct = (productId: string) => {
		setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
		setShowPreview(false);
	};

	const handlePreview = () => {
		if (selectedProducts.length === 0) return;
		setShowPreview(true);
	};

	const generatePDFDocument = async () => {
		if (!printRef.current) return null;

		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4',
		});

		const pages = printRef.current.children;
		
		for (let i = 0; i < pages.length; i++) {
			const pageElement = pages[i] as HTMLElement;
			const canvas = await html2canvas(pageElement, {
				scale: 2,
				backgroundColor: '#ffffff',
				logging: false,
			});
			const imgData = canvas.toDataURL('image/png');
			
			if (i > 0) {
				pdf.addPage();
			}
			pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
		}
		
		return pdf;
	};

	const handleDownloadPDF = async () => {
		setIsDownloading(true);
		try {
			const pdf = await generatePDFDocument();
			if (pdf) {
				pdf.save(`barcodes.pdf`);
			}
		} finally {
			setIsDownloading(false);
		}
	};

	const handlePrint = async () => {
		setIsPrinting(true);
		try {
			const pdf = await generatePDFDocument();
			if (pdf) {
				pdf.autoPrint();
				const blob = pdf.output('bloburl');
				window.open(blob, '_blank');
			}
		} finally {
			setIsPrinting(false);
		}
	};

	const renderBarcodeBox = (product: any) => {
		return (
			<Box
				w='45mm'
				h='40mm'
				p='1.5mm'
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='space-between'
				bg='white'
				border='1px solid black'
				overflow='hidden'
				sx={{ pageBreakInside: 'avoid' }}
				fontFamily='Arial, sans-serif'
				color='black'
			>
				{/* 1st row: Brand/shop name */}
				<Text
					fontSize='11pt'
					fontWeight='normal'
					textAlign='center'
					w='full'
					m={0}
					lineHeight='1'
				>
					{shopName}
				</Text>

				{/* 2nd row: Full product name */}
				<Text
					fontSize='8pt'
					textAlign='center'
					w='full'
					lineHeight='1.1'
					m={0}
					whiteSpace='normal'
					wordBreak='break-word'
				>
					{product?.variantName || 'Product Name'}
				</Text>

				{/* Barcode and Number grouped to control exact gap */}
				<Box display='flex' flexDirection='column' alignItems='center' gap='4px' w='full'>
					{/* 3rd row: Barcode */}
					<Box display='flex' justifyContent='center' w='full' m={0}>
						<Barcode
							value={getBarcodeValue(product)}
							width={1.2}
							height={24}
							fontSize={0}
							margin={0}
							displayValue={false}
						/>
					</Box>

					{/* 4th row: Barcode number written */}
					<Text fontSize='8pt' m={0} lineHeight='1'>
						{getBarcodeValue(product)}
					</Text>
				</Box>

				{/* 5th row: Product price */}
				<Text
					fontSize='12pt'
					fontWeight='bold'
					// m={0}
					lineHeight='1'
					marginBottom='8px'
				>
					Price: TK {product?.variantPrice?.toLocaleString() || '0'}
				</Text>
			</Box>
		);
	};

	// Generate all barcodes based on selected products and their quantities
	const getAllBarcodes = () => {
		const barcodes: any[] = [];
		selectedProducts.forEach(sp => {
			const product = getProductDetails(sp._id);
			if (product) {
				for (let i = 0; i < sp.quantity; i++) {
					barcodes.push(product);
				}
			}
		});
		return barcodes;
	};

	const barcodes = getAllBarcodes();

	// Constants for A4 layout
	const ITEMS_PER_COLUMN = 6;
	const COLUMNS_PER_PAGE = 3;
	const ITEMS_PER_PAGE = ITEMS_PER_COLUMN * COLUMNS_PER_PAGE;

	const printPages = [];
	for (let i = 0; i < barcodes.length; i += ITEMS_PER_PAGE) {
		const pageBarcodes = barcodes.slice(i, i + ITEMS_PER_PAGE);
		
		// Split into columns manually
		const columns = [];
		for (let j = 0; j < pageBarcodes.length; j += ITEMS_PER_COLUMN) {
			columns.push(pageBarcodes.slice(j, j + ITEMS_PER_COLUMN));
		}
		
		printPages.push(columns);
	}

	return (
		<Layout title='Print Barcode'>
			<Box py={6}>
				<Grid
					gridTemplateColumns={{ base: '1fr', md: '1fr 2fr' }}
					gap={6}>
					{/* Left Panel - Selection */}
					<Card
						w='full'
						h='750px'
						overflow='hidden'>
						<CardHeader pb={2}>
							<Heading size='md'>Barcode Settings</Heading>
						</CardHeader>
						<CardBody
							overflowY='auto'
							sx={{
								'&::-webkit-scrollbar': { width: '4px' },
								'&::-webkit-scrollbar-track': { bg: 'transparent' },
								'&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
							}}>
							<VStack
								spacing={6}
								align='stretch'>
								{/* Product Selection */}
								<Box>
									<Text
										fontWeight='semibold'
										mb={2}>
										Select Product
									</Text>
									<VDataMenu
										value={menuValue}
										onChange={(e: any) => {
											handleAddProduct(e.target.value);
											setMenuValue('');
										}}
										label='Choose a product'
										model='stocks'
										menuKey='variantName'
									/>
								</Box>

								{/* Selected Products Info */}
								<VStack align="stretch" spacing={3}>
									{selectedProducts.map((sp) => {
										const product = getProductDetails(sp._id);
										if (!product) return null;
										return (
											<Box
												key={sp._id}
												p={3}
												bg='gray.50'
												_dark={{ bg: 'gray.700' }}
												borderRadius='md'
												position="relative"
											>
												<Box position="absolute" top={2} right={2}>
													<Button size="xs" colorScheme="red" variant="ghost" onClick={() => handleRemoveProduct(sp._id)}>
														🗑️
													</Button>
												</Box>
												<Text fontWeight='bold' pr={6} noOfLines={2} fontSize="sm">{product.variantName}</Text>
												<HStack mt={2} justify="space-between" align="center">
													<HStack>
														<Badge colorScheme='blue'>{product.code}</Badge>
														<Badge colorScheme='green'>
															৳{product.variantPrice?.toLocaleString()}
														</Badge>
													</HStack>
													<HStack w="100px">
														<Text fontSize="xs">Qty:</Text>
														<Input
															size="sm"
															type="number"
															min={1}
															value={sp.quantity}
															onChange={(e) => handleQuantityChange(sp._id, parseInt(e.target.value))}
															bg="white"
															_dark={{ bg: 'gray.800' }}
														/>
													</HStack>
												</HStack>
											</Box>
										);
									})}
								</VStack>

								{selectedProducts.length > 0 && <Divider />}

								{/* Generate Button */}
								<Button
									onClick={handlePreview}
									isDisabled={selectedProducts.length === 0}
									colorScheme="purple"
									size='lg'
									w='full'>
									Generate Preview
								</Button>
							</VStack>
						</CardBody>
					</Card>

					{/* Right Panel - Preview */}
					<Card
						w='full'
						h='750px'
						overflow='hidden'>
						<CardHeader pb={2}>
							<HStack justify='space-between'>
								<Heading size='md'>Preview</Heading>
								{showPreview && (
									<Badge colorScheme='purple'>
										A4 Paper (50x40mm)
									</Badge>
								)}
							</HStack>
						</CardHeader>
						<CardBody
							overflowY='auto'
							bg='gray.100'
							_dark={{ bg: 'gray.800' }}
							sx={{
								'&::-webkit-scrollbar': { width: '4px' },
								'&::-webkit-scrollbar-track': { bg: 'transparent' },
								'&::-webkit-scrollbar-thumb': { bg: 'gray.400', borderRadius: 'full' },
							}}>
							{!showPreview ? (
								<Center
									h='full'
									bg='white'
									_dark={{ bg: 'gray.700', borderColor: 'border.dark' }}
									borderRadius='md'
									border='2px dashed'
									borderColor='gray.200'>
									<VStack color='gray.400'>
										<Text fontSize='4xl'>📦</Text>
										<Text>Select products and click Generate Preview</Text>
									</VStack>
								</Center>
							) : (
								<VStack
									spacing={6}
									align="center"
									w='full'>
									
									{/* Action Buttons */}
									<Box
										w='full'
										maxW="210mm"
										pt={2}>
										<SimpleGrid
											columns={2}
											spacing={4}
											w='full'
											mb={4}>
											<Button
												onClick={handleDownloadPDF}
												isLoading={isDownloading}
												loadingText="Downloading..."
												colorScheme='purple'
												size='md'
												leftIcon={<Text>📥</Text>}
											>
												Download PDF
											</Button>
											<Button
												onClick={handlePrint}
												isLoading={isPrinting}
												loadingText="Preparing Print..."
												colorScheme='green'
												size='md'
												leftIcon={<Text>🖨️</Text>}
											>
												Print Now
											</Button>
										</SimpleGrid>
									</Box>

									{/* Print-Ready Version Displayed for Preview */}
									<Box ref={printRef} w="210mm">
										{printPages.map((pageColumns, pageIndex) => (
											<Box
												key={pageIndex}
												style={{
													width: '210mm',
													height: '297mm',
													padding: '10mm 15mm',
													backgroundColor: 'white',
													pageBreakAfter: 'always',
													position: 'relative',
													boxSizing: 'border-box'
												}}
												boxShadow="xl"
												mb={pageIndex < printPages.length - 1 ? "20px" : "0"}
											>
												<Grid templateColumns={`repeat(${COLUMNS_PER_PAGE}, 1fr)`} gap={4} h="full">
													{pageColumns.map((colBarcodes, colIndex) => (
														<Flex key={colIndex} flexDirection="column" gap="6mm" w="50mm">
															{colBarcodes.map((product, index) => (
																<Box key={index} w="100%">
																	{renderBarcodeBox(product)}
																</Box>
															))}
														</Flex>
													))}
												</Grid>
											</Box>
										))}
									</Box>

								</VStack>
							)}
						</CardBody>
					</Card>
				</Grid>
			</Box>
		</Layout>
	);
};

export default PrintBarcodePage;
