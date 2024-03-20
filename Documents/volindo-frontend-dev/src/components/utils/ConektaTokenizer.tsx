import React, { useEffect, useRef } from 'react';
import configuration from '@config';

const ConektaTokenizer = ({
  onTokenGenerated = () => {},
  onErrorToken = () => {},
  hidden = false,
}: {
  onTokenGenerated: (token: string) => void;
  onErrorToken?: () => void;
  hidden?: boolean;
}) => {
  const iFrameRef = useRef(null);

  useEffect(() => {
    const iframe: any = iFrameRef.current;
    const document = iframe?.contentDocument || iframe?.contentWindow.document;

    const htmlContent = `
    <html style="overflow: hidden;">
      <head>
        <meta charset="utf-8">
        <title>Checkout</title>
        <script type="text/javascript" src="https://pay.conekta.com/v1.0/js/conekta-checkout.min.js"></script>
      </head>
      <body style="overflow: hidden;">
        <div id="conektaIframeContainer" style="height: 480px" ></div>
        <script type="text/javascript">
          const config = {
            targetIFrame: "#conektaIframeContainer",
            publicKey: "${configuration.conkecta_publishable_key}",
            locale: 'es',
          };
          const callbacks = {
            onCreateTokenSucceeded: function(token) {
              const data = {
                message: 'tokenGenerated',
                token: token.id,
              };
              window.parent.postMessage(data,'*');
            },
            onCreateTokenError: function(error) {
              const data = {
                message: 'errorToken',
              };
              window.parent.postMessage(data,'*');
            },
            onGetInfoSuccess: function(loadingTime){
              console.log("loadingTime");
            }
          };
          window.ConektaCheckoutComponents.Card({
            config,
            callbacks,
            allowTokenization: true, 
          })
        </script>
      </body>
    </html>
    `;

    document.open();
    document.write(htmlContent);
    document.close();

    const handleIframeMessage = (event: any) => {
      switch (event.data?.message) {
        case 'tokenGenerated':
          onTokenGenerated(event.data?.token);
          break;
        case 'errorToken':
          onErrorToken();
          break;
      }
    };

    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  return (
    <iframe
      style={{
        display: hidden ? 'none' : 'block',
      }}
      ref={iFrameRef}
      className="w-full h-[480px] mx-auto"
    />
  );
};

export default ConektaTokenizer;
