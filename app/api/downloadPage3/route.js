import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
  try {
    // const { data } = await axios.get("https://hdhub4u.tw/");
    const { data } = await axios.get(
      "http://localhost:3000/htmlFile/demo.html"
    );

    const $ = cheerio.load(data);

    const scrapedData = {};

    // Scrape data based on main.txt structure
    scrapedData.title = $("title").text();
    scrapedData.tumbnail = $('meta[property="og:image"]').attr("content");
    scrapedData.tags = $('meta[name="keywords"]').attr("content");
    scrapedData.howToDownload = $(".how-to-download").text().trim();
    scrapedData.imdbRating = $(".imdb-rating").text().trim();
    scrapedData.imdbLink = $(".imdb-link").attr("href");
    scrapedData.genre = $(".genre").text().trim();
    scrapedData.stars = $(".stars").text().trim();
    scrapedData.director = $(".director").text().trim();
    scrapedData.creator = $(".creator").text().trim();
    scrapedData.language = $(".language").text().trim();
    scrapedData.quality = $(".quality").text().trim();
    scrapedData.noOfEpisodes = $(".no-of-episodes").text().trim();
    scrapedData.screenShots = $(".screen-shots img")
      .map((i, el) => $(el).attr("src"))
      .get();
    scrapedData.downloadLinks = $(".download-links a")
      .map((i, el) => $(el).attr("href"))
      .get();

    return new Response(JSON.stringify({ success: true, data: scrapedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Scraping failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
