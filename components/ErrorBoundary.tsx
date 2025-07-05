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
    console.error('🔥 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    
    // Check for specific Firebase/Network errors
    if (error.message.includes('auth/network-request-failed')) {
      console.warn('🌐 Firebase Authentication network error detected');
      console.warn('💡 The app will continue with mock authentication');
    }
    
    if (error.message.includes('Firebase')) {
      console.warn('🔥 Firebase service error detected');
      console.warn('💡 The app will continue with mock services');
    }
    
    // console.groupEnd() - moved to error logging

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

// Exercise-specific error boundary component
interface ExerciseErrorBoundaryProps {
  children: ReactNode;
  exerciseName: string;
  onBackToMenu?: () => void;
  onRetry?: () => void;
}

interface ExerciseErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ExerciseErrorBoundary extends Component<ExerciseErrorBoundaryProps, ExerciseErrorBoundaryState> {
  constructor(props: ExerciseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ExerciseErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`🎯 Exercise Error Boundary: ${this.props.exerciseName}`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    // console.groupEnd() - moved to error logging

    this.setState({
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Egzersizde Sorun
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>{this.props.exerciseName}</strong> egzersizinde bir hata oluştu.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Tekrar deneyebilir veya ana menüye dönebilirsin.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🔄 Tekrar Dene
              </button>
              
              {this.props.onBackToMenu && (
                <button
                  onClick={this.props.onBackToMenu}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Ana Menüye Dön
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                🔄 Sayfayı Yenile
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  🔧 Geliştirici Bilgileri
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                  <div className="font-semibold text-red-600 mb-2">Error:</div>
                  <div className="text-red-800 mb-3">{this.state.error?.message}</div>
                  <div className="font-semibold text-red-600 mb-2">Stack Trace:</div>
                  <pre className="text-red-700 text-xs overflow-auto max-h-32">
                    {this.state.error?.stack}
                  </pre>
                </div>
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