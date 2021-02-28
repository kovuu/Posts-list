import Post from '../components/Post/Post';
import Paginator from '../components/paginator/Paginator';
import { Component, Fragment } from 'react';
import './List.scss';
import Filter from '../components/filter/Filter';

const POSTS = require('../assets/posts.json');

const POST_ID = 'id';
const POST_TITLE = 'title';
const POST_BODY = 'body';

class List extends Component {
  state = {
    allPosts: [],
    currentPosts: [],
    currentPage: null,
    totalPages: null,
    sortingColumn: null,
    ascDirection: null
  }

  componentDidMount() {
    this.setState( { allPosts: POSTS, ascDirection: true });
  }

  onPageChanged = data => {
    const { allPosts } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentPosts = allPosts.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentPosts, totalPages });
  }

  sortByColumn = async columnName => {
    if (this.state.sortingColumn === columnName) {
      await this.setState({ ascDirection: !this.state.ascDirection });
    } else if (this.state.sortingColumn && this.state.sortingColumn !== columnName) {
      await this.setState({ sortingColumn: columnName, ascDirection: true });
    } else {
      await this.setState({ sortingColumn: columnName, ascDirection: false });
    }


    const { ascDirection, sortingColumn } = this.state;

    this.setState({ allPosts: this.state.allPosts.sort((a,b) => {
        if (ascDirection) {
          if (typeof a[sortingColumn] === 'string') {
            return a[sortingColumn] > b[sortingColumn] ? 1 : -1;
          }
          return a[sortingColumn] - b[sortingColumn];
        }
        if (typeof a[sortingColumn] === 'string') {
          return a[sortingColumn] > b[sortingColumn] ? -1 : 1;
        }

        return b[sortingColumn] - a[sortingColumn];
      })});

    this.onPageChanged({currentPage: this.state.currentPage, totalPages: this.state.totalPages, pageLimit: 50});
  }

  handleSearchText = async filterParams => {
    if (!filterParams.searchText || !filterParams.filteredFields.length) {
      await this.setState({...this.state, allPosts: POSTS});
      this.onPageChanged({currentPage: 1, totalPages: Math.ceil(this.state.allPosts.length / 50), pageLimit: 50});
      return true;
    }
    let allPosts = this.state.allPosts;

    if (filterParams.filteredFields.includes(POST_ID)) {
      allPosts = POSTS.filter((post) => post.id.toString().includes(filterParams.searchText));
    }

    if (filterParams.filteredFields.includes(POST_TITLE)) {
      allPosts = POSTS.filter((post) => post[POST_TITLE].includes(filterParams.searchText));
    }

    if (filterParams.filteredFields.includes(POST_BODY)) {
      allPosts = POSTS.filter((post) => post[POST_BODY].includes(filterParams.searchText));
    }

    await this.setState( {...this.state, allPosts } );
    this.onPageChanged({currentPage: 1, totalPages: Math.ceil(this.state.allPosts.length / 50), pageLimit: 50});
  }

  render() {
    const { allPosts, currentPosts, currentPage, totalPages } = this.state;
    const totalPosts = allPosts.length;

    return (
      <Fragment>
        <div className='list-header'>
          <Filter handleSearchText={this.handleSearchText}/>
          {allPosts.length && <div className='page-info'>
            <span className='pages-count'>Pages {currentPage}/{totalPages}</span>
            <Paginator className='paginator' totalRecords={totalPosts} pageLimit={50} pageNeighbours={1} onPageChanged={this.onPageChanged} />
          </div>}
        </div>
        <table className="table">
          <thead>
          <tr>
            <th scope="col" className='posts-column-name' onClick={e => this.sortByColumn(POST_ID)}>Post id</th>
            <th scope="col" className='posts-column-name' onClick={e => this.sortByColumn(POST_TITLE)}>Title</th>
            <th scope="col" className='posts-column-name' onClick={e => this.sortByColumn(POST_BODY)}>Body</th>
          </tr>
          </thead>
          <tbody>
          {currentPosts && currentPosts.map(post => (
            <Post post={post} key={post.id}/>
          ))}
          </tbody>
        </table>
      </Fragment>
    )
  }
}

export default List;