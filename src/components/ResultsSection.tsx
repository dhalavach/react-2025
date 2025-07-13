import { Component } from 'react';
import type { Character } from '../types/Character.ts';
import { CharacterCard } from './CharacterCard';
import { LoadingSpinner } from './LoadingSpinner.tsx';
import { ErrorMessage } from './ErrorMessage.tsx';

interface Props {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export class ResultsSection extends Component<Props> {
  render() {
    const { characters, isLoading, error, onRetry } = this.props;

    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {isLoading && <LoadingSpinner />}

          {error && <ErrorMessage message={error} onRetry={onRetry} />}

          {!isLoading && !error && characters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No characters found. Try a different search term.
              </p>
            </div>
          )}

          {!isLoading && !error && characters.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results ({characters.length} character
                  {characters.length !== 1 ? 's' : ''})
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {characters.map((character, index) => (
                  <CharacterCard
                    key={`${character.url}-${index}`}
                    character={character}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
