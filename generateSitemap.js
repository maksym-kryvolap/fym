const { SitemapStream } = require("sitemap");
const { createWriteStream } = require("fs");
const { streamToPromise } = require("sitemap");
const fs = require("fs");
const path = require("path");
const moviesIdList = require("./script/movies.json");

const robotsFilePath = path.join(__dirname, "public", "robots.txt");

fs.writeFileSync(robotsFilePath, "User-agent: *\nAllow: /", "utf8");

const headUrl = "http://localhost:3000";

async function generateSitemap() {
  const sitemapStream = new SitemapStream({
    hostname: headUrl,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
    },
  });
  const writeStream = createWriteStream("./public/sitemap.xml");

  try {
    sitemapStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    sitemapStream.write({
      url: "/favorites",
      changefreq: "daily",
      priority: 1.0,
    });

    moviesIdList.map((movie) =>
      sitemapStream.write({
        url: `/favorites/${movie.imdbID}`,
        changefreq: "daily",
        priority: 0.7,
      })
    );

    sitemapStream.end();

    await streamToPromise(sitemapStream)
      .then((data) => data.toString())
      .then((data) => writeStream.write(data))
      .catch(() => console.log("error"));

    console.log("Sitemap generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

generateSitemap();
