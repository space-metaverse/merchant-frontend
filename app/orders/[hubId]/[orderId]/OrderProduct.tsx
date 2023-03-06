import { formatPrice } from "../../../../lib/helpers"
import { Box, Stack } from "@mui/material"
import Image from "next/image"
import styled from "styled-components"

const ProductType = styled.span`
  color: #8D8D95;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
`

const Variation = styled.div`
  font-family: 'Inter', sans-serif;
`

const VariationTitle = styled.span`
  color: #71717A;
  padding-right: 0.5rem;
`

const VariationBreak = styled.span`
  color: #DCDCE0;
  padding-left: 1rem;
`

interface OrderProductProps {
  title: string
  price: number
  quantity: number
  image: string
  color: string
  size: string
  sku: string
  type: string
  isDark?: boolean
}

export default function OrderProduct({ title, price, quantity, image, color, size, sku, type, isDark }: OrderProductProps) {
  return (
    <Stack flexDirection='row' gap={3} sx={{
      background: isDark ? '#FBFBFD' : '#FFFFFF',
      p: '1.5rem 1rem',
      borderRadius: '8px',
    }}>
      <Image src={image} alt={title} width={65} height={65} style={{
        borderRadius: '8px',
        objectFit: 'cover',
      }} />
      <Stack gap={1} width='100%'>
        <ProductType>{type}</ProductType>

        <h4>{title}</h4>

        <Stack flexDirection='row' gap={2}>
          <Variation>
            <VariationTitle>Quantity</VariationTitle> {quantity} <VariationBreak>|</VariationBreak>
          </Variation>

          <Variation>
            <VariationTitle>Size</VariationTitle> {size || '?'} <VariationBreak>|</VariationBreak>
          </Variation>

          <Variation>
            <VariationTitle>Quantity</VariationTitle> {quantity}
          </Variation>
        </Stack>

        <Variation style={{ marginTop: '0.5rem' }}>
          <Stack flexDirection='row' justifyContent='space-between'>
            <Box>
              <VariationTitle>SKU Number</VariationTitle> {sku}
            </Box>
            <Box>
              <VariationTitle>Price</VariationTitle> {formatPrice(price)}
            </Box>
          </Stack>
        </Variation>

      </Stack>
    </Stack>
  )
}