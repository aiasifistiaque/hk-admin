'use client';

import {
	Column,
	Layout,
	VDataMenu,
	VInput,
	useGetAllQuery,
	useGetOneQuery,
	useGetQuery,
} from '@/components/library';
import {
	Button,
	Flex,
	Text,
	Box,
	Radio,
	RadioGroup,
	Stack,
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
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PrintBarcodePage = () => {
	const [product, setProduct] = useState('');
	const [printer, setPrinter] = useState('Label Printer(40mm*25mm)');
	const [showPreview, setShowPreview] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const barcodeRef = useRef<HTMLDivElement>(null);
	const printRef = useRef<HTMLDivElement>(null);

	const { data: stocksData } = useGetAllQuery({
		path: 'stocks',
		limit: 9999,
	});

	const selectedProduct = stocksData?.doc?.find((stock: any) => stock._id === product);

	const getBarcodeValue = () => {
		if (!selectedProduct?.code) return '0000000000';
		const code = selectedProduct.code.toUpperCase();
		return code.replace('STK-', '').replace(/[^0-9]/g, '');
	};

	const printerOptions = [
		{ label: 'A4 Paper', value: 'Regular Printer (A4)', size: '210×297mm' },
		{ label: '40×25mm', value: 'Label Printer(40mm*25mm)', size: '40×25mm' },
		{ label: '45×35mm', value: 'Label Printer(45mm*35mm)', size: '45×35mm' },
		{ label: '41×10mm', value: 'Label Printer(41mm*10mm)', size: '41×10mm' },
		{ label: '81×12mm', value: 'Label Printer(81mm*12mm)', size: '81×12mm' },
	];

	const getPrinterDimensions = () => {
		switch (printer) {
			case 'Regular Printer (A4)':
				return { width: 210, height: 297, widthPx: 794, heightPx: 1123 };
			case 'Label Printer(40mm*25mm)':
				return { width: 40, height: 25, widthPx: 151, heightPx: 94 };
			case 'Label Printer(45mm*35mm)':
				return { width: 45, height: 35, widthPx: 170, heightPx: 132 };
			case 'Label Printer(41mm*10mm)':
				return { width: 41, height: 10, widthPx: 155, heightPx: 38 };
			case 'Label Printer(81mm*12mm)':
				return { width: 81, height: 12, widthPx: 306, heightPx: 45 };
			default:
				return { width: 40, height: 25, widthPx: 151, heightPx: 94 };
		}
	};

	const getPreviewScale = () => {
		const dims = getPrinterDimensions();
		if (printer === 'Regular Printer (A4)') return 0.5;
		if (dims.height <= 12) return 4;
		if (dims.height <= 25) return 3;
		return 2.5;
	};

	const handlePreview = () => {
		if (!product) return;
		setShowPreview(true);
	};

	const handleDownloadPDF = async () => {
		if (!printRef.current) return;

		const canvas = await html2canvas(printRef.current, {
			scale: 4,
			backgroundColor: '#ffffff',
			logging: false,
		});
		const imgData = canvas.toDataURL('image/png');

		const dimensions = getPrinterDimensions();

		const pdf = new jsPDF({
			orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
			unit: 'mm',
			format: [dimensions.width, dimensions.height],
		});

		pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
		pdf.save(`barcode-${selectedProduct?.code || 'label'}.pdf`);
	};

	const handlePrint = () => {
		if (!printRef.current) return;

		const dimensions = getPrinterDimensions();
		const printWindow = window.open('', '', 'height=600,width=800');
		if (printWindow) {
			printWindow.document.write('<html><head><title>Print Barcode</title>');
			printWindow.document.write('<style>');
			printWindow.document.write(`
				@page { size: ${dimensions.width}mm ${dimensions.height}mm; margin: 0; }
				body { margin: 0; padding: 0; }
				* { box-sizing: border-box; }
			`);
			printWindow.document.write('</style></head><body>');
			printWindow.document.write(printRef.current.innerHTML);
			printWindow.document.write('</body></html>');
			printWindow.document.close();
			setTimeout(() => printWindow.print(), 300);
		}
	};

	const isSmallLabel = printer.includes('10mm') || printer.includes('12mm');
	const dimensions = getPrinterDimensions();
	const scale = getPreviewScale();

	const renderBarcodeContent = (forPrint = false) => {
		const containerStyle: React.CSSProperties = {
			width: forPrint ? `${dimensions.width}mm` : `${dimensions.widthPx * scale}px`,
			height: forPrint ? `${dimensions.height}mm` : `${dimensions.heightPx * scale}px`,
			padding: forPrint
				? isSmallLabel
					? '1mm'
					: '2mm'
				: isSmallLabel
					? `${4 * scale}px`
					: `${8 * scale}px`,
			backgroundColor: 'white',
			display: 'flex',
			flexDirection: isSmallLabel ? 'row' : 'column',
			alignItems: 'center',
			justifyContent: isSmallLabel ? 'space-between' : 'center',
			boxSizing: 'border-box',
			overflow: 'hidden',
		};

		const textStyle = (fontSizePt: number, bold = false) => ({
			fontSize: forPrint ? `${fontSizePt}pt` : `${fontSizePt * 1.33 * scale}px`,
			fontWeight: bold ? 'bold' : 'normal',
			lineHeight: 1.2,
			margin: 0,
			whiteSpace: 'nowrap' as const,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			color: 'black',
			fontFamily: 'Arial, sans-serif',
		});

		if (isSmallLabel) {
			return (
				<div style={containerStyle}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'flex-start',
							flex: 1,
							paddingRight: forPrint ? '1mm' : `${4 * scale}px`,
							overflow: 'hidden',
							maxWidth: '65%',
						}}>
						<div style={textStyle(4)}>{selectedProduct?.variantName || 'Product'}</div>
						<div style={textStyle(4, true)}>
							৳{selectedProduct?.variantPrice?.toLocaleString() || '0'}
						</div>
					</div>
					<div style={{ flexShrink: 0 }}>
						<Barcode
							value={getBarcodeValue()}
							width={forPrint ? 0.8 : 1 * scale}
							height={
								forPrint
									? printer.includes('10mm')
										? 15
										: 25
									: (printer.includes('10mm') ? 20 : 30) * scale
							}
							fontSize={forPrint ? 8 : 10 * scale}
							margin={0}
							displayValue={false}
						/>
					</div>
				</div>
			);
		}

		return (
			<div style={containerStyle}>
				<div
					style={{
						...textStyle(8),
						marginBottom: forPrint ? '1mm' : `${2 * scale}px`,
						maxWidth: '95%',
					}}>
					{selectedProduct?.variantName || 'Product Name'}
				</div>
				<div
					style={{
						marginBottom: forPrint ? '1mm' : `${2 * scale}px`,
					}}>
					<Barcode
						value={getBarcodeValue()}
						width={forPrint ? 1.5 : 2 * scale}
						height={forPrint ? 30 : 40 * scale}
						fontSize={forPrint ? 10 : 14 * scale}
						margin={0}
						displayValue={true}
						textMargin={forPrint ? 1 : 2}
					/>
				</div>
				<div style={textStyle(10, true)}>
					৳{selectedProduct?.variantPrice?.toLocaleString() || '0'}
				</div>
			</div>
		);
	};

	return (
		<Layout title='Print Barcode'>
			<Box py={6}>
				<Grid
					gridTemplateColumns={{ base: '1fr', md: '1fr 2fr' }}
					gap={6}>
					{/* Left Panel - Selection */}
					<Card
						w='full'
						h='700px'
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
										value={product}
										onChange={(e: any) => {
											setProduct(e.target.value);
											setShowPreview(false);
										}}
										label='Choose a product'
										model='stocks'
										menuKey='variantName'
									/>
								</Box>

								{/* Selected Product Info */}
								{selectedProduct && (
									<Box
										p={4}
										bg='gray.50'
										_dark={{ bg: 'gray.700' }}
										borderRadius='md'>
										<Text
											fontSize='sm'
											mb={1}>
											Selected Product
										</Text>
										<Text fontWeight='bold'>{selectedProduct.variantName}</Text>
										<HStack mt={2}>
											<Badge colorScheme='blue'>{selectedProduct.code}</Badge>
											<Badge colorScheme='green'>
												৳{selectedProduct.variantPrice?.toLocaleString()}
											</Badge>
										</HStack>
									</Box>
								)}

								<Divider />

								{/* Printer Selection */}
								<Box>
									<Text
										fontWeight='semibold'
										mb={3}>
										Select Label Size
									</Text>
									<SimpleGrid
										columns={2}
										spacing={2}>
										{printerOptions.map(option => (
											<Button
												key={option.value}
												size='xs'
												h='auto'
												py={3}
												variant={printer === option.value ? 'solid' : 'outline'}
												colorScheme={printer === option.value ? 'purple' : 'gray'}
												onClick={() => {
													setPrinter(option.value);
													setShowPreview(false);
												}}
												flexDirection='column'
												gap={0}>
												<Text fontSize='sm'>{option.label}</Text>
												<Text
													fontSize='xs'
													opacity={0.7}>
													{option.size}
												</Text>
											</Button>
										))}
									</SimpleGrid>
								</Box>

								<Divider />

								{/* Generate Button */}
								<Button
									onClick={handlePreview}
									isDisabled={!product}
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
						h='700px'
						overflow='hidden'>
						<CardHeader pb={2}>
							<HStack justify='space-between'>
								<Heading size='md'>Preview</Heading>
								{showPreview && (
									<Badge colorScheme='purple'>
										{dimensions.width}×{dimensions.height}mm
									</Badge>
								)}
							</HStack>
						</CardHeader>
						<CardBody
							overflowY='auto'
							sx={{
								'&::-webkit-scrollbar': { width: '4px' },
								'&::-webkit-scrollbar-track': { bg: 'transparent' },
								'&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
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
										<Text>Select a product and click Generate Preview</Text>
									</VStack>
								</Center>
							) : (
								<VStack
									spacing={6}
									h='full'>
									{/* Scaled Preview for Display */}
									<Center
										flex={1}
										w='full'
										py={4}>
										<Box
											ref={barcodeRef}
											p={4}
											bg='gray.100'
											_dark={{ bg: 'gray.700' }}
											borderRadius='lg'
											display='flex'
											alignItems='center'
											justifyContent='center'
											minH='200px'
											w='full'>
											<Box
												border='1px solid'
												borderColor='gray.400'
												borderRadius='sm'
												overflow='hidden'
												boxShadow='lg'>
												{renderBarcodeContent(false)}
											</Box>
										</Box>
									</Center>

									{/* Hidden Print-Ready Version */}
									<Box
										ref={printRef}
										position='absolute'
										left='-9999px'
										top='-9999px'>
										{renderBarcodeContent(true)}
									</Box>

									{/* Action Buttons */}
									<Box
										w='full'
										pt={4}>
										<SimpleGrid
											columns={2}
											spacing={4}
											w='full'
											mb={4}>
											<Button
												onClick={handleDownloadPDF}
												colorScheme='purple'
												size='lg'
												leftIcon={<Text>📥</Text>}>
												Download PDF
											</Button>
											<Button
												onClick={handlePrint}
												colorScheme='green'
												size='lg'
												leftIcon={<Text>🖨️</Text>}>
												Print Now
											</Button>
										</SimpleGrid>

										<Text
											fontSize='sm'
											color='gray.500'
											textAlign='center'>
											The preview is scaled for visibility. Print/PDF will use exact{' '}
											{dimensions.width}×{dimensions.height}mm dimensions.
										</Text>
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
