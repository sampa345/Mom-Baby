async function run() {
  try {
    const r = await fetch("https://api.microlink.io?url=https://www.amazon.com/dp/B000056J7K"); 
    const t = await r.text();
    console.log(t);
  } catch(e) { console.log("ERR", e); }
}
run();
