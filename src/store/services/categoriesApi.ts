import mainApi from '@/components/library/store/services/mainApi';
import { User, ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const categoriesApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllCategories: builder.query<ListType<any>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
			}) => ({
				url: 'categories',
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: ['categories'],
		}),
		addCategory: builder.mutation<any, any>({
			query: body => ({
				url: 'categories',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['categories'],
		}),
	}),
});

export const { useGetAllCategoriesQuery, useAddCategoryMutation } = categoriesApi;
