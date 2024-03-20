import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import config from '@config';

declare global {
  interface Window {
    analytics: any;
    heap: any;
  }
}
export default function Document() {
  return (
    <Html lang="en" translate="no">
      <Head>
        <script
          type="text/javascript"
          async
          dangerouslySetInnerHTML={{
            __html: `
          window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
heap.load("${config.HEAP_ANALYTICS}")`,
          }}
        />

        <link rel="dns-prefetch" href={config.api} />
      </Head>

      <body className="bg-black">
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
          }}
        />
      </body>
    </Html>
  );
}
