"use client"
import './globals.css'
import { ThemeProvider } from '@space-metaverse-ag/space-ui'
import "@space-metaverse-ag/space-ui/index.css"
import Auth from '../components/Auth'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import TopNav from '../components/TopNav'
import StyledComponentsRegistry from '../lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <Provider store={store}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <body>
              <Auth />
              <TopNav />
              {children}
            </body>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </Provider>
    </html>
  )
}
