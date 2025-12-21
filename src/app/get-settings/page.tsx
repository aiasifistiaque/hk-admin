'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import {
	Layout,
	Column,
	VInput,
	usePostMutation,
	VSelect,
	JsonView,
	Toast,
} from '@/components/library';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { SpaceBetween } from '@/commerce-components';

interface Props {
	params: {
		slug: string;
	};
}

const Page: NextPage<any> = () => {
	const [slug, getSlug] = useState('');
	const [option, setOption] = useState('settings');
	const [trigger, result] = usePostMutation();
	const handleTrigger = () => {
		trigger({
			path: `/model/${slug}/${option}`,
			body: {},
		});
	};

	return (
		<>
			<Layout
				pb='32px'
				title='Get Settings'
				path='/get-settings'>
				<Column
					gap={2}
					mt='16px'>
					<Flex
						gap={2}
						align='flex-end'>
						<VInput
							label='Slug'
							value={slug}
							onChange={(e: any) => getSlug(e.target.value)}
						/>
						<VSelect
							value={option}
							onChange={(e: any) => setOption(e.target.value)}
							label='Option'>
							<option value='settings'>Settings</option>
							<option value='keys'>Keys</option>
						</VSelect>
						<Button
							size='sm'
							onClick={handleTrigger}>
							Fetch
						</Button>
					</Flex>
					<Flex>
						{result?.data && (
							<Column
								p={4}
								mt={4}
								bg='#fff'
								border='1px solid'
								borderColor='border.light'
								_dark={{
									bg: '#000',
									borderColor: 'border.dark',
								}}
								borderRadius='8px'
								width='100%'>
								<SpaceBetween>
									<Heading
										size='md'
										mb='4px'>
										Result:
									</Heading>
									<Button
										size='sm'
										onClick={() => navigator.clipboard.writeText(JSON.stringify(result?.data))}>
										Copy
									</Button>
								</SpaceBetween>
								<JsonView data={result.data} />
							</Column>
						)}
					</Flex>
				</Column>
			</Layout>
			<Toast
				error={result?.error}
				isError={result?.isError}
			/>
		</>
	);
};

export default Page;
