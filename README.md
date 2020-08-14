# Words-Visualization

Words Visualization

> A web app for visualizing most popular words in the news cycle

![demo](https://raw.githubusercontent.com/josephsintum/words-visualizations/master/public/screenshot.png)


Built with these and more:

-   [News API](https://newsapi.org/)
-   [Next.js](https://nextjs.org/)
-   [Base Web](https://baseweb.design/)
-   [Victory Charts](https://formidable.com/open-source/victory/)
-   [Mongoose](https://mongoosejs.com/)

## Setup

1. Create an `.env` file in the root of the project based on `.env.example`

1. [Create a newsAPI account and get API key](https://newsapi.org/) and add the News API key as `API_KEY=XXXX` in `.env` file

1. For MongoDB<br/>
   use [docker](https://www.docker.com/), run `docker-compose up`<br/>
   or install [MongoDB](https://docs.mongodb.com/manual/installation/) <br/>
   or create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

1. Add MongoDB URI string to `.env` as `MONGO_URL:...`

1. Run

    ```bash
    yarn
    yarn run dev
    ```

1. Visit [localhost:3000](http://localhost:3000)
