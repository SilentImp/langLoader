import Document, { Html, Head, Main, NextScript } from 'next/document'
import SubHead from 'next/head';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    console.log(ctx.query);
    return { ...initialProps, language: ctx.query.lang || 'en' }
  }
  

  render() {
    const { language } = this.props;
    return (
      <Html lang={language}>
        <Head />
        <SubHead>
          <link rel="preload" href={`http://localhost:3000/locales/${language}/messages.json`} as="fetch" crossOrigin="anonymous" />
          <script dangerouslySetInnerHTML={{__html: `
            (async ()=>{
              try {
                const response = await fetch('http://localhost:3000/locales/${language}/messages.json');
                const messages = await response.json();
                window.messages = messages;
                console.log('loader messages', messages);
              } catch (error) {
                console.error(error);
              }
            })();
          `}} />
        </SubHead>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;