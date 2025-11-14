import React, { useState, useEffect } from 'react';
import { useGetAllQuery } from '../';

type ContentType = {
	name: string;
	slug: string;
	image: string;
	section: string;
	isVisible: boolean;
	gallery: string[];
	description: string;
	refImage: string;
	content: string;
	subContent: string;
	url: string;
	btnText: string;
	richContent: string;
	list: string[];
	card: Array<{
		image: string;
		title: string;
		description: string;
	}>;
	category: string;
	status: string;
	pageName: string;
	isActive: boolean;
	priority: number;
	note: string;
	_id: string;
	bgColor: string;
	color: string;
	fontSize: string;
	fontSizeSm: string;
	videoUrl: string;
};

const emptyContent: ContentType = {
	_id: '',
	name: '',
	slug: '',
	image: '',
	section: '',
	isVisible: true,
	gallery: [],
	description: '',
	refImage: '',
	content: '',
	subContent: '',
	url: '',
	btnText: '',
	richContent: '',
	list: [],
	card: [],
	category: '',
	status: '',
	pageName: '',
	isActive: true,
	priority: 0,
	note: '',
	bgColor: '',
	color: '',
	fontSize: '',
	fontSizeSm: '',
	videoUrl: '',
};

const useGetContentBySlug = (slug: string) => {
	const { data, isFetching } = useGetAllQuery({ path: 'contents', limit: 9999 });

	const [content, setContent] = useState<ContentType>(emptyContent);

	useEffect(() => {
		if (isFetching) {
			setContent(emptyContent);
		} else if (!data) {
			setContent(emptyContent);
		} else if (!data?.doc || !Array.isArray(data?.doc)) {
			setContent(emptyContent);
		} else {
			const information = data?.doc?.find((item: any) => item.slug === slug);
			setContent(information || emptyContent);
		}
	}, [slug, data]);

	return content;
};

export default useGetContentBySlug;
