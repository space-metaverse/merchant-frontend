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

interface GetSpaceRequest {
  hubId: string
}

interface GetSpaceResponse {
  allow_promotion: boolean
  business_details: Record<any, any>
  categories: string[]
  commerce_type: string
  created_by: string
  description: string
  hub_id: string
  name: string
  products: any[]
  updated_at: string
  url: string
}

interface GetShippingZoneRequest {
  hubId: string
}

export interface ShippingZoneType {
  shipping_zone_id?: number | string
  hub_sid: string
  country: string
  name: string
  rate_name: string
  rate_transit_time: number
  shipping_price: number
  price_conditions: boolean
  order_min_value: number
  order_max_value: number
}

interface PostShippingZoneRequest {
  data: ShippingZoneType
}

interface PostShippingZoneResponse {
  data: {
    data: ShippingZoneType
  }
}

interface PatchShippingZoneRequest {
  data: ShippingZoneType
}

interface PatchShippingZoneResponse {
  data: {
    data: ShippingZoneType
  }
}

const getBaseURL = (): string => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
      return 'https://metaverse-demo.com'
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
          Authorization: `Bearer ${cookies.hubsToken}`,
          'Content-Type': 'application/json'
        }
      })
    }),
    getSpace: builder.query<GetSpaceResponse, GetSpaceRequest>({
      query: ({ hubId }) => ({
        url: `/api/v1/hubs/?hub_id=${hubId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
    getShippingZones: builder.query<any, GetShippingZoneRequest>({
      query: ({ hubId }) => ({
        url: `/api/v1/shipping_zones?hub_sid=${hubId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
    postShippingZone: builder.mutation<PostShippingZoneResponse, PostShippingZoneRequest>({
      query: (body) => ({
        url: `/api/v1/shipping_zone`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        },
        body
      })
    }),
    patchShippingZone: builder.mutation<PatchShippingZoneResponse, PatchShippingZoneRequest>({
      query: (body) => ({
        url: `/api/v1/shipping_zone`,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        },
        body
      })
    }),
  })
})

export const {
  useGetMySpacesQuery,
  useGetSpaceQuery,
  useGetShippingZonesQuery,
  usePostShippingZoneMutation,
  usePatchShippingZoneMutation
} = spaceApi
