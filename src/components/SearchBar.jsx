import React from 'react'
import { Search, Filter, SortAsc } from 'lucide-react'

const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by color, brand, or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-surface border-2 border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm hover:border-primary transition-all duration-200 text-base"
          aria-label="Search for lost items"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label htmlFor="category-filter" className="block text-sm font-semibold text-text-secondary mb-2">
            <Filter className="inline h-4 w-4 mr-1.5" />
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm hover:border-primary transition-all duration-200 cursor-pointer"
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1">
          <label htmlFor="sort-filter" className="block text-sm font-semibold text-text-secondary mb-2">
            <SortAsc className="inline h-4 w-4 mr-1.5" />
            Sort by
          </label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm hover:border-primary transition-all duration-200 cursor-pointer"
            aria-label="Sort items"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchBar