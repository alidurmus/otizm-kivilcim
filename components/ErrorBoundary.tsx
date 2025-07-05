'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isNetworkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      isNetworkError: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Detect network-related errors
    const isNetworkError = 
      error.message.includes('network') ||
      error.message.includes('fetch failed') ||
      error.message.includes('Firebase') ||
      error.message.includes('auth/network-request-failed') ||
      error.message.includes('timeout');

    return {
      hasError: true,
      error,
      isNetworkError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging
    console.group('🔥 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    
    // Check for specific Firebase/Network errors
    if (error.message.includes('auth/network-request-failed')) {
      console.warn('🌐 Firebase Authentication network error detected');
      console.info('💡 The app will continue with mock authentication');
    }
    
    if (error.message.includes('Firebase')) {
      console.warn('🔥 Firebase service error detected');
      console.info('💡 The app will continue with mock services');
    }
    
    console.groupEnd();

    this.setState({
      errorInfo,
      isNetworkError: error.message.includes('network') || 
                     error.message.includes('Firebase') ||
                     error.message.includes('fetch failed')
    });
  }

  render() {
    if (this.state.hasError) {
      // Network error fallback - less intrusive
      if (this.state.isNetworkError) {
        return (
          <div className="min-h-screen bg-background-color flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h2 className="text-xl font-bold text-text-color mb-2">
                Çevrimdışı Mod
              </h2>
              <p className="text-gray-600 mb-4">
                İnternet bağlantısı sınırlı, ancak tüm özellikler kullanılabilir.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-focus-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Devam Et
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Veriler cihazınızda güvenle saklanıyor
              </p>
            </div>
          </div>
        );
      }

      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Generic error fallback
      return (
        <div className="min-h-screen bg-background-color flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-text-color mb-2">
              Bir Sorun Oluştu
            </h2>
            <p className="text-gray-600 mb-4">
              Uygulama beklenmedik bir hatayla karşılaştı.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-focus-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-2"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Sayfayı Yenile
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Geliştirici Bilgileri
                </summary>
                <pre className="text-xs text-red-600 mt-2 overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 