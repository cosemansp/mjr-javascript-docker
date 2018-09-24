# Next.js Static App, Built and Deployed with Now
Demo URL: https://nextjs-static-example.zeit.sh/

## An example
This repository holds an example of a [Next.js](https://nextjs.org) application that is setup to be built and deployed in the same process under Now.
With the use of a `Dockerfile` we can run our build process within the [Now](https://zeit.co/now) deployment lifecycle, then let Now deploy the `./public` directory (the necessary directory for Now to deploy files in this setup).

This example is explained in-depth on the [ZEIT Docs for Static Builds](https://zeit.co/docs/features/static-builds).

## The project at a glance
This project has three dependencies to build:
- [Next.js](https://nextjs.org)
- [React](https://reactjs.org/)
- [ReactDOM](https://reactjs.org/docs/react-dom.html)

This is the base of a very simple Next.js application. There's no additional dependencies required since Next.js builds everything for you, you just need an understanding of React and Next.js and you're good to go!

### Developing
If you want to clone or fork this project to use as a base, that's fine. Here's a little information to get you going:

First, you'll want to install the dependencies. This project is setup to use [Yarn](https://yarnpkg.com/lang/en/), but you're free to switch to npm if you wish.
To install dependencies with Yarn, use the following command in a terminal under the directory of this app:

```
$ yarn
```
> Note that `$` is a symbol to represent the terminal input and isn't part of the command

Once the dependencies are installed you can a few scripts that exist in the `package.json` file.
To start a development server locally, run the following:
```
$ yarn dev
```

If you want to test a staticly exported version of your app, you can use this command:
```
$ yarn build && yarn export -o /public
```

### Docker and Deploying
For Now to identify the build process, this project holds a `Dockerfile` which lists the build and export command inside. Of course, this means you can also build the Docker image locally to test:

```
$ docker build -t my-nextjs-app .
```

With this `Dockerfile`, as mentioned, and the `now.json` file configuring the `type` as `static`, when deploying to Now, Now will detect the `Dockerfile` and build the app as instructed. Once this is done, our static app will be in the working directory of the Docker image under the `./public` directory. Now will see this directory we've made and recognise to upload this as a static app.

> Note that Now requires a `./public` directory to deploy a static app after a build from a `Dockerfile`

To run Now, all we need is one command:
```
$ now
```

That's it! Now will build and deploy our app and give us back a deployment URL where we can see our Next.js static app live. Built the way we want and live for us to see with just one command and an easy setup.

## Further Reading
### Next.js
Next.js is a React-based framework that supports static or server-rendered apps out of the box. No extra config is required, just pick up and go.

You can learn more about Next.js here: https://nextjs.org

### Now
Now is a quick and easy deployment platform with a CLI and Desktop app that makes it as easy as one command or dragging and dropping a file/directory to deploy your apps.

Now supports static apps with great default configurations and extra options, and also dynamic apps so you can run your server-based Node.js or Docker based apps simply.

Learn more: https://zeit.co/now

Read the documentation to get started: https://zeit.co/docs
