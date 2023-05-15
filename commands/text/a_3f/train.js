/** Always run with 'node train.js' from the actual directory this file is in 
 * (i.e. do not run 'node commands/misc/A_3F_training/train.js' from project directory) */
const fs = require("fs");

const dataFiles = fs.readdirSync("./data").filter(file => file.endsWith("txt"));
// console.log(dataFiles)

let data = [], row = {};
for (const file of dataFiles)
{
    console.log(file);
    const text = fs.readFileSync(`./data/${file}`, "utf8");
    // console.log(text);
    let last_split_i = 0;
    for (let i = 0; i < text.length; i++)
    {
        if (text[i] === "\n")
        {
            data.push(text.substring(last_split_i, i).trim());
            last_split_i = i + 1;
            continue;
        }
        row[text[i]] = 0;
    }
}

let markov = {}, distinct_chars = Object.keys(row);
for (let i = 0; i < distinct_chars.length; i++)
{
    markov[distinct_chars[i]] = Object.assign({}, row);
}

let min_len = Infinity, max_len = -1;
for (const entry of data)
{
    // console.log(`${entry}    ${entry.length}`);
    if (entry.length < min_len) min_len = entry.length;
    else if (max_len < entry.length) max_len = entry.length;

    markov["\r"][entry[0]]++;
    for (let i = 1; i < entry.length; i++)
    {
        markov[entry[i-1]][entry[i]]++;
    }
}
// console.log(markov);

let _json = { "min_len": min_len, "max_len": max_len, "markov": markov };

fs.writeFile("./model.json", JSON.stringify(_json), (err) => {
    if (err) throw err;
    console.log("Model has been saved.");
});
