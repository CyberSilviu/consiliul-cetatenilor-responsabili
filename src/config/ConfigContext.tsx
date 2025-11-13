import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameConfig } from './configLoader';
import { loadGameConfig } from './configLoader';

interface ConfigContextValue {
  config: GameConfig | null;
  loading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextValue>({
  config: null,
  loading: true,
  error: null,
});

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context.config && !context.loading) {
    throw new Error('Config failed to load');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadGameConfig()
      .then((loadedConfig) => {
        setConfig(loadedConfig);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#b5f351ff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white text-lg">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-red-900/20 border-2 border-red-500 rounded-xl p-8 space-y-4">
          <h1 className="text-3xl font-bold text-red-400">
            Configuration Error
          </h1>
          <p className="text-white">
            Failed to load game configuration. Please check the console for details.
          </p>
          <pre className="bg-black/50 p-4 rounded-lg text-sm text-red-300 overflow-auto">
            {error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};
