const fs = require('fs');
const cheerio = require('cheerio');

// Baca file SVG
fs.readFile('BLOKPLAN ADHYAKSA_001.svg', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Load file SVG dengan cheerio
  const $ = cheerio.load(data, { xmlMode: true });

  // Temukan elemen <path> dan tambahkan ID jika belum ada
  let pathIndex = 1;
  $('path').each((i, el) => {
    const $el = $(el);
    if (!$el.attr('id')) {
      $el.attr('id', `path${pathIndex++}`);
    }
  });

  // Simpan file SVG yang telah dimodifikasi
  fs.writeFile('file_with_ids.svg', $.xml(), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File saved as file_with_ids.svg');
    }
  });
});
