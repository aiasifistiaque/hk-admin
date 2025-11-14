import { ReactNode } from 'react';
import { Grid, GridProps } from '@chakra-ui/react';

const CartItemContainer = ({ children, ...props }: GridProps & { children: ReactNode }) => (
	<Grid
		borderBottomWidth={1}
		gridTemplateColumns='1fr 4fr 2fr'
		borderColor={'stroke.deepL'}
		px={4}
		_dark={{
			borderColor: 'stroke.deepD',
		}}
		w='full'
		{...props}>
		{children}
	</Grid>
);

export default CartItemContainer;
