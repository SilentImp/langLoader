import React, {useState, useEffect} from 'react';
import { Trans } from '@lingui/macro'
import { I18nProvider } from '@lingui/react';
import { useRouter } from "next/router";

// let languageJson = null;
// if (typeof window === undefined) {
//   languageJson = fs.readFileSync(`../locales/${language}/messages.json`, 'utf-8');
// }


const Home = () => {
  const router = useRouter();
  const language = router.query.lang || 'en';
  const [catalogs, selCatalogs] = useState({});
  const [loading, setLoading] = useState(false);

  // const loader = async language => {
  //   setLoading(true);
  //   const catalog = await import(/* webpackChunkName: 'lng-[language]' */`../locales/${language}/messages.js`).then(m => m.default);
  //   // console.log(catalog);
  //   selCatalogs({
  //     [language]: catalog
  //   });
  //   setLoading(false);
  // };

  const changeLanguage = event => {
    event.preventDefault();
    const element = event.currentTarget;
    const lang = element.getAttribute('data-lng');
    if (language !== lang) {
      router.push({
        pathname: '/',
        query: { lang: lang },
      })
      // loader(lang);
    }
  }

  useEffect(() => {
    const loader = async language => {
      setLoading(true);
      const catalog = await import(/* webpackChunkName: 'lng-[language]' */`../locales/${language}/messages.js`).then(m => m.default);
      // console.log(catalog);
      selCatalogs({
        [language]: catalog
      });
      setLoading(false);
    };
    loader();
  }, [language]);

  // if(!loading && catalogs[language] === undefined) {
  //   loader(language);
  // }

  // if (catalogs[language] === undefined) return null;

  return <I18nProvider catalogs={catalogs} language={language}>
    <nav>
      <h2>Select language: </h2>
      <a onClick={changeLanguage} href="?lang=nl" type="button" data-lng="nl">NL</a>&nbsp;|&nbsp; 
      <a onClick={changeLanguage} href="?lang=en" data-lng="en">EN</a>&nbsp;|&nbsp;
      <a onClick={changeLanguage} href="?lang=fr" data-lng="fr">FR</a>&nbsp;|&nbsp;
      <a onClick={changeLanguage} href="?lang=it" data-lng="it">IT</a>
    </nav>
    <p><Trans>About this company</Trans></p>
  </I18nProvider>
}

// Home.getInitialProps = async () => {
//   return {};
// };

export default Home;