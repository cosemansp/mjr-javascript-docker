import Link from 'next/link'

export default () => <div>
  <p>This is another page!</p>
  <Link href="/"><a>Go Back</a></Link>


  <style jsx>{`
    :global(body) {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Oxygen-Sans, 'Fira Sans', 'Droid Sans', Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }

    a {
      text-decoration: none;
      color: #067df7;
    }

    a:hover {
      text-decoration: underline;
    }
  `}</style>
</div>
