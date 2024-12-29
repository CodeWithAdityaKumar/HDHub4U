import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
  try {
    // const { data } = await axios.get(
    //   "https://hdhub4u.tw/what-if-season-3-webrip-english-full-series/"
    // );
    const { data } = await axios.get(
      "https://hdhub4u.vercel.app/htmlFile/downloadPage.html"
    );

    const $ = cheerio.load(data);

    const mainData = [];

    $(".left-wrapper").each((_, elements) => {
      let title, thumbnail;
      let screenshots = [];
      let details = [];
      let DownloadLinks = [];
      // let episodes = [];
      let totalEpisodes = [];

      $(elements)
        .find(".page-title")
        .each((_, Movietitle) => {
          $(Movietitle)
            .find(".material-text")
            .each((_, titleTxt) => {
              title = $(titleTxt)
                .text()
                .trim()
                .replaceAll("  ", "")
                .replaceAll("\n", " ");
            });
        });

      $(elements)
        .find(".page-body")
        .each((_, movieDetails) => {
          //   thumbnail

          $(movieDetails)
            .find("p > img")
            .each((_, thumbnailSrc) => {
              thumbnail = $(thumbnailSrc).attr("src");
            });

          //   screenshots

          $(movieDetails)
            .find("h3 > a > img")
            .each((_, screenshotsSrc) => {
              screenshots.push($(screenshotsSrc).attr("src"));
            });

          $(movieDetails)
            .find("p > a > img")
            .each((_, screenshotsSrc) => {
              screenshots.push($(screenshotsSrc).attr("src"));
            });

          //   imdb
          $(movieDetails)
            .find(".CQKTwc > div")
            .each((_, divDetails) => {
              $(divDetails)
                .find("span")
                .each((_, keyVal) => {
                  let key = "";
                  let val = "";

                  $(keyVal)
                    .find("strong")
                    .each((_, keyTxt) => {
                      key = $(keyTxt)
                        .text()
                        .trim()
                        .replaceAll("  ", "")
                        .replaceAll("\n", " ");
                    });

                  $(keyVal)
                    .contents()
                    .filter(function () {
                      return this.nodeType === 3;
                    })
                    .each((_, valTxt) => {
                      val += $(valTxt)
                        .text()
                        .trim()
                        .replaceAll("  ", "")
                        .replaceAll("\n", " ");
                    });

                  let detailsArr = {
                    [key.replaceAll(" ", "").replaceAll(":", "")]: val,
                  };

                  let updatedDetailsArr = JSON.stringify(detailsArr)
                    .replaceAll(`iMDBRating`, "")
                    .replaceAll('"":""', "");

                  updatedDetailsArr = JSON.parse(updatedDetailsArr);

                  let filteredDetails = Object.entries(updatedDetailsArr)
                    .filter(([key, value]) => {
                      // Check if the object has at least one valid non-empty key
                      return key.trim() !== "" && value.trim() !== "";
                    })
                    .reduce((acc, [key, value]) => {
                      acc[key] = value;
                      return acc;
                    }, {});
                  details.push(filteredDetails);
                });
            });

          // imdb link

          let imdbLink = $(movieDetails)
            .find(".CQKTwc > div > span > a")
            .attr("href");
          let imdbRating = $(movieDetails)
            .find(".CQKTwc > div > span > a")
            .text()
            .trim();
          details.push({ imdbLink: imdbLink, imdbRating });

          // download links

          $(movieDetails)
            .find("div > h3 > a")
            .each((_, LinkAndValue) => {
              let links = "";
              let Value = "";

              links = $(LinkAndValue).attr("href");
              Value = $(LinkAndValue)
                .text()
                .trim()
                .replaceAll("  ", "")
                .replaceAll("\n", " ");

              let dLinks = {
                [Value]: links,
              };

              console.log(Value);

              DownloadLinks.push(dLinks);
            });

          $(movieDetails)
            .find(
              "div > h4[data-ved='2ahUKEwi0gOTl-ozlAhWfILcAHVY0DbIQyxMoADAvegQIERAJ']"
            )
            .each((_, LinkAndValue) => {
              let links = "";
              let Value = "";

              links = $(LinkAndValue).find("a").attr("href");
              Value = $(LinkAndValue)
                .find("a")
                .text()
                .trim()
                .replaceAll("  ", "")
                .replaceAll("\n", " ");

              let dLinks = {
                [Value]: links,
              };
              DownloadLinks.push(dLinks);
            });

          // Episodes

          // $(movieDetails)
          //   .find(".Z1hOCe > div > h4")
          //   .each((_, LinkAndValue) => {
          //     let links = "";
          //     let Value = "";

          //     links = $(LinkAndValue).find("a").attr("href");
          //     Value = $(LinkAndValue)
          //       .find("a")
          //       .text()
          //       .trim()
          //       .replaceAll("  ", "")
          //       .replaceAll("\n", " ");

          //     let dLinks = {
          //       [Value]: links,
          //     };
          //     episodes.push(dLinks);
          //   });

          $(movieDetails)
            .find(".Z1hOCe > div")
            .each((_, LinkAndValue) => {
              let htmlContent = $(LinkAndValue).html();
              let splitContent = htmlContent.split("<hr>");

              splitContent.forEach((e) => {
                let $2 = cheerio.load(e);
                let episodeNo = "";
                let qualityLinks = {};

                $2("h4").each((_, he4) => {
                  let episodeNoText = $2(he4)
                    .find(
                      `span[style="font-family: 'Open Sans';color: #ff9900"]`
                    )
                    .text()
                    .trim()
                    .replaceAll("  ", "")
                    .replaceAll("\n", " ");

                  if (episodeNoText) {
                    episodeNo = episodeNoText;
                  }

                  let qualityText = $2(he4)
                    .find("span[style='color: #ff0000']")
                    .text()
                    .trim()
                    .replaceAll("  ", "")
                    .replaceAll("\n", "")
                    .replaceAll(" –", "");

                  let linkTextAndHref = [];

                  $2(he4)
                    .find(`span[style="font-family: 'Open Sans'"] > a, a`)
                    .each((_, anchor) => {
                      let linkText = $2(anchor)
                        .text()
                        .trim()
                        .replaceAll("  ", "")
                        .replaceAll("\n", " ");

                      let linkHref = $2(anchor).attr("href");
                      linkTextAndHref.push({ linkText, linkHref });
                    });

                  if (qualityText && linkTextAndHref.length > 0) {
                    if (!qualityLinks[qualityText]) {
                      qualityLinks[qualityText] = [];
                    }
                    qualityLinks[qualityText].push({
                      linkTextAndHref,
                    });
                  }
                });

                if (episodeNo) {
                  totalEpisodes.push({
                    episodeNo,
                    quality: qualityLinks,
                  });
                }
              });
            });
        });

      let movieData = {
        title,
        thumbnail,
        screenshots,
        details,
        DownloadLinks,
        // episodes,
        totalEpisodes,
      };

      mainData.push(movieData);
      // mainData.push(totalEpisodes);
    });

    return new Response(JSON.stringify({ success: true, data: mainData }), {
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
