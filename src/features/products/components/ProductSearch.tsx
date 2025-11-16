import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useProductSearch } from '../hooks/useProducts';
import { normalizeProduct } from '@/lib/utils/productHelpers';
import { formatPrice } from '@/lib/utils/formatters';

export function ProductSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useProductSearch(debouncedSearch);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length > 2);
  };

  const handleSelect = (productId: string) => {
    navigate(`/products/${productId}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set('search', searchTerm.trim());
      setSearchParams(params);
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchTerm.length > 2 && setIsOpen(true)}
            className="pl-10 pr-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && data && data.data.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-2">
              {data.metadata.total} results found
            </p>
            {data.data.slice(0, 5).map((product) => {
              const normalized = normalizeProduct(product);
              return (
                <button
                  key={normalized.id}
                  onClick={() => handleSelect(normalized.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-md transition-colors text-left"
                >
                  <img
                    src={normalized.imageUrl || 'https://via.placeholder.com/40'}
                    alt={normalized.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{normalized.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {normalized.category}
                    </p>
                  </div>
                  <p className="font-semibold text-primary">
                    {formatPrice(normalized.price)}
                  </p>
                </button>
              );
            })}
            {data.data.length > 5 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('search', searchTerm);
                  setSearchParams(params);
                  setIsOpen(false);
                }}
                className="w-full p-3 text-sm text-center text-primary hover:bg-accent rounded-md transition-colors"
              >
                View all {data.metadata.total} results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
