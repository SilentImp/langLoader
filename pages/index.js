import React, {useState, useEffect, useLayoutEffect} from 'react';
import { Trans, Plural } from '@lingui/macro'
import { I18nProvider } from '@lingui/react';
import { useRouter } from "next/router";

let languageJson = null;
try {
  if (typeof window === "undefined") {
    const language = 'fr'; // we may get it from env variable in our case.
    const catalog = require(`../locales/${language}/messages.js`).default;
    languageJson = {
      fr: catalog
    };
  }
} catch (error) {
  console.log(error)
}


const Home = props => {
  if(typeof window === "undefined")  {
    console.log('server side render');
  } else {
    console.log('client side render');
  }
  // const languageJson = props.catalog;
  const router = useRouter();

  const language = router.query.lang || 'fr';
  const [catalogs, selCatalogs] = useState(languageJson !== null ? languageJson : {});
  const [loading, setLoading] = useState(false);

  const changeLanguage = event => {
    event.preventDefault();
    const element = event.currentTarget;
    const lang = element.getAttribute('data-lng');
    if (language !== lang) {
      router.push({
        pathname: '/',
        query: { lang: lang },
      });
    }
  }
  
  useEffect(() => {
    const loader = async language => {
      setLoading(true);
      const catalog = await import(/* webpackChunkName: 'lng-[index]' */`../locales/${language}/messages.js`).then(m => m.default);
      selCatalogs({
        [language]: catalog
      });
      setLoading(false);
    };
    loader(language);
  }, [language]);

  // console.log(language, catalogs[language]);

  if (catalogs[language] === undefined) return null;

  const count = 200;
  const topicClusterName = 'drawinf';
  const topicClusterNameX = 'painting';

  return <I18nProvider catalogs={catalogs} language={language} missing="🚨">
    <nav>
      <h2>Select language: </h2>
      <a onClick={changeLanguage} href="?lang=nl" type="button" data-lng="nl">NL</a>&nbsp;|&nbsp; 
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
  </I18nProvider>
}

// Home.getInitialProps = ()=>{
//   return  {};
// }

// Home.getInitialProps = async props => {
//   const language = props.query.lang;
//   const catalog = await import(/* webpackChunkName: 'lng-[index]' */`../locales/${language}/messages.js`).then(m => m.default);
//   return {
//     catalog: {
//       [language]: catalog
//     }
//   };
// };

export default Home;