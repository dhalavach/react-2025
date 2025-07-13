import React, { Component } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
}

interface State {
  searchTerm: string;
}

export class SearchSection extends Component<Props, State> {
  private readonly STORAGE_KEY = 'starwars-search-term';

  constructor(props: Props) {
    super(props);

    const savedSearchTerm = localStorage.getItem(this.STORAGE_KEY) || '';

    this.state = {
      searchTerm: savedSearchTerm,
    };
  }

  componentDidMount() {
    this.props.onSearch(this.state.searchTerm);
  }

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  private handleSearch = () => {
    const trimmedTerm = this.state.searchTerm.trim();

    localStorage.setItem(this.STORAGE_KEY, trimmedTerm);

    this.props.onSearch(trimmedTerm);
  };

  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    const { isLoading } = this.props;
    const { searchTerm } = this.state;

    return (
      <div className='bg-white shadow-sm border-b border-gray-200 p-6'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6 text-center'>Star Wars Character Search</h1>

          <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                value={searchTerm}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                placeholder='Search for Star Wars characters...'
                disabled={isLoading}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed'
              />
            </div>

            <button
              onClick={this.handleSearch}
              disabled={isLoading}
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium'
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
