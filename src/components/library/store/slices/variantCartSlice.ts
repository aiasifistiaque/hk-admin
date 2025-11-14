// export default cartSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
const CART_NAME = 'DDONG_CART_ONE_SLICE_VARIANT';

type CartItem = {
	uniqueId: string;
	id: string;
	_id: string;
	name: string;
	price: number;
	unitPrice: number;
	vat: number;
	image?: string;
	sku?: string;
	qty: number;
	// Variation-specific fields
	selectedSize?: string;
	selectedColor?: string;
	variationId?: string;
	variantStock?: number;
	variantName?: string;
	variantId?: string;
};

type State = {
	cartItems: CartItem[];
	totalItems?: number;
	subTotal: number;
	total: number;
	tax: number;
	isLoading: boolean;
	vat: number;
	shipping: number;
	discount: number;
	user: string;
	address: any;
	isAddressSet: boolean;
	toggleCart: boolean;
};

const tax = 0;

const initialState: State = {
	cartItems: [],
	totalItems: 0,
	subTotal: 0,
	total: 0,
	tax: tax,
	isLoading: false,
	vat: 0,
	shipping: 0,
	discount: 0,
	user: 'guest',
	address: {},
	isAddressSet: false,
	toggleCart: false,
};

// Helper function to save state to local storage
const saveStateToLocalStorage = (state: typeof initialState) => {
	typeof window !== 'undefined' && localStorage.setItem(CART_NAME, JSON.stringify(state));
};

// Helper function to calculate totals
const calculateTotals = (state: State) => {
	state.subTotal = state.cartItems.reduce((total: number, cartItem: CartItem) => {
		return total + cartItem.unitPrice * cartItem.qty;
	}, 0);

	state.vat = state.cartItems.reduce((total: number, cartItem: CartItem) => {
		if (cartItem.vat) {
			return total + ((cartItem.unitPrice * cartItem.vat) / 100) * cartItem.qty;
		}
		return total; // Fixed to remove unnecessary else block
	}, 0);

	state.total = state.subTotal + state.vat + state.shipping - state.discount;
	state.totalItems = state.cartItems.reduce((total, item) => total + item.qty, 0);
};

export const variantCartSlice = createSlice({
	name: 'variantCart',
	initialState:
		typeof window !== 'undefined' && localStorage.getItem(CART_NAME)
			? JSON.parse(localStorage.getItem(CART_NAME)!)
			: initialState,
	reducers: {
		calculateCartTotals: (state, action) => {
			const { subTotal = 0, total = 0, vat = 0, discount = 0, shipping = 0 } = action.payload;
			state.subTotal = subTotal;
			state.total = total;
			state.vat = vat;
			state.total = total;
			state.total = total;
			state.discount = discount;
			state.shipping = shipping;
			saveStateToLocalStorage(state);
		},

		addToCart: (state, action) => {
			const { item, qty = 1 } = action.payload;
			if (qty <= 0) return;

			// Create unique ID based on product and variation
			const baseId = item?._id || item?.id;
			const variationPart =
				item.variationId || `${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
			const uniqueId = `${baseId}-${variationPart}`;

			// Check stock if variation has stock info
			const availableStock = item.variantStock || item.stock || Infinity;
			if (availableStock < qty) {
				console.warn('Insufficient stock for item:', item.name);
				return;
			}

			const existItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);

			if (existItem) {
				const updatedQty = Number(existItem.qty) + Number(qty);

				// Check stock for updated quantity
				if (availableStock < updatedQty) {
					console.warn('Insufficient stock for updated quantity:', item.name);
					return;
				}

				const updatedPrice = existItem.unitPrice * updatedQty;

				state.cartItems = state.cartItems.map((stateItem: CartItem) =>
					stateItem.uniqueId === uniqueId
						? {
								...stateItem,
								qty: updatedQty,
								price: updatedPrice,
						  }
						: stateItem
				);
			} else {
				const newItem: CartItem = {
					uniqueId: uniqueId,
					_id: item._id || item.id,
					id: item.id || item._id,
					name: item.name,
					price: item.price * qty,
					unitPrice: item.price,
					vat: item.vat || 0,
					qty: qty,
					image: item.image,
					sku: item.sku,
					// Variation-specific fields
					selectedSize: item.selectedSize,
					selectedColor: item.selectedColor,
					variationId: item.variationId,
					variantStock: item.variantStock || item.stock,
					variantName:
						item.selectedSize && item.selectedColor
							? `${item.selectedSize} / ${item.selectedColor}`
							: item.selectedSize || item.selectedColor || '',
					variantId: item.variationId,
				};

				state.cartItems = [...state.cartItems, newItem];
			}

			state.toggleCart = true; // Show cart when item is added
			calculateTotals(state);
			const { toggleCart, ...stt } = state;
			saveStateToLocalStorage({ toggleCart: false, ...stt });
		},

		setAddress: (state, action) => {
			state.address = action.payload;
			state.isAddressSet = true;
		},

		setToggleCart: (state, action) => {
			state.toggleCart = action.payload;
		},

		removeAddress: state => {
			state.address = {};
			state.isAddressSet = false;
		},

		deleteOneFromCart: (state, action) => {
			const uniqueId = action.payload; // Now expects uniqueId instead of just _id
			const findItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);

			if (findItem) {
				if (findItem.qty > 1) {
					state.cartItems = state.cartItems.map((stateItem: CartItem) =>
						stateItem.uniqueId === uniqueId
							? {
									...stateItem,
									qty: stateItem.qty - 1,
									price: stateItem.unitPrice * (stateItem.qty - 1),
							  }
							: stateItem
					);
				} else {
					// Remove item if qty is 1
					state.cartItems = state.cartItems.filter(
						(stateItem: CartItem) => stateItem.uniqueId !== uniqueId
					);
				}

				if (state.cartItems.length === 0) {
					state.totalItems = 0;
					state.subTotal = 0;
					state.total = 0;
					state.vat = 0;
					state.shipping = 0;
					state.discount = 0;
				}
			}

			calculateTotals(state);
			const { toggleCart, ...stt } = state;
			saveStateToLocalStorage({ toggleCart: false, ...stt });
		},
		/******  674052a1-d31f-48f3-80e2-5814cfb5bbd3  *******/

		deleteSingleItemFromCart: (state, action) => {
			const uniqueId = action.payload; // Now expects uniqueId instead of just _id
			const findItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);
			if (findItem) {
				state.cartItems = state.cartItems.filter(
					(stateItem: CartItem) => stateItem.uniqueId !== uniqueId
				);
			}
			if (state.cartItems.length === 0) {
				state.totalItems = 0;
				state.subTotal = 0;
				state.total = 0;
				state.vat = 0;
				state.shipping = 0;
				state.discount = 0;
			}
			calculateTotals(state);
			saveStateToLocalStorage(state);
		},

		deleteAllFromCart: state => {
			state.cartItems = [];
			state.totalItems = 0;
			state.subTotal = 0;
			state.total = 0;
			state.vat = 0;
			state.shipping = 0;
			state.discount = 0;
			state.user = 'guest';

			saveStateToLocalStorage(state);
		},

		updateUser: (state, action) => {
			state.user = action.payload;
		},

		resetCart: state => {
			state.cartItems = [];
			state.totalItems = 0;
			state.subTotal = 0;
			state.total = 0;
			state.vat = 0;
			state.shipping = 0;
			state.discount = 0;
			state.user = 'guest';
			state.address = {};
			state.isAddressSet = false;

			saveStateToLocalStorage(state);
		},
		setCartLoading: (state, action) => {
			state.isLoading = action.payload;
		},
	},
});

export const {
	addToCart: addToVariantCart,
	deleteOneFromCart: deleteOneFromVariantCart,
	deleteAllFromCart: deleteAllFromVariantCart,
	deleteSingleItemFromCart: deleteSingleItemFromVariantCart,
	resetCart: resetVariantCart,
	setCartLoading: setVariantCartLoading,
	calculateCartTotals: calculateVariantCartTotals,
	updateUser: updateVariantCartUser,
	setAddress: setVariantCartAddress,
	removeAddress: removeVariantCartAddress,
	setToggleCart: setVariantCartToggleCart,
} = variantCartSlice.actions;

export default variantCartSlice.reducer;
