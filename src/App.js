import React, { Component } from 'react'
import AppHeader from './components/AppHeader'
import analytics from './utils/analytics'
import api from './utils/api'
// import sortByDate from './utils/sortByDate'
import isLocalHost from './utils/isLocalHost'
import './App.css'

export default class App extends Component {
  state = {
    cases: []
  }

  componentDidMount() {

    /* Track a page view */
    analytics.page()

    // Fetch all cases
    api.readAll().then((cases) => {
      if (cases.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }

      console.log('all cases', cases)
      this.setState({
        cases: cases
      })
    })
  }

  renderCases() {
    // eslint-disable-next-line
    const { cases: cases } = this.state

    if (!cases || !cases.length) {
      // Loading State here
      return null
    }

    // const timeStampKey = 'ts'
    // const orderBy = 'desc' // or `asc`
    // const sortOrder = sortByDate(timeStampKey, orderBy)
    // const todosByDate = cases.sort(sortOrder)

    return cases.map((case_item, i) => {

      const { data } = case_item

      return (
        <div key={i} className='todo-item'>
          <label className="todo">
            <div className='todo-list-title'>
              <a href={data.url} target="_blank" rel="noopener noreferrer">{data.name}</a>
            </div>
          </label>

          {data.update_history[0].case_update_time}
        </div>
      )
    })
  }

  render() {
    return (
      <div className='app'>

        <AppHeader />

        <div className='todo-list'>
          {this.renderCases()}
        </div>

      </div>
    )
  }
}

