import ZEIT from '../components/logo'
import Link from 'next/link'

export default () => (
  <div>

    {/* Page Content */}
    <ZEIT />
    <h1>Static Next.js Example</h1>
    <p>This Next.js is built statically and deployed on Now.</p>
    <span>
      <Link href="/other"><a className="button">Load another page</a></Link>
    </span>
    <a href="https://github.com/now-examples/nextjs-static">Source Code</a>
    <a href="https://zeit.co/docs/features/static-builds">Now Static Build Docs</a>


    {/* Just some styling to look nice! */}
    <style jsx>{`
      :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Oxygen-Sans, 'Fira Sans', 'Droid Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }

      div {
        text-align: center;
        padding: 0 64px 64px;
      }

      h1 {
        font-weight: 400;
      }

      p {
        margin-bottom: 32px;
      }

      span {
        display: block;
        margin-bottom: 32px;
      }

      a {
        text-decoration: none;
        color: #067df7;
      }

      a:hover {
        text-decoration: underline;
      }

      a:not(:last-child) {
        margin-right: 24px;
      }

      a.button {
        height: 40px;
        background: black;
        border-radius: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        color: white;
      }
    `}</style>
  </div>
)
