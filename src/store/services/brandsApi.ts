import mainApi from '@/components/library/store/services/mainApi';
import { ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const categoriesApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllBrands: builder.query<ListType<any>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
			}) => ({
				url: 'brands',
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: ['Brands'],
		}),
		addBrand: builder.mutation<any, any>({
			query: body => ({
				url: 'brands',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Brands'],
		}),
		updateBrand: builder.mutation<any, any>({
			query: body => ({
				url: 'brands',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['Brands'],
		}),
		getBrandById: builder.query<any, any>({
			query: id => ({
				url: `brands/${id}`,
			}),
			providesTags: ['Brands'],
		}),
	}),
});

export const {
	useGetAllBrandsQuery,
	useAddBrandMutation,
	useUpdateBrandMutation,
	useGetBrandByIdQuery,
} = categoriesApi;
