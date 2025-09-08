import mainApi from '@/components/library/store/services/mainApi';
import { User, ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const productsApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllProducts: builder.query<ListType<any>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
			}) => ({
				url: 'items',
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: ['items'],
		}),

		getProductsByQr: builder.query<any, any>({
			query: id => ({
				url: `items/qr/${id}`,
			}),
			providesTags: ['items'],
		}),

		addProduct: builder.mutation<any, any>({
			query: body => ({
				url: 'items',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['items'],
		}),
	}),
});

export const { useGetAllProductsQuery, useAddProductMutation, useGetProductsByQrQuery } =
	productsApi;
