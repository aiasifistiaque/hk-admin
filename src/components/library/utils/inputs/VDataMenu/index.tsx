'use client';

import { Menu, MenuGroup, Flex, Input, useDisclosure, MenuDivider, Button } from '@chakra-ui/react';

import { useState, FC, useRef, useEffect } from 'react';

import {
	DataMenuButton,
	CreateModal,
	MenuContainer,
	MenuItem,
	ItemOfDataMenu,
	useGetAllQuery,
	FormControl,
	Scroll,
	CreateServerModal,
	JsonView,
	JSONDisplay,
} from '../../..';

import { VDataMenuProps } from './types';
import { hiddenInputCss, searchInputCss, unselectTextCss, MAX_H, WIDTH } from './styles';

const getNestedValue = (obj: any, path: string) => {
	return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

const VDataMenu: FC<any> = ({
	label,
	item,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	dataModel,
	form,
	hideNew = false,
	field,
	type = 'value',
	dataKey = '_id',
	menuKey = 'name',
	subMenuChildren,
	subMenuKey,
	menuAddOnKey,
	unselect = true,
	...props
}) => {
	const { onOpen, onClose, isOpen } = useDisclosure();

	const closeMenu = () => {
		setSearch('');
		onClose();
	};

	const [title, setTitle] = useState<string>(`Select ${label}`);
	const [search, setSearch] = useState<string>('');

	const { data, isFetching, isError, error, isSuccess } = useGetAllQuery(
		{
			path: model || '',
			limit: '999',
			sort: item?.sorting || 'name',
			search,
			...(item?.filter && {
				filters: {
					[item?.filter?.key]: form[item?.filter?.value],
				},
			}),
		},
		{
			skip: item?.filter && !form[item?.filter?.value],
		}
	);

	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};

	const handleChange = (e: any) => {
		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: type == 'object' ? e : e?.[dataKey],
				},
			} as any;
			props.onChange(event);
		}
		setTitle(e?.name);
		onClose();
	};

	// useEffect(() => {
	// 	if (!item?.filter) return;
	// 	handleChange({ name: ``, _id: undefined });
	// }, [item?.filter, form[item?.filter?.value]]);

	const getNameById = (id: string | undefined, key = 'name') => {
		const item = data?.doc?.find((item: any) => item._id === id);
		return item?.[key] || id;
	};

	const inputRef = useRef<any>(null);
	const btnRef = useRef<any>(null);
	const addItemRef = useRef<any>(null);

	useEffect(() => {
		if (isOpen) {
			if (inputRef.current) inputRef.current.focus();
		}
	}, [isOpen, onOpen, onClose]);

	const renderMenuItems = data?.doc?.map((item: any, i: number) => (
		<ItemOfDataMenu
			cursor='pointer'
			id={item?._id}
			key={i}
			onClick={() => handleChange(item)}>
			{getNestedValue(item, menuKey)}{' '}
			{subMenuChildren && subMenuKey && `${subMenuChildren} ${getNestedValue(item, subMenuKey)}`}
			{/* {menuAddOnKey && `(${getNestedValue(item, menuAddOnKey)})`} */}
		</ItemOfDataMenu>
	));

	return (
		<Flex w='full'>
			{/* <JsonView data={item} /> */}
			{dataModel && (
				<CreateModal
					data={dataModel}
					path={model}
					trigger={
						<Button
							display='none'
							ref={btnRef}>
							Add new {model}
						</Button>
					}
					type='post'
				/>
			)}
			{item?.addItem && (
				<CreateServerModal
					onNewItemAdd={(item: any) => handleChange(item)}
					path={model}
					trigger={
						<Button
							display='none'
							ref={addItemRef}>
							Add New Item
						</Button>
					}
				/>
			)}
			<Menu onClose={closeMenu}>
				{({ isOpen }) => (
					<>
						<FormControl
							isRequired={isRequired}
							label={label}
							helper={helper}
							w='full'>
							<DataMenuButton
								value={value}
								isActive={isOpen}>
								{value ? getNameById(value, menuKey) : `Select ${label}`}
							</DataMenuButton>
							<Input
								ref={inputRef}
								isRequired={isRequired}
								value={value}
								{...hiddenInputCss}
								{...props}
							/>
						</FormControl>

						<MenuContainer w={WIDTH}>
							<MenuGroup>
								<Flex
									p={1}
									py={0.5}>
									<Input
										{...searchInputCss}
										value={search}
										onChange={handleSearch}
									/>
								</Flex>
							</MenuGroup>
							<MenuDivider mb={1} />
							{dataModel && (
								<>
									<MenuItem onClick={() => btnRef.current.click()}>Add new {model}</MenuItem>
									<MenuDivider
										mt={1}
										mb={0}
									/>
								</>
							)}
							{item?.addItem && (
								<>
									<MenuItem
										fontWeight='700'
										onClick={() => addItemRef.current.click()}>
										(+) Add New Item
									</MenuItem>
									<MenuDivider
										mt={1}
										mb={0}
									/>
								</>
							)}

							<Scroll maxH={MAX_H}>
								{unselect && (
									<MenuItem
										{...unselectTextCss}
										onClick={() => handleChange({ name: ``, _id: undefined })}>
										<i>Unselect</i>
									</MenuItem>
								)}
								{renderMenuItems}
							</Scroll>
						</MenuContainer>
					</>
				)}
			</Menu>
		</Flex>
	);
};

export default VDataMenu;
