import { createReadStream } from 'fs';
import csvParser from 'csv-parser';

// CSV parser
async function loadCSV(filename) {
    return new Promise((resolve, reject) => {
        let data = [];
        const stream = createReadStream(process.cwd() + '/data/' + filename)
            .pipe(csvParser())
            .on('data', (row) => {
                // Process each row of the CSV
                data.push(row);
            })
            .on('end', () => {
                // All rows have been processed
                resolve(data);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function main() {
    // Load csv data
    const zipCodes = await loadCSV('zips.csv');
    const plans = await loadCSV('plans.csv');
    const zipRates = await loadCSV('slcsp.csv');

    // Print header row
    console.log('zipcode, rate');

    for (let row of zipRates) {

        // Set up 5 digit regex check
        const reg = /^\d{5}$/;

        // Verify zipcode is 5 digits or return null entry
        if(!reg.test(row.zipcode)) {
            console.log(row.zipcode + ',');
            continue;
        }

        // Get all rate areas from that exist in a zip code
        const rateAreas = zipCodes.filter(obj => obj.zipcode === row.zipcode);

        // Get the zip code state
        const rateState = rateAreas[0].state;

        // Reduce found rate areas to only unique array for searching
        const uniqueRateAreas = [...new Set(rateAreas.map(obj => obj.rate_area))];

        // Get all plans that match the metal_level, state and rate area(s) criteria
        const rateAreaPlans = plans.filter(
            obj => obj.metal_level === 'Silver' &&
                obj.state === rateState &&
                uniqueRateAreas.includes(obj.rate_area)
        );

        // Organize matching plans by rate area in descending order
        const ratesByArea = rateAreaPlans.reduce((acc, obj) => {
            const { rate_area, rate } = obj;

            // Check if the rate_area key already exists in the accumulator
            if (acc.hasOwnProperty(rate_area)) {
                // If it does, add the rate to the existing array
                acc[rate_area].push(parseFloat(rate).toFixed(2));
                // Sort the array in descending order
                acc[rate_area].sort((a, b) => b - a);
            } else {
                // If it doesn't, create a new array with the rate
                acc[rate_area] = [parseFloat(rate).toFixed(2)];
            }

            return acc;
        }, {});


        // Create container for second most expensive plans
        const secondIndexValues = [];

        // Get all second most expensive plans for each area
        for (const [key, value] of Object.entries(ratesByArea)) {
            if (value.length >= 2) {
                secondIndexValues.push(value[1]);
            }
        }

        // If more than one plan value exists then the plan is ambiguous for the area and should return no value
        if (secondIndexValues.length === 1) {
            console.log(row.zipcode + ',', secondIndexValues[0]);
        } else {
            console.log(row.zipcode + ',');
        }

    }
}

main().catch(error => console.error(error));