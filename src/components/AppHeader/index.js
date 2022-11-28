import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import logo from '../../assets/law-128.png'
import github from '../../assets/github.svg'
import styles from './AppHeader.css' // eslint-disable-line

const AppHeader = (props) => {
  return (
    <header className='app-header'>
      <div className='app-title-wrapper'>
        <div>
          <div className='app-left-nav'>
            <img src={logo} className='app-logo' alt='logo' />
            <div className='app-title-text'>
              <h1 className='app-title'>Судебный дневник</h1>
              <p className='app-intro'>
                Отслеживание гражданских судебных процессов
              </p>
            </div>
          </div>
        </div>
        <div className='deploy-button-wrapper'>
          <div className='login-form'>
            <GoogleLogin
              locale='ru_RU'
              theme='filled_black'
              useOneTap
              auto_select
              onSuccess={props.onLoginSuccess}
              onError={props.onLoginError}
            />
          </div>
          {/* <div className='view-src'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://github.com/tysonite/court_dzr_frontend'>
              <img className='github-icon' src={github} alt='view repo on github' />
              Исходный код приложения
            </a>
          </div> */}
        </div>
      </div>
    </header>
  )
}

export default AppHeader
