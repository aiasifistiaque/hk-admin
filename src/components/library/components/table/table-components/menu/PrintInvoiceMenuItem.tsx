'use client';
import { FC, useState } from 'react';
import { MenuItem } from '../../../..';
import { useSelector } from 'react-redux';

const URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000';

type PrintInvoiceMenuItemProps = {
	id: string;
	title: string;
	index: number;
};

const PrintInvoiceMenuItem: FC<PrintInvoiceMenuItemProps> = ({
	id,
	title,
	index,
}) => {
	const [loading, setLoading] = useState(false);
	const token = useSelector((state: any) => state.auth?.token);

	const handlePrint = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${URL}/sales/export/invoice/dl`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization: token || '',
				},
				body: JSON.stringify({ id }),
			});

			if (!res.ok) throw new Error('Failed to fetch invoice');

			const blob = await res.blob();
			const blobUrl = window.URL.createObjectURL(blob);
			window.open(blobUrl, '_blank');
		} catch (err) {
			console.error('Print invoice error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<MenuItem key={index} onClick={handlePrint}>
			{loading ? 'Loading...' : title}
		</MenuItem>
	);
};

export default PrintInvoiceMenuItem;
