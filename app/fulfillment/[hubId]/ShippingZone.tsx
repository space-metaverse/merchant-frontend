import { Button, Checkbox, Chip, Select, TextInput } from "@space-metaverse-ag/space-ui"
import { Delete, Edit } from "@space-metaverse-ag/space-ui/icons"
import styled from "styled-components"
import usaIcon from "../../../public/usa.svg"
import worldIcon from "../../../public/world.png"
import canadaIcon from "../../../public/canada.png"

import Image from "next/image"
import { ShippingZoneType, useDeleteShippingZoneMutation, usePatchShippingZoneMutation, usePostShippingZoneMutation } from "../../../api/space"
import { useEffect, useState } from "react"

const Wrapper = styled.div`
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  width: 100%;
  padding: 1.5rem 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 2rem;
`

const HeaderIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const CountryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const ShippingRateList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
`

const RateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #FAFAFC;
  padding: 1rem;
`

const RateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
`

const RateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border-radius: 8px;
`

const RateType = styled.h4`
  color: #48484B;
`

const RateTime = styled.p`
  padding-top: 0.5rem;
  color: #71717A;
  font-weight: 400;
`

const RatePrice = styled.span`
  padding-right: 1rem;
  color: #71717A;
  font-weight: 400;
`

const RateIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const AddRate = styled.p`
  padding-top: 1rem;
  color: blue;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E5E5;
`

const shippingOptions = [
  'Express (1 to 2 business days)',
  'Express International (1 to 5 business days)',
  'Standard (3 to 4 business days)',
  'Standard International (6 to 12 business days)',
  'Custom Flat Rate (no transit time)'
]

const countryImages: Record<string, any> = {
  usa: usaIcon,
  world: worldIcon,
  canada: canadaIcon
}

interface ShippingRateProps {
  id: string
  hubId: string
  country: string
  type: string
  time: string
  price: number
  orderMin: number
  orderMax: number
  isPriceConditions: boolean
  isEditing: boolean
  onEdit: (id: string) => void
  onCancel: (id: string) => void
  refetchShippingZones: () => void
}

const ShippingRate = ({
  id,
  hubId,
  country,
  type,
  time,
  price,
  orderMin,
  orderMax,
  isPriceConditions,
  isEditing,
  onEdit,
  onCancel,
  refetchShippingZones
}: ShippingRateProps) => {
  const [shippingType, setShippingType] = useState(type && time ? `${type} (${time})` : shippingOptions[0])
  const [newOrderMin, setNewOrderMin] = useState(orderMin ?? 0)
  const [newOrderMax, setNewOrderMax] = useState(orderMax ?? 0)
  const [shippingPrice, setShippingPrice] = useState(price ?? 0)
  const [priceConditionsChecked, setPriceConditionsChecked] = useState(isPriceConditions)

  const [
    deleteShippingZone,
    {
      data: deleteShippingZoneData,
      error: deleteShippingZoneError,
      isLoading: isDeleteShippingZoneLoading,
      isSuccess: isDeleteShippingZoneSuccess,
    },
  ] = useDeleteShippingZoneMutation();

  const [
    patchShippingZone,
    {
      data: patchShippingZoneData,
      error: patchShippingZoneError,
      isLoading: isPatchShippingZoneLoading,
      isSuccess: isPatchShippingZoneSuccess,
    },
  ] = usePatchShippingZoneMutation();

  const [
    postShippingZone,
    {
      data: postShippingZoneData,
      error: postShippingZoneError,
      isLoading: isPostShippingZoneLoading,
      isSuccess: isPostShippingZoneSuccess,
    },
  ] = usePostShippingZoneMutation();

  useEffect(() => {
    if (isDeleteShippingZoneSuccess || isPatchShippingZoneSuccess || isPostShippingZoneSuccess) {
      refetchShippingZones();
      onEdit('');
      onCancel('new');
    }
  }, [isDeleteShippingZoneSuccess, isPatchShippingZoneSuccess, isPostShippingZoneSuccess])

  const handleSaveShippingZone = () => {
    const data = {
      data: {
        ...(id !== 'new' && { shipping_zone_id: id }),
        hub_sid: hubId,
        country: country,
        name: shippingType.split('(')[0].slice(0, -1),
        rate_name: shippingType.split('(')[0].slice(0, -1),
        rate_transit_time: shippingType.split('(')[1].slice(0, -1),
        shipping_price: shippingPrice,
        price_conditions: priceConditionsChecked,
        order_min_value: newOrderMin,
        order_max_value: newOrderMax
      }
    }
    if (id === 'new') {
      postShippingZone(data)
    } else {
      patchShippingZone(data)
    }
  }

  return (
    <RateWrapper>
      <RateHeader>
        <RateInfo>
          {
            isEditing ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <Select
                    options={shippingOptions}
                    style={{ width: '16rem' }}
                    value={shippingType}
                    onChange={(value) => setShippingType(value)}
                  />
                  <TextInput
                    style={{ width: '16rem' }}
                    value={shippingPrice}
                    label='Shipping Price'
                    type='number'
                    onChange={(e) => setShippingPrice(Number(e.target.value))}
                  />
                  <Chip label={shippingPrice ? `$${shippingPrice}` : 'Free'} color={shippingPrice ? 'blue' : 'green'} />
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <Checkbox
                    label='Add price conditions'
                    isChecked={priceConditionsChecked}
                    onChange={() => setPriceConditionsChecked(!priceConditionsChecked)}
                  />
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <TextInput
                      style={{ width: '8rem' }}
                      value={priceConditionsChecked ? newOrderMin : 'No Limit'}
                      label='Order Min'
                      type='number'
                      disabled={!priceConditionsChecked}
                      onChange={(e) => setNewOrderMin(Number(e.target.value))}
                    />
                    <TextInput
                      style={{ width: '8rem' }}
                      value={priceConditionsChecked ? newOrderMax : 'No Limit'}
                      label='Order Max'
                      type='number'
                      disabled={!priceConditionsChecked}
                      onChange={(e) => setNewOrderMax(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ) :
              (
                <div>
                  <RateType>{type}</RateType>
                  <RateTime>{time}</RateTime>
                </div>
              )
          }
          {
            !isEditing && (
              <div>
                {
                  isPriceConditions && (
                    <RatePrice>${orderMin} - ${orderMax}</RatePrice>
                  )
                }
                <Chip label={shippingPrice ? `$${shippingPrice}` : 'Free'} color={shippingPrice ? 'blue' : 'green'} />
              </div>
            )
          }
        </RateInfo>
        {
          !isEditing && (
            <RateIcons>
              <Edit stroke='#71717A' onClick={() => onEdit(id)} />
              <Delete stroke='#71717A' onClick={() => deleteShippingZone({ shippingZoneId: id })} />
            </RateIcons>
          )
        }
      </RateHeader>
      {
        isEditing && (
          <EditActions>
            <Button
              label={'Cancel'}
              size={"small"}
              color={'white'}
              outline
              onClick={() => onCancel(id)}
              disabled={isDeleteShippingZoneLoading || isPatchShippingZoneLoading}
            />
            <Button
              label={'Save Changes'}
              size={"medium"}
              color={"blue"}
              outline
              disabled={isDeleteShippingZoneLoading || isPatchShippingZoneLoading}
              onClick={handleSaveShippingZone}
            />
          </EditActions>
        )
      }
    </RateWrapper>
  )
}

const countryOptions = [
  'USA', 'Canada', 'Rest of World'
]

interface ShippingZoneProps {
  id: string
  hubId: string
  isEditing: boolean
  country: string
  rates: ShippingZoneType[]
  onCancelEdit: (id: string) => void
  onEditSave: (zone: ShippingZoneType) => void
  onDelete: (id: string) => void
  refetchShippingZones: () => void
}

export default function ShippingZone({
  id,
  hubId,
  isEditing,
  country,
  rates,
  onCancelEdit,
  onEditSave,
  onDelete,
  refetchShippingZones
}: ShippingZoneProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(country || 'USA')
  const [editingRateId, setEditingRateId] = useState<string>("")
  const [addingNewRate, setAddingNewRate] = useState<boolean>(false)

  const handleEditSave = () => {
    const rate = rates?.find((rate) => rate.shipping_zone_id === editingRateId)
    if (rate) {
      onEditSave({
        ...rate,
        shipping_zone_id: String(rate.shipping_zone_id),
        country: selectedCountry
      })
    }
  }

  const handleAddNewRate = () => {
    setAddingNewRate(true)
    setEditingRateId("new")
  }

  const handleCancelNewRate = () => {
    setAddingNewRate(false)
    setEditingRateId("")
    onCancelEdit('new')
  }

  return (
    <Wrapper>
      <Header>
        {
          isEditing ? (
            <Select
              options={['USA', 'Canada', 'Rest of World']}
              style={{ width: '16rem' }}
              value={selectedCountry}
              onChange={(value) => setSelectedCountry(value)}
            />
          ) :
            (
              <CountryWrapper>
                <Image src={countryImages?.[country.toLowerCase()] ?? worldIcon} alt='country' />
                <span>{country}</span>
              </CountryWrapper>
            )
        }
        <HeaderIcons>
          <Delete stroke='#71717A' onClick={() => onDelete(id)} />
        </HeaderIcons>
      </Header>
      <ShippingRateList>
        {
          rates.map((rate) => (
            <ShippingRate
              id={rate.shipping_zone_id || "123"}
              hubId={rate.hub_sid}
              country={rate.country}
              key={rate.shipping_zone_id}
              type={rate.rate_name}
              time={rate.rate_transit_time}
              price={rate.shipping_price}
              orderMin={rate.order_min_value}
              orderMax={rate.order_max_value}
              isEditing={rate.shipping_zone_id === editingRateId}
              isPriceConditions={rate.price_conditions}
              onEdit={(id) => setEditingRateId(id)}
              onCancel={handleCancelNewRate}
              refetchShippingZones={refetchShippingZones}
            />
          ))
        }
        {
          addingNewRate && (
            <ShippingRate
              id={"new"}
              hubId={hubId}
              country={country || selectedCountry}
              type={""}
              time={""}
              price={0}
              orderMin={0}
              orderMax={0}
              isEditing={'new' === editingRateId}
              isPriceConditions={false}
              onEdit={(id) => setEditingRateId("new")}
              onCancel={handleCancelNewRate}
              refetchShippingZones={refetchShippingZones}
            />
          )
        }
      </ShippingRateList>
      <AddRate onClick={handleAddNewRate}>Add Rate</AddRate>
      {isEditing && (
        <EditActions>
          <Button label={'Cancel'} size={"small"} color={'white'} outline onClick={() => onCancelEdit(id)} />
          <Button label={'Save'} size={"medium"} color={"blue"} outline onClick={handleEditSave} />
        </EditActions>
      )}
    </Wrapper>
  )
}