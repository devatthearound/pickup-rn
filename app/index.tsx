import React from 'react';
import WebViewScreen from '../components/WebViewScreen';

export default function Home() {
  return (
    <WebViewScreen 
      url="https://www.ezpickup.kr"  // 여기에 실제 웹사이트 URL을 입력하세요
      onMessage={(event) => {
        const message = JSON.parse(event.nativeEvent.data);
        console.log('Received message:', message);
      }}
    />
  );
} 