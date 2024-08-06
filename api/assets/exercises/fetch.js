const axios = require('axios');
const fs = require("fs");
const { join } = require('path');

const options = {
  method: 'GET',
  url: 'https://exercisedb.p.rapidapi.com/exercises',
  params: {limit: '5000'},
  headers: {
    'X-RapidAPI-Key': '73f823221amsh81a426c3914a947p1f99a5jsn92154aa38cbc',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

async function saveFile() {
    try {
        const response = await axios.request(options);
        const path = join(__dirname, './exercises.json')
        fs.writeFile(path, JSON.stringify(response.data, null, 2), (err) => {
            if(!err) return console.log("File created")

            console.error(err)
        })
    } catch (error) {
        console.error(error);
    }
}

saveFile()
