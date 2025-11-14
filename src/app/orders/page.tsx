'use client';

import React from 'react';
import { NextPage } from 'next';
import OrderItems from './_components/OrderItems';
import { ServerPage } from '@/components/library';

//import table from '@/models/products/viewAllProductModel';

const page: NextPage = () => {
	return (
		<ServerPage route='orders'>
			<OrderItems />
		</ServerPage>
	);
};

export default page;
