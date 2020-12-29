import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
// import { scrollToTop } from '../../utils/apis/helpers'


class Pagination extends Component {

  state = {
    rowsPerPage: 5
  }

  render() {
    const { t } = this.props
    const { displayNum, fullData } = this.props
    if (Math.ceil(fullData.length / (displayNum ? displayNum : 5)) >= 1) {         //displayNum = 5 
      return (
        <div className="col-12 d-flex flex-wrap align-items-center">
          <div className="sohar-row-per-page d-flex align-items-center pr-2">
            <h6 className="my-0 pr-1">{t('Rows per page')}</h6>
            <div className="position-relative">
              <select className="pl-2 pr-4 text-white" value={displayNum} onChange={(e) => this.setRows(e)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
              <div className="sel-r-per-p">
                <span className="iconv1 iconv1-arrow-down"></span>
              </div>
            </div>
          </div>
          <nav className="sohar-pagination">
            <ul className="pagination">
              <li className="page-item" onClick={() => this.pageDecrease()}><i className="page-link"><span className="iconv1 iconv1-left-small-arrow"></span></i></li>
              {this.renderPagination()}
              <li className="page-item" onClick={() => this.pageIncrease()}><i className="page-link"><span className="iconv1 iconv1-right-small-arrow"></span></i></li>
            </ul>
          </nav>
        </div>
      )
    } else {
      return null
    }
  }

  setRows(e) {
    const { displayNumber, getPageNumber } = this.props
    displayNumber(e.target.value)
    getPageNumber(1)
  }

  pageDecrease() {
    const { pageNumber, getPageNumber } = this.props
    if (pageNumber > 1) {
      getPageNumber(pageNumber - 1)
      // scrollToTop()
    }
  }

  pageIncrease() {
    const { pageNumber, getPageNumber, displayNum, fullData } = this.props
    if (pageNumber < Math.ceil(fullData.length / (displayNum ? displayNum : 5))) {
      getPageNumber(pageNumber + 1)
      // scrollToTop()
    }
  }

  pageNumberClicked(i) {
    const { getPageNumber } = this.props
    getPageNumber(i + 1)
    // scrollToTop()
  }

  renderPagination() {
    const { fullData, displayNum, pageNumber } = this.props
    const pageCount = Math.ceil(fullData.length / (displayNum ? displayNum : 5))
    if (pageCount) {
      const pages = []
      if (pageNumber < 10) {
        for (let i = 0; i < (pageCount < 10 ? pageCount : 10); i++) {
          pages.push(
            <li key={i} className="page-item cursorPointer" onClick={() => this.pageNumberClicked(i)}><i className={pageNumber === i + 1 ? "page-link active" : "page-link"}>{i + 1}</i></li>
          )
        }
      } else if (pageNumber >= 10 && pageNumber < pageCount) {
        for (let i = 0 + (pageNumber - 10 + 1); i < (pageCount < 10 ? pageCount : 10 + (pageNumber - 10 + 1)); i++) {
          pages.push(
            <li key={i} className="page-item cursorPointer" onClick={() => this.pageNumberClicked(i)}><i className={pageNumber === i + 1 ? "page-link active" : "page-link"}>{i + 1}</i></li>
          )
        }
      } else {
        for (let i = 0 + (pageNumber - 10); i < (pageCount < 10 ? pageCount : 10 + (pageNumber - 10)); i++) {
          pages.push(
            <li key={i} className="page-item cursorPointer" onClick={() => this.pageNumberClicked(i)}><i className={pageNumber === i + 1 ? "page-link active" : "page-link"}>{i + 1}</i></li>
          )
        }
      }
      return pages
    }
  }
}

export default withTranslation()(Pagination)



//<span key={i} className="cursorPointer m-1" onClick={() => getPageNumber(i + 1)}>{(i + 1)}</span>



// <nav className="sohar-pagination">
            //     <ul className="pagination">
            //         <li className="page-item"><a className="page-link" href="#"><span className="iconv1 iconv1-left-small-arrow"></span></a></li>
            //         <li className="page-item"><a className="page-link" href="#">1</a></li>
            //         <li className="page-item"><a className="page-link" href="#">2</a></li>
            //         <li className="page-item"><a className="page-link" href="#">3</a></li>
            //         <li className="page-item"><a className="page-link" href="#">4</a></li>
            //         <li className="page-item"><a className="page-link" href="#">5</a></li>
            //         <li className="page-item"><a className="page-link" href="#"><span className="iconv1 iconv1-right-small-arrow"></span></a></li>
            //     </ul>
            // </nav>