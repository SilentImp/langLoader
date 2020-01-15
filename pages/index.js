import React, {useState, useEffect, useLayoutEffect} from 'react';
import { Trans, Plural } from '@lingui/macro'
import { I18nProvider } from '@lingui/react';
import { useRouter, withRouter } from "next/router";
import * as plurals from "make-plural/plurals";
import * as fs from 'fs';


const Home = () => {
  const router = useRouter();
  const language = router.query.lang;

  if(typeof window === "undefined")  {
    console.log('server side render', language);
  } else {
    console.log('client side render', language);
  }

  let languageJson = null;
  if (typeof window === "undefined") {
    const messages = JSON.parse(fs.readFileSync(`locales/${language}/messages.json`, 'utf-8'));
    console.log('hd messages: ', messages)
    languageJson = {
      [language]: {
        messages: messages,
        languageData: {
          plurals: plurals[language]
        }
      }
    };
  } else {
    console.log('window.messages: ', window.messages)
    languageJson = {
      [language]: {
        messages: window.messages,
        languageData: {
          plurals: plurals[language]
        }
      }
    };
  }

  const [catalogs, setCatalogs] = useState(languageJson === null ? {} : languageJson);

  if(typeof window === "undefined")  {
    console.log('server catalogs: ', catalogs);
  } else {
    console.log('client side render:', catalogs);
  }

  const loader = async language => {
    const response = await fetch(`/locales/${language}/messages.json`);
    const messages = await response.json();
    console.log('messages are loaded: ', messages);
    setCatalogs({
      ...catalogs,
      [language]: {
        messages,
        languageData: {
          plurals: plurals[language]
        }
      }
    });
    router.push({
      pathname: '/',
      query: { lang: language },
    });
  };

  const changeLanguage = event => {
    event.preventDefault();
    const element = event.currentTarget;
    const lang = element.getAttribute('data-lng');
    if (language !== lang) {
      loader(lang);
    }
  }

  if (catalogs[language] === undefined) return null;

  const count = 200;
  const topicClusterName = 'drawing';

  return <I18nProvider catalogs={catalogs} language={language} missing="🚨">
    <nav>
      <h2>Select language: </h2>
      <a onClick={changeLanguage} href="?lang=nl" data-lng="nl">NL</a>&nbsp;|&nbsp; 
      <a onClick={changeLanguage} href="?lang=en" data-lng="en">EN</a>&nbsp;|&nbsp;
      <a onClick={changeLanguage} href="?lang=fr" data-lng="fr">FR</a>&nbsp;|&nbsp;
      <a onClick={changeLanguage} href="?lang=it" data-lng="it">IT</a>
    </nav>
    <p><Trans>About this company</Trans></p>
    <p><Trans>What can you expect next?</Trans></p>
    <p><Trans>All {0} jobs</Trans></p>
    <p>
    <Trans
      id="All {0} jobs"
      values={{ 0: 20 }}
    />;
    </p>
    <p><Trans>{topicClusterName} overview</Trans></p>
    <p><Plural id="{count, plural, one {You can select # more professional} other {You can select # more professionals}}" value={count} one={`You can select # more professional`} other={`{You can select # more professionals}}`} /></p>
  </I18nProvider>;
}

Home.getInitialProps = () => {
  return {};
}


export default withRouter(Home);