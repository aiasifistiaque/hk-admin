import React from 'react';
import { NextPage } from 'next';
import { ServerPage } from '@/components/library';

interface Props {
	params: {
		slug: string;
	};
}

const Page: NextPage<any> = async ({ params }: any) => {
	const { slug } = await params;
	return <ServerPage route={slug} />;
};

export default Page;
