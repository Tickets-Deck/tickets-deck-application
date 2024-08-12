import * as cheerio from 'cheerio';

export function htmlToPlainText(html: string) {
    const $ = cheerio.load(html);
    
    // Replace img tags with their alt text or a placeholder
    $('img').each(function() {
        const altText = $(this).attr('alt') || '';
        $(this).replaceWith(altText);
    });

    // Handle other specific tags if needed
    $('br').replaceWith('\n');
    $('p, h1, h2, h3, h4, h5, h6').append('\n');

    // Extract and clean the text
    let text = $('body').text();
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}