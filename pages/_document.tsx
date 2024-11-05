import Document, {
  Head,
  Html,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { getServerSideToken, getUserScript } from "../lib/auth";

interface MyDocumentProps {
  user: object;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const props = await Document.getInitialProps(ctx);
    const userData = await getServerSideToken(ctx.req!);

    return { ...props, ...userData };
  }

  render() {
    const { user = {} } = this.props;

    return (
      <Html>
        <Head />
        <body>
          <Main />
          <script
            dangerouslySetInnerHTML={{
              __html: getUserScript(user),
            }}
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}
