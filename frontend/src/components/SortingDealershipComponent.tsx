import React from 'react';
import { SortField, SortOrder } from '../model/Types';
import '../styles/sorting.css';

interface SortControlProps {
    sortField: SortField;
    sortOrder: SortOrder;
    onSortChange: (field: SortField, order: SortOrder) => void;
}

const SortingDealershipComponent: React.FC<SortControlProps> = ({ 
    sortField, 
    sortOrder, 
    onSortChange 
}) => {
    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value as SortField, sortOrder);
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(sortField, e.target.value as SortOrder);
    };

    return (
        <div className="main-container">
            <span>Sort by</span>
            <select 
                value={sortField} 
                onChange={handleFieldChange} 
                className="select-field"
                aria-label="Sort by field"
            >
                <option value="name">Name</option>
                <option value="location">Location</option>
            </select>
            <span>Order</span>
            <select 
                value={sortOrder} 
                onChange={handleOrderChange} 
                className="select-order"
                aria-label="Sort order"
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    );
};

export default SortingDealershipComponent;