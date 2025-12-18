import mainApi from '@/components/library/store/services/mainApi';
import { ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const chatsApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllChats: builder.query<any, any>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				filters = {},
			}) => ({
				url: '/chats',
				params: { sort, page, limit, search, ...filters },
			}),
			providesTags: ['chats'],
		}),
		getChatById: builder.query<any, string>({
			query: id => ({
				url: `/chats/${id}`,
			}),
			providesTags: ['chats'],
		}),
		getMessagesByChatId: builder.query<any, string>({
			query: chatId => ({
				url: `/messages/chat/${chatId}`,
			}),
			providesTags: ['messages'],
		}),
		assignChat: builder.mutation<any, string>({
			query: id => ({
				url: `/chats/${id}/assign`,
				method: 'POST',
			}),
			invalidatesTags: ['chats'],
		}),
		updateChatStatus: builder.mutation<any, { id: string; status: string }>({
			query: ({ id, status }) => ({
				url: `/chats/${id}/status`,
				method: 'PUT',
				body: { status },
			}),
			invalidatesTags: ['chats'],
		}),
		releaseChat: builder.mutation<any, string>({
			query: id => ({
				url: `/chats/${id}/release`,
				method: 'POST',
			}),
			invalidatesTags: ['chats'],
		}),
		sendMessage: builder.mutation<any, any>({
			query: body => ({
				url: '/messages',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['messages'],
		}),
	}),
});

export const {
	useGetAllChatsQuery,
	useGetChatByIdQuery,
	useGetMessagesByChatIdQuery,
	useAssignChatMutation,
	useUpdateChatStatusMutation,
	useReleaseChatMutation,
	useSendMessageMutation,
} = chatsApi;
