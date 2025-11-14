'use client';

import { FC, useState } from 'react';
import { Input, InputGroup, InputGroupProps, InputLeftAddon } from '@chakra-ui/react';
import { useAppDispatch, Icon, updateSearch, SideDrawer, Sidebar, Align } from '../';

type PosSearchProps = InputGroupProps & {};

const PosSearch: FC<PosSearchProps> = ({ ...props }) => {
	const [value, setValue] = useState<string>('');
	const dispatch = useAppDispatch();

	const handleSearch = (e: any) => {
		setValue(e.target.value);
		dispatch(updateSearch(e.target.value || ''));
	};

	return (
		<Align w='100%'>
			<InputGroup {...props}>
				{/* <InputLeftAddon
					borderRadius='sm'
					bg='#ddd'
					_dark={{ bg: 'background.dark' }}>
					<Icon name='barcode' />
				</InputLeftAddon> */}
				<Input
					bg='white'
					_dark={{ bg: 'sidebar.dark' }}
					borderRadius='sm'
					placeholder='Search By Product Name'
					value={value}
					onChange={handleSearch}
				/>
			</InputGroup>
		</Align>
	);
};

export default PosSearch;
