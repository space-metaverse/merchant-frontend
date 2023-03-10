import { useEffect, useState } from 'react'

import { getCookies, setCookie, deleteCookie } from 'cookies-next'
import { useAppDispatch } from 'redux/hooks'
import { setAccountUsername } from 'redux/slices/account'

import { useGetVerifyCodeQuery, useGetVerifyTokenQuery } from '../api/auth'

function getAuthURL(): string {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
      return 'https://auth.qa.tryspace.com'
    case 'dev':
      return 'https://auth.dev.tryspace.com'
    case 'qa':
      return 'https://auth.qa.tryspace.com'
    case 'prod':
      return 'https://auth.tryspace.com'
    default:
      console.log('No ENV set')
      return 'https://auth.dev.tryspace.com'
  }
}

export function getCookieDomain(): string {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
      return 'localhost'
    case 'dev':
      return 'dev.tryspace.com'
    case 'qa':
      return 'qa.tryspace.com'
    case 'prod':
      return 'tryspace.com'
    default:
      console.log('No ENV set')
      return 'dev.tryspace.com'
  }
}

const Auth: React.FC = () => {
  const dispatch = useAppDispatch()

  const [loginCode, setLoginCode] = useState('')
  const [immerToken, setImmerToken] = useState('')

  const {
    isSuccess: isGetVerifyCodeSuccess,
    data: getVerifyCodeData,
    isError: isGetVerifyCodeError,
    isLoading: isGetVerifyCodeLoading,
  } = useGetVerifyCodeQuery({ loginCode },
    {
      skip: !loginCode
    })

  const {
    data: getVerifyTokenData,
    isError: isGetVerifyTokenError,
    isSuccess: isGetVerifyTokenSuccess,
    isLoading: isGetVerifyTokenLoading,
  } = useGetVerifyTokenQuery({ immerToken },
    {
      skip: !immerToken
    })

  useEffect(() => {
    const cookies = getCookies()

    const localImmerToken = cookies.immerToken

    if (!localImmerToken) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const loginCode = urlSearchParams.get('loginCode')
      if (loginCode) {
        setLoginCode(loginCode)
      } else {
        window.location.href = `${getAuthURL()}/?redirect=${window.location.href}`
      }
    } else {
      setImmerToken(localImmerToken)
    }
  }, [])

  useEffect(() => {
    if (isGetVerifyCodeSuccess && getVerifyCodeData?.immerToken) {
      setCookie('immerToken', getVerifyCodeData?.immerToken, {
        domain: getCookieDomain(),
        path: '/'
      })
      setCookie('hubsToken', getVerifyCodeData?.hubsToken, {
        domain: getCookieDomain(),
        path: '/'
      })
      dispatch(setAccountUsername({ username: String(getVerifyCodeData?.username) }))
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }, [isGetVerifyCodeSuccess, getVerifyCodeData, dispatch])

  useEffect(() => {
    if (isGetVerifyTokenSuccess && getVerifyTokenData?.username) {
      dispatch(setAccountUsername({ username: getVerifyTokenData?.username }))
    }
  }, [isGetVerifyTokenSuccess, getVerifyTokenData, dispatch])

  useEffect(() => {
    if ((isGetVerifyTokenError && !isGetVerifyTokenLoading) || (isGetVerifyCodeError && !isGetVerifyCodeLoading)) {
      deleteCookie('immerToken', {
        domain: getCookieDomain(),
        path: '/'
      })
      deleteCookie('hubsToken', {
        domain: getCookieDomain(),
        path: '/'
      })
      window.location.href = `${getAuthURL()}/?redirect=${window.location.href}`
    }
  }, [isGetVerifyTokenError, isGetVerifyTokenLoading, isGetVerifyCodeError, isGetVerifyCodeLoading])

  return <></>
}

export default Auth
