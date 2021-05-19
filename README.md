

## Into: Ultrasoundmoney Frontend 
to do

## Installation

Clone this repo to your machine, then cd into the repo and run
`yarn or npm install` . How you proceed after that depends on what you want to do:

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Working

You can start editing the page by modifying `src/pages/index.js` and for component `src/components/`.
. The page auto-updates as you edit the file.

## Building

To build the app as a stand alone executable, run `yarn build or npm run build`
for more Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## Testing

ALWAYS WRITE TESTS FOR YOU CODE. Define them inside component.test.js, placed alongside your component (or util file). As you develop, always have a terminal open in which you run npm run test to run the test runner in watch mode. We use Jest for unit and snapshot tests and combine it with Enzyme for interaction tests. For easy function mocking and spying, we use Sinon.JS.

## UI Testing

If you are working on a new or existing component, then run `yarn storybook or npm run storybook` to launch Storybook. Here, you can develop your component in isolation first, in a 'visual testing' way. This means you decide on what the component should do, how it should look and which states it can be in, and then define those inside component.stories.js, placed adjacent to the component file in a folder named like the component inside src/components/

## Coding Style

This repo follows the Eslint Style. To ensure this, a pre-commit hook is run that uses lint-staged first reformats staged files using Prettier (mainly for line-length) and then runs standard --fix on the reformatted code. This ensures that all code that gets committed reads in as similar a way as possible.

## Last But not least

Be happy and spread happiness
Keep Rocking
Musa