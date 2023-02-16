import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { parseCookies } from 'nookies'

interface GetMySpacesRequest {
}

interface GetMySpacesResponse {
  entries: Array<{
    attributions: {
      creator: string
    }
    categories: string[]
    commerce_type: string
    description: string
    id: string
    images: {
      preview: {
        url: string
      }
    }
    lobby_count: number
    member_count: number
    name: string
    room_size: number
    scene_id: number
    type: string
    url: string
    user_data: string
    weight: number
  }>
}

const getBaseURL = (): string => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
      return 'https://app.tryspace.com'
    case 'dev':
      return 'https://dev1-metaverse.com'
    case 'qa':
      return 'https://metaverse-demo.com'
    case 'prod':
      return 'https://app.tryspace.com'
    default:
      console.log('No ENV set')
      return 'https://metaverse-demo.com'
  }
}

const cookies = parseCookies()

export const spaceApi = createApi({
  reducerPath: 'spaceApi',
  baseQuery: fetchBaseQuery({ baseUrl: getBaseURL() }),
  endpoints: (builder) => ({
    getMySpaces: builder.query<GetMySpacesResponse, GetMySpacesRequest>({
      query: () => ({
        url: '/api/v1/media/search?source=rooms&filter=my&cursor=1',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
  })
})

export const {
  useGetMySpacesQuery,
} = spaceApi
