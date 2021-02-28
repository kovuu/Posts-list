import { Component } from 'react';
import PropTypes from 'prop-types';
import Lodash from 'lodash';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

class Paginator extends Component {
  constructor(props) {
    super(props);
    const { totalRecords = null, pageLimit = 50, pageNeighbours = 0 } = props;

    this.setPaginatorSettings(pageLimit, totalRecords, pageNeighbours);

    this.state = { currentPage: 1};
  }

  setPaginatorSettings = (pageLimit, totalRecords, pageNeighbours) => {
    this.pageLimit = typeof pageLimit === 'number' ? pageLimit : 50;
    this.totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

    this.pageNeighbours = typeof pageNeighbours === 'number'
      ? Math.max(0, Math.min(pageNeighbours, 2))
      : 0;

    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);
  }

  fetchPageNumbers = () => {
    const { totalRecords = null, pageLimit = 50, pageNeighbours = 0 } = this.props;

    this.setPaginatorSettings(pageLimit, totalRecords, pageNeighbours);

    this.currentPage = this.state.currentPage;

    const totalNumbers = (this.pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (this.totalPages > totalBlocks) {
      const startPage = Math.max(2, this.currentPage - this.pageNeighbours);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + this.pageNeighbours);
      let pages = Lodash.range(startPage, endPage + 1);

      const hasLeftScroll = startPage > 2;
      const hasRightScroll = (this.totalPages - endPage) > 1;
      const scrollOffset = totalNumbers - (pages.length + 1);

      if (hasLeftScroll && !hasRightScroll) {
        const extraPages = Lodash.range(startPage - scrollOffset, startPage);
        pages = [LEFT_PAGE, ...extraPages, ...pages];
      } else if (!hasLeftScroll && hasRightScroll) {
        const extraPages = Lodash.range(endPage + 1, endPage + scrollOffset + 1);
        pages = [...pages, ...extraPages, RIGHT_PAGE];
      } else {
        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
      }

      return [1, ...pages, this.totalPages];
    }

    return Lodash.range(1, this.totalPages + 1);
  }

  render() {
    const { currentPage } = this.state;
    const pages = this.fetchPageNumbers();

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          { pages.map((page, index) => {

            if (page === LEFT_PAGE) return (
              <li key={index} className="page-item">
                <span className="page-link" aria-label="Previous" onClick={this.handleMoveLeft}>
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </span>
              </li>
            );

            if (page === RIGHT_PAGE) return (
              <li key={index} className="page-item">
                <span className="page-link" aria-label="Next" onClick={this.handleMoveRight}>
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </span>
              </li>
            );

            return (
              <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                <span className="page-link" onClick={ this.handleClick(page) }>{ page }</span>
              </li>
            );

          }) }
        </ul>
      </nav>
    )
  }

  componentDidMount() {
    this.gotoPage(1);
  }

  gotoPage = page => {
    const { onPageChanged = f => f } = this.props;
    const currentPage = Math.max(0, Math.min(page, this.totalPages));
    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRecords: this.totalRecords
    };

    this.setState({ currentPage }, () => onPageChanged(paginationData));
  }

  handleClick = page => evt => {
    evt.preventDefault();
    this.gotoPage(page);
  }

  handleMoveLeft = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - (this.pageNeighbours * 2) - 1);
  }

  handleMoveRight = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + (this.pageNeighbours * 2) + 1);
  }
}

Paginator.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbours: PropTypes.number,
  onPageChanged: PropTypes.func
}

export default Paginator;