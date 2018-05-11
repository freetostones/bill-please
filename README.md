# Bill, Please 📜

A simple Express application that lets you look up bills introduced in then 115th Congress.

You can search for bills related to:
* Health Care
* Tariffs
* Nutrition
* Immigration
* Aviation
* Opioids

And you can sort the results based on:
* Number of co-sponsors
* Number of related bills
* Recent Action

## Requirements
* NodeJS
* Git
* ProPublica Congress API Key

## Installation
First clone the repository:
```
git clone https://github.com/freetostones/bill-please.git
```
Then change into the application directory:
```
cd bill-please
```
And finally, install the dependencies:
```
npm install
```

## Getting Started

Before you run the application, you need to make sure you have a valid API Key for ProPublica's Congress API. Request access for an API Key [here](https://www.propublica.org/datastore/api/propublica-congress-api).

Once you have your key, lets add it to your development environment so the application has access to it.

First, create a file to store your key:
```
touch app-env
```

In `app-env`, copy the following the line and make sure to replace `YOUR_API_KEY` with the key you just got:
```
export PROPUBLICA_API_KEY="YOUR_API_KEY"
```

Finally, source this file into your environment:
```
source app-env
```

## Running the application

After your API key has been added your environment, you can run the application by:
```
$ npm start
```

Go to `http://localhost:3000/` in your browser to check it out!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
