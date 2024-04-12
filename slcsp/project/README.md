# SLCSP Assignment
Node based submission for the SLCSP assignment.

# Installation
1. Install node if not already available.
```
# installs NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.12.2`

# verifies the right NPM version is in the environment
npm -v # should print `10.5.0`
```
2. In case `node_modules` is missing run `npm install`

# How to Run
1. Run `npm run start`

Node will log to stdout a CSV valid output of the SLCSP data provided.

# Approach Logic
1. Load CSV data into the script.
2. Validate zip code value
3. Iterate through each row in the `slcsp.csv` file
4. Gather all possibly existing rate area ids from the `zips.csv` file from the currently iterating zip code value along with the state.
5. Reduce the found existing rate area entries into a unique list.
6. Gather all matching entries from `plans.csv` based on `metal_level`, `state` and applicable `rate_areas`.
7. Separate plans into `rate_area` and sort values in `DESC` order.
8. Gathering all second highest values from each `rate_area`. Under the assumption that multiple `rate_areas` or a `rate_area` with only one plan is considered ambiguous the only definitive outcome should be a single value being returned. 