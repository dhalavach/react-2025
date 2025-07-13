import { Component } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import type { Character } from './types/Character';
import { APIService } from './services/api';
import { Bug } from 'lucide-react';

interface State {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  currentSearchTerm: string;
}

class AppContent extends Component<object, State> {
  constructor(props: object) {
    super(props);

    this.state = {
      characters: [],
      isLoading: false,
      error: null,
      currentSearchTerm: '',
    };
  }

  private handleSearch = async (searchTerm: string) => {
    this.setState({
      isLoading: true,
      error: null,
      currentSearchTerm: searchTerm,
    });

    try {
      const response = await APIService.searchCharacters(searchTerm);
      this.setState({
        characters: response.results,
        isLoading: false,
      });
    } catch (error) {
      console.error('Search error:', error);
      this.setState({
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        isLoading: false,
        characters: [],
      });
    }
  };

  private handleRetry = () => {
    this.handleSearch(this.state.currentSearchTerm);
  };

  private throwTestError = () => {
    throw new Error(
      'This is a test error to demonstrate the error boundary functionality'
    );
  };

  render() {
    const { characters, isLoading, error } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SearchSection onSearch={this.handleSearch} isLoading={isLoading} />

        <ResultsSection
          characters={characters}
          isLoading={isLoading}
          error={error}
          onRetry={this.handleRetry}
        />

        {/* Error Test Button */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={this.throwTestError}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
            title="Test Error Boundary"
          >
            <Bug className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
