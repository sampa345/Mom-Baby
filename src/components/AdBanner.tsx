import React from 'react';

interface AdBannerProps {
  dataKey?: string;
  width?: number;
  height?: number;
  domain?: string;
  className?: string;
}

export default function AdBanner({ 
  dataKey = '', 
  width = 728, 
  height = 90, 
  domain = 'www.highperformanceformat.com',
  className = ''
}: AdBannerProps) {
  if (!dataKey) {
    return (
      <div 
        className={`my-8 mx-auto flex flex-col items-center justify-center bg-gray-100/80 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg ${className}`} 
        style={{ width: '100%', maxWidth: width, height, minHeight: height }}
      >
        <p className="text-[13px] font-bold">Adsterra Banner Space ({width}x{height})</p>
        <p className="text-[11px] mt-1 text-gray-400">Waiting for your Ad Key...</p>
      </div>
    );
  }

  const iframeSrc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            margin: 0; min-height: 100vh; padding: 0; background: transparent; 
            display: flex; justify-content: center; align-items: center; overflow: hidden; 
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${dataKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//${domain}/${dataKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`flex justify-center items-center overflow-hidden w-full ${className}`}>
      <iframe 
        srcDoc={iframeSrc}
        width={width} 
        height={height} 
        frameBorder="0" 
        scrolling="no" 
        title="Advertisement"
        style={{ display: 'block', border: 'none', background: 'transparent' }}
      />
    </div>
  );
}
