import React from 'react';
import {SortField, SortOrder} from '../model/Types'
import '../styles/sorting.css'

interface SortControlProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const SortingComponent: React.FC<SortControlProps> = ({ sortField, sortOrder, onSortChange }) => {
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortField, sortOrder);
  };

  const handleOrderChange = () => {
    onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className='main-container'>
        Sort by
      <select value={sortField} onChange={handleFieldChange} className='select-field'>
        <option value="manufacturer">Manufacturer</option>
        <option value="year">Year</option>
        <option value="price">Price</option>
      </select>
        Mode
      <select value={sortOrder} onChange={handleOrderChange} className='select-order'>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortingComponent;