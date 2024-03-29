import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookies } from 'cookies-next'

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
  shipping_zone_id?: string
  hub_sid: string
  country: string
  name: string
  rate_name: string
  rate_transit_time: string
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

interface SpaceOrder {
  amount: number
  created_at: string
  crypto_amount: string
  crypto_payment_from: string
  crypto_payment_to: string
  currency: string
  delivery_type: string
  customer: {
    account_id: number
    address: string
    address_line_two: string
    city: string
    country: string
    customer_sid: string
    email: string
    id: number
    name: string
    state: string
    telephone: string
    zipcode: string
  }
  hub_sid: string
  live_mode: boolean
  order_items: Array<{
    listing_id: string
    minting_links: string[]
    order_type: string
    product: {
      name: string
      product_sid: string
      tax_rate: string
      tax_status: boolean
    }
    product_type: string
    product_variation: {
      barcode: string
      color: string
      dimension: string
      dimension_unit: string
      mint: string
      model_name: string
      model_size: string
      model_url: string
      name: string
      phygital_listing_id: string
      price: string
      product_sid: string
      product_variation_sid: string
      quantity: number
      sale_price: string
      shopify_variation_id: number
      sku: string
      thumbnail_name: string
      thumbnail_size: string
      thumbnail_url: string
      weight: string
      weight_unit: string
    }
    quantity: number
  }>
  order_sid: string
  payment_id: string
  shipping_cost: number
  status: string
  tracking_link: string
  tracking_number: string
  fulfillment_status: string
  shipping_carrier: string
  shipping_email_sent_at: string
  notes: string
}

interface GetSpaceOrdersRequest {
  hubId: string
}

interface GetSpaceOrdersResponse {
  orders: SpaceOrder[]
}

interface PatchFulfilOrderRequest {
  data: {
    order_sid: string
    fulfillment_status: string
    shipping_carrier: string
    shipping_email_sent_at: string
    tracking_link: string
    tracking_number: string
  }
}

interface PatchFulfilOrderResponse {
  message?: string
  ok?: string
}

interface PostOrderNotesRequest {
  data: {
    order_sid: string
    notes: string
  }
}

interface PostOrderNotesResponse {
  message?: string
  ok?: string
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

const cookies = getCookies()

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
    deleteShippingZone: builder.mutation<any, { shippingZoneId: string }>({
      query: ({ shippingZoneId }) => ({
        url: `/api/v1/shipping_zone?shipping_zone_id=${shippingZoneId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
    getSpaceOrders: builder.query<GetSpaceOrdersResponse, GetSpaceOrdersRequest>({
      query: ({ hubId }) => ({
        url: `/api/v1/orders/?hub_id=${hubId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
    patchFullfilOrder: builder.mutation<PatchFulfilOrderResponse, PatchFulfilOrderRequest>({
      query: (body) => ({
        url: '/api/v1/fulfill_order',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
    postOrderNotes: builder.mutation<PostOrderNotesResponse, PostOrderNotesRequest>({
      query: (body) => ({
        url: '/api/v1/dynamical_pandora_box',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${cookies.hubsToken}`
        }
      })
    }),
    getOrdersCount: builder.query<{ unfulfilled_order_count: number }, { hubId: string }>({
      query: ({ hubId }) => ({
        url: `/api/v1/count_orders_unfulfilled/?hub_id=${hubId}`,
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
  useGetSpaceQuery,
  useGetShippingZonesQuery,
  usePostShippingZoneMutation,
  usePatchShippingZoneMutation,
  useDeleteShippingZoneMutation,
  useGetSpaceOrdersQuery,
  usePatchFullfilOrderMutation,
  usePostOrderNotesMutation,
  useGetOrdersCountQuery
} = spaceApi
