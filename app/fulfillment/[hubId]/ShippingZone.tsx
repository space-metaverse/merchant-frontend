import { Button, Checkbox, Chip, Select, TextInput } from "@space-metaverse-ag/space-ui"
import { Delete, Edit } from "@space-metaverse-ag/space-ui/icons"
import styled from "styled-components"
import worldIcon from "../../../public/world.png"

import Image from "next/image"
import { ShippingZoneType, usePatchShippingZoneMutation, usePostShippingZoneMutation } from "../../../api/space"
import { useEffect, useState } from "react"
import { Autocomplete, Box, Stack, TextField } from "@mui/material"
import { permittedCountries } from "./permittedCountries"

const Wrapper = styled.div`
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  width: 100%;
  padding: 1.5rem 1rem;

  svg {
    cursor: pointer;
    :hover {
      filter: brightness(0.5);
    }
  }
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

interface ShippingRateProps {
  id: string
  hubId: string
  country: string
  name: string
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
  setModalData: (data: { country: string, name?: string, shippingZoneId: string, type: 'zone' | 'rate' }) => void
  openModal: () => void
}

const ShippingRate = ({
  id,
  hubId,
  country,
  name,
  type,
  time,
  price,
  orderMin,
  orderMax,
  isPriceConditions,
  isEditing,
  onEdit,
  onCancel,
  refetchShippingZones,
  setModalData,
  openModal,
}: ShippingRateProps) => {
  const [shippingType, setShippingType] = useState(shippingOptions.includes(`${name} (${time})`) ? `${type} (${time})` : 'Custom Flat Rate (no transit time)')
  const [newOrderMin, setNewOrderMin] = useState<number | string>(orderMin ?? '')
  const [newOrderMax, setNewOrderMax] = useState<number | string>(orderMax >= 0 ? orderMax : '')
  const [rateName, setRateName] = useState(name ?? "")
  const [shippingPrice, setShippingPrice] = useState<number | string>(price ?? '')
  const [priceConditionsChecked, setPriceConditionsChecked] = useState(isPriceConditions)
  const [noLimitChecked, setNoLimitChecked] = useState(orderMax === -1)

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
    if (isPatchShippingZoneSuccess || isPostShippingZoneSuccess) {
      refetchShippingZones();
      onEdit('');
      onCancel('new');
    }
  }, [isPatchShippingZoneSuccess, isPostShippingZoneSuccess])

  const handleSaveShippingZone = () => {
    const data = {
      data: {
        ...(id !== 'new' && { shipping_zone_id: id }),
        hub_sid: hubId,
        country: country,
        name: shippingType.split('(')[0].slice(0, -1) === 'Custom Flat Rate' ? rateName || 'Custom Flat Rate' : shippingType.split('(')[0].slice(0, -1),
        rate_name: shippingType.split('(')[0].slice(0, -1) === 'Custom Flat Rate' ? rateName || 'Custom Flat Rate' : shippingType.split('(')[0].slice(0, -1),
        rate_transit_time: shippingType.split('(')[1].slice(0, -1),
        shipping_price: Number(shippingPrice),
        price_conditions: priceConditionsChecked,
        order_min_value: Number(newOrderMin),
        order_max_value: noLimitChecked ? -1 : Number(newOrderMax)
      }
    }
    if (id === 'new') {
      postShippingZone(data)
    } else {
      patchShippingZone(data)
    }
  }

  console.log(orderMax)

  const handleDeleteShippingZone = () => {
    setModalData({ country, name: shippingType.split('(')[0].slice(0, -1), shippingZoneId: id, type: 'rate' })
    openModal()
  }

  const isValid = !isPatchShippingZoneLoading && (priceConditionsChecked ? (Number(newOrderMax) > Number(newOrderMin) || Number(newOrderMin) < Number(newOrderMax)) : true)

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
                    style={{ width: '100%' }}
                    value={shippingType}
                    onChange={(value) => setShippingType(value)}
                    label='Transit Time'
                  />
                  {
                    shippingType === 'Custom Flat Rate (no transit time)' && (
                      <TextInput
                        style={{ width: '16rem' }}
                        value={rateName}
                        label='Rate Name'
                        onChange={(e) => setRateName(e.target.value)}
                      />
                    )
                  }
                  <TextInput
                    style={{ width: '16rem' }}
                    value={shippingPrice}
                    label='Shipping Price ($)'
                    type='number'
                    onChange={(e) => setShippingPrice(e.target.value ? Number(e.target.value) : '')}
                    min={0}
                    step={0.01}
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
                      style={{ width: '14rem' }}
                      value={priceConditionsChecked ? newOrderMin : ''}
                      label='Order Min ($)'
                      type='number'
                      disabled={!priceConditionsChecked}
                      onChange={(e) => setNewOrderMin(e.target.value ? Number(e.target.value) : '')}
                      min={0}
                      max={noLimitChecked ? undefined : newOrderMax}
                      isError={Number(newOrderMin) > Number(newOrderMax) ? 'Min higher then max' : ''}
                      step={0.01}
                    />
                    <TextInput
                      style={{ width: '14rem' }}
                      value={priceConditionsChecked ? (noLimitChecked ? 'No Limit' : newOrderMax) : ''}
                      label='Order Max ($)'
                      type={noLimitChecked ? 'text' : 'number'}
                      disabled={!priceConditionsChecked || noLimitChecked}
                      onChange={(e: any) => setNewOrderMax(e.target.value ? Number(e.target.value) : '')}
                      min={newOrderMin}
                      isError={Number(newOrderMax) < Number(newOrderMin) ? 'Max less then min' : ''}
                      step={0.01}
                    />
                    <Checkbox
                      label='No Limit'
                      isChecked={noLimitChecked}
                      onChange={() => setNoLimitChecked(!noLimitChecked)}
                    />
                  </div>
                </div>
              </div>
            ) :
              (
                <div>
                  <RateType>{name}</RateType>
                  <RateTime>{time}</RateTime>
                </div>
              )
          }
          {
            !isEditing && (
              <div>
                {
                  isPriceConditions && (
                    <RatePrice>${orderMin} - {orderMax === -1 ? 'No limit' : `$${orderMax}`}</RatePrice>
                  )
                }
                <Chip label={shippingPrice ? `$${Number(shippingPrice).toFixed(2)}` : 'Free'} color={shippingPrice ? 'blue' : 'green'} />
              </div>
            )
          }
        </RateInfo>
        {
          !isEditing && (
            <RateIcons>
              <Edit stroke='#71717A' onClick={() => onEdit(id)} />
              <Delete stroke='#71717A' onClick={handleDeleteShippingZone} />
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
              disabled={isPatchShippingZoneLoading}
            />
            <Button
              label={'Save Changes'}
              size={"medium"}
              color={"blue"}
              outline
              disabled={!isValid}
              onClick={handleSaveShippingZone}
            />
          </EditActions>
        )
      }
    </RateWrapper>
  )
}

interface ShippingZoneProps {
  id: string
  hubId: string
  isEditing: boolean
  country: string
  rates: ShippingZoneType[]
  onCancelEdit: (id: string) => void
  onEditSave: (zone: ShippingZoneType) => void
  refetchShippingZones: () => void
  setModalData: (data: { country: string, name?: string, shippingZoneId: string, type: 'zone' | 'rate' }) => void
  openModal: () => void
}

export default function ShippingZone({
  id,
  hubId,
  isEditing,
  country,
  rates,
  onCancelEdit,
  onEditSave,
  refetchShippingZones,
  setModalData,
  openModal
}: ShippingZoneProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(country || 'US')
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

  const handleDelete = () => {
    setModalData({ country, shippingZoneId: id, type: 'zone' })
    openModal()
  }

  return (
    <Wrapper>
      <Header>
        {
          isEditing ? (
            <Stack flexDirection='row' alignItems='center' width='100%' gap={2}>
              <Image
                src={selectedCountry !== 'ROW' ? `https://flagcdn.com/w20/${selectedCountry?.toLowerCase()}.png` : worldIcon}
                alt=""
                width={20}
                height={selectedCountry !== "ROW" ? 13 : 20}
                loading="lazy"
              />
              <Autocomplete
                options={permittedCountries}
                onChange={(e: any, value: any) => setSelectedCountry(value.code)}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Shipping Zone Country"
                    variant="filled"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
                openOnFocus
                renderOption={(props, option) => (
                  <Box
                    {...props}
                    sx={{ '& > img': { mr: 2, flexShrink: 0, borderRadius: '.25rem' } }}
                    component="li"
                  >
                    <Image
                      src={option?.code !== "ROW" ? `https://flagcdn.com/w20/${option?.code?.toLowerCase()}.png` : worldIcon}
                      alt=""
                      width={20}
                      height={option?.code !== "ROW" ? 13 : 20}
                      loading="lazy"
                    />
                    {option.label}
                  </Box>
                )}
                autoHighlight
                getOptionLabel={(option) => option.label}
              />
            </Stack>
          ) :
            (
              <CountryWrapper>
                <Image
                  src={country !== 'ROW' ? `https://flagcdn.com/w20/${country?.toLowerCase()}.png` : worldIcon}
                  alt='country'
                  width={22}
                  height={country !== "ROW" ? 13 : 20}
                  loading="lazy"
                />
                <span>{permittedCountries?.find(c => c.code === country)?.label}</span>
              </CountryWrapper>
            )
        }
        <HeaderIcons>
          {
            id !== 'new' && (
              <Delete stroke='#71717A' onClick={handleDelete} />
            )
          }
        </HeaderIcons>
      </Header>
      <ShippingRateList>
        {
          rates.map((rate) => (
            <ShippingRate
              id={rate.shipping_zone_id || "123"}
              hubId={rate.hub_sid}
              country={rate.country}
              name={rate.rate_name}
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
              setModalData={setModalData}
              openModal={openModal}
            />
          ))
        }
        {
          addingNewRate && (
            <ShippingRate
              id={"new"}
              hubId={hubId}
              country={country || selectedCountry}
              name={""}
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
              setModalData={setModalData}
              openModal={openModal}
            />
          )
        }
      </ShippingRateList>
      {
        !addingNewRate && (
          <AddRate onClick={handleAddNewRate}>Add Rate</AddRate>
        )
      }
      {isEditing && id !== 'new' && (
        <EditActions>
          <Button label={'Cancel'} size={"small"} color={'white'} outline onClick={() => onCancelEdit(id)} />
          <Button label={'Save'} size={"medium"} color={"blue"} outline onClick={handleEditSave} />
        </EditActions>
      )}
    </Wrapper>
  )
}