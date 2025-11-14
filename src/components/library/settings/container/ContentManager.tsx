'use client';

import {
	handleChange,
	handleImage,
	handleImageArray,
	handleNestedImage,
	handleNestedString,
	handleSwitch,
	useGetByIdQuery,
	usePostMutation,
} from '../../';
import React, { useEffect, useState } from 'react';
import {
	useCustomToast,
	Details,
	SettingsEditContainer,
	useUpdateByIdMutation,
} from '@/components/library';

const ContentManager = ({
	successMessage,
	slug,
	dataModel,
	title,
	subTitle,
	footerData,
	path = 'contents',
}: {
	successMessage?: string;
	slug: string;
	dataModel: any[];
	title: string;
	subTitle?: string;
	path?: string;
	footerData?: { title: string; link?: string; href?: string };
}) => {
	const [editing, setEditing] = useState(false);

	const { data, isFetching, isSuccess } = useGetByIdQuery({
		path: path,
		id: `get/slug/${slug}`,
	});

	const [update, result] = isSuccess ? useUpdateByIdMutation() : usePostMutation();

	const [formData, setFormData] = useState<any>({});
	const [changedData, setChangedData] = useState<any>({});

	const handleFormChange = (type = 'string', key: string) => {
		const params = { formData, setFormData, setChangedData };

		switch (type) {
			case 'image':
				return (e: any) => handleImage({ e, dataKey: key || 'image', ...params });
			case 'icon':
				return (e: any) => handleImage({ e, dataKey: key || 'icon', ...params });
			case 'switch':
			case 'image-array':
				return (e: any, type?: string) =>
					handleImageArray({ e, dataKey: key || 'image', type, ...params });
			case 'checkbox':
				return (e: any) => handleSwitch({ e, ...params });
			case 'nested-image':
				return (e: any) => handleNestedImage({ e, dataKey: key || 'image', ...params });
			case 'nested-string':
				return (e: any) => handleNestedString({ e, ...params });
			case 'nested-select':
				return (e: any) => handleNestedString({ e, ...params });
			case 'nested-data-menu':
				return (e: any) => handleNestedString({ e, ...params });
			case 'video':
				return (e: any) => handleImage({ e, dataKey: key || 'image', ...params });

			default:
				return (e: any) => handleChange({ e, ...params });
		}
	};

	const refresh = () => {
		const updatedContent = dataModel.reduce((acc, field) => {
			acc[field.name] = data ? data[field.name] : '';
			return acc;
		}, {} as any);
		setFormData(updatedContent);
	};

	useEffect(() => {
		if (!isFetching) {
			if (isSuccess) {
				const updatedContent = dataModel.reduce((acc, field) => {
					acc[field.name] = data ? data[field.name] : '';
					return acc;
				}, {} as any);
				setFormData(updatedContent);
			}
		}
	}, [isFetching]);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (isSuccess) update({ id: data?._id, body: formData, path: path });
		else {
			const body =
				path == 'contents'
					? {
							...formData,
							slug,
							name: `Content: ${slug}`,
							status: 'published',
							category: 'content',
							isVisible: true,
					  }
					: {
							page: `Page: ${slug}`,
							slug,
							...formData,
					  };
			update({
				path: path,
				body: body,
			} as any);
		}
	};

	const closeEdit = () => {
		setEditing(false);
		refresh();
	};

	const openEdit = () => setEditing(true);

	useEffect(() => {
		if (!result?.isLoading && result?.isSuccess) {
			setEditing(false);
			refresh();
		}
	}, [result?.isLoading]);

	useCustomToast({
		...result,
		successText: successMessage || 'Content Updated Successfully',
	});

	return (
		<SettingsEditContainer
			cols='1fr'
			footerData={footerData}
			subTitle={subTitle}
			handleSubmit={handleSubmit}
			isLoading={result?.isLoading}
			openEdit={openEdit}
			heading={title}
			closeEdit={closeEdit}
			editing={editing}>
			{dataModel?.map((field, i) => (
				<Details
					key={i}
					editing={editing}
					title={field?.label || field?.name}
					name={field?.name}
					type={field?.type}
					helper={field?.helper}
					onChange={handleFormChange(field?.type, field?.name)}>
					{formData?.[field?.name]}
				</Details>
			))}
		</SettingsEditContainer>
	);
};

export default ContentManager;
