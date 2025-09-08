import mainApi from '@/components/library/store/services/mainApi';
import { User, ListType, TableProps, Organization } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const organizationApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllOrganizations: builder.query<ListType<Organization>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
			}) => ({
				url: 'organisations',
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: ['organizations'],
		}),
		addOrganization: builder.mutation<any, any>({
			query: body => ({
				url: 'organisations',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['organizations'],
		}),
	}),
});

export const { useGetAllOrganizationsQuery, useAddOrganizationMutation } = organizationApi;
