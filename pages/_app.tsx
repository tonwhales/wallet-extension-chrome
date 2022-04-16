import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { AuthProvider, WalletReference } from '../components/AuthProvider'

import { getConnectState } from '../api/getConnectState';
import App from 'next/app';
import Cookies from 'cookies';

type Data = {
  state: string | null;
  wallet: WalletReference | null;
};


function MyApp(props: AppProps<Data>) {

  let [auth, setAuth] = React.useState<{ session: string, wallet: WalletReference | null } | null>((props as any).state
        ? { session: (props as any).state, wallet: (props as any).wallet }
        : null
    );
    let authHandler = React.useCallback((src: { session: string, wallet: WalletReference | null } | null) => {
        setAuth(src);
    }, []);
  return (
    <AuthProvider state={auth} handler={authHandler}>
      <props.Component {...props.pageProps} />
    </AuthProvider>
  )
}

const getInitialProps = async (args: { ctx: any }) => {
  if (args.ctx.req && args.ctx.res) {
      const cookies = new Cookies(args.ctx.req, args.ctx.res);
      let cookieState = cookies.get('whales-state');
      let wallet: WalletReference | null = null;
      let state: string | null = null;
      if (cookieState) {
          let ex = await getConnectState(cookieState);
          if (ex.state === 'initing') {
              wallet = null;
              state = cookieState;
          }
          if (ex.state === 'ready') {
              wallet = { address: ex.wallet!.address, endpoint: ex.wallet!.endpoint, appPublicKey: ex.wallet!.appPublicKey};
              state = cookieState;
          }
      }
      return {
          ...App.getInitialProps(args as any),
          state,
          wallet
      }
  } else {
      // NOTE: this values are simply ignored by component: it is used only for initial render
      return {
          ...App.getInitialProps(args as any),
          state: null,
          wallet: null
      }
  }
};
(MyApp as any).getInitialProps = getInitialProps;

export default MyApp
