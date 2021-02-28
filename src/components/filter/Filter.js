import './FIlter.scss';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Paginator from '../paginator/Paginator';

const POST_ID = 'id';
const POST_TITLE = 'title';
const POST_BODY = 'body';

function Filter({ handleSearchText }) {
  const [filterParams, setFilterParams] = useState({ searchText: '', filteredFields: [] });

  useEffect(() => {
    handleSearchText(filterParams);
  }, [filterParams, handleSearchText]);

  const handleInput = async searchText => {
    setFilterParams({ searchText, filteredFields: [...filterParams.filteredFields] });
  }

  const handleSelectFilteredColumn = filteredColumn => {
    if (!filterParams.filteredFields.includes(filteredColumn)) {
      setFilterParams({ filteredFields: [...filterParams.filteredFields, filteredColumn], searchText: filterParams.searchText });
    } else {
      setFilterParams({ filteredFields: filterParams.filteredFields.filter(column => column !== filteredColumn), searchText: filterParams.searchText });
    }
  }

  return (
    <form>
      <input className='filter-input' type='text' onChange={e => handleInput(e.target.value)} value={filterParams.searchText} placeholder='filter'/>
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="checkbox" value={POST_ID} onChange={e => handleSelectFilteredColumn(POST_ID)} id="flexCheckDefault"/>
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Id
          </label>
      </div>
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="checkbox" value={POST_TITLE} onChange={e => handleSelectFilteredColumn(POST_TITLE)} id="flexCheckChecked"/>
          <label className="form-check-label" htmlFor="flexCheckChecked">
            Title
          </label>
      </div>
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="checkbox" value={POST_BODY} onChange={e => handleSelectFilteredColumn(POST_BODY)} id="flexCheckChecked"/>
        <label className="form-check-label" htmlFor="flexCheckChecked">
          Body
        </label>
      </div>
    </form>
  )
}

Paginator.propTypes = {
  handleSearchText: PropTypes.func
}

export default Filter;