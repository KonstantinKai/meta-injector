import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import '../biz/setup/initialRegistration';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to next!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
