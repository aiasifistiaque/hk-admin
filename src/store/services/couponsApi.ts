import mainApi from '@/components/library/store/services/mainApi';
import { User, ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const couponsApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllCoupons: builder.query<ListType<any>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
			}) => ({
				url: 'coupons',
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: ['coupons'],
		}),
		getCouponById: builder.query<any, string>({
			query: id => `coupons/${id}`,
			providesTags: ['coupons'],
		}),
		addCoupon: builder.mutation<any, any>({
			query: body => ({
				url: 'coupons',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['coupons'],
		}),
	}),
});

export const { useGetAllCouponsQuery, useAddCouponMutation, useGetCouponByIdQuery } = couponsApi;
