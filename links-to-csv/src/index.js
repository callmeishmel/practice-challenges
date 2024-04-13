import fs from "fs";
import cheerio from "cheerio";

const html = fs.readFileSync('links.html', 'utf8');

const $ = cheerio.load(html);

process.stdout.write('Company Name Link* Location* Description \n');

$('li').each((index, listItem) => {

    const anchor = $(listItem).find('a');

    const link = anchor.attr('href');
    const linkText = anchor.text().trim();
    const listItemText = $(listItem).text().trim();

    if (['remote', 'Remote'].some(el => listItemText.includes(el))) {
        const listItemTextFields = listItemText.split('|');

        // Print link, link text, and list item text
        process.stdout.write(linkText + '* '); // Company Name
        process.stdout.write(link + '* '); // Link
        process.stdout.write(listItemTextFields[1] + '* '); // Location
        process.stdout.write(listItemTextFields[2] + '\n '); // Description
    }


});
