import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

const AccountLinks = ({ activeTab }: { activeTab: string }) => {
	return (
		<Flex
			gap={3}
			my={6}
			mb={2}>
			<Link href='/chart/asset'>
				<Button
					size='sm'
					variant={activeTab === 'asset' ? 'solid' : 'outline'}>
					Asset
				</Button>
			</Link>
			<Link href='/chart/liability'>
				<Button
					size='sm'
					variant={activeTab === 'liability' ? 'solid' : 'outline'}>
					Liability
				</Button>
			</Link>
			<Link href='/chart/income'>
				<Button
					size='sm'
					variant={activeTab === 'income' ? 'solid' : 'outline'}>
					Income
				</Button>
			</Link>
			<Link href='/chart/expense'>
				<Button
					size='sm'
					variant={activeTab === 'expense' ? 'solid' : 'outline'}>
					Expense
				</Button>
			</Link>
		</Flex>
	);
};

export default AccountLinks;
