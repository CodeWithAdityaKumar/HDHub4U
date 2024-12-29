import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
    try {
        const { data } = await axios.get("https://hdhub4u.tw/");
        // const { data } = await axios.get(
        //   "http://localhost:3000/htmlFile/demo.html"
        // );

        const $ = cheerio.load(data);

        const mainData = [];

        
        $(".thumb").each((_, element) => {

            let title = ""
            let images = ""
            let links = ""

            

            $(element).find("img").each((_, src) => {
                images = $(src).attr("src");
            });

            $(element).find("a").each((_, href) => {
                links = $(href).attr("href");
            });

            $(element).find("p").each((_, txt) => {
                title = $(txt).text().trim().replaceAll("  ", "").replaceAll("\n", " ");
                
            });

            const MovieCard = {
                title,
                links,
                images
            }

            

            mainData.push(MovieCard);
        });






        // const headings = [];
        // $("h1,h2,h3,h4,h5,h6").each((_, element) => {
        //   headings.push($(element).text().trim());
        // });

        // const para = [];
        // $("p").each((_, element) => {
        //   para.push($(element).text().trim());
        // });

        // const images = [];
        // $("img").each((_, element) => {
        //   images.push($(element).attr("src"));
        // });






         return new Response(
           JSON.stringify({ success: true, data: mainData }),
           {
             status: 200,
             headers: { "Content-Type": "application/json" },
           }
         );
        
        


  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Scraping failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
