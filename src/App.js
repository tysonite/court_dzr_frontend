import React, { Component } from 'react'
import AppHeader from './components/AppHeader'
import analytics from './utils/analytics'
import api from './utils/api'
import isLocalHost from './utils/isLocalHost'
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import './App.css'


export default class App extends Component {
  state = {
    isLoggedIn: false,
    userName: 'Unknown User',
    email: 'unknown@some.org',
    cases: []
  }

  constructor(props) {
    super(props)
    this.onLoginSuccess = this.onLoginSuccess.bind(this)
  }

  componentDidMount() {
    /* Track a page view */
    analytics.page();
  }

  renderCases() {
    // eslint-disable-next-line
    const {
      cases: cases,
      isLoggedIn: isLoggedIn
    } = this.state;

    if (!cases || !cases.length) {
      return (
        <div>Нет отслеживаемых дел</div>
      );
    }

    if (!isLoggedIn) {
      return (
        <div>Не выполнен вход</div>
      );
    }

    return cases.map((case_item, i) => {
      const { data } = case_item

      const days_count = ((retrieval_time) => {
        const last_update_date = new Date(parseInt(retrieval_time) * 1000);
        const now_date = new Date()
        last_update_date.setHours(24, 0, 0, 0)
        now_date.setHours(24, 0, 0, 0)
        const diff_days = Math.ceil((now_date.getTime() - last_update_date.getTime()) / (1000 * 3600 *24));
        return 'Обновлено ' + (diff_days == 0 ? 'Сегодня' : (diff_days + ' дней назад'));
      })(data.update_history[0].retrieval_time);

      return (
        <div key={i} className='todo-item'>
          <label className="todo">
            <div className='todo-list-title'>
              <a href={data.url} target="_blank" rel="noopener noreferrer">{data.name}</a>
            </div>
          </label>

          <label><div>{data.update_history[0].case_update_time}</div></label>
          <label><div>{days_count}</div></label>
        </div>
      )
    })
  }

  onLoginSuccess(credentialResponse) {
    const responsePayload = jwt_decode(credentialResponse.credential);
    const email = responsePayload.email;

    /* Fetch all cases */
    api.readAll(email).then((cases) => {
      if (cases.name === 'Unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false;
      }

      this.setState({
        cases: cases
      });
    });

    this.setState({
      isLoggedIn: true,
      email: email,
      userName: responsePayload.name,
    });
  }

  onLoginError() {
    this.setState({
      isLoggedIn: false,
      email: 'unknown@some.org',
      userName: 'Unknown User',
    });
  }

  renderHeader() {
    return (
      <AppHeader onLoginSuccess={this.onLoginSuccess} onLoginError={this.onLoginError} />
    )
  }

  render() {
    return (
      <GoogleOAuthProvider clientId="228034351966-4j0t8iupfrv4jb0tljhpns9mpg4vb4h1.apps.googleusercontent.com">
        <div className='app'>
          {this.renderHeader()}

          <div className='todo-list'>
            {this.renderCases()}
          </div>
        </div>
      </GoogleOAuthProvider>
    )
  }
}
