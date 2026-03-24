import lume from "lume/mod.ts";
import blog from "https://deno.land/x/lume_theme_simple_blog@v0.15.11/mod.ts";

const site = lume({
  src: "./src",
});

site.use(blog());

export default site;
