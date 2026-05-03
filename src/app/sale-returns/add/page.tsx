import { Suspense } from 'react';
import CreateSaleReturn from './_components/CreateSaleReturn';
// import CreateSaleReturn from './CreateSaleReturn'; // your component

export default function Page() {
	return (
		<Suspense fallback={null}>
			<CreateSaleReturn />
		</Suspense>
	);
}
