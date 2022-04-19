import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
function MyApp(props: AppProps) {
  return (
      <props.Component {...props.pageProps} />
  )
}

export default MyApp
