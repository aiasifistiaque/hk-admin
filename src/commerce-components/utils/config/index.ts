//

import { productSwiperBreakpoints } from './swiper/breakpoints';

const navbarHeight = '92px';
const navbarHeightMobile = '60px';

export const padding = {
	LAYOUT_X: 4,
	LAYOUT: 4,
};

export const currency = {
	code: 'BDT',
	symbol: '৳',
};

export const sizes = {
	NAVBAR_HEIGHT: navbarHeight,
	NAVBAR_HEIGHT_BASE: navbarHeightMobile,
	BODY_MIN_HEIGHT: `calc(100vh - ${navbarHeight})`,
	BODY_MIN_HEIGHT_BASE: `calc(100vh - ${navbarHeightMobile})`,
	RADIUS: 'xl',
	PRODUCT_CARD_HEIGHT: '360px',
	CATEGORY_CARD_HEIGHT: '260px',
};

export const swiper = {
	BREAKPOINTS: {
		PRODUCT: productSwiperBreakpoints,
	},
};
