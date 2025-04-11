import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

interface WebViewScreenProps {
  url: string;
  onMessage?: (event: any) => void;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url, onMessage }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleMessage = (event: any) => {
    if (onMessage) {
      onMessage(event);
    }
  };

  const handleError = () => {
    setHasError(true);
  };

  const handleReload = () => {
    setHasError(false);
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>페이지를 불러오는데 실패했습니다.</Text>
      <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
        <Text style={styles.reloadButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNoInternet = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>인터넷 연결이 필요합니다.</Text>
      <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
        <Text style={styles.reloadButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isConnected) {
    return renderNoInternet();
  }

  if (hasError) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={handleMessage}
        renderLoading={renderLoading}
        onError={handleError}
        injectedJavaScript={`
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'WEBVIEW_READY'
          }));
          true;
        `}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WebViewScreen; 